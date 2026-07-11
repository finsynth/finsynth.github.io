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
          {/* Enabled-by-Excel pill */}
          <div className="hero-excel-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="20" height="18" rx="2" fill="#107C41" />
              <path d="M6.5 7l4.2 5-4.2 5h2.6l2.9-3.6L15 17h2.6l-4.2-5 4.2-5H15l-2.9 3.6L9.1 7H6.5z" fill="#fff" />
            </svg>
            <span>Enabled by Excel</span>
          </div>

          {/* Heading */}
          <h1 className="hero-s2-title">
            The auditable spreadsheet agent for{' '}
            <RotatingRole />
          </h1>

          {/* Supporting paragraph */}
          <p className="hero-s2-sub">
            Works inside your Excel. Every number traces back to its source.
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
