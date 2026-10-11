const SECTIONS = [
  ["1. Titolare del Trattamento", `Creaxion Agency di Schweizer Ennio Federico
Via Monte di Casa, San Cesareo (RM)
P.IVA: 18247171004
Email: info@creaxionagency.it
Tel: 331 783 9690`],
  ["2. Dati raccolti", `Form di contatto: nome, ragione sociale, email, telefono e messaggio.

Acquisti nello Shop: nome, email, telefono, indirizzo di spedizione e di fatturazione, prodotti ordinati, note e file caricati per la personalizzazione.

Pagamenti: i dati della carta sono trattati direttamente da Stripe e non vengono conservati da noi. Riceviamo solo l'esito del pagamento e i dati di contatto.

Dati tecnici: indirizzo IP e dati di navigazione sono trattati dai fornitori tecnici (hosting) per il funzionamento e la sicurezza del sito.`],
  ["3. Finalità e base giuridica", `• Rispondere alle richieste di contatto: consenso e misure precontrattuali (Art. 6, par. 1, lett. a e b GDPR).
- Gestire e consegnare gli ordini: esecuzione del contratto (Art. 6, par. 1, lett. b GDPR).
- Adempiere agli obblighi fiscali e contabili, come la fattura elettronica: obbligo di legge (Art. 6, par. 1, lett. c GDPR).
- Sicurezza del sito e prevenzione delle frodi: legittimo interesse (Art. 6, par. 1, lett. f GDPR).

Non utilizziamo i dati per finalità di marketing senza il tuo consenso esplicito.`],
  ["4. Conservazione dei dati", `• Richieste di contatto: per il tempo necessario a rispondere e comunque non oltre 24 mesi dall'ultima interazione.
- Ordini e documenti fiscali: 10 anni, come previsto dalla legge.
- File caricati per la personalizzazione: per il tempo necessario a realizzare e consegnare l'ordine e a gestire eventuali contestazioni, poi vengono cancellati.`],
  ["5. Destinatari dei dati", `I dati possono essere comunicati ai seguenti soggetti, che trattano i dati per nostro conto o come autonomi titolari:
- Stripe, per la gestione dei pagamenti;
- Vercel, per l'hosting del sito e l'archiviazione dei file caricati;
- Formspree, per la gestione del form di contatto;
- corrieri, per la consegna degli ordini;
- commercialista e consulenti, per gli adempimenti fiscali;
- Agenzia delle Entrate e Sistema di Interscambio, per la fatturazione elettronica.

I dati non vengono ceduti a terzi per finalità commerciali.`],
  ["6. Trasferimenti fuori dall'Unione Europea", "Alcuni dei fornitori indicati possono trattare dati anche fuori dall'Unione Europea. In questo caso il trasferimento avviene nel rispetto del Capo V del GDPR, con garanzie adeguate (per esempio le clausole contrattuali standard o una decisione di adeguatezza)."],
  ["7. Diritti dell'interessato", `In qualità di interessato, hai diritto di:
- accedere ai tuoi dati personali;
- chiederne la rettifica o la cancellazione;
- opporti al trattamento o chiederne la limitazione;
- ricevere i tuoi dati in un formato leggibile (portabilità);
- revocare il consenso in qualsiasi momento;
- presentare reclamo all'autorità di controllo (Garante Privacy - www.garanteprivacy.it).

Per esercitare i tuoi diritti scrivi a: info@creaxionagency.it`],
  ["8. Cookie e archiviazione locale", "Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento (es. Google Fonts per il caricamento dei caratteri tipografici). Lo Shop salva il contenuto del carrello nel tuo browser (archiviazione locale) per permetterti di riprendere l'ordine: queste informazioni restano sul tuo dispositivo e non servono a profilarti. Non utilizziamo cookie di profilazione o di tracciamento di terze parti."],
  ["9. Aggiornamenti", "Questa informativa può essere aggiornata in qualsiasi momento. La versione aggiornata sarà pubblicata su questa pagina con la relativa data di revisione."],
];

export function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <section className="py-20 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">Informativa</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Privacy Policy</h1>

        {SECTIONS.map(([title, text]) => (
          <div key={title} className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <h2 className="text-lg font-bold text-cyan-400 mb-3">{title}</h2>
            <p className="text-white/65 leading-7 whitespace-pre-line">{text}</p>
          </div>
        ))}

        <p className="mt-8 text-xs text-white/35">Ultimo aggiornamento: Ottobre 2026</p>
      </section>
    </div>
  );
}

// FINE FILE Privacy.jsx
