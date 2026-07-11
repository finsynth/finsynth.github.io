function BadgeSoc2() {
  return (
    <div className="secx-badge">
      <span className="secx-badge-top">AICPA</span>
      <span className="secx-badge-rule" />
      <span className="secx-badge-bot">SOC 2</span>
    </div>
  )
}

function BadgeGdpr() {
  const stars = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * 2 * Math.PI - Math.PI / 2
    return { x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) }
  })
  return (
    <div className="secx-badge">
      <svg className="secx-badge-stars" viewBox="0 0 100 100" aria-hidden="true">
        {stars.map((s, i) => (
          <text key={i} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central">★</text>
        ))}
      </svg>
      <span className="secx-badge-mid">GDPR</span>
    </div>
  )
}

function BadgeLocal() {
  return (
    <div className="secx-badge">
      <svg className="secx-badge-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4.5 12.5l5 5 10-11" />
      </svg>
      <span className="secx-badge-cap">Local<br />Execution</span>
    </div>
  )
}

const STATS = [
  {
    value: '12,000+',
    desc: 'Listed companies covered with filings, transcripts, reports and presentations',
  },
  {
    value: '500+',
    desc: 'Analysts trust FinSynth to build, update and audit their models',
  },
]

export default function Security() {
  return (
    <section className="secx" id="security">
      <div className="wrap">
        <div className="secx-frame">
          <span className="secx-crop tl" /><span className="secx-crop tr" />
          <span className="secx-crop bl" /><span className="secx-crop br" />

          <div className="secx-top">
            <div className="secx-copy">
              <h2>Enterprise security as standard</h2>
              <p>
                Privacy. Security. Peace of mind.<br />
                Never used for training.<br />
                Excel operations run locally, on your machine.
              </p>
              <a
                className="secx-more"
                href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </div>
            <div className="secx-badges">
              <BadgeSoc2 />
              <BadgeGdpr />
              <BadgeLocal />
            </div>
          </div>

          <div className="secx-stats">
            {STATS.map(s => (
              <div key={s.value} className="secx-stat">
                <span className="secx-stat-num">{s.value}</span>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
