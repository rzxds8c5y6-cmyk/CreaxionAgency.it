import { useCallback, useEffect, useMemo, useState } from "react";
import { CATALOG, calcShipping } from "../../shared/catalog.js";

export const eur = (cents) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

// ─── ELEMENTI GRAFICI ──────────────────────────────────────────────────────────

const ICONS = {
  arrow: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 7H6" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  file: <><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4" /></>,
};

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function Container({ children }) {
  return <div className="mx-auto max-w-7xl px-5 lg:px-8">{children}</div>;
}

export function Button({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const base = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const variants = {
    primary: "bg-cyan-400 text-black hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "border border-white/20 text-white hover:border-cyan-300 hover:bg-white/5 active:scale-[0.98]",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">{eyebrow}</p>}
      <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-white/60">{text}</p>}
    </div>
  );
}

// ─── CARRELLO ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "creaxion-cart-v2";

export function useCart() {
  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return saved.filter((i) => CATALOG.some((p) => p.id === i.productId));
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignora */ }
  }, [items]);

  const add = useCallback((item) => setItems((l) => [...l, { ...item, uid: crypto.randomUUID() }]), []);
  const remove = useCallback((uid) => setItems((l) => l.filter((i) => i.uid !== uid)), []);
  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (CATALOG.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity, 0),
    [items]
  );
  const ship = useMemo(() => calcShipping(subtotal), [subtotal]);

  return { items, add, remove, clear, subtotal, ship, total: subtotal + ship.total, count: items.length };
}

// FINE FILE ui.jsx
