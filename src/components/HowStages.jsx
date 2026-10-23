import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'
import useMediaQuery from '../hooks/useMediaQuery'

/* ── How it works, as three stages of one research workflow ─────────────────
 * Shared across the solution pages: the heading, the three stage labels and
 * their explanations are universal, and only the example inside the scene
 * changes by audience (how.example in src/data/solutions.js). The same
 * example runs through all three stages: the documents brought in stage one
 * are the inputs of stage two, and the cell written in stage two is the one
 * verified in stage three.
 *
 * Layouts, picked by ?how= on the URL (see Solution.jsx):
 *   tabs       the three stages as tabs; the open one shows the pillars that
 *              belong to it (from how.steps) beside its scene. Ships.
 *   columns    three connected columns, each stage with its own scene
 *   workspace  three short stage notes over one continuous scene
 *   evidence   two compact preparation cells over one large evidence stage
 * Narrow screens stack every layout the same way: each stage's copy, its
 * pillars when the layout shows them, then its own scene under it.
 */

export const HOW_STAGES = [
  { n: '01', title: 'Bring your research context', body: 'Attach the filing or release, your own template, and anything in the Dataroom or a connected source. The agent works from your material, in your format' },
  { n: '02', title: 'Run your workflow', body: 'One instruction, in Excel or on the web. Save the routine as a Skill and run it on every name in your book' },
  { n: '03', title: 'Review the evidence', body: 'Every number links to the line it came from. Select a range and step through each source in one pass' },
]

const ENTERPRISE = {
  label: 'Enterprise ready',
  text: 'Customer-hosted deployment and SOC 2 Type II certified, across every stage of the workflow',
  link: 'Security and deployment',
  href: '/#security',
}

/* ── small drawn parts ── */
function Ico({ kind }) {
  const d = {
    doc: <><path d="M4 2.5h5.5L13 6v7.5H4z" /><path d="M9.5 2.5V6H13" /><path d="M6 8.5h5M6 10.5h5" /></>,
    sheet: <><rect x="3" y="3" width="10" height="10" rx="1" /><path d="M3 6.5h10M3 9.5h10M7 3v10" /></>,
    plug: <><path d="M5.5 2.5v3M10.5 2.5v3" /><path d="M4 5.5h8v2.5a4 4 0 0 1-8 0z" /><path d="M8 12v2" /></>,
    folder: <><path d="M2.5 4.5h4l1.5 1.5h5.5v7h-11z" /></>,
  }[kind]
  return <svg className={`hw-ico hw-ico--${kind}`} viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">{d}</svg>
}
function Tick() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function Arrow() {
  return (
    <svg className="hw-arrow" viewBox="0 0 40 16" aria-hidden="true">
      <path d="M1 8h34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m30 3 6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* 01 · the sources attached to the session: a filing, the fund's own
   template, a connected source, a Dataroom folder */
export function SourcesPanel({ ex, n }) {
  return (
    <div className="hw-panel hw-sources">
      {n && <span className="hw-n">{n}</span>}
      <div className="hw-panel-head"><span>Attached to this session</span><em>{ex.sources.length} sources</em></div>
      <ul className="hw-src-list">
        {ex.sources.map((s, i) => (
          <li key={s.name} style={{ '--i': i }}>
            <Ico kind={s.icon} />
            <span className="hw-src-name">{s.name}</span>
            <span className="hw-src-kind">{s.kind}</span>
            <span className="hw-src-meta">{s.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 02 · the workspace: the surface tab, one instruction, the saved Skill it
   ran as, and the workbook the stage one documents were written into */
export function BenchPanel({ ex, n }) {
  return (
    <div className="hw-panel hw-bench">
      {n && <span className="hw-n">{n}</span>}
      <div className="hw-bench-bar">
        {ex.surfaces.map((s, i) => <span key={s} className={`hw-tab${i === 0 ? ' is-on' : ''}`}>{s}</span>)}
        <em>{ex.file}</em>
      </div>
      <div className="hw-ask">
        <span className="hw-ask-dot" aria-hidden="true" />
        <p>{ex.instruction}</p>
        <span className="hw-skill"><i aria-hidden="true" />Skill · {ex.skill}</span>
      </div>
      <table className="hw-sheet">
        <thead><tr>{ex.sheet.cols.map((c, i) => <th key={c} className={i === 2 ? 'is-col' : ''}>{c}</th>)}</tr></thead>
        <tbody>
          {ex.sheet.rows.map((r) => (
            <tr key={r[0]}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
              <td className="hw-cell is-filled">{r[2]}</td>
              <td>{r[3]}</td>
              <td className={r[4].startsWith('+') ? 'hw-ok' : 'hw-miss'}>{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="hw-bench-foot"><Tick />{ex.done}</div>
    </div>
  )
}

/* 03 · the evidence: the cell stage two wrote, wired to the line in the
   source it came from, and the control that steps through the rest */
export function EvidencePanel({ ex, n }) {
  const { cite, sheet } = ex
  const rows = sheet.rows.slice(0, 3)
  return (
    <div className="hw-panel hw-evid">
      {n && <span className="hw-n">{n}</span>}
      <div className="hw-evid-grid">
        <div className="hw-evid-sheet">
          <div className="hw-evid-fx"><span>{cite.cell}</span><span>fx</span><span>={sheet.rows[cite.row][2]}</span></div>
          <table className="hw-sheet hw-sheet--mini">
            <thead><tr><th>{sheet.cols[0]}</th><th className="is-col">{sheet.cols[2]}</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className={`hw-cell${i === cite.row ? ' is-sel' : ''}`}><span>{r[2]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hw-evid-src">
          <div className="hw-src-head"><span className="hw-chip">{cite.source}</span><span>{cite.where}</span></div>
          <p className="hw-passage">{cite.before}<mark>{cite.mark}</mark>{cite.after}</p>
        </div>
      </div>
      <div className="hw-review">
        <span>Review citations</span>
        <b>{cite.reviewed} / {cite.total}</b>
        <i aria-hidden="true">‹</i><i aria-hidden="true">›</i>
      </div>
    </div>
  )
}

const PANELS = [SourcesPanel, BenchPanel, EvidencePanel]

function Stage({ i, ex, size }) {
  const Panel = PANELS[i]
  return (
    <div className={`hw-stage hw-stage--${size}`} aria-hidden="true">
      <Panel ex={ex} />
    </div>
  )
}

function Copy({ st, as: Tag = 'h3', className = '' }) {
  // inside a button (the tabs) only phrasing content is allowed, so the
  // title and the body are spans there
  const P = Tag === 'span' ? 'span' : 'p'
  return (
    <div className={`hw-copy ${className}`}>
      <span className="hw-num">{st.n}</span>
      <Tag className="hw-title">{st.title}</Tag>
      <P className="hw-p">{st.body}</P>
    </div>
  )
}

/* ── the pillars, grouped under the stage each belongs to ──
 * The nine approved pillars (how.steps) read as the detail of the three
 * stages: what you can bring, what you can run, how you check it. Enterprise
 * ready is the strip at the frame's foot, not a pillar of any one stage. */
const STAGE_STEPS = [
  ['format', 'dataroom', 'mcp'],
  ['workflows', 'surfaces', 'skills'],
  ['cited', 'review'],
]
function stagePillars(steps, i) {
  return STAGE_STEPS[i].map((k) => steps.find((st) => st.key === k)).filter(Boolean)
}

function PillarIco({ kind }) {
  const d = {
    workflows: <><path d="M2 11.5 6.5 7l3 3L14 4.5" /><path d="M10.5 4.5H14V8" /></>,
    surfaces: <><rect x="2" y="3" width="12" height="8" rx="1" /><path d="M6 13.5h4M8 11v2.5" /></>,
    cited: <><path d="M6.5 9.5a3 3 0 0 0 4.2 0l1.8-1.8a3 3 0 0 0-4.2-4.2l-.8.8" /><path d="M9.5 6.5a3 3 0 0 0-4.2 0L3.5 8.3a3 3 0 0 0 4.2 4.2l.8-.8" /></>,
    format: <><rect x="2.5" y="2.5" width="11" height="11" rx="1" /><path d="M2.5 6h11M6.5 6v7.5" /></>,
    skills: <path d="M9 2 3.5 9h4L7 14l5.5-7h-4z" />,
    dataroom: <path d="M2.5 4.5h4l1.5 1.5h5.5v7h-11z" />,
    mcp: <><path d="M5.5 2.5v3M10.5 2.5v3" /><path d="M4 5.5h8v2.5a4 4 0 0 1-8 0z" /><path d="M8 12v2" /></>,
    review: <><circle cx="8" cy="8" r="5.5" /><path d="m5.5 8 1.8 1.8L10.8 6" /></>,
    enterprise: <><rect x="3.5" y="7" width="9" height="6.5" rx="1" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></>,
  }[kind]
  return <svg className="hw-pico" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">{d}</svg>
}

function Pillars({ items, className = '' }) {
  return (
    <ul className={`hw-pillars ${className}`}>
      {items.map((p, i) => (
        <li className="hw-pillar" key={p.key} style={{ '--i': i }}>
          <PillarIco kind={p.key} />
          <h4>{p.title}</h4>
          <p>{p.body}</p>
        </li>
      ))}
    </ul>
  )
}

/* the open tab: advances on its own while the frame is on screen, and stops
   for good once the reader picks one */
function useAutoTab(count, rootRef, dwell = 6500) {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [rootRef])
  useEffect(() => {
    if (held || !onScreen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % count), dwell)
    return () => clearInterval(t)
  }, [held, onScreen, count, dwell])
  const pick = (i) => { setHeld(true); setActive(i) }
  return [active, pick]
}

function Head({ how }) {
  return (
    <div className="x4e-head hw-head x4e-reveal">
      <div className="x4e-head-copy">
        <p className="sol-eyebrow">{how.eyebrow || 'How your team works with FinSynth'}</p>
        <h2>{how.titleNode}</h2>
      </div>
      {how.intro && <p className="hw-intro">{how.intro}</p>}
    </div>
  )
}

/* the strip at the frame's foot: a property of the whole workflow, not a
   fourth step */
function Enterprise() {
  return (
    <div className="hw-ent">
      <span className="hw-ent-label">
        <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M8 1.8 13 3.6v3.9c0 3.1-2.1 5.4-5 6.7-2.9-1.3-5-3.6-5-6.7V3.6z" /><path d="m5.8 8 1.6 1.6L10.4 6.4" strokeLinecap="round" /></svg>
        {ENTERPRISE.label}
      </span>
      <p>{ENTERPRISE.text}</p>
      <a href={ENTERPRISE.href}>{ENTERPRISE.link} <span aria-hidden="true">→</span></a>
    </div>
  )
}

/* ── the layouts ── */

/* tabs · the three stages in a row; the open one shows its pillars beside
   its scene */
function Tabs({ ex, steps }) {
  const ref = useRef(null)
  const [active, pick] = useAutoTab(HOW_STAGES.length, ref)
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const n = HOW_STAGES.length
    const next = (active + (e.key === 'ArrowRight' ? 1 : n - 1)) % n
    pick(next)
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus()
  }
  const st = HOW_STAGES[active]
  return (
    <div className="hw-tabs" ref={ref}>
      <div className="hw-tablist" role="tablist" aria-label="Stages of the workflow" onKeyDown={onKey}>
        {HOW_STAGES.map((s, i) => (
          <button
            type="button" role="tab" key={s.n} id={`hw-tab-${s.n}`}
            aria-selected={i === active} aria-controls="hw-tabpanel" tabIndex={i === active ? 0 : -1}
            className={`hw-stagetab${i === active ? ' is-active' : ''}`} onClick={() => pick(i)}
          >
            <Copy st={s} as="span" />
          </button>
        ))}
      </div>
      <div className="hw-tabbody" role="tabpanel" id="hw-tabpanel" aria-labelledby={`hw-tab-${st.n}`} key={st.n}>
        <Pillars items={stagePillars(steps, active)} />
        <Stage i={active} ex={ex} size="tab" />
      </div>
    </div>
  )
}

/* tabs, stacked for narrow screens: every stage open, copy then pillars then
   scene */
function Stacked({ ex, steps }) {
  return (
    <div className="hw-cols">
      {HOW_STAGES.map((st, i) => (
        <div className="hw-col" key={st.n}>
          <Copy st={st} />
          <Pillars items={stagePillars(steps, i)} className="hw-pillars--stack" />
          <Stage i={i} ex={ex} size="col" />
        </div>
      ))}
    </div>
  )
}

/* 1 · three connected columns */
function Columns({ ex }) {
  return (
    <div className="hw-cols">
      {HOW_STAGES.map((st, i) => (
        <div className="hw-col" key={st.n}>
          <Copy st={st} />
          <Stage i={i} ex={ex} size="col" />
        </div>
      ))}
    </div>
  )
}

/* 2 · one continuous workspace: the stage notes in a row, one scene under
   them with the three panels wired left to right */
function Workspace({ ex }) {
  return (
    <>
      <div className="hw-steps">
        {HOW_STAGES.map((st) => <Copy key={st.n} st={st} className="hw-step" />)}
      </div>
      <div className="hw-stage hw-stage--scene" aria-hidden="true">
        <SourcesPanel ex={ex} n="01" />
        <Arrow />
        <BenchPanel ex={ex} n="02" />
        <Arrow />
        <EvidencePanel ex={ex} n="03" />
      </div>
    </>
  )
}

/* 5 · preparation over evidence: two compact cells, then the result at
   full width */
function Evidence({ ex }) {
  return (
    <>
      <div className="hw-two">
        {HOW_STAGES.slice(0, 2).map((st, i) => (
          <div className="hw-cell-wrap" key={st.n}>
            <Copy st={st} />
            <Stage i={i} ex={ex} size="half" />
          </div>
        ))}
      </div>
      <div className="hw-big">
        <Copy st={HOW_STAGES[2]} className="hw-big-copy" />
        <Stage i={2} ex={ex} size="big" />
      </div>
    </>
  )
}

const LAYOUTS = { tabs: Tabs, columns: Columns, workspace: Workspace, evidence: Evidence }

export default function HowStages({ how, layout, id }) {
  const frameRef = useReveal({ threshold: 0.08 })
  const stacked = useMediaQuery('(max-width: 900px)')
  const Layout = stacked ? (layout === 'tabs' ? Stacked : Columns) : (LAYOUTS[layout] || Tabs)
  return (
    <section className={`x4e-sec sol-how hw hw--${layout}`} id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>
          <Head how={how} />
          <Layout ex={how.example} steps={how.steps || []} />
          <Enterprise />
        </div>
      </div>
    </section>
  )
}
