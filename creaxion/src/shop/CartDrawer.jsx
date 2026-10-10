import { useState } from "react";
import { CATALOG, SHIPPING } from "../../shared/catalog.js";
import { eur, Icon, Button } from "./ui.jsx";

export function CartDrawer({ cart, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            productId: i.productId, quantity: i.quantity, note: i.note, files: i.files.map((f) => f.url),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Errore");
      window.location.href = data.url;
    } catch (e) {
      setError(`Non è stato possibile avviare il pagamento: ${e.message}`);
      setBusy(false);
    }
  };

  const missing = SHIPPING.freeFrom - cart.subtotal;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950" aria-label="Carrello">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h3 className="text-xl font-bold">Il tuo carrello</h3>
          <button onClick={onClose} aria-label="Chiudi carrello" className="rounded-full border border-white/10 p-2 text-white/60 hover:text-white"><Icon name="close" size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            <p className="mt-10 text-center text-white/50">Il carrello è vuoto. Scegli un prodotto e carica i tuoi file per iniziare.</p>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((i) => {
                const p = CATALOG.find((x) => x.id === i.productId);
                if (!p) return null;
                return (
                  <li key={i.uid} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-white/45">{i.quantity} × {eur(p.price)} / {p.unit}</div>
                      </div>
                      <div className="font-semibold">{eur(p.price * i.quantity)}</div>
                    </div>
                    {i.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {i.files.map((f) => (
                          <span key={f.url} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300">
                            <Icon name="file" size={12} /><span className="truncate">{f.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {i.note && <p className="mt-3 text-xs leading-5 text-white/50">{i.note}</p>}
                    <button onClick={() => cart.remove(i.uid)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400">
                      <Icon name="trash" size={13} /> Rimuovi
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Prodotti</span><span>{eur(cart.subtotal)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm text-white/70">
              <span>Spedizione</span>
              <span>{cart.ship.total === 0 ? "Inclusa" : eur(cart.ship.total)}</span>
            </div>
            {cart.ship.bollo > 0 && (
              <p className="mt-1 text-xs text-white/35">
                {eur(SHIPPING.cost)} di spedizione + {eur(SHIPPING.bollo)} di imposta di bollo
              </p>
            )}
            {missing > 0 && (
              <p className="mt-1 text-xs text-cyan-400/80">
                Ancora {eur(missing)} e la spedizione è inclusa.
              </p>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-white/60">Totale</span>
              <span className="text-2xl font-extrabold">{eur(cart.total)}</span>
            </div>
            <p className="mt-1 text-xs text-white/35">Prezzi senza IVA: operazione effettuata in regime forfettario.</p>
            {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
            <Button onClick={checkout} disabled={busy} className="mt-4 w-full justify-center">
              {busy ? "Reindirizzamento a Stripe…" : <>Paga con Stripe <Icon name="arrow" size={16} /></>}
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}

// FINE FILE CartDrawer.jsx
