import { useCallback, useEffect, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CATALOG, MAX_FILES_PER_ITEM, MAX_FILE_MB, ALLOWED_TYPES } from "../shared/catalog.js";

const eur = (cents) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);


// ─── ELEMENTI GRAFICI (copie di quelli di App.jsx, così Shop.jsx è indipendente) ─

function Icon({ name, size = 24 }) {
  const icons = {
    arrow: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
    close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Container({ children, className = "" }) {
  return <div className={`mx-auto max-w-7xl px-5 lg:px-8 ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = "primary", type = "button", disabled = false, className = "" }) {
  const base = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const variants = {
    primary: "bg-cyan-400 text-black hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "border border-white/20 text-white hover:border-cyan-300 hover:bg-white/5 active:scale-[0.98]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.35em] text-cyan-400">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-white/60">{text}</p>}
    </div>
  );
}

// ─── CARRELLO ─────────────────────────────

const STORAGE_KEY = "creaxion-cart-v1";

export function useCart() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignora */ }
  }, [items]);

  const add = useCallback((item) => setItems((l) => [...l, { ...item, uid: crypto.randomUUID() }]), []);
  const remove = useCallback((uid) => setItems((l) => l.filter((i) => i.uid !== uid)), []);
  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((s, i) => s + (CATALOG.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity, 0),
    [items]
  );
  const count = items.length;

  return { items, add, remove, clear, total, count };
}

// ─── ICONE LOCALI ──────────────────────────────────────────────────────────────

function ShopIcon({ name, size = 18 }) {
  const paths = {
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 7H6" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
    file: <><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// ─── CARD PRODOTTO ─────────────────────────────────────────────────────────────

function ProductCard({ product, onSelect }) {
  return (
    <article className="card-glow flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="relative h-44 bg-[#0a0a0a]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.22),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.18),transparent_45%)]" />
        <div className="absolute inset-0 flex items-center justify-center font-display text-7xl font-extrabold text-white/10">X</div>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-xl font-bold">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-white/55">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl font-extrabold text-cyan-400">{eur(product.price)}</div>
            <div className="text-xs text-white/40">{product.unit}</div>
          </div>
          <Button onClick={() => onSelect(product)}>Personalizza</Button>
        </div>
      </div>
    </article>
  );
}

// ─── PANNELLO PERSONALIZZAZIONE + UPLOAD ───────────────────────────────────────

function CustomizeModal({ product, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(product.min);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]); // { id, name, status: 'uploading'|'done'|'error', progress, url }
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const uploading = files.some((f) => f.status === "uploading");
  const ready = files.filter((f) => f.status === "done");

  const patch = (id, data) => setFiles((l) => l.map((f) => (f.id === id ? { ...f, ...data } : f)));

  const handleFiles = async (list) => {
    setError("");
    const room = MAX_FILES_PER_ITEM - files.length;
    const chosen = Array.from(list).slice(0, Math.max(room, 0));
    if (list.length > room) setError(`Massimo ${MAX_FILES_PER_ITEM} file per prodotto.`);

    for (const file of chosen) {
      const id = crypto.randomUUID();
      if (!ALLOWED_TYPES.includes(file.type) && !/\.(ai|eps|psd)$/i.test(file.name)) {
        setError("Formati accettati: PNG, JPG, WEBP, SVG, PDF, AI, EPS, PSD.");
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`"${file.name}" supera i ${MAX_FILE_MB} MB.`);
        continue;
      }
      setFiles((l) => [...l, { id, name: file.name, status: "uploading", progress: 0 }]);
      try {
        const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
        const blob = await upload(`ordini/${id.slice(0, 8)}.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: file.type || undefined,
          onUploadProgress: ({ percentage }) => patch(id, { progress: Math.round(percentage) }),
        });
        patch(id, { status: "done", progress: 100, url: blob.url });
      } catch {
        patch(id, { status: "error" });
        setError(`Caricamento di "${file.name}" non riuscito. Riprova.`);
      }
    }
  };

  const unitTotal = product.price * quantity;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Personalizza ${product.name}`}>
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-7 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold">{product.name}</h3>
            <p className="mt-1 text-sm text-white/50">{eur(product.price)} · {product.unit}</p>
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="rounded-full border border-white/10 p-2 text-white/60 hover:text-white">
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Quantità */}
        <label className="mt-6 block text-sm font-medium text-white/80" htmlFor="qty">
          Quantità {product.min > 1 && <span className="text-white/40">(minimo {product.min})</span>}
        </label>
        <div className="mt-2 inline-flex items-center rounded-full border border-white/10">
          <button type="button" onClick={() => setQuantity((q) => Math.max(product.min, q - 1))} className="h-11 w-11 text-lg text-white/70 hover:text-white" aria-label="Diminuisci">−</button>
          <input
            id="qty" type="number" inputMode="numeric" min={product.min} max={product.max} value={quantity}
            onChange={(e) => setQuantity(Math.min(product.max, Math.max(product.min, Number(e.target.value) || product.min)))}
            className="w-16 bg-transparent text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" onClick={() => setQuantity((q) => Math.min(product.max, q + 1))} className="h-11 w-11 text-lg text-white/70 hover:text-white" aria-label="Aumenta">+</button>
        </div>

        {/* Upload */}
        <div className="mt-6">
          <div className="text-sm font-medium text-white/80">File per la personalizzazione</div>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/40 px-5 py-8 text-center transition hover:border-cyan-400/60"
          >
            <span className="text-cyan-300"><ShopIcon name="upload" size={24} /></span>
            <span className="text-sm text-white/70">Trascina qui i file o <span className="text-cyan-400 underline">sfoglia</span></span>
            <span className="text-xs text-white/35">Logo, grafiche, PDF · fino a {MAX_FILES_PER_ITEM} file, {MAX_FILE_MB} MB ciascuno</span>
            <input type="file" multiple className="sr-only" disabled={files.length >= MAX_FILES_PER_ITEM}
              accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.eps,.psd"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
          </label>

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <span className="text-white/50"><ShopIcon name="file" /></span>
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  {f.status === "uploading" && <span className="text-xs text-cyan-400">{f.progress}%</span>}
                  {f.status === "done" && <span className="text-cyan-400"><Icon name="check" size={16} /></span>}
                  {f.status === "error" && <span className="text-xs text-red-400">Errore</span>}
                  <button onClick={() => setFiles((l) => l.filter((x) => x.id !== f.id))} aria-label={`Rimuovi ${f.name}`} className="text-white/40 hover:text-white">
                    <ShopIcon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Note */}
        <label className="mt-6 block text-sm font-medium text-white/80" htmlFor="note">Note per la stampa</label>
        <textarea
          id="note" rows={3} maxLength={480} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Colori, taglie, posizione del logo, testi da inserire…"
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm outline-none placeholder:text-white/30 focus:border-cyan-400/60"
        />

        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="font-display text-2xl font-extrabold">{eur(unitTotal)}</div>
          <Button
            disabled={uploading}
            onClick={() => onAdd({
              productId: product.id, quantity, note: note.trim(),
              files: ready.map((f) => ({ name: f.name, url: f.url })),
            })}
          >
            {uploading ? "Caricamento…" : "Aggiungi al carrello"}
          </Button>
        </div>
        {ready.length === 0 && !uploading && (
          <p className="mt-3 text-xs text-white/35">Puoi aggiungere al carrello anche senza file e inviarli dopo via email.</p>
        )}
      </div>
    </div>
  );
}

// ─── CARRELLO LATERALE ─────────────────────────────────────────────────────────

function CartDrawer({ cart, onClose }) {
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
      window.location.href = data.url; // pagamento su Stripe
    } catch (e) {
      setError(`Non è stato possibile avviare il pagamento: ${e.message}`);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950" aria-label="Carrello">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h3 className="font-display text-xl font-bold">Il tuo carrello</h3>
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
                        <div className="text-xs text-white/45">{i.quantity} × {eur(p.price)} ({p.unit})</div>
                      </div>
                      <div className="font-semibold">{eur(p.price * i.quantity)}</div>
                    </div>
                    {i.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {i.files.map((f) => (
                          <span key={f.url} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300">
                            <ShopIcon name="file" size={12} /><span className="truncate">{f.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {i.note && <p className="mt-3 text-xs leading-5 text-white/50">{i.note}</p>}
                    <button onClick={() => cart.remove(i.uid)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400">
                      <ShopIcon name="trash" size={13} /> Rimuovi
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Totale</span>
              <span className="font-display text-2xl font-extrabold">{eur(cart.total)}</span>
            </div>
            <p className="mt-1 text-xs text-white/35">Spedizione e IVA indicate nel passaggio di pagamento.</p>
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

// ─── PAGINA SHOP ───────────────────────────────────────────────────────────────

export function ShopPage() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const dismissStatus = () => setStatus(null);

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
            <button onClick={dismissStatus} aria-label="Chiudi messaggio" className="text-white/40 hover:text-white"><Icon name="close" size={16} /></button>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Shop"
            title="Scegli il prodotto, carica i tuoi file, noi lo personalizziamo."
            text="Ogni articolo viene stampato sulla tua grafica. Paghi online in sicurezza con Stripe."
          />
          <Button variant="secondary" onClick={() => setCartOpen(true)}>
            <ShopIcon name="cart" size={16} /> Carrello ({cart.count})
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-stagger">
          {CATALOG.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={setSelected} />
          ))}
        </div>

        <p className="mt-10 text-sm text-white/40">
          Hai bisogno di una grafica nuova o di un prodotto che non trovi qui? Scrivici dalla pagina Contatti.
        </p>
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
