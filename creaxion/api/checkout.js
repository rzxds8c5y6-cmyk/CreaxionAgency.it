// Vercel Function: crea la sessione di pagamento Stripe Checkout.
import Stripe from "stripe";
import { CATALOG, MAX_FILES_PER_ITEM, SHIPPING, calcShipping } from "../shared/catalog.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// accetta solo link del TUO storage Blob
const isBlobUrl = (u) =>
  typeof u === "string" && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(u);

const euro = (cents) => (cents / 100).toFixed(2).replace(".", ",") + " €";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items } = req.body || {};
    // Stripe ammette max 50 voci di metadata: 3 per riga + 2 extra
    if (!Array.isArray(items) || items.length === 0 || items.length > 15) {
      return res.status(400).json({ error: "Carrello vuoto o non valido (max 15 righe)" });
    }

    const line_items = [];
    const metadata = {};
    let subtotal = 0;

    items.forEach((it, i) => {
      const product = CATALOG.find((p) => p.id === it.productId);
      if (!product) throw new Error("Prodotto non valido");

      const qty = Math.floor(Number(it.quantity));
      if (!(qty >= product.min && qty <= product.max)) {
        throw new Error(`Quantità non valida per ${product.name}`);
      }

      const note = String(it.note || "").trim();
      if (product.noteRequired && !note) {
        throw new Error(`Indica ${product.noteLabel?.toLowerCase() || "le note"} per ${product.name}`);
      }

      const files = (Array.isArray(it.files) ? it.files : []).slice(0, MAX_FILES_PER_ITEM);
      if (!files.every(isBlobUrl)) throw new Error("File non valido");

      subtotal += product.price * qty;

      line_items.push({
        quantity: qty,
        price_data: {
          currency: "eur",
          unit_amount: product.price,          // prezzo deciso dal server
          product_data: { name: product.name, description: product.unit },
        },
      });

      const n = i + 1;
      metadata[`r${n}_prodotto`] = product.name;
      metadata[`r${n}_note`] = note.slice(0, 480);
      metadata[`r${n}_file`] = files.join(" ").slice(0, 500);
    });

    // Spedizione (con bollo incluso quando dovuto)
    const ship = calcShipping(subtotal);
    let shippingName = "Spedizione inclusa";
    if (ship.total > 0) {
      shippingName = ship.bollo
        ? `Spedizione (${euro(SHIPPING.cost)}) + imposta di bollo (${euro(SHIPPING.bollo)})`
        : `Spedizione (${euro(SHIPPING.cost)})`;
    }
    metadata.bollo_incluso = ship.bollo ? "si" : "no";
    metadata.regime = "forfettario - operazione senza IVA";

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      line_items,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: ship.total, currency: "eur" },
            display_name: shippingName,
          },
        },
      ],
      metadata,
      payment_intent_data: { metadata },
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["IT"] },
      billing_address_collection: "required",
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

// FINE FILE checkout.js
