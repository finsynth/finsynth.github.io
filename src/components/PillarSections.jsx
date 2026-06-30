import { useRef, useEffect, useState } from 'react';

const PILLARS = [
  { id: 'accuracy',    num: '01', label: 'Accuracy' },
  { id: 'auditability',num: '02', label: 'Auditability' },
  { id: 'data',        num: '03', label: 'Data Coverage' },
  { id: 'speed',       num: '04', label: 'Speed' },
];

function PillarNav({ active: initialActive }) {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    const els = PILLARS.map(p => document.getElementById('p-' + p.id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('p-', '');
          setActive(id);
        }
      });
    }, { threshold: 0.35 });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    setActive(id);
    document.getElementById('p-' + id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="pillarnav" aria-label="Pillars">
      {PILLARS.map(p => (
        <a
          key={p.id}
          className={`pn-item${active === p.id ? ' active' : ''}`}
          href={'#p-' + p.id}
          onClick={e => handleClick(e, p.id)}
        >
          <span className="pn-circ">{p.num}</span>
          <span className="pn-label">{p.label}</span>
        </a>
      ))}
    </nav>
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

export function PillarAccuracy() {
  return (
    <section className="pillar-new" id="p-accuracy">
      <div className="wrap">
        <PillarNav active="accuracy" />
        <div className="pillar-grid-new">
          <div>
            <h2>Built to be right, not just confident</h2>
            <p className="lede">FinSynth uses a structured research pipeline — not a single prompt — to produce outputs you can verify cell by cell.</p>
            <div className="points">
              <div className="point"><span className="n">1</span><div><h3>Formula-driven outputs</h3><p>Every value is computed via auditable Excel formulas, not opaque model generations.</p></div></div>
              <div className="point"><span className="n">2</span><div><h3>Source-grounded numbers</h3><p>All financial figures are extracted verbatim from filings, transcripts, and decks — never inferred.</p></div></div>
              <div className="point"><span className="n">3</span><div><h3>Non-destructive edits</h3><p>FinSynth never overwrites your existing work without a diff preview and explicit approval.</p></div></div>
              <div className="point"><span className="n">4</span><div><h3>Professional formatting preserved</h3><p>Outputs match your firm's model standards — headers, units, color coding, and decimal precision.</p></div></div>
            </div>
          </div>
          <BenchmarkCard />
        </div>
      </div>
    </section>
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

export function PillarAuditability() {
  return (
    <section className="pillar-new" id="p-auditability" style={{ background: '#FAFAF7' }}>
      <div className="wrap">
        <PillarNav active="auditability" />
        <div className="pillar-grid-new">
          <div>
            <h2>Every cell traces to a primary source</h2>
            <p className="lede">PM challenge mode? Compliance review? Audit trail is built in — not bolted on afterward.</p>
            <div className="points">
              <div className="point"><span className="n">1</span><div><h3>Inline citations</h3><p>Click any cell to see the exact document, page number, and quote it came from.</p></div></div>
              <div className="point"><span className="n">2</span><div><h3>Full transparency</h3><p>Every assumption and data point is exposed — no black box, no unexplained figures.</p></div></div>
              <div className="point"><span className="n">3</span><div><h3>Enterprise-grade audit log</h3><p>Track every model change, data refresh, and user action for compliance and review.</p></div></div>
              <div className="point"><span className="n">4</span><div><h3>Intuitive UX for verification</h3><p>PMs and compliance teams can verify outputs directly — no analyst intermediary required.</p></div></div>
            </div>
          </div>
          <AuditVisual />
        </div>
      </div>
    </section>
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

export function PillarData() {
  return (
    <section className="pillar-new" id="p-data">
      <div className="wrap">
        <PillarNav active="data" />
        <div className="pillar-grid-new">
          <div>
            <h2>Every source your analyst would check</h2>
            <p className="lede">FinSynth ingests the full research stack — structured, unstructured, public, and proprietary.</p>
            <div className="points">
              <div className="point"><span className="n">1</span><div><h3>Global filing coverage</h3><p>10-K, 10-Q, 8-K, 20-F, 6-K, and international equivalents across all public markets.</p></div></div>
              <div className="point"><span className="n">2</span><div><h3>Earnings call transcripts</h3><p>Full Q&A transcript access with speaker-level attribution and sentence-level indexing.</p></div></div>
              <div className="point"><span className="n">3</span><div><h3>IR decks and press releases</h3><p>Slide-level extraction with table parsing, chart OCR, and footnote handling.</p></div></div>
              <div className="point"><span className="n">4</span><div><h3>Custom integrations</h3><p>Connect your proprietary data — internal models, CRM notes, Bloomberg exports, and more.</p></div></div>
            </div>
          </div>
          <DataVisual />
        </div>
      </div>
    </section>
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

export function PillarSpeed() {
  return (
    <section className="pillar-new" id="p-speed" style={{ background: '#FAFAF7' }}>
      <div className="wrap">
        <PillarNav active="speed" />
        <div className="pillar-grid-new">
          <div>
            <h2>From question to model in minutes</h2>
            <p className="lede">Significantly faster than humans on complex, long-running work — with instant turnaround on quick tasks.</p>
            <div className="points">
              <div className="point"><span className="n">1</span><div><h3>10× faster than manual research</h3><p>A model that takes a first-year analyst 3 days takes FinSynth under an hour.</p></div></div>
              <div className="point"><span className="n">2</span><div><h3>Parallel research execution</h3><p>FinSynth queries dozens of sources simultaneously — no sequential waiting.</p></div></div>
            </div>
          </div>
          <SpeedVisual />
        </div>
      </div>
    </section>
  );
}
