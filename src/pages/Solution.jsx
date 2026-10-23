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
import HowStages, { EvidencePanel } from '../components/HowStages'

/* ── How it works, which layout mounts ─────────────────────────────────────
 * `tabs` ships: the three stages as tabs, each opening its pillars and its
 * scene (src/components/HowStages.jsx). The others stay for comparison with
 * ?how= on the URL: /solutions/hedge-funds?how=rail (the nine-pillar rail
 * this replaced), ?how=columns, ?how=workspace, ?how=evidence. */
const HOW_LAYOUT_DEFAULT = 'tabs'
const HOW_LAYOUTS = ['rail', 'tabs', 'columns', 'workspace', 'evidence']
function howLayout() {
  if (typeof window === 'undefined') return HOW_LAYOUT_DEFAULT
  const q = new URLSearchParams(window.location.search).get('how')
  return HOW_LAYOUTS.includes(q) ? q : HOW_LAYOUT_DEFAULT
}

/* ── drawn product panels ──────────────────────────────────────────────────
 * Every visual is drawn, not a screenshot, so the numbers in it are
 * illustrative and sized in em off the stage, which is what lets the whole
 * picture scale down on a phone instead of re-flowing.
 */

function Tick() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/* where a figure or claim came from */
function Src({ children }) {
  return <span className="sol-src">{children}</span>
}

/* ── hedge fund visuals ────────────────────────────────────────────────────
 * One dominant working screen and one smaller supporting card that overlaps
 * its corner: the source it came from, the finding it points at, or the
 * result it produced. Three of them move, on the home page's source-tracing
 * pattern: a tick clock steps through the rows, and the completed state is
 * what the loop rests on, so a still frame still reads.
 */

/* a tick clock that starts once the stage is in view; reduced motion holds
   the last tick (the finished state) */
function useTicks(total, ms, ref, paused = false) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el || paused) return
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
  }, [total, ms, ref, paused])
  return t
}

/* the model's own rows: four reported lines the release fills, and two margin
   rows that are the fund's formulas, which recalculate when their inputs land.
   `line` is the sentence in the release each reported figure is taken from */
const EARN_ROWS = [
  { label: 'Revenue', prior: '1,184.2', now: '1,284.6' },
  { label: 'Gross profit', prior: '470.1', now: '512.5' },
  { label: 'Gross margin', fx: true, prior: '39.7%', now: '39.9%', after: 1 },
  { label: 'Adj. EBITDA', prior: '196.4', now: '208.3' },
  { label: 'EBITDA margin', fx: true, prior: '16.6%', now: '16.2%', after: 2 },
  { label: 'Diluted EPS', prior: '0.84', now: '0.91' },
]
const EARN_INPUTS = EARN_ROWS.filter((r) => !r.fx)

/* one motion: the reported column fills cell by cell in the fund's own
   layout, their margin rows recalculate, and the pill over the sheet turns
   its spinner into a check and reads Model updated. Two ticks a row (the row
   lights, the cell fills), then a hold on the finished update */
function EarningsVisual() {
  const ref = useRef(null)
  const HOLD = 8
  const t = useTicks(EARN_INPUTS.length * 2 + HOLD, 620, ref)
  const cur = Math.floor(t / 2)
  const filled = (k) => t >= k * 2 + 1
  const done = filled(EARN_INPUTS.length - 1)
  let k = -1
  return (
    <div className="sol-stage sol-stage--focus" ref={ref} aria-hidden="true">
      <div className="sol-panel sol-sheet sol-sheet--earn sol-main">
        <div className="sol-sheet-title">Northwind Retail · model<em className="sol-sheet-tag">Your layout</em></div>
        <table className="sol-upd">
          <thead><tr><th>USD m</th><th>Q3 FY25A</th><th className="is-col">Q3 FY26A</th></tr></thead>
          <tbody>
            {EARN_ROWS.map((r) => {
              if (r.fx) {
                return (
                  <tr key={r.label} className="is-derived">
                    <td>{r.label}</td>
                    <td>{r.prior}</td>
                    <td className={`sol-upd-cell${filled(r.after) ? ' is-filled' : ''}`}><span>{r.now}</span></td>
                  </tr>
                )
              }
              k += 1
              const i = k
              return (
                <tr key={r.label} className={cur === i && !filled(i) ? 'is-lit' : ''}>
                  <td>{r.label}</td>
                  <td>{r.prior}</td>
                  <td className={`sol-upd-cell${filled(i) ? ' is-filled' : ''}`}><span>{r.now}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="sol-sheet-tabs">
          <span className="is-on">Model</span>
          <em><Src>Q3 FY26 release · p. 4</Src></em>
        </div>
      </div>
      <div className={`sol-status${done ? ' is-done' : ''}`}>
        <span className="sol-status-ico">
          <span className="sol-status-spin" />
          <span className="sol-status-check">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2 5 8.6l4.5-5.2" /></svg>
          </span>
        </span>
        <span className="sol-status-lbls"><span>Updating from the release</span><span>Model updated</span></span>
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

/* the model's historical columns, spread from the three 10-Ks. The forecast
   columns stay empty: the claim is that the analyst starts there */
const BUILD_YEARS = ['FY23A', 'FY24A', 'FY25A']
const BUILD_ROWS = [
  ['Revenue', '4,355', '4,610', '4,872'],
  ['Gross profit', '1,742', '1,857', '1,973'],
  ['EBITDA', '655', '702', '748'],
  ['Capex', '(195)', '(204)', '(215)'],
  ['Free cash flow', '318', '341', '362'],
]
const BUILD_PAGES = ['FY23 10-K · p. 41', 'FY24 10-K · p. 43', 'FY25 10-K · p. 44']

/* the model window beside the FinSynth pane, the way the add-in sits in Excel.
   Year by year the historical column fills in the fund's template from that
   year's 10-K, the pane counts the years and the recast, then the DCF tab
/* the DCF tab's output, what the build is for: the bridge from enterprise
   value to a value per share, and that value against the price */
const DCF_OUT = [
  ['Enterprise value', '9,420'],
  ['Net debt', '(1,310)'],
  ['Equity value', '8,110'],
  ['Shares (m)', '212'],
  ['Value per share', '$38.25'],
]
const DCF_PRICE = '$31.40'
const DCF_UPSIDE = '+22%'
   lights and the pill over the sheet turns its spinner into a check. Two
   ticks a year (the column lights, then fills), one for the recast, one for
   the DCF, then a hold on the finished build */
function ModelBuildVisual() {
  const ref = useRef(null)
  const HOLD = 8
  const t = useTicks(BUILD_YEARS.length * 2 + 2 + HOLD, 620, ref)
  const cur = Math.floor(t / 2)
  const filled = (c) => t >= c * 2 + 1
  const years = BUILD_YEARS.filter((_, c) => filled(c)).length
  const recast = t >= BUILD_YEARS.length * 2 + 1
  const done = t >= BUILD_YEARS.length * 2 + 2
  const srcCol = Math.min(cur, BUILD_YEARS.length - 1)
  return (
    <div className="sol-stage sol-stage--build" ref={ref} aria-hidden="true">
      <div className="sol-win-wrap">
  // a tick after the DCF tab lights, the window opens it on the output
  const dcf = t >= BUILD_YEARS.length * 2 + 3
        <div className="sol-panel sol-sheet sol-sheet--earn sol-win">
          <div className="sol-sheet-title">Northwind Retail · {dcf ? 'DCF' : 'model'}</div>
          {dcf ? (
            <table className="sol-upd sol-dcf sol-dcf-out">
              <thead><tr><th>USD m</th><th className="is-col">Base</th></tr></thead>
              <tbody>
                {DCF_OUT.map((r, i) => (
                  <tr key={r[0]} className={i === DCF_OUT.length - 1 ? 'is-total' : ''}>
                    <td>{r[0]}</td><td className="sol-upd-cell is-filled"><span>{r[1]}</span></td>
                  </tr>
                ))}
                <tr className="is-up"><td>Upside to {DCF_PRICE}</td><td><span className="sol-dcf-up">{DCF_UPSIDE}</span></td></tr>
              </tbody>
            </table>
          ) : (
            <table className="sol-upd sol-dcf">
              <thead><tr><th>USD m</th>{BUILD_YEARS.map((y) => <th key={y}>{y}</th>)}<th className="is-col">FY26E</th><th className="is-col">FY27E</th></tr></thead>
              <tbody>
                {BUILD_ROWS.map((r, i) => (
                  <tr key={r[0]} className={i === BUILD_ROWS.length - 1 ? 'is-total' : ''}>
                    <td>{r[0]}</td>
                    {r.slice(1).map((v, c) => (<td key={c} className={`sol-upd-cell${filled(c) ? ' is-filled' : cur === c ? ' is-lit' : ''}`}><span>{v}</span></td>))}
                    <td className="is-fc" /><td className="is-fc" />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="sol-sheet-tabs">
            <span className={dcf ? '' : 'is-on'}>Model</span><span className={dcf ? 'is-on' : done ? 'is-new' : ''}>DCF</span><span>Inputs</span>
            <em>{dcf ? 'WACC 8.6% · g 2.5%' : <Src>{BUILD_PAGES[srcCol]}</Src>}</em>
          </div>
        </div>
        <div className={`sol-status${done ? ' is-done' : ''}`}>
          <span className="sol-status-ico">
            <span className="sol-status-spin" />
            <span className="sol-status-check">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2 5 8.6l4.5-5.2" /></svg>
            </span>
          </span>
          <span className="sol-status-lbls"><span>Spreading the historicals</span><span>Model and DCF built</span></span>
        </div>
      </div>
      <div className="sol-panel sol-pane">
        <div className="sol-sheet-tabs sol-pane-tabs">
          <svg className="sol-pane-mark" viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" /><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".35" /><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".35" /><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" /></svg>
          <span className="is-on">Chat</span><span>Review</span><span>Trace</span>
        </div>
        <div className="sol-pane-ask">
          <span className="sol-pane-dot" />
          <p>Build the model and DCF in our template from the last three 10-Ks</p>
        </div>
        <div className="sol-pane-body">
          {/* the agent's running line, which its result replaces once the build is done */}
          <p className="sol-pane-say" key={done ? 'done' : 'run'}>{done ? 'History ties out across the three years. The forecast columns are yours' : 'Spreading the historicals into your template, each figure linked to its filing page'}</p>
          <ul className="sol-pane-steps">
            <li className={years ? 'is-on' : ''}><span>Historicals spread</span><em>{years} / {BUILD_YEARS.length} yrs</em></li>
            <li className={recast ? 'is-on' : ''}><span>Segment recast</span><em>{recast ? 'Applied' : 'Pending'}</em></li>
            <li className={done ? 'is-on' : ''}><span>DCF</span><em>{done ? 'Built' : 'Pending'}</em></li>
          </ul>
        </div>
        <div className="sol-pane-in"><span>Ask FinSynth</span><b>Send ↵</b></div>
      </div>
    </div>
  )
}

/* the fund's own comps sheet: the subject on top, four peers the agent fills,
   and a median row that is the fund's formula, recalculating once they land */
const COMPS = [
  { name: 'Northwind Retail', ev: '8.9x', pe: '15.2x', evs: '1.0x', self: true },
  { name: 'Contoso Mart', ev: '9.8x', pe: '16.8x', evs: '1.1x' },
  { name: 'Fabrikam Stores', ev: '7.6x', pe: '13.9x', evs: '0.8x' },
  { name: 'Tailspin Retail', ev: '10.4x', pe: '18.1x', evs: '1.3x' },
  { name: 'Litware Grocers', ev: '8.2x', pe: '14.6x', evs: '0.6x' },
  { name: 'Peer median', ev: '9.0x', pe: '15.7x', evs: '0.95x', fx: true },
]
const COMPS_PEERS = COMPS.filter((p) => !p.self && !p.fx)

/* one motion, the earnings row's: the peers' multiples fill row by row in the
   fund's own template, calendarised as they land, the median recalculates,
   and the pill over the sheet turns its spinner into a check */
function CompsVisual() {
  const ref = useRef(null)
  const HOLD = 8
  const t = useTicks(COMPS_PEERS.length * 2 + HOLD, 620, ref)
  const cur = Math.floor(t / 2)
  const filled = (k) => t >= k * 2 + 1
  const done = filled(COMPS_PEERS.length - 1)
  let k = -1
  return (
    <div className="sol-stage sol-stage--focus" ref={ref} aria-hidden="true">
      <div className="sol-panel sol-sheet sol-sheet--earn sol-sheet--comps sol-main">
        <div className="sol-sheet-title">Northwind Retail · comps</div>
        <table className="sol-upd">
          <thead><tr><th>NTM</th><th className="is-col">EV/EBITDA</th><th className="is-col">P/E</th><th className="is-col">EV/Sales</th></tr></thead>
          <tbody>
            {COMPS.map((r) => {
              if (r.self) {
                return (
                  <tr key={r.name} className="is-self"><td>{r.name}</td><td>{r.ev}</td><td>{r.pe}</td><td>{r.evs}</td></tr>
                )
              }
              const on = r.fx ? done : filled((k += 1))
              const i = k
              const cell = `sol-upd-cell${on ? ' is-filled' : ''}`
              return (
                <tr key={r.name} className={r.fx ? 'is-derived' : cur === i && !on ? 'is-lit' : ''}>
                  <td>{r.name}</td>
                  <td className={cell}><span>{r.ev}</span></td>
                  <td className={cell}><span>{r.pe}</span></td>
                  <td className={cell}><span>{r.evs}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="sol-sheet-tabs">
          <span className="is-on">Comps</span>
          <em><Src>Calendarised to December</Src></em>
        </div>
      </div>
      <div className={`sol-status${done ? ' is-done' : ''}`}>
        <span className="sol-status-ico">
          <span className="sol-status-spin" />
          <span className="sol-status-check">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2 5 8.6l4.5-5.2" /></svg>
          </span>
        </span>
        <span className="sol-status-lbls"><span>Building comps in your template</span><span>Comps built</span></span>
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
        {/* no Excel grid behind this hero: the solutions heroes stay plain */}
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
            {/* the strategies the page serves, as pills under the buttons */}
            {sol.strategies && (
              <div className="sol-chips">
                <span className="sol-chips-lead">{sol.strategiesLead}</span>
                <ul>{sol.strategies.map((name) => <li key={name}>{name}</li>)}</ul>
              </div>
            )}
          </div>
          {/* the product instead of a stock photo: the approved Review the
              evidence scene (the model window, the release page it cites and
              the wire between them) on the page's grey, no stage ground */}
          <div className="sol-hero-visual" aria-hidden="true">
            <EvidencePanel ex={sol.how.example} />
          </div>
        </header>
        <SectionRule />

        {/* the use cases in one hairline frame on the page's grey ground, head
            band on top, then the rows split down the middle like the home
            page's Excel pane: copy on one side, the stage filling the other */}
        <section className="wrap sol-works-wrap" id="use-cases">
          <div className="x4e-frame sol-works" ref={worksRef}>
            {sol.useCasesHead && <FrameHead title={sol.useCasesHead.title} />}
            {sol.workflows.map((w, i) => <Workflow key={w.key} w={w} flip={i % 2 === 1} />)}
          </div>
        </section>

        {sol.how && <SectionRule />}
        {sol.how && (howLayout() === 'rail' || !sol.how.example
          ? <HowItWorks how={sol.how} id="how-it-works" />
          : <HowStages how={{ ...sol.how, titleNode: highlight(sol.how.title) }} layout={howLayout()} id="how-it-works" />)}

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
