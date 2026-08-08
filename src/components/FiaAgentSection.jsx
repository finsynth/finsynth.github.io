import useReveal from '../hooks/useReveal'

/**
 * "Fia" — split out of ExcelSection into its own file so the Excel frame
 * stays untouched, but wearing the same framed layout: hairline frame with
 * a head band, then a pane splitting a rail of claims from the stage. Unlike
 * the Excel rail, the rows here are statements, not navigation — one window
 * sits on the stage the whole time, so nothing is interactive and no row
 * carries the active marker.
 *
 * The window is browser chrome drawn around a real screenshot of the Fia
 * workspace: the chrome is ours (traffic lights, tabs, toolbar), the page
 * inside it is the shot. To refresh the product view, drop a new capture at
 * /assets/img/fia-workspace.png — nothing here needs to change.
 */

const CLAIMS = [
  {
    title: 'Beyond the spreadsheet',
    body: 'The full research workspace: read filings, build the model, write the memo, all in one thread',
  },
  {
    title: 'Every source in one place',
    body: 'Global filings, transcripts, your internal drives and your market data vendors, queried together',
  },
  {
    title: 'Picks up where you left off',
    body: 'Threads persist, so the work from this morning is context for the question you ask tonight',
  },
]

function ChatWindow() {
  return (
    <div className="fiag-window">
      {/* browser chrome — traffic lights, a pinned-tab group, a resting tab,
          the active tab naming the webapp, a plus, and window controls on the
          right, the page floats inset below */}
      <div className="fiag-chrome" aria-hidden="true">
        <span className="fiag-lights"><i /><i /><i /></span>
        <span className="fiag-pins">
          Work
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 8 9 6 9-6" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 20v-8" /><path d="M12 20V5" /><path d="M19 20v-5" /></svg>
        </span>
        <span className="fiag-tab fiag-tab--rest">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></svg>
          Docs
        </span>
        <span className="fiag-tab">
          <span className="fiag-favicon" />
          FinSynth
        </span>
        <span className="fiag-tab-add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
        </span>
        <span className="fiag-chrome-right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M15 5v14" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </div>

      <div className="fiag-page">
        <div className="fiag-toolbar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
          <svg className="fiag-tool-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11a8 8 0 1 0-.9 5.2" /><path d="M20 5v6h-6" /></svg>
          <span className="fiag-crumb"><strong>FinSynth</strong></span>
        </div>

        {/* the page itself is the product shot */}
        <img
          className="fiag-shot"
          src="/assets/img/fia-workspace.png"
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
                Fia: FinSynth <span className="ttl-hl">beyond Excel</span>
              </h2>
              <p className="fiag-sub">
                Same FinSynth engine, in a full research workspace, beyond the spreadsheet
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
