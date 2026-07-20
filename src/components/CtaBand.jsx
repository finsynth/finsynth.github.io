import { useEffect, useRef } from 'react'

export default function CtaBand() {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return
        el.classList.add('is-in')
        io.unobserve(el)
      })
    }, { threshold: .3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="cta-card cta-reveal" ref={cardRef}>
          <div className="cta-card-left">
            <p className="cta-eyebrow">Get started</p>
            <h2>Your new co-worker's<br />ready when you are.</h2>
            <p className="cta-card-sub">Book a demo, see what a normal Tuesday could look like.</p>
            <div className="cta-card-actions">
              <a
                className="cta-cta"
                href="https://calendly.com/kartik-finsynth/intro"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cta-cta-label">Book a demo</span>
                <span className="cta-cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12L12 4" />
                    <path d="M5.5 4H12V10.5" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div className="cta-fan" aria-hidden="true">
            <div className="fan-card fan-1" />
            <div className="fan-card fan-2" />
            <div className="fan-card fan-3 fan-dark" />
            <div className="fan-card fan-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
