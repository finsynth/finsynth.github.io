import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'

const POINTS = [
  {
    title: 'Cell-level citations',
    desc: 'Every figure FinSynth writes links to the filing, page, and line behind it. When someone asks where a number came from, the answer is one click away.',
  },
  {
    title: 'Permission-gated writes',
    desc: 'The agent never changes your model on its own. It proposes; you approve. Every cell that lands is one you signed off on.',
  },
  {
    title: 'Accuracy you can check',
    desc: "You don't take accuracy on faith. Because every output is cited, you can verify any figure against its source in seconds.",
  },
]

/* ── Stage scenes ─────────────────────────────── */

function SceneCitation() {
  return (
    <>
      <p className="astage-tag">01 · CELL-LEVEL CITATIONS</p>
      <div className="astage-cell">
        <span className="astage-ref">B14</span>
        <span className="astage-val">$391.0B</span>
        <span className="astage-cite">10-K</span>
      </div>
      <span className="astage-thread" aria-hidden="true" />
      <div className="astage-pop">
        <div className="astage-pop-head">SOURCE · APPLE 10-K FY2024 · P.28</div>
        <div className="astage-pop-meta">Filed 2024-11-01 · SEC EDGAR</div>
      </div>
    </>
  )
}

function SceneApprove() {
  return (
    <>
      <p className="astage-tag">02 · PERMISSION-GATED WRITES</p>
      <div className="astage-prop">
        <div className="astage-prop-head">PROPOSED WRITE</div>
        <div className="astage-cell astage-cell-flat">
          <span className="astage-ref">B14</span>
          <span className="astage-val">$391.0B</span>
          <span className="astage-cite">10-K</span>
        </div>
        <div className="astage-actions">
          <span className="astage-btn ok">✓ Approve</span>
          <span className="astage-btn no">Reject</span>
        </div>
      </div>
    </>
  )
}

function SceneVerify() {
  const rows = [
    { ref: 'B12', label: 'Revenue', val: '$391.0B', src: '10-K p.28' },
    { ref: 'B13', label: 'Services', val: '$96.2B', src: '10-Q p.11' },
    { ref: 'B14', label: 'Gross margin', val: '46.2%', src: '10-K p.31' },
  ]
  return (
    <>
      <p className="astage-tag">03 · ACCURACY YOU CAN CHECK</p>
      <div className="astage-checks">
        {rows.map(r => (
          <div key={r.ref} className="astage-check">
            <span className="astage-ref">{r.ref}</span>
            <span className="astage-check-label">{r.label}</span>
            <span className="astage-check-val">{r.val}</span>
            <span className="astage-check-src">✓ {r.src}</span>
          </div>
        ))}
      </div>
    </>
  )
}

const SCENES = [<SceneCitation />, <SceneApprove />, <SceneVerify />]

/* ── Section ──────────────────────────────────── */

export default function Auditability() {
  const pointRefs = useRef([])
  const revealRef = useReveal()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.55
      let idx = 0
      pointRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setActive(idx)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="audit-sec" id="auditability" ref={revealRef}>
      <div className="wrap">
        <div className="audit-grid">
          <div>
            <p className="hiw-eyebrow">AUDITABILITY</p>
            <h2 className="audit-title">Every number traces back to its source</h2>
            <p className="audit-sub">Auditability isn't a feature we bolted on. It's how the agent works.</p>
            <div className="points audit-points">
              {POINTS.map((p, i) => (
                <div
                  className={`point${i === active ? ' active' : ''}`}
                  key={p.title}
                  ref={el => { pointRefs.current[i] = el }}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="n">{i + 1}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="audit-stage-col" aria-hidden="true">
            <div className="audit-stage">
              {SCENES.map((scene, i) => (
                <div key={i} className={`audit-scene${i === active ? ' on' : ''}`}>{scene}</div>
              ))}
              <div className="audit-stage-dots">
                {POINTS.map((_, i) => (
                  <span key={i} className={i === active ? 'on' : ''} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
