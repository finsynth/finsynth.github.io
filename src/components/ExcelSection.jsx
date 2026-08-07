import useReveal from '../hooks/useReveal'

/**
 * "FinSynth for Excel" — the add-in product as a plain split: one reserved
 * image frame on the left (empty until product shots exist, sized now so the
 * copy doesn't reflow when they land), and the four messaging pillars as a
 * hairline-ruled text list on the right.
 */
const PILLARS = [
  {
    title: 'Complex financial workflows, fully auditable',
    desc: 'Multi-step work — model builds, earnings refreshes, reconciliations — runs end to end inside your workbook, and every step lands in an audit trail you can replay.',
  },
  {
    title: 'Every number, traced to its exact source',
    desc: 'Public or internal — a 10-K page, a market data field, an email someone sent you — click any cell and see exactly where the figure came from.',
  },
  {
    title: 'Integrations that work out of the box',
    desc: 'Market data, internal emails, OneDrive, spreadsheets, PowerPoint — connected from day one, so the agent works with the sources you already use.',
  },
  {
    title: 'Custom integrations, enterprise ready',
    desc: 'Bring proprietary systems in through custom connectors, built and deployed with the controls an enterprise rollout demands.',
  },
]

export default function ExcelSection() {
  const revealRef = useReveal({ threshold: 0.08 })

  return (
    <section className="x4e-sec" id="excel" ref={revealRef}>
      <div className="x4e-stage">
        <p className="hiw-eyebrow">FinSynth for Excel</p>
        <h2 className="x4e-heading">
          FinSynth for <span className="ttl-hl">Excel</span>
        </h2>
        <p className="x4e-lede">
          The agent as an add-in — running complex, auditable workflows inside
          the workbook you already have open.
        </p>

        <div className="x4e-grid">
          {/* empty for now — reserved frame for the product image */}
          <div className="x4e-media" aria-hidden="true">
            <span className="x4e-media-label">Image coming soon</span>
          </div>

          <ul className="x4e-list">
            {PILLARS.map((p, i) => (
              <li className="x4e-item" key={p.title}>
                <span className="x4e-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="x4e-claim">{p.title}</h3>
                  <p className="x4e-detail">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
