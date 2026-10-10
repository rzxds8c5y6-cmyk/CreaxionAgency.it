import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { MAX_FILES_PER_ITEM, MAX_FILE_MB, ALLOWED_TYPES } from "../../shared/catalog.js";
import { eur, Icon, Button } from "./ui.jsx";

export function CustomizeModal({ product, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(product.min);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
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

  const submit = () => {
    if (product.noteRequired && !note.trim()) {
      setError(`Scrivi ${product.noteLabel.toLowerCase()} nel campo qui sotto, poi aggiungi al carrello.`);
      return;
    }
    onAdd({
      productId: product.id, quantity, note: note.trim(),
      files: ready.map((f) => ({ name: f.name, url: f.url })),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Personalizza ${product.name}`}>
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-7 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <p className="mt-1 text-sm text-white/50">{product.from ? "da " : ""}{eur(product.price)} / {product.unit}</p>
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="rounded-full border border-white/10 p-2 text-white/60 hover:text-white">
            <Icon name="close" size={16} />
          </button>
        </div>

        <label className="mt-6 block text-sm font-medium text-white/80" htmlFor="qty">
          {product.qtyLabel || "Quantità"} {product.min > 1 && <span className="text-white/40">(minimo {product.min})</span>}
        </label>
        <div className="mt-2 inline-flex items-center rounded-full border border-white/10">
          <button type="button" onClick={() => setQuantity((q) => Math.max(product.min, q - 1))} className="h-11 w-11 text-lg text-white/70 hover:text-white" aria-label="Diminuisci">−</button>
          <input
            id="qty" type="number" inputMode="numeric" min={product.min} max={product.max} value={quantity}
            onChange={(e) => setQuantity(Math.min(product.max, Math.max(product.min, Number(e.target.value) || product.min)))}
            className="w-20 bg-transparent text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" onClick={() => setQuantity((q) => Math.min(product.max, q + 1))} className="h-11 w-11 text-lg text-white/70 hover:text-white" aria-label="Aumenta">+</button>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium text-white/80">File per la personalizzazione</div>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/40 px-5 py-8 text-center transition hover:border-cyan-400/60"
          >
            <span className="text-cyan-300"><Icon name="upload" size={24} /></span>
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
                  <span className="text-white/50"><Icon name="file" /></span>
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  {f.status === "uploading" && <span className="text-xs text-cyan-400">{f.progress}%</span>}
                  {f.status === "done" && <span className="text-cyan-400"><Icon name="check" size={16} /></span>}
                  {f.status === "error" && <span className="text-xs text-red-400">Errore</span>}
                  <button onClick={() => setFiles((l) => l.filter((x) => x.id !== f.id))} aria-label={`Rimuovi ${f.name}`} className="text-white/40 hover:text-white">
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="mt-6 block text-sm font-medium text-white/80" htmlFor="note">
          {product.noteLabel || "Note per la stampa"}
          {product.noteRequired && <span className="text-cyan-400"> (obbligatorio)</span>}
        </label>
        <textarea
          id="note" rows={3} maxLength={480} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={product.notePlaceholder || "Colori, posizione del logo, testi da inserire…"}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm outline-none placeholder:text-white/30 focus:border-cyan-400/60"
        />

        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-2xl font-extrabold">{eur(product.price * quantity)}</div>
          <Button disabled={uploading} onClick={submit}>
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

// FINE FILE CustomizeModal.jsx
