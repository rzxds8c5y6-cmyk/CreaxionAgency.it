import { useEffect, useMemo, useState, useCallback, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const pages = [
  ["home", "Home"],
  ["agenzia", "Agenzia"],
  ["servizi", "Servizi"],
  ["clienti", "Clienti"],
  ["progetti", "Progetti"],
  ["processo", "Processo"],
  ["contatti", "Contatti"],
];

// Privacy policy not in nav but accessible via footer

const services = [
  {
    icon: "strategy",
    title: "Strategia & Branding",
    text: "Posizionamento, naming, identità visiva e brand strategy per rendere il tuo brand riconoscibile e differente.",
    items: ["Analisi e posizionamento", "Naming", "Identità visiva", "Brand strategy"],
  },
  {
    icon: "creative",
    title: "Comunicazione & Creatività",
    text: "Contenuti, campagne, social, grafica, copywriting, video e fotografia con una direzione coerente e d'impatto.",
    items: ["Social media management", "Campagne ADV", "Content marketing", "Grafica e copywriting"],
  },
  {
    icon: "growth",
    title: "Performance & Crescita",
    text: "Funnel, lead generation, advertising e ottimizzazione per trasformare attenzione in clienti reali.",
    items: ["Lead generation", "Funnel e automazioni", "ADV", "Analisi e ottimizzazione"],
  },
];

const offline = [
  { type: "sampling", title: "Sampling & Attivazioni", text: "Portiamo il tuo brand nelle mani delle persone con esperienze tangibili e memorabili." },
  { type: "print",    title: "Stampe & Materiali",     text: "Cataloghi, brochure, packaging, espositori, materiali coordinati e stampe di qualsiasi genere." },
  { type: "expo",     title: "Allestimenti Fieristici", text: "Stand e spazi progettati per attirare attenzione, valorizzare il brand e generare contatti qualificati." },
];

const stats = [
  ["+120%", "Lead generati",       "in 90 giorni"],
  ["+80%",  "Richieste contatto",  "da campagne ADV"],
  ["3.5x",  "ROAS medio",          "sulle campagne gestite"],
  ["+65%",  "Aumento fatturato",   "dei nostri clienti"],
];

const clients = [
  ["HELEN DORON", "Branding + ADV",    "+80% lead"],
  ["ULLALÀ",      "Social + ADV",      "+75% engagement"],
  ["NEXORA",      "Sito web + ADV",    "+120% contatti"],
  ["ALTURA",      "Funnel + ADV",      "3.2x ROAS"],
  ["VISION",      "Rebranding + ADV",  "+90% traffico"],
];

const projects = [
  ["Rebranding corporate",       "Futura Group",   "Brand Identity", "Rebranding completo, materiali stampati e nuova presenza digital per un'azienda in forte crescita."],
  ["Lancio prodotto e sampling", "Glem Food",      "Activation",     "Concept, materiali POP, attivazione sul territorio e supporto ADV per il lancio di una nuova linea."],
  ["Stand fieristico + lead flow","Nexora Systems", "Exhibition",     "Stand, visual, landing dedicata e raccolta contatti automatizzata per evento B2B internazionale."],
];

const processSteps = [
  ["01", "Think",   "Analizziamo mercato, competitor, obiettivi e opportunità. Nessuna azione prima di una strategia solida."],
  ["02", "Create",  "Traduciamo la strategia in identità, contenuti e campagne. Creatività al servizio dei risultati."],
  ["03", "Convert", "Attiviamo strumenti per generare contatti, clienti e crescita. Misuriamo tutto, ottimizziamo sempre."],
];

const founders = [
  {
    name: "Ennio Schweizer",
    role: "Project Manager & CEO",
    photo: "/ennio.jpg",
    bio: "Guida la strategia e la visione di CreaXion, coordinando ogni progetto dalla fase di analisi alla realizzazione con un approccio orientato ai risultati.",
  },
  {
    name: "Paola Grimaldi",
    role: "Marketing Specialist & Co-founder",
    photo: "/paola.jpg",
    bio: "Responsabile della direzione creativa e delle strategie di marketing, trasforma ogni brief in comunicazione efficace e campagne che generano valore reale.",
  },
];

// ─── ICONS ──────────────────────────────────────────────────────────────────────

function Icon({ name, size = 24 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": "true",
  };
  const icons = {
    arrow:     <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    strategy:  <><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></>,
    creative:  <><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z"/><path d="m14 6 3 3"/></>,
    growth:    <><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-4 3 3 5-7"/></>,
    menu:      <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close:     <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
    mail:      <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    phone:     <path d="M6.5 4.5c1.2-.8 3.2 1 3.5 2 .2.7-.2 1.4-.8 2l-1 1c1.1 2.2 2.8 3.9 5 5l1-1c.6-.6 1.3-1 2-.8 1 .3 2.8 2.3 2 3.5-.8 1.2-2 2-3.4 1.8-6.7-1-10.4-4.7-11.4-11.4-.2-1.4.6-2.6 1.8-3.4Z"/>,
    pin:       <><path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></>,
    check:     <path d="M20 6 9 17l-5-5"/>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></>,
    linkedin:  <><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 17V10"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><path d="M11 17v-4a2 2 0 0 1 4 0v4"/><path d="M11 13v4"/></>,
  };
  return <svg {...props}>{icons[name] || icons.strategy}</svg>;
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────────

function LogoImg({ size = 32 }) {
  return (
    <img
      src="/logo-x.png"
      alt="X"
      width={size}
      height={size}
      style={{ display: "inline-block", verticalAlign: "middle", objectFit: "contain" }}
    />
  );
}

function Logo({ size = "md", onClick }) {
  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-3xl", xl: "text-5xl" };
  const imgSizes  = { sm: 22, md: 28, lg: 36, xl: 52 };
  const cls = `font-bold tracking-tight leading-none ${textSizes[size]}`;

  const inner = (
    <span className="inline-flex items-center gap-0">
      <span className="text-white">Crea</span>
      <LogoImg size={imgSizes[size]} />
      <span className="text-white">ion</span>
    </span>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded`} aria-label="CreaXion — Home">
        {inner}
      </button>
    );
  }
  return <span className={cls}>{inner}</span>;
}

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────────

function Container({ children, className = "" }) {
  return <div className={`mx-auto max-w-7xl px-5 lg:px-8 ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = "primary", type = "button", disabled = false, className = "" }) {
  const base = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const variants = {
    primary:   "bg-cyan-400 text-black hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "border border-white/20 text-white hover:border-cyan-300 hover:bg-white/5 active:scale-[0.98]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, text, centered = false }) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">{eyebrow}</p>}
      <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-white/60">{text}</p>}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-400">
      {children}
    </span>
  );
}

// ─── ANIMATED STAT ────────────────────────────────────────────────────────────────

function AnimatedStat({ value, label, sub }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <article ref={ref} className={`card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <div className={`text-5xl font-black text-cyan-400 transition-all duration-700 ${visible ? "scale-100" : "scale-90"}`}>{value}</div>
      <div className="mt-4 font-semibold uppercase tracking-wide text-sm">{label}</div>
      <div className="mt-1.5 text-sm text-white/50">{sub}</div>
    </article>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────────

function Header({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setOpen(false); }, [page]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/10 bg-black/85 shadow-2xl shadow-black/50 backdrop-blur-xl" : "border-b border-transparent bg-transparent backdrop-blur-sm"}`}>
      <Container className="flex items-center justify-between py-4">
        <Logo size="md" onClick={() => setPage("home")} />
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex" aria-label="Navigazione principale">
          {pages.map(([key, label]) => (
            <button key={key} onClick={() => setPage(key)}
              className={`relative py-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${page === key ? "text-cyan-400" : "text-white/65 hover:text-white"}`}>
              {label}
              {page === key && <span className="absolute -bottom-1 left-0 right-0 h-px bg-cyan-400 rounded-full" />}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button onClick={() => setPage("contatti")} className="hidden sm:inline-flex">Prenota una call</Button>
          <button onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-white/25 lg:hidden" aria-label={open ? "Chiudi menu" : "Apri menu"} aria-expanded={open}>
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {pages.map(([key, label]) => (
              <button key={key} onClick={() => setPage(key)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${page === key ? "bg-cyan-400/10 text-cyan-400" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                {label}
              </button>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <Button onClick={() => setPage("contatti")} className="w-full justify-center">Prenota una call gratuita</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

// ─── HERO MARK ────────────────────────────────────────────────────────────────────

function HeroMark() {
  return (
    <div className="animate-float relative flex aspect-square max-w-[480px] w-full items-center justify-center rounded-[3rem] border border-white/10 bg-white/[0.02] p-8 shadow-2xl shadow-cyan-500/10">
      <div className="absolute inset-10 rounded-[2rem] border border-white/[0.06]" />
      <div className="absolute bottom-10 h-28 w-3/4 rounded-full bg-gradient-to-r from-cyan-500/25 to-fuchsia-500/25 blur-3xl" />
      <img src="/logo-x.png" alt="CreaXion X" className="relative w-44 h-44 md:w-60 md:h-60 object-contain select-none" />
      <div className="absolute left-5 top-7 max-w-[130px] text-sm leading-snug text-white/55">
        <b className="font-semibold text-cyan-400">think.</b><br />Strategia su misura.
      </div>
      <div className="absolute right-5 top-28 max-w-[130px] text-right text-sm leading-snug text-white/55">
        <b className="font-semibold text-fuchsia-400">create.</b><br />Identità e contenuti.
      </div>
      <div className="absolute bottom-7 right-6 max-w-[150px] text-sm leading-snug text-white/55">
        <b className="font-semibold text-cyan-400">convert.</b><br />Risultati concreti.
      </div>
    </div>
  );
}

// ─── THINK CREATE CONVERT (big, homepage) ────────────────────────────────────────

function ThinkCreateConvert() {
  const steps = [
    { num: "01", word: "Think",   color: "text-cyan-400",    border: "border-cyan-400/20",    bg: "bg-cyan-400/5",    desc: "Analizziamo il tuo mercato, i competitor e gli obiettivi. Costruiamo una strategia solida prima di qualsiasi azione." },
    { num: "02", word: "Create",  color: "text-fuchsia-400", border: "border-fuchsia-400/20", bg: "bg-fuchsia-400/5", desc: "Traduciamo la strategia in identità visiva, contenuti e campagne. Creatività orientata ai risultati, non all'estetica fine a se stessa." },
    { num: "03", word: "Convert", color: "text-cyan-400",    border: "border-cyan-400/20",    bg: "bg-cyan-400/5",    desc: "Attiviamo funnel, advertising e automazioni per trasformare attenzione in clienti reali. Misuriamo tutto, ottimizziamo sempre." },
  ];
  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-3 animate-stagger">
      {steps.map(({ num, word, color, border, bg, desc }) => (
        <article key={word} className={`card-glow relative overflow-hidden rounded-3xl border ${border} ${bg} p-10`}>
          <div className="absolute -right-4 -top-4 text-[8rem] font-black leading-none opacity-5 select-none">{num}</div>
          <div className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${color}`}>{num}</div>
          <h3 className={`text-5xl font-black tracking-tight ${color}`}>{word}</h3>
          <div className={`mt-4 h-0.5 w-12 rounded-full ${color.replace("text-","bg-")}`} />
          <p className="mt-5 text-base leading-7 text-white/60">{desc}</p>
        </article>
      ))}
    </div>
  );
}

// ─── HOME SECTIONS ────────────────────────────────────────────────────────────────

function HomeHero({ setPage }) {
  return (
    <section className="hero-grid relative grid gap-12 pb-16 pt-12 lg:grid-cols-2 lg:py-24">
      <div className="flex flex-col justify-center">
        <Badge>Agenzia di comunicazione e branding</Badge>
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-[4.5rem]">
          Costruiamo brand<br />che si fanno notare.{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">E che vendono.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
          Dalla strategia alla realizzazione, progettiamo comunicazione online e offline che genera risultati concreti per la tua azienda.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={() => setPage("contatti")}>Prenota una call gratuita <Icon name="arrow" size={16} /></Button>
          <Button variant="secondary" onClick={() => setPage("servizi")}>Scopri come lavoriamo</Button>
        </div>
      </div>
      <div className="flex justify-center lg:justify-end"><HeroMark /></div>
    </section>
  );
}

function BrandMarquee() {
  const names = clients.map(([n]) => n);
  const doubled = [...names, ...names];
  return (
    <section className="border-y border-white/10 py-7 overflow-hidden">
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.35em] text-white/35">Alcuni dei brand che ci hanno scelto</p>
      <div className="relative">
        <div className="animate-marquee flex gap-12 whitespace-nowrap">
          {doubled.map((name, i) => (
            <span key={i} className="text-xl font-bold tracking-[0.2em] text-white/35 hover:text-white/60 transition-colors duration-300">{name}</span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black" />
      </div>
    </section>
  );
}

function ServiceCards() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3 animate-stagger">
      {services.map((s) => (
        <article key={s.title} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
            <Icon name={s.icon} />
          </div>
          <h3 className="text-2xl font-bold">{s.title}</h3>
          <p className="mt-3 leading-7 text-white/55">{s.text}</p>
          <ul className="mt-6 space-y-2.5">
            {s.items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/65">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400"><Icon name="check" size={11} /></span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function MockupImage({ type }) {
  const label = type === "sampling" ? "SAMPLING" : type === "print" ? "PRINT" : "EXPO";
  return (
    <div className="relative h-64 overflow-hidden bg-[#0a0a0a]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.22),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_40%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        {type === "sampling" && (
          <div className="relative">
            <div className="h-44 w-32 rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl flex flex-col items-center justify-center gap-3">
              <img src="/logo-x.png" alt="" className="w-12 h-12 object-contain" />
              <div className="text-xs tracking-[0.35em] text-white/50 font-semibold">CREAXION</div>
            </div>
            <div className="absolute -right-6 top-4 h-32 w-20 rounded-xl border border-white/5 bg-zinc-800/60 -z-10" />
          </div>
        )}
        {type === "print" && (
          <div className="relative flex gap-2">
            <div className="h-48 w-36 rotate-[-8deg] rounded-xl border border-white/10 bg-zinc-900/80 shadow-xl flex items-center justify-center">
              <img src="/logo-x.png" alt="" className="w-16 h-16 object-contain" />
            </div>
            <div className="h-48 w-36 rotate-[5deg] rounded-xl border border-white/5 bg-zinc-950/90 shadow-2xl flex flex-col items-center justify-center gap-2">
              <span className="text-xl font-bold text-white">CreaXion</span>
              <div className="h-px w-16 bg-cyan-400/50" />
              <div className="text-xs text-white/40 font-semibold tracking-widest">AGENCY</div>
            </div>
          </div>
        )}
        {type === "expo" && (
          <div className="relative w-72">
            <div className="h-12 w-full rounded-t-2xl border-t border-l border-r border-white/10 bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center gap-2">
              <img src="/logo-x.png" alt="" className="h-7 w-7 object-contain" />
              <span className="text-sm font-bold text-black tracking-wider">CREAXION</span>
            </div>
            <div className="h-32 w-full border border-white/10 bg-zinc-900/90 flex items-center justify-center">
              <img src="/logo-x.png" alt="" className="w-20 h-20 object-contain opacity-10" />
            </div>
            <div className="h-3 w-full bg-zinc-800/50 rounded-b-sm" />
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] rounded-full border border-white/10 bg-black/60 px-3 py-1 text-white/70 backdrop-blur">{label}</span>
      </div>
    </div>
  );
}

function OfflineCards() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3 animate-stagger">
      {offline.map((item) => (
        <article key={item.title} className="card-glow overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <MockupImage type={item.type} />
          <div className="p-7">
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="mt-3 leading-7 text-white/55">{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function MethodCards() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3 animate-stagger">
      {processSteps.map(([n, title, text]) => (
        <article key={n} className="card-glow rounded-3xl border border-white/10 bg-white/[0.025] p-8">
          <div className="mb-5 text-xs font-semibold text-cyan-400">{n}</div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-3 leading-7 text-white/55">{text}</p>
        </article>
      ))}
    </div>
  );
}

function StatsGrid() {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(([value, label, sub]) => (
        <AnimatedStat key={label} value={value} label={label} sub={sub} />
      ))}
    </div>
  );
}

function ClientsGrid() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-stagger">
      {clients.map(([name, detail, result]) => (
        <article key={name} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <div className="text-2xl font-extrabold tracking-[0.15em]">{name}</div>
          <div className="mt-3 text-sm text-white/55">{detail}</div>
          <div className="mt-4 inline-flex items-center gap-2 font-semibold text-cyan-400">
            <Icon name="check" size={14} />{result}
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── FOUNDERS ─────────────────────────────────────────────────────────────────────

function FoundersSection() {
  return (
    <section className="py-20">
      <SectionTitle
        eyebrow="Chi siamo"
        title={<>Le persone dietro <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">CreaXion.</span></>}
        text="Due professionisti con una visione comune: costruire brand che lasciano il segno e generano risultati concreti."
      />
      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl animate-stagger">
        {founders.map((f) => (
          <article key={f.name} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="relative h-72 overflow-hidden">
              <img
                src={f.photo}
                alt={f.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
            <div className="p-7">
              <h3 className="text-2xl font-bold">{f.name}</h3>
              <p className="mt-1 text-sm font-semibold text-cyan-400">{f.role}</p>
              <p className="mt-4 leading-7 text-white/60">{f.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── CTA BANNER ──────────────────────────────────────────────────────────────────

function CtaBanner({ setPage }) {
  return (
    <section className="pb-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-fuchsia-500/20 bg-white/[0.02] p-8 lg:p-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Pronto a far{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">crescere</span>{" "}
            il tuo brand?
          </h2>
          <div className="lg:text-right">
            <p className="mb-6 text-lg leading-7 text-white/60">Parliamo del tuo progetto e costruiamo insieme la strategia giusta.</p>
            <Button onClick={() => setPage("contatti")}>Prenota una call gratuita <Icon name="arrow" size={16} /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ nome: "", azienda: "", email: "", telefono: "", messaggio: "", privacy: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const validate = () => {
    const e = {};
    if (!form.nome.trim())     e.nome     = "Campo obbligatorio";
    if (!form.email.trim())    e.email    = "Campo obbligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email non valida";
    if (!form.messaggio.trim()) e.messaggio = "Raccontaci del tuo progetto";
    if (!form.privacy)         e.privacy  = "Devi accettare la Privacy Policy per continuare";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mgorqden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Errore");
      setStatus("success");
      setForm({ nome: "", azienda: "", email: "", telefono: "", messaggio: "", privacy: false });
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const field = (key, placeholder, type = "text", span = false) => (
    <div className={span ? "md:col-span-2" : ""}>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={(ev) => { setForm((f) => ({ ...f, [key]: ev.target.value })); setErrors((er) => ({ ...er, [key]: "" })); }}
        className={`w-full rounded-2xl border bg-black/40 px-5 py-4 text-sm placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-cyan-400/60 ${errors[key] ? "border-red-400/60" : "border-white/10"}`}
      />
      {errors[key] && <p className="mt-1.5 text-xs text-red-400">{errors[key]}</p>}
    </div>
  );

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400"><Icon name="check" size={28} /></div>
        <h3 className="text-2xl font-bold">Messaggio inviato!</h3>
        <p className="text-white/60">Ti risponderemo entro 24 ore per fissare una call conoscitiva.</p>
        <Button onClick={() => setStatus("idle")} variant="secondary">Invia un altro messaggio</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <h3 className="text-xl font-bold mb-6">Raccontaci il tuo progetto</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {field("nome",     "Nome *")}
        {field("azienda",  "Azienda")}
        {field("email",    "Email *",    "email", true)}
        {field("telefono", "Telefono",   "tel",   true)}
        <div className="md:col-span-2">
          <textarea value={form.messaggio} placeholder="Di cosa hai bisogno? Raccontaci il tuo progetto... *"
            onChange={(ev) => { setForm((f) => ({ ...f, messaggio: ev.target.value })); setErrors((er) => ({ ...er, messaggio: "" })); }}
            rows={5} className={`w-full resize-none rounded-2xl border bg-black/40 px-5 py-4 text-sm placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-cyan-400/60 ${errors.messaggio ? "border-red-400/60" : "border-white/10"}`}
          />
          {errors.messaggio && <p className="mt-1.5 text-xs text-red-400">{errors.messaggio}</p>}
        </div>
      </div>
      <div className="mt-5 md:col-span-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={form.privacy}
            onChange={(ev) => { setForm((f) => ({ ...f, privacy: ev.target.checked })); setErrors((er) => ({ ...er, privacy: "" })); }}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 accent-cyan-400 cursor-pointer"
          />
          <span className="text-sm text-white/60 leading-relaxed">
            Ho letto e accetto la{" "}
            <button type="button" onClick={() => window._showPrivacy && window._showPrivacy()} className="text-cyan-400 hover:underline">
              Privacy Policy
            </button>
            {" "}e acconsento al trattamento dei miei dati personali ai sensi del Reg. UE 2016/679 (GDPR). *
          </span>
        </label>
        {errors.privacy && <p className="mt-1.5 text-xs text-red-400">{errors.privacy}</p>}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Invio in corso…" : <>Invia richiesta <Icon name="arrow" size={16} /></>}
        </Button>
      </div>
    </form>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <Container>
      <HomeHero setPage={setPage} />
      <BrandMarquee />

      <section className="py-20">
        <SectionTitle eyebrow="Cosa facciamo"
          title={<>Strategia, creatività e performance.<br /><span className="text-cyan-400">Un obiettivo: far crescere il tuo business.</span></>}
          text="Ci occupiamo di comunicazione a 360°, online e offline, con un metodo chiaro e risultati misurabili."
        />
        <ServiceCards />
      </section>

      <section className="border-y border-white/10 py-20">
        <SectionTitle eyebrow="Il nostro metodo"
          title={<><span className="text-cyan-400">think.</span> <span className="text-fuchsia-400">create.</span> <span className="text-cyan-400">convert.</span></>}
          text="Un processo strutturato per trasformare ogni progetto in risultati concreti."
        />
        <ThinkCreateConvert />
      </section>

      <section className="py-20">
        <SectionTitle eyebrow="Dal digitale al fisico" title={<>Il tuo brand, <span className="text-cyan-400">ovunque.</span></>}
          text="Sampling, stampa e allestimenti fieristici diventano parte di un unico sistema di brand coerente."
        />
        <OfflineCards />
      </section>

      <section className="border-y border-white/10 py-20">
        <SectionTitle eyebrow="Risultati che parlano" title={<>Numeri reali, <span className="text-cyan-400">risultati concreti.</span></>}
          text="Misuriamo ogni azione. Questi sono alcuni dei risultati dei nostri clienti."
        />
        <StatsGrid />
      </section>

      <FoundersSection />

      <section className="border-y border-white/10 py-20">
        <SectionTitle eyebrow="Alcuni dei nostri clienti" title="Clienti che ci affidano crescita, identità e comunicazione." />
        <ClientsGrid />
      </section>

      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function AgenziaPage({ setPage }) {
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Chi siamo"
          title="Strategia, creatività e visione per brand che vogliono crescere davvero."
          text="CreaXion unisce branding, comunicazione e performance in un unico ecosistema, online e offline."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3 animate-stagger">
          {[
            ["Approccio strategico", "Non agiamo per intuizione ma per analisi. Ogni progetto parte da dati, obiettivi e un piano preciso."],
            ["Visione completa",     "Online e offline, brand e performance: gestiamo l'intera strategia in modo coerente."],
            ["Partner, non fornitori","Lavoriamo come un'estensione del tuo team, con piena trasparenza sui risultati e sulle decisioni."],
          ].map(([t, d]) => (
            <article key={t} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-2xl font-bold">{t}</h3>
              <p className="mt-3 leading-7 text-white/55">{d}</p>
            </article>
          ))}
        </div>
      </section>
      <FoundersSection />
      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function ServiziPage({ setPage }) {
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Servizi"
          title="Diamo forma a brand completi: online, offline, dal concept all'attivazione."
          text="Branding, social, ADV, siti web, sampling, stampe e allestimenti in un'unica direzione creativa coerente."
        />
        <ServiceCards />
        <div className="mt-20">
          <SectionTitle eyebrow="Offline & Attivazioni" title={<>Il tuo brand, <span className="text-cyan-400">ovunque.</span></>} />
          <OfflineCards />
        </div>
      </section>
      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function ClientiPage({ setPage }) {
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Clienti" title="Alcuni dei nostri clienti e dei risultati costruiti insieme."
          text="Lavoriamo con brand in diversi settori, dalla GDO al B2B, dall'alimentare al tech."
        />
        <ClientsGrid />
      </section>
      <section className="border-y border-white/10 py-20">
        <SectionTitle eyebrow="I numeri" title="Risultati che parlano." centered />
        <StatsGrid />
      </section>
      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function ProgettiPage({ setPage }) {
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Progetti" title="Progetti pensati per posizionare meglio il brand e generare risultati."
          text="Ogni progetto è unico. Questi sono alcuni dei lavori di cui andiamo più fieri."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3 animate-stagger">
          {projects.map(([title, client, category, summary]) => (
            <article key={title} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <Badge>{category}</Badge>
              <h3 className="mt-5 text-2xl font-bold">{title}</h3>
              <p className="mt-1 text-xs text-white/40 font-medium">{client}</p>
              <p className="mt-5 leading-7 text-white/55">{summary}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function ProcessoPage({ setPage }) {
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Come lavoriamo"
          title="Un metodo chiaro per trasformare un'idea in un brand che funziona."
          text="Tre fasi, un'unica direzione. Nessuna azione prima di una strategia solida."
        />
        <ThinkCreateConvert />
      </section>
      <CtaBanner setPage={setPage} />
    </Container>
  );
}

function ContattiPage() {
  const contacts = [
    ["mail",  "Email",     "info@creaxionagency.it",                    "mailto:info@creaxionagency.it"],
    ["phone", "Telefono",  "331 783 9690 / 389 620 5964",               "tel:+393317839690"],
    ["pin",   "Sede",      "Via Monte di Casa, San Cesareo, Roma",       null],
  ];
  return (
    <Container>
      <section className="py-20">
        <SectionTitle eyebrow="Contatti" title="Parliamo del tuo progetto."
          text="Compila il form o contattaci direttamente. Rispondiamo entro 24 ore."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm />
          <div className="space-y-5">
            {contacts.map(([icon, title, text, href]) => (
              <article key={title} className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-4 text-cyan-300"><Icon name={icon} /></div>
                <h3 className="text-lg font-bold">{title}</h3>
                {href
                  ? <a href={href} className="mt-2 block text-white/60 hover:text-cyan-400 transition-colors">{text}</a>
                  : <p className="mt-2 text-white/60">{text}</p>
                }
              </article>
            ))}
            <article className="card-glow rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-bold mb-4">Seguici</h3>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/creaxion.agency?igsh=MW1iZmZkczk3YXA1cQ%3D%3D&utm_source=qr"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors">
                  <Icon name="instagram" size={18} />
                </a>
                <a href="https://www.linkedin.com/in/creaxion-agency-421803371/"
                  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors">
                  <Icon name="linkedin" size={18} />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Container>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10">
      <Container className="grid gap-10 py-14 lg:grid-cols-4">
        <div>
          <Logo size="lg" onClick={() => setPage("home")} />
          <p className="mt-4 text-sm leading-6 text-white/50">Agenzia di comunicazione, branding e marketing online e offline.</p>
          <div className="mt-5 flex gap-3">
            <a href="https://www.instagram.com/creaxion.agency?igsh=MW1iZmZkczk3YXA1cQ%3D%3D&utm_source=qr"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors">
              <Icon name="instagram" size={16} />
            </a>
            <a href="https://www.linkedin.com/in/creaxion-agency-421803371/"
              target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors">
              <Icon name="linkedin" size={16} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35">Link</h3>
          <ul className="mt-4 space-y-2.5">
            {pages.map(([key, label]) => (
              <li key={key}><button onClick={() => setPage(key)} className="text-sm text-white/55 hover:text-white transition-colors">{label}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35">Servizi</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {["Branding", "Social Media", "ADV", "Siti web", "Stampe", "Allestimenti"].map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35">Contatti</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href="mailto:info@creaxionagency.it" className="text-white/55 hover:text-cyan-400 transition-colors">info@creaxionagency.it</a></li>
            <li><a href="tel:+393317839690" className="text-white/55 hover:text-cyan-400 transition-colors">331 783 9690</a></li>
            <li><a href="tel:+393896205964" className="text-white/55 hover:text-cyan-400 transition-colors">389 620 5964</a></li>
            <li className="text-white/55">Via Monte di Casa, San Cesareo, Roma</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col gap-2 text-xs text-white/30 sm:flex-row sm:justify-between sm:items-center">
          <span>© {year} CreaXion Agency di Schweizer Ennio Federico. Tutti i diritti riservati.</span>
          <div className="flex gap-4">
            <button onClick={() => setPage("privacy")} className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
            <span>P.IVA 18247171004</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}


// ─── PRIVACY POLICY PAGE ─────────────────────────────────────────────────────────

function PrivacyPage() {
  return (
    <Container>
      <section className="py-20 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">Informativa</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Privacy Policy</h1>

        {[
          ["1. Titolare del Trattamento", `Creaxion Agency di Schweizer Ennio Federico
Via Monte di Casa, San Cesareo (RM)
P.IVA: 18247171004
Email: info@creaxionagency.it
Tel: 331 783 9690`],
          ["2. Dati raccolti", "Tramite il form di contatto raccogliamo: nome, ragione sociale, indirizzo email, numero di telefono e il messaggio inviato dall'utente. Tali dati sono forniti volontariamente dall'utente."],
          ["3. Finalità del trattamento", "I dati raccolti sono utilizzati esclusivamente per rispondere alle richieste di contatto e per fornire i servizi richiesti. Non vengono utilizzati per finalità di marketing senza esplicito consenso."],
          ["4. Base giuridica", "Il trattamento si basa sul consenso espresso dell'interessato (Art. 6, par. 1, lett. a GDPR) e sull'esecuzione di misure precontrattuali adottate su richiesta dell'interessato (Art. 6, par. 1, lett. b GDPR)."],
          ["5. Conservazione dei dati", "I dati personali saranno conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti e comunque non oltre 24 mesi dall'ultima interazione, salvo obblighi di legge."],
          ["6. Comunicazione a terzi", "I dati non vengono ceduti a terzi per finalità commerciali. Possono essere condivisi con fornitori di servizi tecnici (es. Formspree per la gestione del form) nel rispetto del GDPR, i quali agiscono come Responsabili del Trattamento."],
          ["7. Diritti dell'interessato", `In qualità di interessato, hai diritto di:
• Accedere ai tuoi dati personali
• Chiederne la rettifica o la cancellazione
• Opporti al trattamento
• Richiedere la limitazione del trattamento
• Presentare reclamo all'autorità di controllo (Garante Privacy - www.garanteprivacy.it)

Per esercitare i tuoi diritti scrivi a: info@creaxionagency.it`],
          ["8. Cookie", "Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento (es. Google Fonts per il caricamento dei caratteri tipografici). Non vengono utilizzati cookie di profilazione o tracciamento di terze parti."],
          ["9. Aggiornamenti", "Questa informativa può essere aggiornata in qualsiasi momento. La versione aggiornata sarà pubblicata su questa pagina con la relativa data di revisione."],
        ].map(([title, text]) => (
          <div key={title} className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <h2 className="text-lg font-bold text-cyan-400 mb-3">{title}</h2>
            <p className="text-white/65 leading-7 whitespace-pre-line">{text}</p>
          </div>
        ))}

        <p className="mt-8 text-xs text-white/35">Ultimo aggiornamento: Aprile 2025</p>
      </section>
    </Container>
  );
}

// ─── COOKIE BANNER ────────────────────────────────────────────────────────────────

function CookieBanner({ onAccept, onShowPrivacy }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-black/90 backdrop-blur-xl p-5 shadow-2xl shadow-black/50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">🍪 Questo sito usa cookie tecnici</p>
            <p className="text-xs leading-relaxed text-white/55">
              Utilizziamo cookie tecnici necessari al funzionamento del sito (es. Google Fonts).
              Non usiamo cookie di profilazione. Continuando accetti l'uso di questi cookie.{" "}
              <button onClick={onShowPrivacy} className="text-cyan-400 hover:underline">
                Leggi la Privacy Policy
              </button>
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={onAccept}
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-cyan-300 transition-colors"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [cookieAccepted, setCookieAccepted] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem("cookie_accepted") === "1"
  );

  const navigate = useCallback((key) => {
    setPage(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showPrivacy = useCallback(() => {
    navigate("privacy");
  }, [navigate]);

  // Expose showPrivacy globally for the form checkbox link
  useEffect(() => {
    window._showPrivacy = showPrivacy;
    return () => { delete window._showPrivacy; };
  }, [showPrivacy]);

  const handleAcceptCookie = useCallback(() => {
    localStorage.setItem("cookie_accepted", "1");
    setCookieAccepted(true);
  }, []);

  useEffect(() => {
    const titles = { agenzia: "Agenzia", servizi: "Servizi", clienti: "Clienti", progetti: "Progetti", processo: "Processo", contatti: "Contatti", privacy: "Privacy Policy" };
    document.title = `${titles[page] ?? "Home"} — CreaXion Agency`;
  }, [page]);

  const currentPage = useMemo(() => {
    const props = { setPage: navigate };
    switch (page) {
      case "agenzia":  return <AgenziaPage  {...props} />;
      case "servizi":  return <ServiziPage  {...props} />;
      case "clienti":  return <ClientiPage  {...props} />;
      case "progetti": return <ProgettiPage {...props} />;
      case "processo": return <ProcessoPage {...props} />;
      case "contatti": return <ContattiPage />;
      case "privacy":  return <PrivacyPage />;
      default:         return <HomePage    {...props} />;
    }
  }, [page, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/3 h-80 w-80 animate-[glowPulse_4s_ease-in-out_infinite] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-96 right-0 h-96 w-96 animate-[glowPulse_4s_ease-in-out_infinite_1.5s] rounded-full bg-fuchsia-500/8 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 h-64 w-64 animate-[glowPulse_4s_ease-in-out_infinite_3s] rounded-full bg-cyan-500/6 blur-3xl" />
      </div>
      <Header page={page} setPage={navigate} />
      <main className="relative" id="main-content">{currentPage}</main>
      <Footer setPage={navigate} />
      {!cookieAccepted && (
        <CookieBanner onAccept={handleAcceptCookie} onShowPrivacy={showPrivacy} />
      )}
    </div>
  );
}
