/** Metrics band under the Excel section: shares .wrap so its edges meet the frame's.
 *  Column count follows NUMBERS via --n, so cutting a figure never leaves an empty cell. */
const NUMBERS = [
  { value: '80%', label: 'Time saved' },
  { value: '90%', label: 'Less time auditing' },
  { value: '2x', label: 'More coverage' },
]

export default function WhyAnalysts() {
  return (
    <section className="wac-sec" id="why-finsynth" data-reveal="0.08">
      {/* .wrap, not a stage of its own: it's the same container the Excel
          section's frame uses, which is what makes the two line up */}
      <div className="wrap">
        {/* one row of figures, no dividers — the size gap between the
            figure and its mono label does the persuading; no cards, no CTA */}
        <div className="wac-band">
          <dl className="wac-nums" style={{ '--n': NUMBERS.length }}>
            {NUMBERS.map((s, i) => (
              <div className="wac-num" key={s.label} style={{ '--d': `${0.1 + 0.07 * i}s` }}>
                <dt className="wac-num-value">{s.value}</dt>
                <dd className="wac-num-label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
