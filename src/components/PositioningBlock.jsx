import useReveal from '../hooks/useReveal'
import useSectionZoom from '../hooks/useSectionZoom'

/* ── Mini visuals ─────────────────────────────── */

function VizCitation() {
  return (
    <div className="pos-viz pos-viz-cite">
      <div className="posv-cellrow">
        <span className="posv-ref">B14</span>
        <span className="posv-val">$391.0B</span>
        <span className="posv-src-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3h9l4 4v14H6z" />
            <path d="M15 3v4h4M9.5 12h6M9.5 16h6" />
          </svg>
        </span>
      </div>
      <svg className="posv-cur" viewBox="0 0 24 24" fill="none">
        <path d="M5 3l7 16 2.2-6.2L20.5 10 5 3z" fill="#14242E" stroke="#fff" strokeWidth="1.4" />
      </svg>
      <div className="posv-popover">
        <div className="posv-pop-head">SOURCE · APPLE 10-K FY2024 · P.28</div>
        <div className="posv-quote">“Total net sales of $391,035 million…”</div>
      </div>
    </div>
  )
}

function VizCoverage() {
  const docs = ['Filings', 'Transcripts', 'Reports', 'Presentations']
  const exchanges = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX', 'ASX', 'ENX', 'BSE']
  return (
    <div className="pos-viz pos-viz-cov">
      <div className="posv-stat">12,000<span>+</span></div>
      <div className="posv-stat-cap">listed companies covered</div>
      <div className="posv-chips">
        {docs.map(d => <span key={d} className="posv-chip posv-chip-doc">{d}</span>)}
      </div>
      <div className="posv-chips posv-chips-dim">
        {exchanges.map(e => <span key={e} className="posv-chip">{e}</span>)}
      </div>
    </div>
  )
}

function VizExcel() {
  const ribbonTabs = ['File', 'Home', 'Insert', 'Formulas', 'Data']
  return (
    <div className="pos-viz pos-viz-excel">
      <div className="posv-xl">
        <div className="posv-xl-titlebar">
          <span className="posv-xl-logo">X</span>
          <span className="posv-xl-name">Model_v12.xlsx</span>
        </div>
        <div className="posv-xl-ribbon">
          {ribbonTabs.map(t => (
            <span key={t} className="posv-xl-tab">{t}</span>
          ))}
        </div>
        <div className="posv-xl-addin-row">
          <button className="posv-xl-addin" type="button">
            <span className="posv-xl-addin-ic">◆</span> FinSynth
            <span className="posv-xl-ripple" />
          </button>
          <svg className="posv-xl-cursor" viewBox="0 0 24 24" fill="none">
            <path d="M5 3l7 16 2.2-6.2L20.5 10 5 3z" fill="#14242E" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
      <div className="posv-timer">⏱ Up and running in under 2 minutes</div>
    </div>
  )
}

/* ── Section ──────────────────────────────────── */

const ITEMS = [
  {
    title: 'Cell-level citations',
    desc: 'Every figure. One click to source. Auditability built in, not bolted on.',
    viz: <VizCitation />,
  },
  {
    title: 'Global coverage',
    desc: '12,000+ listed companies, with filings, transcripts, reports, and presentations.',
    viz: <VizCoverage />,
  },
  {
    title: 'Any workflow, Excel-native',
    desc: 'Up in under two minutes. Build, update, audit, and query models without leaving the spreadsheet.',
    viz: <VizExcel />,
  },
]

export default function PositioningBlock() {
  const ref = useReveal()
  const zoomRef = useSectionZoom()
  return (
    <section className="pos-block" ref={ref}>
      <div className="wrap" ref={zoomRef}>
        <div className="pos-head">
          <p className="hiw-eyebrow">WHY FINSYNTH</p>
          <h2>Auditable by design, native to Excel</h2>
          <p className="pos-sub">Cited numbers, global coverage, and a two-minute setup, inside the spreadsheet you already use.</p>
        </div>
        <div className="pos-grid">
          {ITEMS.map(item => (
            <div key={item.title} className="pos-item">
              {item.viz}
              <div className="pos-body">
                <h3>{item.title}</h3>
                <p className="body-text">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
