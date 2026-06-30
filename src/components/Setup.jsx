const STEPS = [
  {
    num: '01',
    title: 'Download the manifest',
    desc: 'Grab the FinSynth add-in manifest file — a single click, no installer to run.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 8v20M14 21l8 8 8-8" />
        <path d="M9 34h26" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Install in Excel',
    desc: 'Side-load the manifest from Insert → Add-ins. FinSynth appears in your ribbon in seconds.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="9" width="30" height="26" rx="2" />
        <path d="M7 17h30M15 9v26" />
        <path d="M24 25l3 3 6-7" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Start working',
    desc: 'Open the side panel, type what you need, and approve each write. Your first model in minutes.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 10l16 12-16 12z" />
      </svg>
    ),
  },
]

export default function Setup() {
  return (
    <section className="setup-sec" id="setup">
      <div className="wrap">
        <div className="setup-head">
          <p className="setup-eyebrow">GET STARTED</p>
          <h2>Up and running in three steps</h2>
          <p className="setup-sub">No procurement cycle, no IT ticket. Install the add-in and start building.</p>
        </div>
        <div className="setup-grid">
          {STEPS.map((s, i) => (
            <div className="setup-step" key={s.num}>
              <div className="setup-step-top">
                <span className="setup-ic">{s.icon}</span>
                <span className="setup-num">{s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <span className="setup-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
