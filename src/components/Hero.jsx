import { useEffect } from 'react'
import { initGrid } from '../utils/gridCanvas'

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
            <em className="hero-s2-accent">buy-side analysts</em>
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
        </div>

      </div>
    </section>
  )
}

export default Hero
