import useReveal from '../hooks/useReveal'

/* ── How it works on the solution pages ── the three stages of one research
 * workflow as columns, each holding the pillars (how.steps in
 * src/data/solutions.js) that belong to it as cards. */

export const HOW_STAGES = [
  { n: '01', title: 'Bring your research context', body: 'Attach the filing or release, your own template, and anything in the Dataroom or a connected source. The agent works from your material, in your format' },
  { n: '02', title: 'Run your workflow', body: 'One instruction, in Excel or on the web. Save the routine as a Skill and run it on every name in your book' },
  { n: '03', title: 'Review the evidence', body: 'Every number links to the line it came from. Select a range and step through each source in one pass' },
]

export function Cursor({ x, y }) {
  return (
    <svg className="hw-cursor" viewBox="0 0 16 16" aria-hidden="true" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <path d="M2.5 1.5v12.2l3.1-2.8 2.1 4.6 2.2-1-2.1-4.6h4.2z" fill="#fff" stroke="#1C1C1C" strokeWidth=".9" strokeLinejoin="round" />
    </svg>
  )
}

/* the pillars, grouped under the stage each belongs to: what you can bring,
   what you can run, how you check it */
const STAGE_STEPS = [
  ['format', 'dataroom', 'mcp'],
  ['workflows', 'surfaces', 'skills'],
  ['cited', 'review'],
]
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
  }[kind]
  return <svg className="hw-pico" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">{d}</svg>
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

/* every pillar as a card under its stage, the whole inventory on the page at
   once with nothing to open */
function Grid({ steps }) {
  return (
    <div className="hw-grid-cols">
      {HOW_STAGES.map((st, i) => (
        <div className="hw-grid-col" key={st.n}>
          <div className="hw-grid-head">
            <span className="hw-num">{st.n}</span>
            <h3>{st.title}</h3>
          </div>
          <ul className="hw-cards">
            {STAGE_STEPS[i].map((k) => steps.find((p) => p.key === k)).filter(Boolean).map((p) => (
              <li className="hw-card" key={p.key}>
                <PillarIco kind={p.key} />
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function HowStages({ how, id }) {
  const frameRef = useReveal({ threshold: 0.08 })
  return (
    <section className="x4e-sec sol-how hw hw--grid" id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>
          <Head how={how} />
          <Grid steps={how.steps || []} />
        </div>
      </div>
    </section>
  )
}
