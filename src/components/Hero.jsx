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
          {/* Backed-by-Accel pill */}
          <div className="hero-excel-pill">
            <span>Backed by Accel</span>
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
