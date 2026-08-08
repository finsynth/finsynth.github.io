import useReveal from '../hooks/useReveal'

/**
 * The verifiable stats, as a metrics band hung off the bottom of the Excel
 * section: same .wrap, so the band's edges land exactly on the frame's, and it
 * abuts it with no border of its own on top — the frame's bottom hairline is
 * the only line between them. The tint is what separates the two; nothing else
 * has to. Home.jsx runs it with no <SectionRule /> either side.
 *
 * The figures are left-aligned on the frame's own text inset, so the first one
 * starts under the section heading above it, and there are no vertical rules
 * between them: four figures reading left to right off a shared baseline is
 * already a row, and dividers only made it look like a table.
 *
 * No heading: the claim and sub that used to sit over the row were dropped on
 * request, so the figures are the whole band and are sized to carry it.
 */
const NUMBERS = [
  { value: '80%', label: 'Less build time' },
  { value: '2x', label: 'More coverage' },
  { value: '90%', label: 'Less time auditing' },
  { value: '0', label: 'Unsourced numbers' },
]

export default function WhyAnalysts() {
  const revealRef = useReveal({ threshold: 0.08 })

  return (
    <section className="wac-sec" id="why-finsynth" ref={revealRef}>
      {/* .wrap, not a stage of its own: it's the same container the Excel
          section's frame uses, which is what makes the two line up */}
      <div className="wrap">
        {/* one row, four figures, no dividers — the size gap between the
            figure and its mono label does the persuading; no cards, no CTA */}
        <div className="wac-band">
          <dl className="wac-nums">
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
