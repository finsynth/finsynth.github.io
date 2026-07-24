import { useEffect, useRef } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

function BadgeSoc2() {
  return (
    <div className="secx-badge">
      <span className="secx-badge-top">AICPA</span>
      <span className="secx-badge-rule" />
      <span className="secx-badge-bot">SOC 2</span>
    </div>
  )
}

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
)

const POINTS = [
  {
    key: 'local',
    title: 'Local Excel execution',
    body: "Excel operations run locally, on your machine. FinSynth's backend never reads, stores, or transmits your workbook.",
  },
  {
    key: 'gate',
    title: 'Permission-gated by design',
    body: 'The agent cannot write to your model without your explicit approval.',
  },
  {
    key: 'soc2',
    title: 'SOC 2 Type II certified',
    body: 'Independently audited controls for security, availability, and confidentiality.',
  },
  {
    key: 'integrations',
    title: 'Custom integrations supported',
    body: 'Connect FinSynth to the data sources and tools your team already runs on.',
  },
]

export default function Security() {
  const ref = useRef(null)
  const zoomRef = useSectionZoom()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (!e.isIntersecting) return
        el.classList.add('is-in')
        io.unobserve(el)
      }),
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="secx" id="security">
      <div className="wrap" ref={zoomRef}>
        <div className="secx-frame" ref={ref}>

          <div className="secx-head secx-reveal">
            <div className="secx-head-copy">
              <p className="secx-eyebrow">Security &amp; compliance</p>
              <h2>Enterprise-<span className="ttl-hl">ready</span></h2>
            </div>
            <div className="secx-badges">
              <BadgeSoc2 />
            </div>
          </div>

          <ul className="secx-grid">
            {POINTS.map((pt, i) => (
              <li
                key={pt.key}
                className="secx-point secx-reveal"
                style={{ '--d': `${0.08 + 0.07 * i}s` }}
              >
                <span className="secx-point-ic" aria-hidden="true">{CheckIcon}</span>
                <div className="secx-point-body">
                  <h3 className="secx-point-title">{pt.title}</h3>
                  <p>{pt.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
