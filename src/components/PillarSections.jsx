import { useRef, useEffect, useState } from 'react';

const PILLARS = [
  {
    id: 'build',
    label: 'Build models',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="2" y="2" width="12" height="12" rx="1.2" /><path d="M2 5.6h12M5.6 5.6V14M8.4 8h4M8.4 10.5h4" />
      </svg>
    ),
  },
  {
    id: 'update',
    label: 'Update & extend',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M11 2.5l2.5 2.5-8 8-3 .5.5-3 8-8z" /><path d="M3 14h5" />
      </svg>
    ),
  },
  {
    id: 'citations',
    label: 'Cell-level citations',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 1.8h6l3 3v9.4H4z" /><path d="M10 1.8v3h3" /><path d="M6 9.2l1.5 1.5 3-3" />
      </svg>
    ),
  },
  {
    id: 'grounded',
    label: 'Source-grounded',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4.5 2h7a1 1 0 0 1 1 1v11l-4.5-2.5L3.5 14V3a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: 'approval',
    label: 'Human-in-the-loop',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="6.5" cy="5" r="2.6" /><path d="M2 14c.4-3 2.2-4.6 4.5-4.6S10.6 11 11 14" /><path d="M10.5 6.5 12 8l2.5-2.5" />
      </svg>
    ),
  },
  {
    id: 'excel',
    label: 'Native to Excel',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="2" y="2.5" width="12" height="11" rx="1" /><path d="M2 6h12M6.5 6v7.5M10.2 6v7.5M2 9.7h12" />
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
      <button type="button" className="pn-item" disabled>
        <span className="pn-label">And more</span>
      </button>
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
    tab: 'Describe',
    title: 'Describe it in plain English',
    desc: '"Build a revenue model for AAPL with segment detail through FY27." That\'s the whole input.',
    ref: 'A1',
    fx: 'Build a revenue model for AAPL…',
    demo: <><span className="accwb-demo-chip">Build a revenue model for AAPL, segment detail, through FY27</span></>,
  },
  {
    tab: 'Structure',
    title: 'A structured model, not a blob',
    desc: 'Schedules, drivers, and assumptions laid out the way an analyst would build them.',
    ref: 'A1',
    fx: 'Revenue Build ($ in millions)',
    demo: <><span className="accwb-demo-chip">Revenue Build</span><span className="accwb-demo-chip">Drivers</span><span className="accwb-demo-chip">Assumptions</span></>,
  },
  {
    tab: 'Formulas',
    title: 'Formula-driven outputs',
    desc: 'Every value is computed via auditable Excel formulas, not opaque model generations.',
    ref: 'B14',
    fx: '=SUM(B4:B12)*B2',
    demo: <><span className="accwb-demo-ref">B14</span><span className="accwb-demo-fx">fx</span><span className="accwb-demo-code">=SUM(B4:B12)*B2</span></>,
  },
  {
    tab: 'Audit-ready',
    title: 'Ready to audit on arrival',
    desc: 'Inputs are extracted from filings and cited, so your first pass is verification, not a rebuild.',
    ref: 'C8',
    fx: '391035 · source: 10-K FY2024 p.28',
    demo: <><span className="accwb-demo-code">$391.0B</span><span className="accwb-demo-arrow">←</span><span className="accwb-demo-chip">10-K FY2024 · p.28</span></>,
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
        <span className="accwb-name">Model_Build.xlsx</span>
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
      <div className="accwb-tabs" role="tablist" aria-label="From prompt to working model">
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

function UpdateVisual() {
  return (
    <div className="pviz pviz-audit">
      <div className="pviz-cellbar">
        <span className="pviz-ref">B14</span>
        <span className="pviz-val">$94.9B</span>
        <span className="pviz-tracebadge">refreshed</span>
      </div>
      <div className="pviz-cite">
        <div className="pviz-cite-src">New filing detected · 10-Q Q3</div>
        <p className="pviz-cite-quote">17 affected cells identified across Revenue Build and Comps, refreshed with citations attached.</p>
      </div>
      <div className="pviz-log">
        <div className="pviz-log-title">Refresh log</div>
        {[
          ['10:02', 'B14: $88.1B → $94.9B', 'approved'],
          ['10:02', 'C22: 41.8% → 43.2%', 'approved'],
          ['10:01', 'Source linked: 10-Q Q3', 'auto'],
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

function ApprovalVisual() {
  return (
    <div className="pviz pviz-audit">
      <div className="pviz-cellbar">
        <span className="pviz-ref">B14</span>
        <span className="pviz-val">=B12*(1+B13)</span>
        <span className="pviz-tracebadge">pending</span>
      </div>
      <div className="pviz-cite">
        <div className="pviz-cite-src">Diff preview</div>
        <p className="pviz-cite-quote">$88.1B → $94.9B. Nothing is written to your model until you approve.</p>
      </div>
      <div className="pviz-log">
        <div className="pviz-log-title">Approval log</div>
        {[
          ['09:41', 'Write B14 → $94.9B', 'approved'],
          ['09:40', 'Refresh comps D2:D9', 'approved'],
          ['09:38', 'Proposed: extend FY26 col', 'pending'],
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

function ExcelVisual() {
  const ITEMS = [
    { name: 'Excel add-in', meta: 'Windows · Mac' },
    { name: 'Web app', meta: 'browser-based' },
    { name: 'Macros preserved', meta: 'nothing breaks' },
    { name: 'Shortcuts intact', meta: 'your workflow' },
    { name: 'Local workbook', meta: 'runs on device' },
    { name: 'No data uploads', meta: 'stays with you' },
  ];
  return (
    <div className="pviz pviz-data">
      <div className="pviz-data-head">
        <span className="pviz-globe" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M9.5 9v11M15 9v11M3 14.5h18" />
          </svg>
        </span>
        <span>Runs in your environment</span>
      </div>
      <div className="pviz-data-grid">
        {ITEMS.map((s) => (
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

const PILLAR_CONTENT = {
  build: {
    eyebrow: 'Build models',
    headline: <>Describe the analysis,<br />get a working model</>,
    lead: 'Describe the analysis in plain English.',
    rest: 'FinSynth assembles a fully structured model with schedules, drivers, and formulas, ready to audit.',
    body: (
      <div className="pillar-grid-new">
        <AccuracyWorkbook />
        <BenchmarkCard />
      </div>
    ),
  },
  update: {
    eyebrow: 'Update & extend',
    headline: <>Point it at the model<br />you already use</>,
    lead: 'No template, no rebuild.',
    rest: 'FinSynth refreshes figures, adds periods, and extends logic without breaking your structure.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>New-quarter refresh</h3><p>When a new filing drops, affected cells are identified and refreshed with citations attached.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Extend without breaking</h3><p>New periods and schedules follow your existing structure, formats, and naming conventions.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>Your formulas stay yours</h3><p>Existing logic is preserved. FinSynth extends it rather than replacing it with its own.</p></div></div>
        </div>
        <UpdateVisual />
      </div>
    ),
  },
  citations: {
    eyebrow: 'Cell-level citations',
    headline: <>Every cell traces<br />to a primary source</>,
    lead: 'Click any cell to see the document behind it.',
    rest: 'SEC filings, live quotes, or your own inputs, down to the exact page and quote.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Inline citations</h3><p>Click any cell to see the exact document, page number, and quote it came from.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Full transparency</h3><p>Every assumption and data point is exposed, no black box, no unexplained figures.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>Enterprise-grade audit log</h3><p>Track every model change, data refresh, and user action for compliance and review.</p></div></div>
          <div className="point"><span className="n">4</span><div><h3>Intuitive UX for verification</h3><p>PMs and compliance teams can verify outputs directly, no analyst intermediary required.</p></div></div>
        </div>
        <AuditVisual />
      </div>
    ),
  },
  grounded: {
    eyebrow: 'Source-grounded numbers',
    headline: <>Numbers extracted,<br />never inferred</>,
    lead: 'Every figure is extracted verbatim from primary documents.',
    rest: 'Filings, transcripts, and decks, never inferred, never hallucinated.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Global filing coverage</h3><p>10-K, 10-Q, 8-K, 20-F, 6-K, and international equivalents across all public markets.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Earnings call transcripts</h3><p>Full Q&A transcript access with speaker-level attribution and sentence-level indexing.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>IR decks and press releases</h3><p>Slide-level extraction with table parsing, chart OCR, and footnote handling.</p></div></div>
          <div className="point"><span className="n">4</span><div><h3>Custom integrations</h3><p>Connect your proprietary data: internal models, CRM notes, Bloomberg exports, and more.</p></div></div>
        </div>
        <DataVisual />
      </div>
    ),
  },
  approval: {
    eyebrow: 'Human-in-the-loop',
    headline: <>The agent proposes,<br />you approve</>,
    lead: 'No autonomous writes to your model.',
    rest: 'Every cell change is previewed as a diff and lands only with your sign-off.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Diff preview on every write</h3><p>See exactly which cells change and how, before anything touches your workbook.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Permission-gated by design</h3><p>The agent can't overwrite your work on its own. Every landed cell is one you signed off on.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>Reviewable history</h3><p>Every approval and rejection is logged, so reviews and rollbacks are straightforward.</p></div></div>
        </div>
        <ApprovalVisual />
      </div>
    ),
  },
  excel: {
    eyebrow: 'Native to Excel',
    headline: <>Runs where your<br />models already live</>,
    lead: 'An add-in alongside your real workbook.',
    rest: 'Your macros, formulas, and shortcuts keep working. Nothing leaves your environment.',
    body: (
      <div className="pillar-grid-new">
        <div className="points">
          <div className="point"><span className="n">1</span><div><h3>Excel add-in and web app</h3><p>Works inside Excel on Windows and Mac, with a browser-based web app alongside.</p></div></div>
          <div className="point"><span className="n">2</span><div><h3>Nothing leaves your machine</h3><p>Excel runs locally. The backend never reads or stores your workbook.</p></div></div>
          <div className="point"><span className="n">3</span><div><h3>Your workflow, unchanged</h3><p>Macros, formulas, and shortcuts keep working exactly as they did before.</p></div></div>
        </div>
        <ExcelVisual />
      </div>
    ),
  },
};

export function Pillars() {
  const [active, setActive] = useState('build');
  const c = PILLAR_CONTENT[active];
  return (
    <section className="pillar-new" id="p-accuracy">
      <div className="wrap">
        <div className="pillar-sec-head">
          <p className="hiw-eyebrow">CAPABILITIES</p>
          <h2>Everything an analyst does, in your spreadsheet</h2>
        </div>
        <div className="pillar-band">
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
