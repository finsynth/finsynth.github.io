import { useEffect, useRef } from 'react'

// Locked copy — "How" section (§4, Updated Content 2026-07-16).
// Each line is a beat, read start to finish — not a labeled list.
const BEATS = [
  'Tell it what you need.',
  'It gets to work.',
  'It checks with you first.',
  'You call the shot.',
  'It delivers the answer, sourced.',
]

export default function HowItWorks() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="hiw-section" id="how-it-works" ref={ref}>
      <div className="hiw-wrap">
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">Say hello to your new co-worker.</h2>
        </div>
        <ol className="hiw-flow">
          {BEATS.map((line, i) => (
            <li className="hiw-beat" key={line}>
              <span className="hiw-beat-marker">{String(i + 1).padStart(2, '0')}</span>
              <span className="hiw-beat-line">{line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
