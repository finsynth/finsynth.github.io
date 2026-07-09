import { useRef, useEffect, useState } from 'react';

const PILLARS = [
  {
    id: 'accuracy',
    label: 'Accuracy',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="8" cy="8" r="6.2" /><circle cx="8" cy="8" r="2.6" /><circle cx="8" cy="8" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'auditability',
    label: 'Auditability',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 1.8h6l3 3v9.4H4z" /><path d="M10 1.8v3h3" /><path d="M6 9.2l1.5 1.5 3-3" />
      </svg>
    ),
  },
  {
    id: 'data',
    label: 'Data Coverage',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="8" cy="8" r="6.2" /><path d="M1.8 8h12.4M8 1.8c2.2 2 2.2 10.4 0 12.4M8 1.8c-2.2 2-2.2 10.4 0 12.4" />
      </svg>
    ),
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M8.8 1.5 3.5 9h4l-.8 5.5L12.5 7h-4l.3-5.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function PillarNav({ active, onSelect }) {
  return (
    <nav className="pillarnav" aria-label="Pillars" role="tablist">
      {PILLARS.map(p => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={active === p.id}
          className={`pn-item${active === p.id ? ' active' : ''}`}
          onClick={() => onSelect(p.id)}
        >
          <span className="pn-ic" aria-hidden="true">{p.icon}</span>
          <span className="pn-label">{p.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PillarHead({ eyebrow, headline, lead, rest }) {
  return (
    <>
      <div className="pillar-eyebrow">
        <span className="pillar-eyebrow-ic" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6h12" />
          </svg>
        </span>
        {eyebrow}
        <svg className="pillar-eyebrow-chev" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M2 1.5 6.5 6 2 10.5" />
        </svg>
      </div>
      <div className="pillar-head-grid">
        <h2 className="pillar-headline">{headline}</h2>
        <p className="pillar-lede"><strong>{lead}</strong> {rest}</p>
      </div>
    </>
  );
}

function BenchmarkCard() {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        card.querySelectorAll('.col').forEach(c => {
          c.style.height = (parseFloat(c.dataset.h) / 94 * 100) + '%';
        });
        card.querySelectorAll('[data-count]').forEach(el => {
          const target = parseFloat(el.dataset.count), t0 = performance.now();
          const dec = el.dataset.count.includes('.') ? 1 : 0;
          const tick = now => {
            const p = Math.min((now - t0) / 1200, 1);
            el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        io.unobserve(card);
      });
    }, { threshold: .35 });

    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bench-card" ref={cardRef}>
      <div className="bench-90"><span data-count="94">0</span>%</div>
      <p className="bench-cap">Win rate in head-to-head Excel challenges against first-year professionals</p>
      <div className="bench-hr"></div>
      <div className="bench-label">SpreadsheetBench Scores</div>
      <div className="bars-chart">
        <div className="bar"><span className="pct"><span data-count="6">0</span>%</span><div className="col" data-h="6"></div><span className="name">Copilot in Excel</span></div>
        <div className="bar"><span className="pct"><span data-count="12">0</span>%</span><div className="col" data-h="12"></div><span className="name">ChatGPT Agent w/ .xlsx</span></div>
        <div className="bar"><span className="pct"><span data-count="18">0</span>%</span><div className="col" data-h="18"></div><span className="name">Claude (Files)</span></div>
        <div className="bar"><span className="pct"><span data-count="31">0</span>%</span><div className="col" data-h="31"></div><span className="name">ChatGPT Agent</span></div>
        <div className="bar win"><span className="pct"><span data-count="94">0</span>%</span><div className="col" data-h="94"></div><span className="name">FinSynth AI</span></div>
      </div>
      <p className="bench-src">Benchmark: <u>SpreadsheetBench</u> · Oct 16, 2025</p>
    </div>
  );
}

const ACCURACY_SHEETS = [
  {
    tab: 'Formula-driven',
    title: 'Formula-driven outputs',
    desc: 'Every value is computed via auditable Excel formulas, not opaque model generations.',
    ref: 'B14',
    fx: '=SUM(B4:B12)*B2',
    demo: <><span className="accwb-demo-ref">B14</span><span className="accwb-demo-fx">fx</span><span className="accwb-demo-code">=SUM(B4:B12)*B2</span></>,
  },
  {
    tab: 'Source-grounded',
    title: 'Source-grounded numbers',
    desc: 'All financial figures are extracted verbatim from filings, transcripts, and decks — never inferred.',
    ref: 'C8',
    fx: '391035 · source: 10-K FY2024 p.28',
    demo: <><span className="accwb-demo-code">$391.0B</span><span className="accwb-demo-arrow">←</span><span className="accwb-demo-chip">10-K FY2024 · p.28</span></>,
  },
  {
    tab: 'Non-destructive',
    title: 'Non-destructive edits',
    desc: 'FinSynth never overwrites your existing work without a diff preview and explicit approval.',
    ref: 'B14',
    fx: '=B12*(1+B13) · pending approval',
    demo: <><span className="accwb-demo-ref">B14</span><span className="accwb-demo-old">$88.1B</span><span className="accwb-demo-arrow">→</span><span className="accwb-demo-new">$94.9B</span><span className="accwb-demo-chip accwb-demo-approve">Approve?</span></>,
  },
  {
    tab: 'Formatting',
    title: 'Professional formatting preserved',
    desc: "Outputs match your firm's model standards — headers, units, color coding, and decimal precision.",
    ref: 'A1',
    fx: 'Revenue Build ($ in millions)',
    demo: <><span className="accwb-demo-chip">$ in millions</span><span className="accwb-demo-chip">1 decimal</span><span className="accwb-demo-chip">firm color coding</span></>,
  },
];

const ACCWB_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const ACCWB_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function AccuracyWorkbook() {
  const [active, setActive] = useState(0);
  const sheet = ACCURACY_SHEETS[active];
  return (
    <div className="accwb">
      <div className="accwb-titlebar">
        <span className="accwb-logo">X</span>
        <span className="accwb-name">Accuracy.xlsx</span>
      </div>
      <div className="accwb-fxbar">
        <span className="accwb-namebox">{sheet.ref}</span>
        <span className="accwb-fxlab">fx</span>
        <span className="accwb-fxval">{sheet.fx}</span>
      </div>
      <div className="accwb-colhead">
        <span className="accwb-corner" />
        {ACCWB_COLS.map(c => <span key={c}>{c}</span>)}
      </div>
      <div className="accwb-body">
        <div className="accwb-rownums">
          {ACCWB_ROWS.map(r => <span key={r}>{r}</span>)}
        </div>
        <div className="accwb-sheet">
        <span className="accwb-num">{String(active + 1).padStart(2, '0')}</span>
        <h3>{sheet.title}</h3>
        <p>{sheet.desc}</p>
          <div className="accwb-demo">{sheet.demo}</div>
        </div>
      </div>
      <div className="accwb-tabs" role="tablist" aria-label="Accuracy features">
        {ACCURACY_SHEETS.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`accwb-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {s.tab}
          </button>
        ))}
        <span className="accwb-tab-add">+</span>
      </div>
    </div>
  );
}

function AuditVisual() {
  return (
    <div className="pviz pviz-audit">
      <div className="pviz-cellbar">
        <span className="pviz-ref">D14</span>
        <span className="pviz-val">$391.0B</span>
        <span className="pviz-tracebadge">traced</span>
      </div>
      <div className="pviz-cite">
        <div className="pviz-cite-src">SEC 10-K · FY2024 · p.31</div>
        <p className="pviz-cite-quote">"Total net sales of $391.0 billion for fiscal 2024…"</p>
      </div>
      <div className="pviz-log">
        <div className="pviz-log-title">Audit log</div>
        {[
          ['09:41', 'Write B14 → $391.0B', 'approved'],
          ['09:41', 'Source linked: SEC 10-K', 'auto'],
          ['09:38', 'Refresh comps D2:D9', 'approved'],
        ].map(([t, a, tag], i) => (
          <div className="pviz-log-row" key={i}>
            <span className="pviz-log-t">{t}</span>
            <span className="pviz-log-a">{a}</span>
            <span className={`pviz-log-tag${tag === 'approved' ? ' ok' : ''}`}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataVisual() {
  const SOURCES = [
    { name: 'SEC filings', meta: '10-K · 10-Q · 8-K' },
    { name: 'Global filings', meta: '20-F · 6-K · intl' },
    { name: 'Earnings calls', meta: 'transcripts + Q&A' },
    { name: 'IR decks', meta: 'slides · tables' },
    { name: 'Press releases', meta: 'real-time' },
    { name: 'Custom uploads', meta: 'your models' },
  ];
  return (
    <div className="pviz pviz-data">
      <div className="pviz-data-head">
        <span className="pviz-globe" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
          </svg>
        </span>
        <span>Global coverage</span>
      </div>
      <div className="pviz-data-grid">
        {SOURCES.map((s) => (
          <div className="pviz-srccard" key={s.name}>
            <span className="pviz-srccheck" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="pviz-srcname">{s.name}</span>
            <span className="pviz-srcmeta">{s.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedVisual() {
  const ROWS = [
    { who: 'First-year analyst', time: '3 days', w: '100%', slow: true },
    { who: 'Offshore team', time: '1 day', w: '40%', slow: true },
    { who: 'FinSynth AI', time: '< 1 hour', w: '8%', slow: false },
  ];
  return (
    <div className="pviz pviz-speed">
      <div className="pviz-speed-title">Time to a complete model</div>
      {ROWS.map((r) => (
        <div className={`pviz-speed-row${r.slow ? '' : ' win'}`} key={r.who}>
          <div className="pviz-speed-meta">
            <span className="pviz-speed-who">{r.who}</span>
            <span className="pviz-speed-time">{r.time}</span>
          </div>
          <div className="pviz-speed-track">
            <span className="pviz-speed-fill" style={{ width: r.w }} />
          </div>
        </div>
      ))}
      <div className="pviz-speed-foot">Parallel research across dozens of sources — no sequential waiting.</div>
    </div>
  );
}

const PILLAR_CONTENT = {
  accuracy: {
    eyebrow: 'Accuracy',
    headline: <>Built to be right,<br />not just confident</>,
    lead: 'FinSynth uses a structured research pipeline — not a single prompt.',
    rest: 'Every number is produced with formulas and sources, so you can verify outputs cell by cell.',
    body: (
      <div className="pillar-grid-new">
        <AccuracyWorkbook />
        <BenchmarkCard />
      </div>
    ),
  },
  auditability: {
    eyebrow: 'Auditability',
    headline: <>Every cell traces<br />to a primary source</>,
    lead: 'Audit trail is built in — not bolted on afterward.',
    rest: 'PM challenge mode or compliance review: click any cell and see the exact document, page, and quote behind it.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Inline citations</h3><p>Click any cell to see the exact document, page number, and quote it came from.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Full transparency</h3><p>Every assumption and data point is exposed — no black box, no unexplained figures.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>Enterprise-grade audit log</h3><p>Track every model change, data refresh, and user action for compliance and review.</p></div></div>
          <div className="point"><span className="n">4</span><div><h3>Intuitive UX for verification</h3><p>PMs and compliance teams can verify outputs directly — no analyst intermediary required.</p></div></div>
        </div>
        <AuditVisual />
      </div>
    ),
  },
  data: {
    eyebrow: 'Data Coverage',
    headline: <>Every source your<br />analyst would check</>,
    lead: 'FinSynth ingests the full research stack.',
    rest: 'Structured, unstructured, public, and proprietary — filings, transcripts, decks, and your own data.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Global filing coverage</h3><p>10-K, 10-Q, 8-K, 20-F, 6-K, and international equivalents across all public markets.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Earnings call transcripts</h3><p>Full Q&A transcript access with speaker-level attribution and sentence-level indexing.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>IR decks and press releases</h3><p>Slide-level extraction with table parsing, chart OCR, and footnote handling.</p></div></div>
          <div className="point"><span className="n">4</span><div><h3>Custom integrations</h3><p>Connect your proprietary data — internal models, CRM notes, Bloomberg exports, and more.</p></div></div>
        </div>
        <DataVisual />
      </div>
    ),
  },
  speed: {
    eyebrow: 'Speed',
    headline: <>From question to<br />model in minutes</>,
    lead: 'Significantly faster than humans on complex, long-running work.',
    rest: 'Instant turnaround on quick tasks, parallel research on the heavy ones.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>10× faster than manual research</h3><p>A model that takes a first-year analyst 3 days takes FinSynth under an hour.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Parallel research execution</h3><p>FinSynth queries dozens of sources simultaneously — no sequential waiting.</p></div></div>
        </div>
        <SpeedVisual />
      </div>
    ),
  },
};

export function Pillars() {
  const [active, setActive] = useState('accuracy');
  const c = PILLAR_CONTENT[active];
  return (
    <section className="pillar-new" id="p-accuracy">
      <div className="wrap">
        <div className="pillar-band">
          <p className="pillar-band-title">An agent built for institutional research</p>
          <PillarNav active={active} onSelect={setActive} />
        </div>
        <div className="pillar-pane" key={active}>
          <PillarHead eyebrow={c.eyebrow} headline={c.headline} lead={c.lead} rest={c.rest} />
          {c.body}
        </div>
      </div>
    </section>
  );
}
