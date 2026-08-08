import { useEffect, useRef } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

/**
 * A certification seal. `pending` marks one that hasn't been awarded yet: the
 * seal reads slightly back from the certified ones and carries an "In progress"
 * pill on its lower edge, so the row never implies a certification we don't hold.
 */
function SealBadge({ top, name, pending }) {
  return (
    <div className={`secx-badge${pending ? ' secx-badge--pending' : ''}`}>
      <span className="secx-badge-top">{top}</span>
      <span className="secx-badge-rule" />
      <span className="secx-badge-bot">{name}</span>
      {pending && <span className="secx-badge-pill">In progress</span>}
    </div>
  )
}

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
)

// Every certification gets a seal. The ones not yet awarded carry an
// "In progress" pill instead of being stated as plain status lines, so the row
// reads as one set without over-claiming.
const CERTS = [
  { key: 'soc2', top: 'AICPA', name: 'SOC 2' },
  { key: 'gdpr', top: 'EU', name: 'GDPR', pending: true },
  { key: 'iso', top: 'ISO/IEC', name: '27001', pending: true },
]

// Four points, two columns — the controls the customer holds.
const POINTS = [
  {
    key: 'gate',
    title: 'Permission-gated by design',
    body: 'The agent cannot write to your model without your explicit approval',
  },
  {
    key: 'notraining',
    title: 'No training on your data',
    body: 'By default your data is never shared, used to train AI models, or made accessible to other firms or third-party AI providers',
  },
  {
    key: 'access',
    title: 'Strict access controls',
    body: 'FinSynth runs a zero-trust, least-privilege access model with granular role-based controls',
  },
  {
    key: 'integrations',
    title: 'Custom integrations supported',
    body: 'Connect FinSynth to the data sources and tools your team already runs on',
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
            <div className="secx-certs">
              <div className="secx-badges">
                {CERTS.map((c) => (
                  <SealBadge key={c.key} top={c.top} name={c.name} pending={c.pending} />
                ))}
              </div>
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
