import { useEffect, useRef, useState } from 'react'

/* Animated mini visuals — one per step, looping */

function VisDownload() {
  return (
    <div className="setup-vis" aria-hidden="true">
      <div className="sv-row">
        <span className="sv-doc" />
        <span className="sv-name">finsynth-manifest.xml</span>
        <span className="sv-done">✓ saved</span>
      </div>
      <div className="sv-bar"><i /></div>
    </div>
  )
}

function VisInstall() {
  return (
    <div className="setup-vis" aria-hidden="true">
      <div className="sv-ribbon">
        <span>Home</span><span>Insert</span><span>Formulas</span>
        <span className="sv-addin">FinSynth</span>
      </div>
      <div className="sv-sheet">
        {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
      </div>
    </div>
  )
}

function VisWork() {
  return (
    <div className="setup-vis" aria-hidden="true">
      <div className="sv-prompt">
        <span className="sv-typing">Pull Q3 segment revenue</span>
        <i className="sv-caret" />
      </div>
      <div className="sv-approve">
        <span className="sv-chip">Approved</span>
        <span className="sv-cell">B4 · $94.9B</span>
      </div>
    </div>
  )
}

const STEPS = [
  {
    num: '01',
    title: 'Download the manifest',
    desc: 'Grab the FinSynth add-in manifest file — a single click, no installer to run.',
    vis: <VisDownload />,
  },
  {
    num: '02',
    title: 'Install in Excel',
    desc: 'Side-load the manifest from Insert → Add-ins. FinSynth appears in your ribbon in seconds.',
    vis: <VisInstall />,
  },
  {
    num: '03',
    title: 'Start working',
    desc: 'Open the side panel, type what you need, and approve each write. Your first model in minutes.',
    vis: <VisWork />,
  },
]

export default function Setup() {
  const tlRef = useRef(null)
  const [progress, setProgress] = useState(0) // 0..1 — how far the line has drawn

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = tlRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        // line starts drawing when the timeline top passes 78% of the
        // viewport and finishes as its bottom approaches the same mark
        const start = window.innerHeight * 0.78
        // horizontal (desktop) layout is much shorter, so drive progress
        // over a fixed viewport-based distance instead of the element height
        const horizontal = window.matchMedia('(min-width: 901px)').matches
        const denom = horizontal ? window.innerHeight * 0.45 : r.height
        const p = (start - r.top) / denom
        setProgress(Math.max(0, Math.min(1, p)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="setup-sec" id="setup">
      <div className="wrap">
        <div className="setup-head">
          <p className="setup-eyebrow">GET STARTED</p>
          <h2>Up and running in three steps</h2>
          <p className="setup-sub">No procurement cycle, no IT ticket. Install the add-in and start building.</p>
        </div>
        <div className="setup-timeline" ref={tlRef} style={{ '--tl-progress': progress }}>
          <div className="setup-track" aria-hidden="true">
            <div className="setup-track-fill" />
          </div>
          {STEPS.map((s, i) => (
            <div
              className={`setup-step${progress * STEPS.length >= i + 0.35 ? ' lit' : ''}`}
              key={s.num}
            >
              <span className="setup-dot" aria-hidden="true" />
              <div className="setup-step-top">
                {s.vis}
                <span className="setup-num">{s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
