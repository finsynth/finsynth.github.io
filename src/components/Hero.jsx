import { useEffect, useState } from 'react'
import { initGrid } from '../utils/gridCanvas'

const ROLES = [
  'buy-side analysts',
  'hedge funds',
  'asset managers',
  'equity research',
]

const TYPE_MS = 45      // per character
const HOLD_MS = 2600    // full word on screen
const SELECT_MS = 620   // selection highlight before delete

function RotatingRole() {
  const [text, setText] = useState(ROLES[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let word = 0
    let alive = true
    const timers = []
    const t = (fn, ms) => { if (alive) timers.push(setTimeout(fn, ms)) }

    const typeNext = () => {
      word = (word + 1) % ROLES.length
      const target = ROLES[word]
      setPhase('typing')
      for (let i = 1; i <= target.length; i++) t(() => setText(target.slice(0, i)), i * TYPE_MS)
      t(() => setPhase('hold'), target.length * TYPE_MS + 250)
      t(select, target.length * TYPE_MS + HOLD_MS)
    }

    const select = () => {
      setPhase('selected')
      t(() => { setText(''); typeNext() }, SELECT_MS)
    }

    t(() => { setPhase('hold'); t(select, HOLD_MS) }, 400)

    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [])

  return (
    <>
      {/* static copy for screen readers; the animated span is decorative */}
      <span className="sr-only">{ROLES[0]}</span>
      <span className={`hero-rotate ${phase}`} aria-hidden="true">
        <em className="hero-s2-accent">{text}</em>
        <i className="hr-caret" />
        <span className="hr-frame">
          <b className="hr-handle tl" /><b className="hr-handle tr" />
          <b className="hr-handle bl" /><b className="hr-handle br" />
        </span>
      </span>
    </>
  )
}

function Hero() {
  useEffect(() => initGrid(), [])

  return (
    <section className="hero-s2">
      <canvas className="hero-s2-canvas" data-grid-hero aria-hidden="true"></canvas>
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">

        {/* ── ONE BIG CELL ── */}
        <div className="hero-cell">
          {/* Backed-by-Accel pill */}
          <div className="hero-excel-pill">
            <span>Backed by</span>
            <img src="/assets/img/accel-logo.svg" alt="Accel" height="14" />
          </div>

          {/* Heading */}
          <h1 className="hero-s2-title">
            The auditable spreadsheet agent for{' '}
            <RotatingRole />
          </h1>

          {/* Supporting paragraph */}
          <p className="hero-s2-sub">
            Works inside your{' '}
            <span className="excel-inline" aria-hidden="true" style={{display:'inline-flex',verticalAlign:'-2px',marginRight:'4px'}}>
              <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true">
                <path fill="#185C37" d="M20 16l-11-2v14.5c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5V23z" />
                <path fill="#21A366" d="M20 2h-9.5C9.67 2 9 2.67 9 3.5V9l11 7 5.5 2L31 16V9z" />
                <path fill="#107C41" d="M9 9h11v7H9z" />
                <path fill="#33C481" d="M29.5 2H20v7h11V3.5c0-.83-.67-1.5-1.5-1.5z" />
                <path fill="#107C41" d="M31 16H20v7h11z" />
                <path fill="#134A2C" d="M16.67 7H9v18h7.67c.73 0 1.33-.6 1.33-1.33V8.33C18 7.6 17.4 7 16.67 7z" opacity=".4" />
                <rect x="1" y="7" width="17" height="18" rx="1.8" fill="#107C41" />
                <path fill="#fff" d="M5.1 21.5l3.1-4.9-2.85-4.6h2.3l1.55 2.9c.15.3.25.5.3.65h.02c.1-.25.2-.47.32-.68l1.66-2.87h2.12l-2.92 4.58 3 4.92h-2.26l-1.8-3.36c-.08-.15-.15-.3-.21-.47h-.03c-.05.16-.12.3-.2.46l-1.85 3.37z" />
              </svg>
            </span>
            Excel. Every number traces back to its source.
          </p>

          {/* Primary CTA */}
          <a
            className="hero-s2-cta"
            href="https://calendly.com/kartik-finsynth/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a demo
          </a>

          {/* Trust line */}
          <p className="hero-trust-line">
            Trusted by investors from leading global hedge funds and asset managers
          </p>
        </div>

      </div>
    </section>
  )
}

export default Hero
