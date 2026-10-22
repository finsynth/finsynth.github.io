import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useUser } from '@clerk/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useReveal from '../hooks/useReveal'
import { BOOK_URL, SIGNIN_HREF, APP_HREF } from '../components/AskParts'
import { SOLUTIONS } from '../data/solutions'

/* ── drawn product panels ──────────────────────────────────────────────────
 * Every visual is a pair of white panels on the site's grainy blue ground:
 * the deliverable on the left (a model, a sheet, a slide) and the Fia thread
 * that produced it on the right. They are drawn, not screenshots, so the
 * numbers in them are illustrative and sized in em off the stage, which is
 * what lets the whole picture scale down on a phone instead of re-flowing.
 */

/* a waterfall bridge: entry bar, two steps, exit bar */
function Bridge({ steps, unit = '', H = 150 }) {
  const W = 300, pad = 10, gap = 14
  const n = steps.length
  const bw = (W - pad * 2 - gap * (n - 1)) / n
  const max = Math.max(...steps.map((s) => s.top))
  const y = (v) => H - 26 - (v / max) * (H - 50)
  return (
    <svg className="sol-bridge" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {steps.map((s, i) => {
        const x = pad + i * (bw + gap)
        const y0 = y(s.top), y1 = y(s.base)
        return (
          <g key={s.label}>
            <rect x={x} y={y0} width={bw} height={Math.max(2, y1 - y0)} rx="2" className={s.kind === 'step' ? 'sol-bridge-step' : 'sol-bridge-bar'} />
            <text x={x + bw / 2} y={y0 - 5} textAnchor="middle" className="sol-bridge-val">{s.value}{unit}</text>
            <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="sol-bridge-lbl">{s.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Returns({ items }) {
  return (
    <dl className="sol-returns">
      {items.map((it) => (
        <div key={it.label}>
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Tick() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/* where a figure or claim came from */
function Src({ children }) {
  return <span className="sol-src">{children}</span>
}

/* the Fia thread beside each deliverable */
function FiaPane({ ask, note, rows, result, flag }) {
  return (
    <div className="sol-panel sol-fia">
      <div className="sol-fia-head">
        <span className="sol-fia-dot" aria-hidden="true" />
        Fia
      </div>
      <div className="sol-fia-body">
        <p className="sol-fia-ask">{ask}</p>
        <p className="sol-fia-note">{note}</p>
        <ul className="sol-fia-rows">
          {rows.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              <b>{r.done} / {r.total}</b>
            </li>
          ))}
        </ul>
        <p className="sol-fia-result">
          <Tick />
          {result}
        </p>
        {flag && (
          <p className="sol-fia-flag">
            <span className="sol-fia-flag-tag">{flag.level}</span>
            {flag.text}
          </p>
        )}
      </div>
      <div className="sol-fia-composer">
        <span>Ask Fia</span>
        <i aria-hidden="true" />
      </div>
    </div>
  )
}

function LboVisual() {
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-assume">
        <h4>Assumptions</h4>
        <p className="sol-panel-sub">Stress-test the LBO</p>
        {[
          ['Entry multiple', '10.0x', 58],
          ['EBITDA growth', '8.5%', 34],
          ['Debt paydown', '55%', 55],
        ].map(([l, v, pct]) => (
          <div className="sol-slider" key={l}>
            <div className="sol-slider-row"><span>{l}</span><b>{v}</b></div>
            <div className="sol-slider-track"><i style={{ width: `${pct}%` }} /><em style={{ left: `${pct}%` }} /></div>
          </div>
        ))}
        <p className="sol-assume-hyp"><b>Hypothesis</b> Returns are driven by the bridge: margin expansion adds about 0.4x MOIC</p>
      </div>
      <div className="sol-panel sol-bridge-panel">
        <div className="sol-panel-top">
          <div>
            <h4>EBITDA bridge</h4>
            <p className="sol-panel-sub">Entry to exit · $M</p>
          </div>
          <span className="sol-pill">IC-ready</span>
        </div>
        <Bridge H={215} steps={[
          { label: 'Entry EBITDA', value: '$42.0', base: 0, top: 42 },
          { label: '+ Organic growth', value: '+10.7', base: 42, top: 52.7, kind: 'step' },
          { label: '+ Margin', value: '+7.8', base: 52.7, top: 60.5, kind: 'step' },
          { label: 'Exit EBITDA', value: '$60.5', base: 0, top: 60.5 },
        ]} />
        <Returns items={[{ label: 'MOIC', value: '2.4x' }, { label: 'IRR', value: '26%' }, { label: 'Exit EBITDA', value: '$60.5M' }]} />
      </div>
    </div>
  )
}

function UnderwritingVisual() {
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-tree-panel">
        <h4>Underwriting model</h4>
        <p className="sol-panel-sub">Driver tree · built bottom-up</p>
        <div className="sol-tree">
          <div className="sol-tree-col">
            <span className="sol-node"><small>Volume</small><b>920k</b></span>
            <span className="sol-node"><small>Price</small><b>$38.5</b></span>
          </div>
          <div className="sol-tree-col">
            <span className="sol-node sol-node--sum"><small>Revenue</small><b>$35.4M</b></span>
            <span className="sol-node"><small>Opex</small><b>$21.9M</b></span>
          </div>
          <div className="sol-tree-col">
            <span className="sol-node sol-node--out"><small>EBITDA</small><b>$8.7M</b></span>
          </div>
        </div>
        <div className="sol-tree-foot">
          <span>IC tables</span>
          <span className="sol-pill">Ready</span>
        </div>
      </div>
      <FiaPane
        ask="Scope the driver tree and build the model to our conventions"
        note="The driver tree is scoped from the CIM and the management plan, then each schedule is built bottom-up"
        rows={[{ label: 'Schedules built', done: 6, total: 6 }, { label: 'IC tables', done: 4, total: 4 }]}
        result="Build complete. Handing over to model review"
        flag={{ level: 'Medium', text: 'Opex double-counts freight in the cost tree. Fix suggested in the workbook' }}
      />
    </div>
  )
}

const PORTCOS = [
  ['Alpha', 'Custom', '12.4x', '$203M'],
  ['Beta', 'Fund std', '10.1x', '$118M'],
  ['Gamma', 'Legacy', '9.6x', '$74M'],
  ['Delta', 'Custom', '11.2x', '$61M'],
  ['Epsilon', 'Fund std', '8.8x', '$34M'],
]

function ValuationVisual() {
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-sheet">
        <div className="sol-sheet-title">Q4 Consolidation.xlsx</div>
        <div className="sol-sheet-fx"><span>D6</span><span>fx</span><span>=INDEX(Comps!E:E, MATCH(A6, Comps!A:A, 0))</span></div>
        <table>
          <thead><tr><th>Portco</th><th>Template</th><th>EV/EBITDA</th><th>FMV</th><th>Status</th></tr></thead>
          <tbody>
            {PORTCOS.map((r) => (
              <tr key={r[0]}>
                {r.map((c) => <td key={c}>{c}</td>)}
                <td className="sol-sheet-ok">Mapped</td>
              </tr>
            ))}
            <tr className="sol-sheet-total"><td>Fund</td><td /><td /><td>$490M</td><td className="sol-sheet-ok">Ties out</td></tr>
          </tbody>
        </table>
        <div className="sol-sheet-tabs">
          <span className="is-on">Fund</span><span>Comps</span><span>Multiples</span>
          <em>Ready · 100%</em>
        </div>
      </div>
      <FiaPane
        ask="Refresh the comps and consolidate the Q4 portco reports"
        note="Multiples are pulled straight from the source filings. Each portco template is mapped to the fund standard"
        rows={[{ label: 'Portcos consolidated', done: 5, total: 5 }, { label: 'Templates normalised', done: 3, total: 3 }]}
        result="Fund FMV ties out at $490M across all five portco templates"
      />
    </div>
  )
}

function DeckVisual() {
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-deck">
        <div className="sol-sheet-title">IC Memo.pptx</div>
        <div className="sol-deck-body">
          <ol className="sol-deck-rail">
            {[0, 1, 2, 3].map((i) => <li key={i} className={i === 0 ? 'is-on' : ''}><span>{i + 1}</span><i /></li>)}
          </ol>
          <div className="sol-slide">
            <h4>Returns summary, base case</h4>
            <Bridge steps={[
              { label: 'Entry', value: '140', base: 0, top: 140 },
              { label: '+ EBITDA', value: '+96', base: 140, top: 236, kind: 'step' },
              { label: '+ Multiple', value: '+52', base: 236, top: 288, kind: 'step' },
              { label: 'Exit', value: '320', base: 0, top: 320 },
            ]} />
            <Returns items={[{ label: 'MOIC', value: '2.3x' }, { label: 'IRR', value: '24%' }, { label: 'Exit EBITDA', value: '$74M' }]} />
            <p className="sol-slide-src">Source: LBO Model.xlsx · Returns!C18</p>
          </div>
        </div>
        <div className="sol-sheet-tabs"><em>Slide 1 of 4</em></div>
      </div>
      <FiaPane
        ask="Build the IC deck from the live model"
        note="Slides are generated from the model: cases, returns bridge and sensitivities, each figure cited to its source cell"
        rows={[{ label: 'Slides drafted', done: 12, total: 12 }, { label: 'Figures cited', done: 38, total: 38 }]}
        result="Cross-checked against the underlying model. No stale numbers"
      />
    </div>
  )
}

/* ── hedge fund visuals ── the six use cases on /solutions/hedge-funds ── */

function EarningsVisual() {
  const rows = [['Revenue', '1,284.6', '+2.1%'], ['Gross profit', '512.5', '+1.7%'], ['EBITDA', '208.3', '-0.8%'], ['EPS', '0.91', '+3.4%']]
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-doc">
        <div className="sol-sheet-title">Q3 FY26 earnings release</div>
        <dl className="sol-doc-figs">
          {[['Net revenue', '$1,284.6m'], ['Gross profit', '$512.5m'], ['Diluted EPS', '$0.91']].map(([l, v]) => (
            <div key={l}><dt>{l}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <p className="sol-doc-foot">Condensed statements of operations, p. 4</p>
      </div>
      <div className="sol-panel sol-sheet">
        <div className="sol-sheet-title">Your model</div>
        <div className="sol-sheet-fx"><span>C8</span><span>fx</span><span>=1284.6 · Q3 FY26 release, p. 4</span></div>
        <table>
          <thead><tr><th>USD m</th><th>Q3 FY26A</th><th>vs cons.</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td>{r[1]}</td>
                <td className={r[2].startsWith('+') ? 'sol-sheet-ok' : 'sol-sheet-miss'}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>Consensus</span><em>30 cells updated</em></div>
      </div>
    </div>
  )
}

function OverviewVisual() {
  const points = [
    ['Two segments: Stores (71% of revenue) and Online (29%)', 'FY25 10-K, p. 41'],
    ['Online growing 18% y/y while stores are flat', 'Q3 release'],
    ['Management targets 200bp margin expansion by FY28', 'Q2 call'],
    ['Street debate centres on private label mix', 'Broker note'],
    ['Closest peers: Contoso Mart, Fabrikam Stores', 'FY25 10-K, p. 9'],
  ]
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-doc">
        <div className="sol-sheet-title">Northwind Retail · company overview</div>
        <ul className="sol-points">
          {points.map(([t, src]) => <li key={t}><span>{t}</span><Src>{src}</Src></li>)}
        </ul>
      </div>
      <FiaPane
        ask="Get me up to speed on Northwind Retail"
        note="The business, its segments, key metrics and what management has been saying, each point linked to its source. Broker notes from the Dataroom included"
        rows={[{ label: 'Sources read', done: 14, total: 14 }, { label: 'Points cited', done: 18, total: 18 }]}
        result="Overview ready. Ask a follow-up on any point"
      />
    </div>
  )
}

function ModelBuildVisual() {
  const rows = [
    ['Revenue', '4,102', '4,355', '4,610', '4,872'],
    ['EBITDA', '610', '655', '702', '748'],
    ['Capex', '(180)', '(195)', '(204)', '(215)'],
    ['Free cash flow', '290', '318', '341', '362'],
  ]
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-sheet">
        <div className="sol-sheet-title">Northwind Retail · model build</div>
        <div className="sol-sheet-fx"><span>E12</span><span>fx</span><span>=4872 · FY25 10-K, p. 44</span></div>
        <table>
          <thead><tr><th>USD m</th><th>FY22A</th><th>FY23A</th><th>FY24A</th><th>FY25A</th></tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r[0]}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>DCF</span><span>Inputs</span><em>FY23 recast applied</em></div>
      </div>
      <div className="sol-panel">
        <div className="sol-panel-top">
          <div>
            <h4>DCF</h4>
            <p className="sol-panel-sub">Your template · every historical linked to the filings</p>
          </div>
          <span className="sol-pill">Built</span>
        </div>
        <Returns items={[{ label: 'WACC', value: '8.5%' }, { label: 'Terminal growth', value: '2.5%' }, { label: 'Implied value', value: '$46.20' }]} />
        <p className="sol-assume-hyp"><b>Ready to forecast</b> The history lines up before you start, with the FY23 segment recast already applied</p>
      </div>
    </div>
  )
}

function CompsVisual() {
  const rows = [
    ['Northwind Retail', '8.9x', '15.2x', '5.6%'],
    ['Contoso Mart', '9.8x', '16.8x', '4.1%'],
    ['Fabrikam Stores', '7.6x', '13.9x', '3.2%'],
    ['Tailspin Retail', '10.4x', '18.1x', '7.0%'],
  ]
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-sheet">
        <div className="sol-sheet-title">Peer comps · NTM</div>
        <table>
          <thead><tr><th>Company</th><th>EV/EBITDA</th><th>P/E</th><th>Rev. growth</th></tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={r[0]} className={i === 1 ? 'sol-sheet-pick' : ''}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Comps</span><span>Inputs</span><em>Calendarised to December</em></div>
      </div>
      <div className="sol-panel sol-cite">
        <div className="sol-panel-top">
          <div>
            <h4>Contoso Mart · EV/EBITDA 9.8x</h4>
            <p className="sol-panel-sub">The inputs behind the multiple</p>
          </div>
        </div>
        <ul className="sol-points">
          <li><span>EV $14.2bn</span><Src>Q3 10-Q, p. 3</Src></li>
          <li><span>NTM EBITDA $1.45bn</span><Src>Consensus, calendarised</Src></li>
          <li><span>January year end shifted to December</span><Src>Normalised</Src></li>
        </ul>
        <p className="sol-fia-result"><Tick />Every input traced to where it came from</p>
      </div>
    </div>
  )
}

function ThesisVisual() {
  const evidence = [
    ['Private label up 4pts of mix in two years', 'Supported', 'FY25 10-K'],
    ['Gross margin up 120bp year on year', 'Supported', 'Q3 release'],
    ['Promotional intensity rising in core categories', 'Risk', 'Q3 call'],
  ]
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel">
        <div className="sol-panel-top">
          <div>
            <h4>Your thesis</h4>
            <p className="sol-panel-sub">Margins expand as private label grows</p>
          </div>
        </div>
        <ul className="sol-evidence">
          {evidence.map(([t, k, src]) => (
            <li key={t}>
              <span className={`sol-tag sol-tag--${k.toLowerCase()}`}>{k}</span>
              <span>{t}</span>
              <Src>{src}</Src>
            </li>
          ))}
        </ul>
      </div>
      <FiaPane
        ask="Test my thesis against the filings and build the strongest case against it"
        note="Each point is checked against filings, transcripts and your own research, then the counter-case is drafted with every claim cited"
        rows={[{ label: 'Points tested', done: 3, total: 3 }, { label: 'Claims cited', done: 6, total: 6 }]}
        result="Counter-case drafted. Promo pressure offsets mix gains"
        flag={{ level: 'Risk', text: 'Promotional intensity rising in core categories, per the Q3 call' }}
      />
    </div>
  )
}

function AuditVisual() {
  const rows = [['12', '4,355', '4,610', '4,872'], ['13', '655', '702', '748'], ['14', '(195)', '(204)', '#REF!'], ['15', '318', '341', '362'], ['16', '7.3%', '7.4%', '7.4%']]
  const flagged = new Set(['13-2', '14-3', '16-1']) // D13, E14, C16
  return (
    <div className="sol-stage" aria-hidden="true">
      <div className="sol-panel sol-sheet">
        <div className="sol-sheet-title">Inherited_model.xlsx · audit</div>
        <div className="sol-sheet-fx"><span>D13</span><span>fx</span><span>=C13*1.072+12</span></div>
        <table className="sol-grid">
          <thead><tr><th /><th>C</th><th>D</th><th>E</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, j) => <td key={j} className={j === 0 ? 'sol-grid-n' : flagged.has(`${r[0]}-${j}`) ? 'sol-grid-bad' : ''}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>Audit</span><em>3 issues · FY24 reconciled</em></div>
      </div>
      <div className="sol-panel">
        <div className="sol-panel-top">
          <div>
            <h4>Audit findings</h4>
            <p className="sol-panel-sub">Each issue linked to the exact cell</p>
          </div>
          <span className="sol-pill">3 open</span>
        </div>
        <ul className="sol-findings">
          <li><b>D13</b><span>Hardcoded number inside a formula</span></li>
          <li><b>E14</b><span>Broken reference</span></li>
          <li><b>C16</b><span>Formula differs from the rest of the row</span></li>
        </ul>
        <p className="sol-fia-result sol-audit-ok"><Tick />FY24 historicals reconciled to the 10-K</p>
      </div>
    </div>
  )
}

const VISUALS = {
  lbo: LboVisual, underwriting: UnderwritingVisual, valuation: ValuationVisual, deck: DeckVisual,
  earnings: EarningsVisual, overview: OverviewVisual, modelbuild: ModelBuildVisual, comps: CompsVisual, thesis: ThesisVisual, audit: AuditVisual,
}

function SectionHead({ eyebrow, title }) {
  return (
    <div className="sol-sec-head">
      <p className="sol-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}

/* the home page's accordion items (.faq-*) in a framed list, plus FAQPage
   structured data so the questions are quotable by search and agents */
function SolFaq({ head, items }) {
  const [open, setOpen] = useState(-1)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <section className="sol-faq wrap sol-anchor-target" id="faq">
      <SectionHead eyebrow={head.eyebrow} title={head.title} />
      <div className="sol-faq-list">
        {items.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} className={`faq-item${isOpen ? ' open' : ''}`}>
              <button type="button" className="faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </button>
              <div className="faq-a" role="region" aria-hidden={!isOpen}>
                <div className="faq-a-inner"><p>{f.a}</p></div>
              </div>
            </div>
          )
        })}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}

function Workflow({ w, flip }) {
  const ref = useReveal({ threshold: 0.12 })
  const Visual = VISUALS[w.visual]
  return (
    <section className={`sol-work${flip ? ' sol-work--flip' : ''}`} ref={ref}>
      <div className="sol-work-copy sol-reveal">
        <p className="sol-eyebrow">{w.eyebrow}</p>
        <h2>{w.title}</h2>
        <p>{w.body}</p>
      </div>
      <div className="sol-work-visual sol-reveal" style={{ '--d': '.12s' }}>
        <Visual />
      </div>
    </section>
  )
}

export default function Solution() {
  const { slug } = useParams()
  const sol = SOLUTIONS[slug]
  const { isSignedIn: signedIn } = useUser()
  const statsRef = useReveal({ threshold: 0.2 })
  const howRef = useReveal({ threshold: 0.1 })

  useEffect(() => {
    if (!sol) return
    document.title = `FinSynth AI for ${sol.name}`
    return () => {
      document.title = 'FinSynth AI - Auditable spreadsheet agent'
    }
  }, [sol])

  if (!sol) return <Navigate to="/" replace />

  return (
    <div className="mainContainer">
      <Navbar />
      <main className="sol-page">
        <header className="sol-hero wrap">
          <div className="sol-hero-copy">
            <p className="sol-eyebrow">{sol.name}</p>
            <h1 className="sol-hero-title">{sol.title}</h1>
            <p className="sol-hero-lede">{sol.lede}</p>
            <div className="sol-hero-ctas">
              <a className="hero-s2-cta" href={BOOK_URL} target="_blank" rel="noopener noreferrer">Talk to Us</a>
              <a className="hero-s2-cta hero-s2-cta--ghost" href={signedIn ? APP_HREF : SIGNIN_HREF} target="_blank" rel="noopener noreferrer">
                {signedIn ? 'Go to app' : 'Sign in'}
              </a>
            </div>
            {sol.strategies && (
              <div className="sol-chips">
                <span className="sol-chips-lead">{sol.strategiesLead}</span>
                <ul>{sol.strategies.map((name) => <li key={name}>{name}</li>)}</ul>
              </div>
            )}
          </div>
          {/* the same Wall Street photo the home hero pixelates, here left as a photograph */}
          <div className="sol-hero-photo">
            <img src="/assets/img/wall-street-bw.webp" alt="" loading="eager" />
          </div>
        </header>

        {sol.anchors && (
          <nav className="sol-anchors" aria-label="On this page">
            <div className="wrap sol-anchors-row">
              <span className="sol-anchors-lead">On this page</span>
              {sol.anchors.map((a) => <a key={a.id} href={`#${a.id}`}>{a.label}</a>)}
            </div>
          </nav>
        )}

        <section className="sol-stats wrap" ref={statsRef}>
          <div className="sol-stats-band">
            <p className="sol-stats-lead">{sol.statsLead}</p>
            <dl className="wac-nums sol-stats-nums" style={{ '--n': sol.stats.length }}>
              {sol.stats.map((s, i) => (
                <div className="wac-num" key={s.label} style={{ '--d': `${0.1 + 0.07 * i}s` }}>
                  <dt className="wac-num-value">{s.value}</dt>
                  <dd className="wac-num-label">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="sol-works wrap sol-anchor-target" id="use-cases">
          {sol.useCasesHead && <SectionHead {...sol.useCasesHead} />}
          {sol.workflows.map((w, i) => <Workflow key={w.key} w={w} flip={i % 2 === 1} />)}
          {sol.more && <p className="sol-more"><b>{sol.more.lead}</b> {sol.more.rest}</p>}
        </div>

        {sol.how && (
          <section className="sol-how wrap sol-anchor-target" id="how-it-works" ref={howRef}>
            <SectionHead eyebrow={sol.how.eyebrow} title={sol.how.title} />
            <ul className="sol-pillars">
              {sol.how.pillars.map((p, i) => (
                <li key={p.title} className="sol-reveal" style={{ '--d': `${0.05 * i}s` }}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
            {sol.quote && (
              <figure className="sol-quote">
                <blockquote>{sol.quote.text}</blockquote>
                <figcaption>{sol.quote.who}</figcaption>
              </figure>
            )}
          </section>
        )}

        {sol.faqs && <SolFaq head={sol.faqHead} items={sol.faqs} />}

        <section className="sol-close wrap">
          <div className="sol-close-panel">
            <h2>{sol.closing}</h2>
            {sol.closingSub && <p className="sol-close-sub">{sol.closingSub}</p>}
            <div className="ent-ctas">
              <a className="ent-cta" href={BOOK_URL} target="_blank" rel="noopener noreferrer">Talk to Us</a>
              <a className="ent-cta ent-cta--ghost" href={signedIn ? APP_HREF : SIGNIN_HREF} target="_blank" rel="noopener noreferrer">
                {signedIn ? 'Go to app' : 'Get access'}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
