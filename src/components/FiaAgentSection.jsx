import useReveal from '../hooks/useReveal'

/**
 * "Fia" — split out of ExcelSection into its own file so the Excel frame
 * stays untouched, but wearing the same framed layout: hairline frame with
 * a head band, then a pane splitting a rail of claims from the stage. Unlike
 * the Excel rail, the rows here are statements, not navigation — one window
 * sits on the stage the whole time, so nothing is interactive and no row
 * carries the active marker.
 *
 * The window is a plain frame around a real screenshot of the Fia workspace —
 * the browser dressing (chrome strip, toolbar) was cut on request. To refresh
 * the product view, drop a new capture at /assets/img/fia-workspace.webp —
 * nothing here needs to change.
 */

// One claim per row, each a single clause: the rows sit beside the Excel
// section's rail on the same page, so they read in the same register as its
// pillars rather than as sentences.
const CLAIMS = [
  {
    title: 'Agentic research',
    body: 'Describe any complex research and it runs the full analysis, cited end to end',
  },
  {
    title: 'Background execution',
    body: 'Confirm a plan and let it run, with no file to keep open',
  },
  {
    title: 'Ready-made deliverables',
    body: 'IC memos, pitch decks, dashboards and PDFs, built from the same analysis',
  },
]

function ChatWindow() {
  return (
    <div className="fiag-window">
      <div className="fiag-page">
        {/* the page itself is the product shot */}
        <img
          className="fiag-shot"
          src="/assets/img/fia-workspace.webp"
          alt="The FinSynth workspace: a thread history rail beside a new thread, ready for a question"
          loading="lazy"
          width="2000"
          height="880"
        />
      </div>
    </div>
  )
}

export default function FiaAgentSection({ id = 'fia-agent' }) {
  const frameRef = useReveal({ threshold: 0.08 })

  return (
    <section className="x4e-sec" id={id}>
      <div className="wrap">
        <div className="x4e-frame" ref={frameRef}>

          <div className="x4e-head x4e-reveal">
            <div className="x4e-head-copy">
              <h2>
                Fia: The FinSynth <span className="ttl-hl">workspace</span>
              </h2>
              <p className="fiag-sub">
                Same FinSynth engine, in a full research workspace
              </p>
            </div>
          </div>

          <div className="x4e-pane">
            {/* claims, not navigation — the stage never changes, so these rows
                are static and none of them wears the active marker */}
            <ol className="x4e-rail">
              {CLAIMS.map((c) => (
                <li key={c.title}>
                  <div className="x4e-item x4e-item--static">
                    <span className="x4e-item-body">
                      <span className="x4e-item-title">{c.title}</span>
                      <span className="x4e-item-p">{c.body}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="x4e-stage fiag-stage">
              <div className="x4e-visual is-active">
                <ChatWindow />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
