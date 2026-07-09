/* ── Mini visuals ─────────────────────────────── */

function VizComps() {
  const rows = [
    { t: 'AAPL', a: '22.4x', b: '29.1x', c: '+6.1%' },
    { t: 'MSFT', a: '24.8x', b: '33.6x', c: '+15.7%' },
    { t: 'GOOGL', a: '17.2x', b: '24.3x', c: '+13.9%' },
    { t: 'META', a: '15.9x', b: '26.8x', c: '+18.9%', writing: true },
  ]
  return (
    <div className="uc-viz uc-viz-comps">
      <div className="ucv-row ucv-head">
        <span>TICKER</span><span>EV/EBITDA</span><span>P/E</span><span>REV YoY</span>
      </div>
      {rows.map(r => (
        <div key={r.t} className={`ucv-row${r.writing ? ' ucv-writing' : ''}`}>
          <span className="ucv-tick">{r.t}</span>
          <span>{r.a}</span><span>{r.b}</span><span className="ucv-pos">{r.c}</span>
        </div>
      ))}
      <div className="ucv-status"><span className="ucv-dot" /> Writing peer set · 4 of 12 tickers</div>
    </div>
  )
}

function VizPopulate() {
  const cells = [
    { ref: 'B4', label: 'Revenue', val: '$391.0B' },
    { ref: 'B5', label: 'Gross margin', val: '46.2%' },
    { ref: 'B6', label: 'Segment: Services', val: '$96.2B' },
  ]
  return (
    <div className="uc-viz uc-viz-populate">
      {cells.map((c, i) => (
        <div key={c.ref} className="ucv-cell" style={{ animationDelay: `${i * 0.9}s` }}>
          <span className="ucv-ref">{c.ref}</span>
          <span className="ucv-lab">{c.label}</span>
          <span className="ucv-val">{c.val}</span>
          <span className="ucv-cite">10-K</span>
        </div>
      ))}
      <div className="ucv-status"><span className="ucv-dot" /> FY22–FY24 pulled · every cell cited</div>
    </div>
  )
}

function VizDcf() {
  const bars = [34, 42, 50, 58, 67, 78, 90]
  return (
    <div className="uc-viz uc-viz-dcf">
      <div className="ucv-bars">
        {bars.map((h, i) => (
          <div key={i} className={`ucv-bar${i > 2 ? ' ucv-bar-proj' : ''}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="ucv-assump">
        <span className="ucv-chip">WACC 8.4% <em>cited</em></span>
        <span className="ucv-chip">TGR 2.5% <em>cited</em></span>
      </div>
    </div>
  )
}

function VizBriefing() {
  return (
    <div className="uc-viz uc-viz-brief">
      <div className="ucv-q">Get me up to speed on NVDA</div>
      <div className="ucv-a">
        <div className="ucv-line">Data-center revenue is now 88% of total <span className="ucv-cite">10-Q Q3</span></div>
        <div className="ucv-line">Mgmt guided +12% QoQ next quarter <span className="ucv-cite">Call</span></div>
        <div className="ucv-line ucv-line-dim">Key driver: Blackwell ramp…</div>
      </div>
    </div>
  )
}

function VizQuarter() {
  return (
    <div className="uc-viz uc-viz-quarter">
      <div className="ucv-badge">New filing detected · 10-Q Q3</div>
      <div className="ucv-diff">
        <span className="ucv-ref">B14</span>
        <span className="ucv-old">$88.1B</span>
        <svg viewBox="0 0 16 10" className="ucv-arr"><path d="M1 5h12M9 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        <span className="ucv-new">$94.9B</span>
        <span className="ucv-cite">10-Q</span>
      </div>
      <div className="ucv-diff">
        <span className="ucv-ref">C22</span>
        <span className="ucv-old">41.8%</span>
        <svg viewBox="0 0 16 10" className="ucv-arr"><path d="M1 5h12M9 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        <span className="ucv-new">43.2%</span>
        <span className="ucv-cite">10-Q</span>
      </div>
      <div className="ucv-status"><span className="ucv-dot" /> 17 affected cells refreshed</div>
    </div>
  )
}

/* ── Section ──────────────────────────────────── */

const CASES = [
  {
    title: 'Build a comps table',
    tag: 'Full peer set. One pass.',
    desc: 'Pull the metrics for your whole peer set in one pass, across your coverage universe, not one ticker at a time.',
    viz: <VizComps />,
    span: 'uc-span-3',
  },
  {
    title: 'Populate a model from filings',
    tag: 'Three years of data. Minutes, not hours.',
    desc: 'Drop segment revenue, margins, and line items straight from the 10-K and 10-Q into your model, cited.',
    viz: <VizPopulate />,
    span: 'uc-span-3',
  },
  {
    title: 'Run a DCF',
    tag: 'Every input cited back to source.',
    desc: 'Build the projection on the actuals FinSynth pulled, every assumption traceable.',
    viz: <VizDcf />,
    span: 'uc-span-2',
  },
  {
    title: 'Get up to speed on a new name',
    tag: 'From zero to thesis in one session.',
    desc: 'Ask for the business summary, recent results, and key drivers with citations, so you can go straight to what matters.',
    viz: <VizBriefing />,
    span: 'uc-span-2',
  },
  {
    title: 'Update for a new quarter',
    tag: 'New filing. Affected cells refreshed.',
    desc: 'Citations attached automatically.',
    viz: <VizQuarter />,
    span: 'uc-span-2',
  },
]

export default function UseCases() {
  return (
    <section className="usecases" id="use-cases">
      <div className="wrap">
        <div className="uc-head">
          <p className="hiw-eyebrow">USE CASES</p>
          <h2>What analysts run on FinSynth</h2>
          <p className="uc-sub">Real tasks, done inside your model, every output cited.</p>
        </div>
        <div className="uc-grid">
          {CASES.map((c, i) => (
            <div key={c.title} className={`uc-card ${c.span}`}>
              {c.viz}
              <div className="uc-body">
                <span className="uc-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p className="uc-tag">{c.tag}</p>
                <p className="body-text">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
