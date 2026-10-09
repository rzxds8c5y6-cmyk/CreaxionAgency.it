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
