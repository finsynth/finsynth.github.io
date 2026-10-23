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
 * Three layouts to compare, picked by ?how= on the URL (see Solution.jsx):
 *   columns    three connected columns, each stage with its own scene
 *   workspace  three short stage notes over one continuous scene
 *   evidence   two compact preparation cells over one large evidence stage
 * Narrow screens stack every layout the same way: each stage's copy, then
 * its own scene under it.
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
  return (
    <div className={`hw-copy ${className}`}>
      <span className="hw-num">{st.n}</span>
      <Tag className="hw-title">{st.title}</Tag>
      <p className="hw-p">{st.body}</p>
    </div>
  )
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

/* ── the three layouts ── */

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

const LAYOUTS = { columns: Columns, workspace: Workspace, evidence: Evidence }

export default function HowStages({ how, layout, id }) {
  const frameRef = useReveal({ threshold: 0.08 })
  const stacked = useMediaQuery('(max-width: 900px)')
  const Layout = stacked ? Columns : (LAYOUTS[layout] || Columns)
  return (
    <section className={`x4e-sec sol-how hw hw--${layout}`} id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>
          <Head how={how} />
          <Layout ex={how.example} />
          <Enterprise />
        </div>
      </div>
    </section>
  )
}
