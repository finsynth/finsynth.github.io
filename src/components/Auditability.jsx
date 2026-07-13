const POINTS = [
  {
    title: 'Cell-level citations',
    desc: 'Every figure FinSynth writes links to the filing, page, and line behind it. When someone asks where a number came from, the answer is one click away.',
  },
  {
    title: 'Permission-gated writes',
    desc: 'The agent never changes your model on its own. It proposes; you approve. Every cell that lands is one you signed off on.',
  },
  {
    title: 'Accuracy you can check',
    desc: "You don't take accuracy on faith. Because every output is cited, you can verify any figure against its source in seconds.",
  },
]

export default function Auditability() {
  return (
    <section className="audit-sec" id="auditability">
      <div className="wrap">
        <div className="hiw-head">
          <p className="hiw-eyebrow">Why FinSynth</p>
        </div>
        <div className="audit-grid">
          <div>
            <h2 className="audit-title">Every number traces back to its source</h2>
            <p className="audit-sub">Auditability isn't a feature we bolted on. It's how the agent works.</p>
            <div className="points">
              {POINTS.map((p, i) => (
                <div className="point" key={p.title}>
                  <span className="n">{i + 1}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="audit-stat">
            <div className="audit-zero">0</div>
            <p className="audit-zero-cap">unattributed cells in any FinSynth output</p>
          </div>
        </div>
      </div>
    </section>
  )
}
