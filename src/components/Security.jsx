function VizLocal() {
  return (
    <div className="st-viz">
      <svg viewBox="0 0 220 110" fill="none" className="st-svg">
        {/* laptop */}
        <rect x="18" y="18" width="92" height="60" rx="4" stroke="#8FA3E8" strokeWidth="1.4" />
        <path d="M10 84h108l-8-6H18l-8 6z" stroke="#8FA3E8" strokeWidth="1.4" />
        {/* workbook grid inside */}
        <rect x="30" y="28" width="68" height="40" rx="2" stroke="#4CAF7D" strokeWidth="1.2" />
        <path d="M30 40h68M52 28v40M75 28v40" stroke="#4CAF7D" strokeWidth="0.9" opacity=".7" />
        {/* dashed link to cloud, blocked */}
        <path d="M118 48h34" stroke="#8FA3E8" strokeWidth="1.2" strokeDasharray="4 5" opacity=".6" />
        <circle cx="137" cy="48" r="9" stroke="#E37E8C" strokeWidth="1.4" />
        <path d="M131 42l12 12" stroke="#E37E8C" strokeWidth="1.4" />
        {/* cloud */}
        <path d="M170 56a10 10 0 0 1 2-19.8A13 13 0 0 1 197 34a9.5 9.5 0 0 1 3 22h-30z" stroke="#8FA3E8" strokeWidth="1.4" opacity=".55" />
      </svg>
      <div className="st-viz-cap"><span className="st-dot" /> Workbook stays on your machine</div>
    </div>
  )
}

function VizBadges() {
  return (
    <div className="st-viz st-viz-badges">
      <svg viewBox="0 0 130 130" className="st-cert" role="img" aria-label="SOC 2 Type II certified">
        <defs>
          <path id="st-cert-top" d="M20,65 A45,45 0 0 1 110,65" />
          <path id="st-cert-bot" d="M24,65 A41,41 0 0 0 106,65" />
        </defs>
        {/* rosette edge */}
        <circle cx="65" cy="65" r="62" className="st-cert-edge" />
        <circle cx="65" cy="65" r="56" className="st-cert-ring" />
        <circle cx="65" cy="65" r="33" className="st-cert-ring" />
        <text className="st-cert-arc">
          <textPath href="#st-cert-top" startOffset="50%" textAnchor="middle">SERVICE ORGANIZATION CONTROLS</textPath>
        </text>
        <text className="st-cert-arc">
          <textPath href="#st-cert-bot" startOffset="50%" textAnchor="middle">INDEPENDENTLY AUDITED</textPath>
        </text>
        <text x="65" y="63" textAnchor="middle" className="st-cert-main">SOC 2</text>
        <text x="65" y="78" textAnchor="middle" className="st-cert-sub">TYPE II</text>
        <path d="M52 88h26" className="st-cert-ring" />
      </svg>
      {/* Add when applicable:
      <div className="st-chips">
        <span className="st-chip">ISO 27001</span>
        <span className="st-chip">GDPR</span>
      </div> */}
    </div>
  )
}

function VizApproval() {
  return (
    <div className="st-viz">
      <div className="st-dialog">
        <div className="st-dialog-head">PROPOSED WRITE</div>
        <div className="st-dialog-row">
          <span className="st-ref">B14</span>
          <span className="st-arrow">←</span>
          <span className="st-val">$391.0B</span>
          <span className="st-cite">10-K</span>
        </div>
        <div className="st-dialog-btns">
          <span className="st-btn-approve">Approve</span>
          <span className="st-btn-reject">Reject</span>
        </div>
      </div>
      <div className="st-viz-cap"><span className="st-dot" /> Nothing written without you</div>
    </div>
  )
}

const CARDS = [
  {
    title: 'Local Excel execution',
    desc: "Excel operations run locally, on your machine. FinSynth's backend never reads, stores, or transmits your workbook. Your model stays yours.",
    viz: <VizLocal />,
  },
  {
    title: 'Certified & compliant',
    desc: 'SOC 2 Type II certified. Security controls audited independently, built for buy-side diligence.',
    viz: <VizBadges />,
  },
  {
    title: 'Permission-gated by design',
    desc: 'The agent cannot write to your model without your approval.',
    viz: <VizApproval />,
  },
]

export default function Security() {
  return (
    <section className="sec-trust" id="security">
      <div className="wrap">
        <div className="sec-trust-head">
          <h2>Your files never leave<br />your machine</h2>
          <p>For a buy-side team, security is the first question. Here are the answers.</p>
        </div>
        <div className="sec-trust-grid">
          {CARDS.map(c => (
            <div key={c.title} className="sec-trust-card">
              {c.viz}
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <a
                className="st-more"
                href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN MORE <span aria-hidden="true">⟶</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
