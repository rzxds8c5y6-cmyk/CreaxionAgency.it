import { useEffect, useState } from "react";
import { CATALOG, CATEGORIES, QUOTE_ONLY } from "../shared/catalog.js";
import { eur, Icon, Container, Button, SectionTitle, useCart } from "./shop/ui.jsx";
import { CustomizeModal } from "./shop/CustomizeModal.jsx";
import { CartDrawer } from "./shop/CartDrawer.jsx";

// ─── CARD PRODOTTO ─────────────────────────────────────────────────────────────

function CardImage({ id }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative h-44 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.22),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.18),transparent_45%)]" />
      {broken ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/logo-x.png" alt="" className="h-20 w-20 object-contain opacity-30" />
        </div>
      ) : (
        <img src={`/shop/${id}.jpg`} alt="" loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}

function ProductCard({ product, onSelect, onContact }) {
  return (
    <article className="card-glow flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <CardImage id={product.id} />
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-white/55">{product.description}</p>
        {product.quote ? (
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="text-lg font-bold text-cyan-400">Su preventivo</div>
            <Button onClick={onContact}>Contattaci <Icon name="arrow" size={16} /></Button>
          </div>
        ) : (
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-2xl font-extrabold text-cyan-400">
                {product.from && <span className="mr-1 text-sm font-semibold text-cyan-400/70">da</span>}
                {eur(product.price)}
              </div>
              <div className="text-xs text-white/40">
                / {product.unit}{product.min > 1 ? ` · minimo ${product.min}` : ""}
              </div>
            </div>
            <Button onClick={() => onSelect(product)}>Personalizza</Button>
          </div>
        )}
      </div>
    </article>
  );
}

function ContactCard({ onContact }) {
  return (
    <article className="card-glow flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.22),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.18),transparent_45%)]" />
        <img src="/logo-x.png" alt="CreaXion" className="relative h-24 w-24 object-contain" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl font-bold">Non trovi quello che cerchi?</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-white/55">
          Scrivici e ti risponderemo il prima possibile.
        </p>
        <div className="mt-5">
          <Button onClick={onContact}>Scrivici <Icon name="arrow" size={16} /></Button>
        </div>
      </div>
    </article>
  );
}

// ─── PAGINA SHOP ───────────────────────────────────────────────────────────────

export function ShopPage({ setPage }) {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);

  // Ritorno da Stripe: l'indirizzo contiene ?checkout=success oppure ?checkout=cancel
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("checkout");
    if (result === "success" || result === "cancel") {
      setStatus(result);
      if (result === "success") cart.clear();
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contact = () => {
    if (setPage) setPage("contatti");
    else window.location.href = "mailto:info@creaxionagency.it";
  };

  return (
    <Container>
      <section className="py-20">
        {status && (
          <div
            role="status"
            className={`mb-10 flex items-start justify-between gap-4 rounded-2xl border p-5 ${
              status === "success" ? "border-cyan-400/30 bg-cyan-400/5" : "border-white/15 bg-white/[0.03]"
            }`}
          >
            <p className="text-sm leading-6 text-white/80">
              {status === "success"
                ? "Pagamento ricevuto, grazie! Abbiamo i tuoi file e ti scriviamo a breve per confermare i dettagli della stampa."
                : "Pagamento annullato. Il carrello è ancora qui: puoi riprendere quando vuoi."}
            </p>
            <button onClick={() => setStatus(null)} aria-label="Chiudi messaggio" className="text-white/40 hover:text-white"><Icon name="close" size={16} /></button>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Shop"
            title="Scegli il prodotto, carica i tuoi file, noi lo personalizziamo."
            text="Ogni articolo viene stampato sulla tua grafica. Paghi online in sicurezza con Stripe."
          />
          <Button variant="secondary" onClick={() => setCartOpen(true)}>
            <Icon name="cart" size={16} /> Carrello ({cart.count})
          </Button>
        </div>

        {CATEGORIES.map((cat, idx) => {
          const list = [
            ...CATALOG.filter((p) => p.category === cat.id),
            ...QUOTE_ONLY.filter((p) => p.category === cat.id).map((p) => ({ ...p, quote: true })),
          ];
          const isLast = idx === CATEGORIES.length - 1;
          return (
            <div key={cat.id} className="mt-16">
              <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">{cat.name}</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-stagger">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} onSelect={setSelected} onContact={contact} />
                ))}
                {isLast && <ContactCard onContact={contact} />}
              </div>
            </div>
          );
        })}
      </section>

      {selected && (
        <CustomizeModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(item) => { cart.add(item); setSelected(null); setCartOpen(true); }}
        />
      )}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
    </Container>
  );
}

// FINE FILE Shop.jsx
