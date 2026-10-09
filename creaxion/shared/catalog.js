// Catalogo prodotti: UNICA fonte di verità, usata sia dal sito che dal server.
// I prezzi sono in CENTESIMI (4900 = 49,00 €) e sono quelli che Stripe addebita davvero:
// il server li rilegge da qui, quindi nessuno può modificarli dal browser.

export const CATALOG = [
  {
    id: "biglietti-visita",
    name: "Biglietti da visita",
    description: "Carta 350g opaca, 8,5×5,5 cm, fronte/retro. Minimo 100 pezzi.",
    price: 3900,          // prezzo per 'unità' (qui: confezione da 100)
    unit: "conf. da 100",
    min: 1,
    max: 20,
    mockup: "card",
  },
  {
    id: "volantini-a5",
    name: "Volantini A5",
    description: "Carta patinata 135g, stampa fronte/retro a colori.",
    price: 6900,
    unit: "conf. da 250",
    min: 1,
    max: 20,
    mockup: "flyer",
  },
  {
    id: "rollup",
    name: "Roll-up 85×200",
    description: "Telo in PVC con struttura in alluminio e borsa per il trasporto.",
    price: 8900,
    unit: "pezzo",
    min: 1,
    max: 10,
    mockup: "rollup",
  },
  {
    id: "magliette",
    name: "Magliette personalizzate",
    description: "Cotone 180g, stampa fronte. Indica taglie e colori nelle note.",
    price: 1500,
    unit: "pezzo",
    min: 5,
    max: 200,
    mockup: "tshirt",
  },
  {
    id: "adesivi",
    name: "Adesivi sagomati",
    description: "Vinile resistente all'acqua, tagliato sulla forma del tuo logo.",
    price: 2900,
    unit: "conf. da 50",
    min: 1,
    max: 40,
    mockup: "sticker",
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
