import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useUser } from '@clerk/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionRule from '../components/SectionRule'
import Faq from '../components/Faq'
import Testimonial from '../components/Testimonial'
import { useAutoStep, VisualWorkflows, VisualAudit, VisualIntegrated, VisualEnterprise } from '../components/ExcelSection'
import useReveal from '../hooks/useReveal'
import useMediaQuery from '../hooks/useMediaQuery'
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

/* ── hedge fund visuals ────────────────────────────────────────────────────
 * One dominant working screen and one smaller supporting card that overlaps
 * its corner: the source it came from, the finding it points at, or the
 * result it produced. Three of them move, on the home page's source-tracing
 * pattern: a tick clock steps through the rows, and the completed state is
 * what the loop rests on, so a still frame still reads.
 */

/* a tick clock that starts once the stage is in view; reduced motion holds
   the last tick (the finished state) */
function useTicks(total, ms, ref) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(total - 1)
      return
    }
    let id
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      if (e.isIntersecting) id = setInterval(() => setT((v) => (v + 1) % total), ms)
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); clearInterval(id) }
  }, [total, ms, ref])
  return t
}

const EARN_ROWS = [
  { label: 'Revenue', prior: '1,184.2', now: '1,284.6', cons: '1,258.0', vs: '+2.1%', cell: 'C8', fx: '=1284.6', line: 'Net revenue of $1,284.6m, up 8.5% on the prior year' },
  { label: 'Gross profit', prior: '470.1', now: '512.5', cons: '504.0', vs: '+1.7%', cell: 'C9', fx: '=512.5', line: 'Gross profit of $512.5m, a 39.9% gross margin' },
  { label: 'Adj. EBITDA', prior: '196.4', now: '208.3', cons: '210.0', vs: '-0.8%', cell: 'C11', fx: '=208.3', line: 'Adjusted EBITDA of $208.3m' },
  { label: 'Diluted EPS', prior: '0.84', now: '0.91', cons: '0.88', vs: '+3.4%', cell: 'C14', fx: '=0.91', line: 'Diluted earnings per share of $0.91' },
]

/* release line lights, the model cell fills from it, the variance prints.
   Three ticks a row, four rows, then a hold on the finished update */
function EarningsVisual() {
  const ref = useRef(null)
  const HOLD = 5
  const t = useTicks(EARN_ROWS.length * 3 + HOLD, 620, ref)
  const cur = Math.floor(t / 3)
  const filled = (i) => t >= i * 3 + 1
  const shown = (i) => t >= i * 3 + 2
  const done = EARN_ROWS.filter((_, i) => filled(i)).length
  const fxRow = EARN_ROWS[Math.min(cur, EARN_ROWS.length - 1)]
  return (
    <div className="sol-stage sol-stage--focus" ref={ref} aria-hidden="true">
      <div className="sol-panel sol-sheet sol-main">
        <div className="sol-sheet-title">Northwind Retail · model<em className="sol-sheet-tag">Q3 FY26 update</em></div>
        <div className="sol-sheet-fx"><span>{fxRow.cell}</span><span>fx</span><span>{fxRow.fx} · Q3 FY26 release, p. 4</span></div>
        <table className="sol-upd">
          <thead><tr><th>USD m</th><th>Q3 FY25A</th><th className="is-col">Q3 FY26A</th><th>Cons.</th><th>vs cons.</th></tr></thead>
          <tbody>
            {EARN_ROWS.map((r, i) => (
              <tr key={r.label} className={cur === i && !filled(i) ? 'is-lit' : ''}>
                <td>{r.label}</td>
                <td>{r.prior}</td>
                <td className={`sol-upd-cell${filled(i) ? ' is-filled' : ''}`}><span>{r.now}</span></td>
                <td>{r.cons}</td>
                <td className={`sol-upd-var ${r.vs.startsWith('+') ? 'sol-sheet-ok' : 'sol-sheet-miss'}${shown(i) ? ' is-on' : ''}`}>{r.vs}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>Consensus</span><em>{done} of {EARN_ROWS.length} cells updated</em></div>
      </div>
      <div className="sol-panel sol-aside sol-excerpt">
        <div className="sol-aside-head"><Src>Q3 FY26 release</Src><span>p. 4</span></div>
        <ul>
          {EARN_ROWS.map((r, i) => (
            <li key={r.label} className={cur === i && !filled(i) ? 'is-lit' : filled(i) ? 'is-done' : ''}>{r.line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const OVERVIEW_SOURCES = [
  ['FY25 10-K', 'Filing'], ['Q3 release', 'Filing'], ['Q3 call', 'Transcript'],
  ['Broker notes', 'Dataroom'], ['Expert call', 'Dataroom'],
]

/* a research brief, with the stack of sources that fed it */
function OverviewVisual() {
  return (
    <div className="sol-stage sol-stage--focus" aria-hidden="true">
      <div className="sol-panel sol-main sol-brief">
        <div className="sol-sheet-title">Northwind Retail · overview<em className="sol-sheet-tag">Drafted by Fia</em></div>
        <div className="sol-brief-body">
          <section>
            <h5>Business</h5>
            <p>Value grocer with 1,240 stores across the Midwest, two segments: Stores (71% of revenue) and Online (29%) <Src>FY25 10-K, p. 41</Src></p>
          </section>
          <section>
            <h5>Key metrics</h5>
            <dl className="sol-brief-kpis">
              <div><dt>Revenue FY25</dt><dd>$4.9bn</dd></div>
              <div><dt>Margin</dt><dd>15.4%</dd></div>
              <div><dt>Online growth</dt><dd>+18%</dd></div>
              <div><dt>Leverage</dt><dd>1.8x</dd></div>
            </dl>
          </section>
          <section>
            <h5>Management is saying</h5>
            <p>Targets 200bp of margin expansion by FY28 as private label reaches a third of the mix <Src>Q3 FY26 call</Src></p>
          </section>
        </div>
      </div>
      <div className="sol-panel sol-aside sol-stack">
        <div className="sol-aside-head"><span>Sources read</span><b>14 / 14</b></div>
        <ul>
          {OVERVIEW_SOURCES.map(([name, kind]) => (
            <li key={name}><Tick /><span>{name}</span><em>{kind}</em></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const BUILD_ROWS = [
  ['Revenue', '4,355', '4,610', '4,872'],
  ['EBITDA', '655', '702', '748'],
  ['Capex', '(195)', '(204)', '(215)'],
  ['Free cash flow', '318', '341', '362'],
]

/* historicals spread from the filings, the forecast columns waiting: the sheet
   alone, full width, since the claim is the empty forecast columns and a DCF
   card beside them only said the opposite */
function ModelBuildVisual() {
  return (
    <div className="sol-stage sol-stage--focus" aria-hidden="true">
      <div className="sol-panel sol-sheet sol-main">
        <div className="sol-sheet-title">Northwind Retail · model build<em className="sol-sheet-tag">Your template</em></div>
        <div className="sol-sheet-fx"><span>F12</span><span>fx</span><span>=4872 · FY25 10-K, p. 44</span></div>
        <table className="sol-build">
          <thead>
            <tr className="sol-build-span"><th /><th colSpan="3">From the filings</th><th colSpan="2" className="is-fc">Forecast</th></tr>
            <tr><th>USD m</th><th>FY23A</th><th>FY24A</th><th>FY25A</th><th className="is-fc">FY26E</th><th className="is-fc">FY27E</th></tr>
          </thead>
          <tbody>
            {BUILD_ROWS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                {r.slice(1).map((v, i) => <td key={i} className="is-hist">{v}</td>)}
                <td className="is-fc" /><td className="is-fc" />
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>DCF</span><span>Inputs</span><em>FY23 recast applied</em></div>
      </div>
    </div>
  )
}

const COMPS = [
  { name: 'Northwind Retail', ev: '8.9x', pe: '15.2x', evs: '1.0x', g: '5.6%', self: true },
  { name: 'Contoso Mart', ev: '9.8x', pe: '16.8x', evs: '1.1x', g: '4.1%', EV: '$14.2bn', ebitda: '$1.45bn', fye: 'January year end, shifted' },
  { name: 'Fabrikam Stores', ev: '7.6x', pe: '13.9x', evs: '0.8x', g: '3.2%', EV: '$9.1bn', ebitda: '$1.20bn', fye: 'June year end, shifted' },
  { name: 'Tailspin Retail', ev: '10.4x', pe: '18.1x', evs: '1.3x', g: '7.0%', EV: '$21.7bn', ebitda: '$2.09bn', fye: 'December year end, no shift' },
  { name: 'Litware Grocers', ev: '8.2x', pe: '14.6x', evs: '0.6x', g: '2.4%' },
]
const COMPS_PICK = [1, 2, 3]

/* the selection walks the peers; the inputs behind each multiple follow it */
function CompsVisual() {
  const ref = useRef(null)
  const t = useTicks(COMPS_PICK.length * 5, 600, ref)
  const sel = COMPS_PICK[Math.floor(t / 5)]
  const c = COMPS[sel]
  return (
    <div className="sol-stage sol-stage--focus" ref={ref} aria-hidden="true">
      <div className="sol-panel sol-sheet sol-main">
        <div className="sol-sheet-title">Peer comps · NTM<em className="sol-sheet-tag">Calendarised to December</em></div>
        <table className="sol-comps">
          <thead><tr><th>Company</th><th>EV/EBITDA</th><th>P/E</th><th>EV/Sales</th></tr></thead>
          <tbody>
            {COMPS.map((p, i) => (
              <tr key={p.name} className={p.self ? 'is-self' : i === sel ? 'is-sel' : ''}>
                <td>{p.name}</td>
                <td className={i === sel ? 'sol-cell-sel' : ''}><span>{p.ev}</span></td>
                <td>{p.pe}</td><td>{p.evs}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Comps</span><span>Inputs</span><em>Every input traced</em></div>
      </div>
      <div className="sol-panel sol-aside sol-inputs" key={sel}>
        <div className="sol-aside-head"><span>{c.name}</span><b>{c.ev}</b></div>
        <ul>
          <li><span>EV</span><b>{c.EV}</b><Src>10-Q, p. 3</Src></li>
          <li><span>NTM EBITDA</span><b>{c.ebitda}</b><Src>Consensus</Src></li>
          <li className="sol-inputs-note"><span>{c.fye}</span><Src>Calendarised</Src></li>
        </ul>
      </div>
    </div>
  )
}

/* the thesis, its evidence, and the strongest case against it given the room */
function ThesisVisual() {
  return (
    <div className="sol-stage sol-stage--focus" aria-hidden="true">
      <div className="sol-panel sol-main sol-thesis">
        <div className="sol-sheet-title">Your thesis<em className="sol-sheet-tag">3 points tested</em></div>
        <p className="sol-thesis-stmt">Private label lifts margins</p>
        <ul className="sol-evidence">
          <li><span className="sol-tag sol-tag--supported">Supported</span><span>Private label mix up 4pts in two years</span><Src>FY25 10-K</Src></li>
          <li><span className="sol-tag sol-tag--supported">Supported</span><span>Gross margin up 120bp year on year</span><Src>Q3 release</Src></li>
          <li className="sol-evidence--counter">
            <span className="sol-tag sol-tag--risk">Strongest counter</span>
            <span>Rising promotions offset the mix gain</span>
            <Src>Q3 call, p. 7</Src>
          </li>
        </ul>
      </div>
      <div className="sol-panel sol-aside sol-excerpt sol-excerpt--quote">
        <div className="sol-aside-head"><Src>Q3 FY26 call</Src><span>p. 7</span></div>
        <ul>
          <li>Private label reached 31% of sales this quarter</li>
          <li className="is-lit">"We expect promotional activity to remain elevated through the holiday period"</li>
        </ul>
      </div>
    </div>
  )
}

const AUDIT_ROWS = [
  [12, '4,355', '4,610', '4,872'],
  [13, '655', '702', '748'],
  [14, '(195)', '(204)', '#REF!'],
  [15, '318', '341', '362'],
  [16, '7.3%', '7.4%', '7.4%'],
]
const FINDINGS = [
  { cell: 'D13', fx: '702', text: 'Hardcoded number inside a formula row' },
  { cell: 'E14', fx: '=D14*(1+#REF!)', text: 'Broken reference' },
  { cell: 'C16', fx: '=C15/C12', text: 'Formula differs from the rest of the row' },
]

/* the selected finding walks the list; its cell lights and the formula bar
   shows what is actually in it */
function AuditVisual() {
  const ref = useRef(null)
  const t = useTicks(FINDINGS.length * 5, 600, ref)
  const sel = Math.floor(t / 5)
  const f = FINDINGS[sel]
  const cols = ['C', 'D', 'E']
  return (
    <div className="sol-stage sol-stage--focus" ref={ref} aria-hidden="true">
      <div className="sol-panel sol-sheet sol-main">
        <div className="sol-sheet-title">inherited_model.xlsx · audit<em className="sol-sheet-tag sol-sheet-tag--warn">3 open</em></div>
        <div className="sol-sheet-fx"><span>{f.cell}</span><span>fx</span><span>{f.fx}</span></div>
        <table className="sol-grid">
          <thead><tr><th /><th>C</th><th>D</th><th>E</th></tr></thead>
          <tbody>
            {AUDIT_ROWS.map((r) => (
              <tr key={r[0]}>
                <td className="sol-grid-n">{r[0]}</td>
                {r.slice(1).map((v, i) => {
                  const id = `${cols[i]}${r[0]}`
                  const bad = FINDINGS.some((x) => x.cell === id)
                  return <td key={id} className={`${bad ? 'sol-grid-bad' : ''}${f.cell === id ? ' is-sel' : ''}`}><span>{v}</span></td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sol-sheet-tabs"><span className="is-on">Model</span><span>Audit</span><em>FY24 historicals reconciled to the 10-K</em></div>
      </div>
      <div className="sol-panel sol-aside sol-findings">
        <div className="sol-aside-head"><span>Audit findings</span><span>3</span></div>
        <ul>
          {FINDINGS.map((x, i) => (
            <li key={x.cell} className={i === sel ? 'is-sel' : ''}><b>{x.cell}</b><span>{x.text}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* small drawn fragments for a few of the how-it-works cells, one treatment:
   a hairline strip in the page's grey with a single product detail in it */
const VISUALS = {
  lbo: LboVisual, underwriting: UnderwritingVisual, valuation: ValuationVisual, deck: DeckVisual,
  earnings: EarningsVisual, overview: OverviewVisual, modelbuild: ModelBuildVisual, comps: CompsVisual, thesis: ThesisVisual, audit: AuditVisual,
}

/* the home page's section titles carry one accent word, the last one */
function highlight(title) {
  const at = title.lastIndexOf(' ')
  if (at < 0) return title
  return <>{title.slice(0, at)} <span className="ttl-hl">{title.slice(at + 1)}</span></>
}

/* the head band of a framed section, as the home page's Excel section wears it:
   no kicker label, the title alone on the frame's inset */
function FrameHead({ title }) {
  return (
    <div className="x4e-head x4e-reveal">
      <div className="x4e-head-copy"><h2>{highlight(title)}</h2></div>
    </div>
  )
}

/* ── How it works: the stage visuals drawn here ─────────────────────────────
 * One card, one list: an eyebrow and three rows, the first of them live. The
 * rows are the fund's own things (its templates, its folders, the surfaces the
 * agent runs in, the claims it has cited), so each pillar's picture is the
 * pillar's own noun. Sized like the workflow checklist next door (.xv-marquee)
 * so the stage reads at one scale from claim to claim.
 */
function HxList({ eyebrow, rows }) {
  return (
    <div className="sol-hx">
      <p className="sol-hx-eyebrow">{eyebrow}</p>
      <ul className="sol-hx-list">
        {rows.map(([name, tag, state], i) => (
          <li key={name} className={i === 0 ? 'is-on' : ''} style={{ '--i': i }}>
            <i aria-hidden="true" />
            <span className="sol-hx-name">{name}</span>
            <span className="sol-hx-tpl">{tag}</span>
            {state && <em className="sol-hx-state">{state}</em>}
          </li>
        ))}
      </ul>
    </div>
  )
}
const HowSurfacesVisual = () => (
  <HxList eyebrow="Where it runs" rows={[
    ['Excel add-in', 'Fund_model_v12.xlsx', 'Updating Q3 actuals in your sheet'],
    ['Web app', 'Northwind thesis', ''],
    ['Same agent, same citations', 'Both', ''],
  ]} />
)
const HowCitedVisual = () => (
  <HxList eyebrow="Every number, one source" rows={[
    ['Revenue 1,284.6', 'Form 10-Q, p. 4', 'Condensed Statements of Operations, line 3'],
    ['Gross margin 39.9%', 'Q3 release', ''],
    ['Promo intensity rising', 'Q3 call, 14:32', ''],
  ]} />
)
const HowFormatVisual = () => (
  <HxList eyebrow="Your templates" rows={[
    ['Fund model', 'Fund_model_v12.xlsx', 'Applied to the Northwind build'],
    ['Comps sheet', 'Comps_template.xlsx', ''],
    ['Investment memo', 'Memo_format.docx', ''],
  ]} />
)
const HowSkillsVisual = () => (
  <HxList eyebrow="Saved skills" rows={[
    ['Earnings update', 'Fund model v12', 'Running on 14 names'],
    ['Comps refresh', 'Comps template', ''],
    ['Model audit', 'Audit memo', ''],
  ]} />
)
const HowDataroomVisual = () => (
  <HxList eyebrow="Dataroom" rows={[
    ['Broker notes', '14 files', 'Attached to this session'],
    ['Expert call transcripts', '6 files', ''],
    ['Internal research', '22 files', ''],
  ]} />
)

/* the stage visuals the How it works pillars call up: four are the home page's
   own (the workflow checklist, the source field, the citation trace, the
   certification seals), five are drawn here */
const HOW_VISUALS = {
  workflows: VisualWorkflows, surfaces: HowSurfacesVisual, cited: HowCitedVisual, format: HowFormatVisual,
  skills: HowSkillsVisual, dataroom: HowDataroomVisual, sources: VisualIntegrated, trace: VisualAudit, enterprise: VisualEnterprise,
}

/* the home page's Excel section, claim for claim: a rail of the steps on the
   left and one visual on stage on the right, scrubbed by scroll and advanced
   by a clock. Narrow screens mount each claim's visual under its own row. */
function HowItWorks({ how, id }) {
  const frameRef = useReveal({ threshold: 0.08 })
  const paneRef = useRef(null)
  const stacked = useMediaQuery('(max-width: 900px)')
  const dwell = useMemo(() => how.steps.map((st) => st.ms), [how])
  const { step, goTo, hold, release } = useAutoStep(dwell, paneRef, { scrub: !stacked })
  return (
    <section className="x4e-sec sol-how" id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>
          <FrameHead title={how.title} />
          <div className="x4e-pane" ref={paneRef} onMouseEnter={hold} onMouseLeave={release} onFocusCapture={hold} onBlurCapture={release}>
            <ol className="x4e-rail">
              {how.steps.map((st, i) => {
                const Visual = HOW_VISUALS[st.visual]
                return (
                  <li key={st.key}>
                    <button
                      type="button"
                      className={`x4e-item${!stacked && i === step ? ' is-active' : ''}`}
                      aria-current={!stacked && i === step}
                      onClick={() => goTo(i)}
                    >
                      <span className="x4e-item-body">
                        <span className="x4e-item-title">{st.title}</span>
                        <span className="x4e-item-p">{st.body}</span>
                      </span>
                    </button>
                    {stacked && (
                      <div className="x4e-stage x4e-stage--inline">
                        <div className="x4e-visual is-active"><Visual /></div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
            {!stacked && (
              <div className="x4e-stage">
                {how.steps.map((st, i) => {
                  const Visual = HOW_VISUALS[st.visual]
                  return (
                    <div key={st.key} className={`x4e-visual${i === step ? ' is-active' : ''}`} aria-hidden={i !== step}>
                      <Visual />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* FAQPage structured data beside the home page's FAQ section, so the
   questions are quotable by search and agents */
function faqSchema(items) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  })
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
  const worksRef = useReveal({ threshold: 0.05 })

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
      <div className="page-rails" aria-hidden="true">
        <span className="rail rail-left" />
        <span className="rail rail-right" />
      </div>
      <Navbar />
      <main className="sol-page">
        <header className="sol-hero wrap">
          <div className="sol-hero-copy">
            <p className="sol-eyebrow">{sol.name}</p>
            <h1 className="sol-hero-title">{sol.title}</h1>
            <p className="sol-hero-lede">{sol.lede}</p>
            <div className="sol-hero-ctas">
              <a className="hero-s2-cta" href={BOOK_URL} target="_blank" rel="noopener noreferrer">Talk to Us</a>
              {/* the home hero's second button, word for word: the self-serve
                  path names the price, and the arrow only shows on hover */}
              <a className="hero-s2-cta hero-s2-cta--ghost" href={signedIn ? APP_HREF : SIGNIN_HREF} target="_blank" rel="noopener noreferrer">
                {signedIn ? 'Go to app' : 'Try for free'}
                <svg className="hero-s2-cta-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            {/* the strategies the page serves, as a ruled line under the
                buttons: a mono label and the names set off by hairlines, the
                way the visuals' sheet tabs are, not a row of pills */}
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
        <SectionRule />

        {/* the use cases in one hairline frame on the page's grey ground, head
            band on top, the way the home page frames its Security section */}
        <section className="wrap sol-works-wrap" id="use-cases">
          <div className="x4e-frame sol-works" ref={worksRef}>
            {sol.useCasesHead && <FrameHead title={sol.useCasesHead.title} />}
            {sol.workflows.map((w, i) => <Workflow key={w.key} w={w} flip={i % 2 === 1} />)}
          </div>
        </section>

        {sol.how && <SectionRule />}
        {sol.how && <HowItWorks how={sol.how} id="how-it-works" />}

        {/* the page's quote, in the home page's Customers treatment */}
        {sol.quote && <Testimonial quotes={[{ quote: sol.quote.text, name: sol.quote.who }]} />}

        {sol.faqs && <SectionRule />}
        {sol.faqs && <Faq id="faq" items={sol.faqs} title={highlight(sol.faqHead.title)} />}
        {sol.faqs && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(sol.faqs) }} />}

      </main>
      <SectionRule />
      <Footer />
    </div>
  )
}
