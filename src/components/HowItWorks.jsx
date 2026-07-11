/* ── Row visuals ─────────────────────────────── */

function VizAsk() {
  return (
    <div className="hiwr-stack">
      <div className="hiwr-bubble">
        “Pull Apple’s FY2024 revenue by segment and write it into my model.”
      </div>
      <div className="hiwr-card hiwr-composer">
        <span className="hiwr-composer-ph">Ask FinSynth...</span>
        <span className="hiwr-composer-send">
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path d="M1.5 7.5L13.5 1.5L7.5 13.5L6 8.5L1.5 7.5Z" fill="white" />
          </svg>
        </span>
      </div>
    </div>
  )
}

const TOOLS = [
  { name: 'Search filings', sub: 'Apple 10-K FY2024 · revenue by segment', color: '#0E9F6E' },
  { name: 'Read model', sub: 'Scanning B12:B18 in Model_v12.xlsx', color: '#7A5AF8' },
  { name: 'Propose write', sub: 'B14 ← $391.0B · awaiting your approval', color: '#3550C8' },
]

function VizTools() {
  return (
    <div className="hiwr-stack">
      {TOOLS.map(t => (
        <div key={t.name} className="hiwr-card hiwr-tool">
          <span className="hiwr-tool-bar" style={{ background: t.color }} />
          <div>
            <div className="hiwr-tool-name">{t.name}</div>
            <div className="hiwr-tool-sub">{t.sub}</div>
          </div>
          <svg className="hiwr-tool-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      ))}
    </div>
  )
}

const ROWS = [
  { seg: 'iPhone', val: '201.2', delta: '+0.3%', up: true },
  { seg: 'Services', val: '96.2', delta: '+13%', up: true },
  { seg: 'Total net sales', val: '391.0', delta: '+2%', up: true, total: true },
]

function VizAnswer() {
  return (
    <div className="hiwr-stack">
      <div className="hiwr-card hiwr-answer">
        <div className="hiwr-answer-head">
          <span className="hiwr-answer-logo">F</span>
          <span className="hiwr-answer-title">Revenue by segment ($B)</span>
          <span className="hiwr-answer-total">$391.0B</span>
        </div>
        <div className="hiwr-answer-rows">
          {ROWS.map(r => (
            <div key={r.seg} className={`hiwr-arow${r.total ? ' total' : ''}`}>
              <span className="hiwr-arow-seg">{r.seg}</span>
              <span className="hiwr-arow-val">{r.val}</span>
              <span className={`hiwr-arow-delta ${r.up ? 'pos' : 'neg'}`}>{r.delta}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="hiwr-cite-pill">SEC 10-K FY2024 · p.28 ✓</span>
    </div>
  )
}

/* ── Section ─────────────────────────────────── */

const STEPS = [
  {
    title: 'Ask in plain English',
    desc: 'Type the question the way you’d ask an analyst — no formulas, no syntax. FinSynth reads your model and the filings behind it.',
    viz: <VizAsk />,
  },
  {
    title: 'Watch every step it takes',
    desc: 'FinSynth searches the filing, reads your model, and proposes the write. Every tool call is visible — nothing lands in a cell until you approve it.',
    viz: <VizTools />,
  },
  {
    title: 'Approve cited numbers into your cells',
    desc: 'Every figure arrives with the exact document, page, and quote behind it. When your PM asks where $391.0B came from, the answer is one click away.',
    viz: <VizAnswer />,
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw-section" id="how-it-works">
      <div className="hiw-wrap">
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">What asking FinSynth looks like</h2>
          <p className="hiw-sub">Ask in plain English. FinSynth searches the filing, proposes the write, and shows its work — every step visible.</p>
        </div>
        <div className="hiw-rows">
          {STEPS.map(step => (
            <div key={step.title} className="hiw-row2">
              <div className="hiw-row2-text">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              <div className="hiw-row2-viz">{step.viz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
