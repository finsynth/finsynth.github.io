import { useEffect, useRef } from 'react'

/**
 * iOS-style cyclic card stack on an automatic timer.
 *
 * Attach `stackRef` to the container whose direct children are the cards
 * (`sectionRef` to the section — used only to pause the loop offscreen).
 * The deck cycles on its own: after HOLD_MS the front card lifts up out of the
 * stack on a sine arc, flips to the back z-index at the apex, and settles into
 * the last slot while the deeper cards each slide one slot forward. Cards at
 * rest are translated down PEEK px and scaled down SCALE_STEP per unit of
 * depth, so they peek out below the front.
 *
 * Hovering the deck pauses it so the front card can be read, but only at rest:
 * a card already in flight always completes its arc and lands before the deck
 * holds, so a hover never freezes a card mid-air. Moving the pointer away
 * resumes the cycle.
 *
 * No-op when the user prefers reduced motion (CSS shows a plain column).
 */
const PEEK = 24 // px each deeper card peeks out below the one in front
const SCALE_STEP = 0.05 // scale lost per unit of depth
const HOLD_MS = 2800 // rest time with a card at the front
const FLIGHT_MS = 950 // duration of the up-and-over flight

export default function useCardStack(count) {
  const sectionRef = useRef(null)
  const stackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    if (!section || !stack) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(stack.children)
    let raf = 0
    let base = 0 // index of the card currently at the front
    let phase = 'hold' // 'hold' | 'flight'
    let phaseStart = 0
    let visible = false
    let hovered = false // true while the pointer is over the deck — pauses at rest

    const ease = (t) => t * t * (3 - 2 * t) // smoothstep

    const render = (t) => {
      // t: 0 at rest → 1 when the front card has landed at the back
      const cardH = cards[0] ? cards[0].offsetHeight : 320
      const lift = cardH * 0.6 + 40 // apex clears the stack's top edge
      cards.forEach((el, i) => {
        const raw = (i - base + count * 2) % count // 0 = front slot
        let y, s, z
        if (raw === 0 && t > 0) {
          // in flight: up and over the top, then down behind the deck
          const landDepth = count - 1
          y = landDepth * PEEK * t - lift * Math.sin(Math.PI * t)
          s = 1 - landDepth * SCALE_STEP * t
          z = t < 0.5 ? count * 2 + 1 : 1
        } else {
          // resting in the stack, sliding one slot forward during a flight
          const d = Math.max(0, raw - t)
          y = d * PEEK
          s = 1 - d * SCALE_STEP
          z = count * 2 - Math.round(d)
        }
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
        el.style.zIndex = z
      })
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!visible) {
        phaseStart = now // hold the timer while offscreen
        return
      }
      const elapsed = now - phaseStart
      if (phase === 'hold') {
        // hovering pauses at the resting card; a flight in progress is never
        // interrupted — it falls through to the flight branch and completes
        if (hovered) { phaseStart = now; return }
        if (elapsed >= HOLD_MS) {
          phase = 'flight'
          phaseStart = now
        }
        return
      }
      const t = Math.min(1, elapsed / FLIGHT_MS)
      render(ease(t))
      if (t >= 1) {
        base = (base + 1) % count
        phase = 'hold'
        phaseStart = now
        render(0)
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(section)

    const onEnter = () => { hovered = true }
    const onLeave = () => { hovered = false }
    stack.addEventListener('pointerenter', onEnter)
    stack.addEventListener('pointerleave', onLeave)

    cards.forEach((el) => {
      el.style.willChange = 'transform'
    })
    render(0)
    raf = requestAnimationFrame(tick)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      stack.removeEventListener('pointerenter', onEnter)
      stack.removeEventListener('pointerleave', onLeave)
      cards.forEach((el) => {
        el.style.transform = ''
        el.style.zIndex = ''
        el.style.willChange = ''
      })
    }
  }, [count])

  return { sectionRef, stackRef }
}
