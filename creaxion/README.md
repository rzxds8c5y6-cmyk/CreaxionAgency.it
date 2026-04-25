# CreaXion Agency — Sito Web

Sito React + Vite + Tailwind CSS per CreaXion Agency.

---

## 🚀 Avvio in locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev

# 3. Apri http://localhost:5173
```

---

## 📦 Build per la produzione

```bash
npm run build
```

Genera la cartella `dist/` pronta per il deploy.

---

## ☁️ Deploy su Vercel (consigliato — gratuito)

### Passo 1: Pubblica su GitHub
1. Crea un repo su [github.com](https://github.com)
2. Carica tutti i file del progetto

### Passo 2: Connetti a Vercel
1. Vai su [vercel.com](https://vercel.com) → Sign up con GitHub
2. Clicca **Add New → Project**
3. Importa il repo CreaXion
4. Impostazioni (Vercel le rileva automaticamente):
   - **Framework**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
5. Clicca **Deploy**

### Passo 3: Collega il dominio Aruba
1. Su Vercel: **Settings → Domains → Add**
2. Inserisci il tuo dominio (es. `creaxionagency.it`)
3. Vercel ti mostrerà i record DNS da configurare

**Su Aruba (pannello DNS):**
```
Tipo A      @       76.76.21.21
Tipo A      @       76.76.21.22
Tipo CNAME  www     cname.vercel-dns.com
```

⏳ La propagazione DNS richiede tra 15 minuti e 24 ore.

---

## 🌐 Deploy su Netlify (alternativa)

1. Vai su [netlify.com](https://netlify.com) → Sign up con GitHub
2. **Add new site → Import from Git**
3. Seleziona il repo → Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Domain management → Add custom domain**

**Su Aruba (pannello DNS):**
```
Tipo A      @       75.2.60.5
Tipo CNAME  www     [nome-sito].netlify.app
```

---

## ✉️ Configurare il form contatti

Il form attualmente simula l'invio. Per renderlo funzionale:

### Opzione A — Formspree (gratuito, no backend)
1. Registrati su [formspree.io](https://formspree.io)
2. Crea un form e copia l'endpoint
3. In `src/App.jsx`, nella funzione `handleSubmit`, sostituisci:
```js
await new Promise((r) => setTimeout(r, 1400));
```
con:
```js
const res = await fetch("https://formspree.io/f/TUO_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});
if (!res.ok) throw new Error("Errore");
```

### Opzione B — EmailJS (gratuito fino a 200 email/mese)
Segui la guida su [emailjs.com](https://emailjs.com)

---

## 🔧 Personalizzazione

Tutti i dati del sito (clienti, servizi, statistiche, progetti) si trovano
nella sezione `DATA` all'inizio di `src/App.jsx`.

Modifica le costanti:
- `clients` — i tuoi clienti reali
- `stats` — le tue statistiche
- `projects` — i tuoi progetti
- `services` / `offline` — i tuoi servizi

Per cambiare email e telefono cerca `info@creaxionagency.it` e `+39 012 345 6789` nel codice.

---

## 📁 Struttura progetto

```
creaxion/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← tutto il sito
│   ├── index.css      ← stili globali + Tailwind
│   └── main.jsx       ← entry point React
├── index.html         ← entry point HTML + SEO meta
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```
