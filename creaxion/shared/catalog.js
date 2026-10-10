// CATALOGO PRODOTTI - unica fonte di verità, usata sia dal sito che dal server.
// I prezzi sono in CENTESIMI: 800 = 8,00 €.  Prezzi senza IVA (regime forfettario).

export const CATEGORIES = [
  { id: "stampa", name: "Stampa e pubblicità" },
  { id: "abbigliamento", name: "Abbigliamento" },
  { id: "gadget", name: "Gadget" },
];

// Spedizione: 4,99 € + 2,00 € di bollo, fino a 199 €. Da 199 € in su è inclusa.
// Il bollo si aggiunge solo se la fattura supera 77,47 € (sotto non è dovuto).
export const SHIPPING = {
  cost: 499,
  bollo: 200,
  bolloAbove: 7747,
  freeFrom: 19900,
};

export function calcShipping(subtotal) {
  if (subtotal <= 0 || subtotal >= SHIPPING.freeFrom) {
    return { shipping: 0, bollo: 0, total: 0 };
  }
  const bollo = subtotal + SHIPPING.cost > SHIPPING.bolloAbove ? SHIPPING.bollo : 0;
  return { shipping: SHIPPING.cost, bollo, total: SHIPPING.cost + bollo };
}

const CLOTHING_NOTE = {
  noteRequired: true,
  noteLabel: "Taglie e colori",
  notePlaceholder: "Es. 3 taglia M nera, 2 taglia L bianca…",
};

const SIZE_NOTE = {
  noteRequired: true,
  noteLabel: "Misure desiderate",
  notePlaceholder: "Es. 2 banner da 200 × 100 cm (4 mq in totale)",
};

export const CATALOG = [
  // ───── STAMPA E PUBBLICITÀ ─────
  {
    id: "biglietti-visita", category: "stampa", name: "Biglietti da visita",
    description: "Biglietti da visita formato 8,5 × 5,5 cm. Confezione da 100 pezzi.",
    price: 1500, unit: "confezione da 100", min: 1, max: 100,
  },
  {
    id: "volantini-a5", category: "stampa", name: "Volantini A5",
    description: "Volantini formato A5. Confezione da 100 pezzi.",
    price: 2000, unit: "confezione da 100", min: 1, max: 200,
  },
  {
    id: "manifesti", category: "stampa", name: "Manifesti 70 × 100",
    description: "Manifesti in carta formato 70 × 100 cm. Minimo 10 pezzi.",
    price: 300, unit: "pezzo", min: 10, max: 2000,
  },
  {
    id: "rollup", category: "stampa", name: "Roll-up 85 × 200",
    description: "Roll-up misura 85 × 200 cm, personalizzato con la tua grafica.",
    price: 6500, unit: "pezzo", min: 1, max: 100,
  },
  {
    id: "banner", category: "stampa", name: "Banner",
    description: "Banner personalizzato, 25 € al metro quadro. Scegli i metri quadri e indica le misure desiderate.",
    price: 2500, unit: "mq", min: 1, max: 500, qtyLabel: "Metri quadri", ...SIZE_NOTE,
  },
  {
    id: "adesivi", category: "stampa", name: "Adesivi",
    description: "Adesivi personalizzati, 20 € al metro quadro. Scegli i metri quadri e indica le misure desiderate.",
    price: 2000, unit: "mq", min: 1, max: 500, qtyLabel: "Metri quadri", ...SIZE_NOTE,
  },

  // ───── ABBIGLIAMENTO ─────
  {
    id: "maglietta", category: "abbigliamento", name: "Maglietta personalizzata",
    description: "Maglietta personalizzata con il tuo logo o la tua grafica. Indica taglie e colori.",
    price: 800, from: true, unit: "pezzo", min: 1, max: 1000, ...CLOTHING_NOTE,
  },
  {
    id: "grembiule", category: "abbigliamento", name: "Grembiule da lavoro",
    description: "Grembiule da lavoro personalizzato con il tuo logo.",
    price: 800, unit: "pezzo", min: 1, max: 1000,
  },
  {
    id: "felpa-cappuccio", category: "abbigliamento", name: "Felpa con cappuccio",
    description: "Felpa con cappuccio personalizzata. Indica taglie e colori.",
    price: 2200, unit: "pezzo", min: 1, max: 1000, ...CLOTHING_NOTE,
  },
  {
    id: "felpa-zip", category: "abbigliamento", name: "Felpa con zip",
    description: "Felpa con zip, senza cappuccio, personalizzata. Indica taglie e colori.",
    price: 1800, unit: "pezzo", min: 1, max: 1000, ...CLOTHING_NOTE,
  },
  {
    id: "cappellino", category: "abbigliamento", name: "Cappellino",
    description: "Cappellino personalizzato con il tuo logo.",
    price: 1000, unit: "pezzo", min: 1, max: 1000,
  },
  {
    id: "cappello", category: "abbigliamento", name: "Cappello",
    description: "Cappello personalizzato con il tuo logo.",
    price: 1100, unit: "pezzo", min: 1, max: 1000,
  },

  // ───── GADGET ─────
  {
    id: "tazza", category: "gadget", name: "Tazza personalizzata",
    description: "Tazza personalizzata con il tuo logo o la tua grafica.",
    price: 1200, unit: "pezzo", min: 1, max: 1000,
  },
  {
    id: "penne", category: "gadget", name: "Penne personalizzate",
    description: "Penne personalizzate con il tuo logo. Minimo 100 pezzi.",
    price: 100, from: true, unit: "pezzo", min: 100, max: 10000,
  },
  {
    id: "borraccia", category: "gadget", name: "Borraccia personalizzata",
    description: "Borraccia personalizzata con il tuo logo.",
    price: 1500, unit: "pezzo", min: 1, max: 1000,
  },
  {
    id: "shopper", category: "gadget", name: "Shopper",
    description: "Shopper personalizzata con il tuo logo. Minimo 50 pezzi.",
    price: 90, unit: "pezzo", min: 50, max: 10000,
  },
  {
    id: "accendini", category: "gadget", name: "Accendini personalizzati",
    description: "Accendini personalizzati con il tuo logo.",
    price: 100, from: true, unit: "pezzo", min: 1, max: 10000,
  },
  {
    id: "calendari", category: "gadget", name: "Calendari",
    description: "Calendari personalizzati. Minimo 100 pezzi.",
    price: 100, unit: "pezzo", min: 100, max: 5000,
  },
  {
    id: "powerbank", category: "gadget", name: "Power bank personalizzato",
    description: "Power bank personalizzato con il tuo logo.",
    price: 2500, unit: "pezzo", min: 1, max: 1000,
  },
  {
    id: "zaino", category: "gadget", name: "Zaino personalizzato",
    description: "Zaino personalizzato con il tuo logo.",
    price: 2500, unit: "pezzo", min: 1, max: 1000,
  },
];

// Prodotti NON acquistabili online: mostrano il pulsante "Contattaci"
export const QUOTE_ONLY = [
  {
    id: "insegne", category: "stampa", name: "Insegne",
    description: "Insegne su misura per la tua attività. Ogni progetto è diverso: contattaci per un preventivo.",
  },
];

export const MAX_FILES_PER_ITEM = 3;
export const MAX_FILE_MB = 25;
export const ALLOWED_TYPES = [
  "image/png", "image/jpeg", "image/webp", "image/svg+xml",
  "application/pdf",
  "application/postscript",   // .ai / .eps
  "image/vnd.adobe.photoshop",
];

// FINE FILE catalog.js
