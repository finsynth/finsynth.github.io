import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'

/**
 * "What" — an infinite vertical focus carousel (Harvey.ai pattern).
 * The workflow list loops forever inside a bounded band: it auto-advances one
 * item at a time, and the visitor can also drive it with the mouse wheel
 * (over the list) or arrow keys. The centered item reads black and bold; its
 * neighbours are grey and fully sharp — only the outermost visible items blur
 * and dissolve into the edge mask.
 *
 * The list is rendered three times so the loop can wrap seamlessly: the focus
 * runs through the middle copy and silently re-bases by ±N when it drifts
 * into an outer copy (the copies are identical, so the jump is invisible).
 */
const WORKFLOWS = [
  'Building models',
  'Earnings updates',
  'Peer benchmarking',
  'Model audits',
  'Catalyst analysis',
  'Filing analysis',
  'Scenario modeling',
  'Consensus tracking',
  'Deal analysis',
  'Sector mapping',
  'Portfolio monitoring',
  'Thesis testing',
]

const AUTO_MS = 2400        // auto-advance cadence
const RESUME_MS = 4000      // pause after manual input before auto resumes
const WHEEL_STEP = 70       // accumulated deltaY per manual step

export default function WhatSection() {
  const viewportRef = useRef(null)
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const revealRef = useReveal({ threshold: 0.08 })
  const [isStatic, setIsStatic] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 820px)')
    const update = () => setIsStatic(reduce.matches || narrow.matches)
    update()
    reduce.addEventListener('change', update)
    narrow.addEventListener('change', update)
    return () => {
      reduce.removeEventListener('change', update)
      narrow.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    if (isStatic) return
    const viewport = viewportRef.current
    const list = listRef.current
    if (!viewport || !list) return

    const N = WORKFLOWS.length
    const MID = N + Math.floor(N / 2) // start centered in the middle copy

    let current = MID   // eased position
    let target = MID    // where we're headed
    let lastInput = 0   // ms timestamp of last manual input
    let lastAuto = performance.now()
    let wheelAcc = 0
    let raf = 0

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

    const paint = (now) => {
      // auto-advance unless the visitor drove it recently
      if (now - lastInput > RESUME_MS && now - lastAuto > AUTO_MS) {
        target += 1
        lastAuto = now
      }

      // ease toward the target, then re-base both into the middle copy
      current += (target - current) * 0.09
      if (target >= 2 * N && current >= 2 * N - 0.01) { target -= N; current -= N }
      if (target < N && current < N + 0.01) { target += N; current += N }

      const items = itemRefs.current
      const step = items[1] ? items[1].offsetTop - items[0].offsetTop : 0
      if (step) {
        // land the eased index on the viewport's vertical center
        const mid = (items.length - 1) / 2
        list.style.transform = `translateY(${((mid - current) * step).toFixed(2)}px)`
      }

      items.forEach((el, i) => {
        if (!el) return
        const dist = Math.abs(i - current)
        const focus = dist < 0.5
        // center: black + bold; neighbours: grey, fully sharp;
        // only the outermost visible rows (2+ steps out) soften
        const blur = clamp(dist - 1.6, 0, 2) * 1.1
        el.style.color = focus ? 'var(--ink)' : 'var(--muted)'
        el.style.fontWeight = focus ? '600' : '400'
        el.style.opacity = clamp(1 - dist * 0.28, 0.1, 1).toFixed(3)
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'
      })

      raf = requestAnimationFrame(paint)
    }

    const nudge = (dir) => {
      target += dir
      lastInput = performance.now()
      lastAuto = lastInput
    }

    const onWheel = (e) => {
      e.preventDefault()
      wheelAcc += e.deltaY
      while (wheelAcc >= WHEEL_STEP) { nudge(1); wheelAcc -= WHEEL_STEP }
      while (wheelAcc <= -WHEEL_STEP) { nudge(-1); wheelAcc += WHEEL_STEP }
    }

    const onKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); nudge(1) }
      if (e.key === 'ArrowUp') { e.preventDefault(); nudge(-1) }
    }

    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('keydown', onKey)
    raf = requestAnimationFrame(paint)

    return () => {
      cancelAnimationFrame(raf)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('keydown', onKey)
    }
  }, [isStatic])

  // three copies for a seamless wrap; one copy when static
  const rendered = isStatic ? WORKFLOWS : [...WORKFLOWS, ...WORKFLOWS, ...WORKFLOWS]

  return (
    <section className="what-sec">
      <div className="what-stage" ref={revealRef}>
        <p className="hiw-eyebrow what-eyebrow">FinSynth does it all</p>
        <div className="what-grid">
          <div className="what-anchor">
            <p>
              One agent,<br />every workflow
            </p>
          </div>

          <div
            className="what-viewport"
            ref={viewportRef}
            tabIndex={0}
            role="group"
            aria-label="Workflows FinSynth runs"
            aria-hidden={isStatic ? undefined : 'true'}
          >
            <ul className="what-list" ref={listRef}>
              {rendered.map((w, i) => (
                <li
                  key={`${w}-${i}`}
                  className="what-item"
                  ref={(el) => (itemRefs.current[i] = el)}
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
          {/* accessible plain list for screen readers */}
          {!isStatic && (
            <ul className="sr-only">
              {WORKFLOWS.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}

          <div className="what-cta">
            <p>Whatever you're working on, we'll run it with you.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
