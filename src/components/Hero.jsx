import { useEffect } from 'react'
import { initGrid } from '../utils/gridCanvas'

function Hero() {
  useEffect(() => initGrid(), [])

  return (
    <section className="hero-s2">
      <canvas className="hero-s2-canvas" data-grid-hero aria-hidden="true"></canvas>
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">
        <div className="hero-s2-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="hero-s2-left">

            {/* Trust / rating badge */}
            <div className="hero-s2-badge">
              <svg className="hero-s2-star" width="15" height="15" viewBox="0 0 24 24" fill="#F5A623" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <strong>4.9</strong>
              <span>on G2</span>
            </div>

            {/* Heading — avatars inline, accent keyword at end */}
            <h1 className="hero-s2-title">
              The finance AI{' '}
              <span className="hero-s2-avatars" aria-hidden="true">
                <span style={{background:'#3550C8'}}>KP</span>
                <span style={{background:'#0E9F6E'}}>AR</span>
                <span style={{background:'#7C3AED'}}>MC</span>
                <span style={{background:'#475467'}}>JS</span>
              </span>
              {' '}trusted by analysts<br />
              who demand{' '}
              <em className="hero-s2-accent">precision</em>
            </h1>

            {/* Supporting paragraph */}
            <p className="hero-s2-sub">
              Run any analysis on global coverage — filings, live quotes, comps — with cell-level citations that trace every number back to its source. The agent proposes. You approve.
            </p>

            {/* Primary CTA */}
            <a
              className="hero-s2-cta"
              href="https://calendly.com/kartik-finsynth/intro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a demo
            </a>

            {/* Backed-by badge — top border, 32px padding above */}
            <div className="hero-s2-backed">
              <span className="hero-s2-backed-lbl">Backed by</span>
              <span className="hero-s2-backed-name">Accel</span>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="hero-s2-right">
            <div className="hero-s2-portrait-wrap">

              {/* Portrait card — finance dashboard screenshot */}
              <div className="hero-s2-portrait">

                {/* App top bar */}
                <div className="hsp-bar">
                  <div className="hsp-dots">
                    <i /><i /><i />
                  </div>
                  <div className="hsp-bar-tabs">
                    <span className="hsp-tab active">Portfolio</span>
                    <span className="hsp-tab">Analytics</span>
                    <span className="hsp-tab">Audit trail</span>
                  </div>
                </div>

                {/* Formula bar */}
                <div className="hsp-fbar">
                  <span className="hsp-cell-ref">B2</span>
                  <span className="hsp-fx">fx</span>
                  <span className="hsp-formula">=FINSYNTH("AAPL.revenue.FY24","SEC/10-K")</span>
                </div>

                {/* Spreadsheet rows */}
                <div className="hsp-sheet">
                  <div className="hsp-sheet-hdr">
                    <span className="hsp-rc" />
                    <span>Company</span>
                    <span>Revenue</span>
                    <span>YoY</span>
                    <span>Source</span>
                  </div>
                  {[
                    { co:'AAPL', rev:'$394.3B', yoy:'+8.1%', src:'10-K', active:true },
                    { co:'MSFT', rev:'$211.9B', yoy:'+16.2%', src:'10-K', active:false },
                    { co:'GOOG', rev:'$307.4B', yoy:'+8.7%', src:'10-K', active:false },
                    { co:'META', rev:'$134.9B', yoy:'+16.1%', src:'10-K', active:false },
                    { co:'AMZN', rev:'$574.8B', yoy:'+12.5%', src:'10-K', active:false },
                  ].map(({ co, rev, yoy, src, active }, i) => (
                    <div key={co} className={`hsp-sheet-row${active ? ' hsp-row-active' : ''}`}>
                      <span className="hsp-rc">{i + 1}</span>
                      <span className="hsp-co">{co}</span>
                      <span className="hsp-rev">{rev}</span>
                      <span className="hsp-pos">{yoy}</span>
                      <span className="hsp-cite">{src}</span>
                    </div>
                  ))}
                </div>

                {/* AI analysis card */}
                <div className="hsp-ai">
                  <div className="hsp-ai-header">
                    <span className="hsp-ai-dot" />
                    <span className="hsp-ai-label">FinSynth AI</span>
                  </div>
                  <p className="hsp-ai-text">
                    Revenue CAGR 12.4% over 5Y, outperforming sector median of 8.2%. All figures source-linked.
                  </p>
                  <div className="hsp-ai-cites">
                    <span>SEC 10-K 2024</span>
                    <span>Bloomberg</span>
                    <span>FactSet</span>
                  </div>
                </div>

              </div>
              {/* /portrait */}

              {/* Float: top-right — stacked check pills */}
              <div className="hero-s2-float hero-s2-float--pills">
                <div className="hero-s2-pill">
                  <span className="hero-s2-pill-icon">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  Source-backed
                </div>
                <div className="hero-s2-pill">
                  <span className="hero-s2-pill-icon">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  Audit-ready
                </div>
              </div>

              {/* Float: left edge — brand stat card */}
              <div className="hero-s2-float hero-s2-float--stat hero-s2-float--left">
                <span className="hero-s2-fstat-num">$2.4T</span>
                <span className="hero-s2-fstat-lbl">Assets<br />analyzed</span>
              </div>

              {/* Float: lower-left — white tag chip card */}
              <div className="hero-s2-float hero-s2-float--tags">
                <span className="hero-s2-tags-title">Data sources</span>
                <div className="hero-s2-tags-row">
                  <span className="hero-s2-tag-chip">+SEC filings</span>
                  <span className="hero-s2-tag-chip">+Bloomberg</span>
                  <span className="hero-s2-tag-chip">+FactSet</span>
                </div>
              </div>

              {/* Float: bottom-right — brand stat card */}
              <div className="hero-s2-float hero-s2-float--stat hero-s2-float--br">
                <span className="hero-s2-fstat-num">98%</span>
                <span className="hero-s2-fstat-lbl">Audit<br />pass rate</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
