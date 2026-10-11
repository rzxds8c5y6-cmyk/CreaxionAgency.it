import { SHIPPING } from "../shared/catalog.js";

const eur = (cents) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

const SECTIONS = [
  ["1. Venditore", `Creaxion Agency di Schweizer Ennio Federico
Via Monte di Casa, San Cesareo (RM)
P.IVA: 18247171004
Email: info@creaxionagency.it
Tel: 331 783 9690`],
  ["2. Ambito di applicazione", "Le presenti condizioni regolano la vendita online dei prodotti personalizzati presentati nello Shop di creaxionagency.it. Si applicano sia ai consumatori sia ai clienti professionisti. Inviando l'ordine dichiari di aver letto e accettato queste condizioni e la Privacy Policy."],
  ["3. Prodotti e personalizzazione", "Ogni prodotto viene realizzato sulla base dei file e delle indicazioni che invii al momento dell'ordine (grafiche, loghi, misure, taglie, colori). Sei responsabile della correttezza di queste informazioni. I colori stampati possono differire in modo lieve da quelli visualizzati sullo schermo. Le foto presenti nello Shop sono indicative."],
  ["4. Controllo dei file", "Dopo l'ordine controlliamo i file ricevuti. Se non sono adatti alla stampa (per esempio per risoluzione o formato) ti contattiamo via email per correggerli o per ricevere nuovi file. Se non è possibile procedere, l'ordine viene annullato e ti rimborsiamo l'importo pagato."],
  ["5. Diritti sui contenuti", "Caricando file e testi dichiari di avere tutti i diritti necessari (marchi, loghi, immagini, fotografie) e che i contenuti non sono illeciti né violano diritti di terzi. Rispondi di qualsiasi pretesa di terzi al riguardo. Ci riserviamo di rifiutare gli ordini con contenuti illeciti, offensivi o lesivi di diritti altrui, con rimborso integrale."],
  ["6. Prezzi, IVA e spedizione", `I prezzi sono in euro e indicati senza IVA: operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge n. 190/2014 (regime forfettario).

Per ordini con prodotti inferiori a ${eur(SHIPPING.freeFrom)} la spedizione costa ${eur(SHIPPING.cost)}. Se l'importo della fattura supera ${eur(SHIPPING.bolloAbove)}, a questa somma si aggiungono ${eur(SHIPPING.bollo)} per l'imposta di bollo. Per ordini pari o superiori a ${eur(SHIPPING.freeFrom)} la spedizione è inclusa.

Il totale è sempre mostrato prima del pagamento.`],
  ["7. Ordine e pagamento", "Il pagamento avviene online tramite Stripe, con i metodi disponibili nella pagina di pagamento. Non vediamo né conserviamo i dati della tua carta. Premendo il pulsante di pagamento effettui un ordine con obbligo di pagare. Il contratto si conclude quando il pagamento va a buon fine; ti contattiamo poi via email per confermare i dettagli della stampa."],
  ["8. Fatturazione", "Emettiamo fattura elettronica per ogni ordine. Per emetterla potremmo chiederti via email il codice fiscale o la partita IVA e il codice destinatario o la PEC."],
  ["9. Consegna", "Spediamo in Italia tramite corriere. I tempi di produzione e di consegna ti vengono comunicati nella conferma dell'ordine e sono indicativi. Controlla la merce alla consegna e segnalaci eventuali danni o difformità scrivendo a info@creaxionagency.it."],
  ["10. Modifica o annullamento dell'ordine", "Puoi chiedere di modificare o annullare l'ordine scrivendoci subito. Se la produzione non è ancora iniziata ti rimborsiamo l'importo pagato. Dopo l'avvio della produzione non è più possibile annullare."],
  ["11. Diritto di recesso", `Ai consumatori che acquistano online spetta di norma un diritto di recesso di 14 giorni. Questo diritto è escluso per i beni confezionati su misura o chiaramente personalizzati (art. 59, comma 1, lett. c, D.Lgs. 206/2005). Tutti i prodotti dello Shop sono personalizzati sulla base delle tue indicazioni: per questo, dopo la conferma dell'ordine, non è possibile esercitare il recesso.

Il diritto di recesso non si applica ai clienti professionisti.`],
  ["12. Garanzia e difetti", `Ai consumatori spetta la garanzia legale di conformità di 24 mesi (art. 128 e seguenti del Codice del Consumo). Se un prodotto presenta un difetto di stampa o di fabbricazione imputabile a noi, provvediamo secondo i rimedi previsti dalla legge (riparazione, sostituzione, riduzione del prezzo o rimborso). Non rispondiamo di errori contenuti nei file, nei testi, nelle misure, nelle taglie o nei colori indicati dal cliente.

I clienti professionisti devono segnalare i vizi entro 8 giorni dalla consegna.`],
  ["13. Rimborsi", "I rimborsi sono effettuati con lo stesso metodo di pagamento usato per l'ordine, di norma entro 14 giorni dalla decisione di rimborsare."],
  ["14. Reclami", "Per reclami o richieste di assistenza scrivi a info@creaxionagency.it: ti rispondiamo il prima possibile."],
  ["15. Legge applicabile e foro competente", "Le presenti condizioni sono regolate dalla legge italiana. Per i consumatori resta applicabile il foro del luogo di residenza o domicilio. Per i clienti professionisti è competente il foro del luogo in cui ha sede il venditore."],
  ["16. Dati personali", "I dati personali sono trattati come descritto nella Privacy Policy, disponibile in fondo a ogni pagina del sito."],
];

export function CondizioniVendita() {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <section className="py-20 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">Shop</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Condizioni di vendita</h1>

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

// FINE FILE Condizioni.jsx
