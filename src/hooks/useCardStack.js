import { useCallback, useEffect, useRef } from 'react'

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
 * `next`/`prev` drive the same step by hand, for arrow controls. Going back is
 * the forward flight of the card behind the deck played in reverse, so there is
 * one motion in this file and both directions land in exactly the resting
 * arrangement the timer would produce. A click during a flight is ignored rather
 * than queued: the card in the air always finishes its own arc.
 *
 * No-op when the user prefers reduced motion (CSS shows a plain column), where
 * `next`/`prev` do nothing and the arrows are hidden.
 */
const PEEK = 24 // px each deeper card peeks out below the one in front
const SCALE_STEP = 0.05 // scale lost per unit of depth
const HOLD_MS = 2800 // rest time with a card at the front
const FLIGHT_MS = 950 // duration of the up-and-over flight

export default function useCardStack(count) {
  const sectionRef = useRef(null)
  const stackRef = useRef(null)
  // set up by the effect below; a no-op before mount and under reduced motion
  const stepRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    if (!section || !stack) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(stack.children)
    let raf = 0
    let base = 0 // index of the card currently at the front
    let phase = 'hold' // 'hold' | 'flight'
    let dir = 1 // 1 = flight plays forward, -1 = the same flight in reverse
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
          dir = 1
          phaseStart = now
        }
        return
      }
      const t = Math.min(1, elapsed / FLIGHT_MS)
      // reverse plays the identical arc from its landed end back to its start
      render(dir === 1 ? ease(t) : 1 - ease(t))
      if (t >= 1) {
        // forward: the front card has landed at the back, so the deck advances.
        // reverse: `base` was already moved back when the step was kicked off,
        // and render(0) is where that flight began — nothing left to shift.
        if (dir === 1) base = (base + 1) % count
        phase = 'hold'
        dir = 1
        phaseStart = now
        render(0)
      }
    }

    // Hand-driven step, off the arrow controls. Forward is the timer's own move;
    // backward pulls the card at the rear of the deck to the front by putting
    // the deck one slot back and running its flight in reverse.
    stepRef.current = (d) => {
      if (phase === 'flight') return
      dir = d
      if (d === -1) base = (base - 1 + count) % count
      phase = 'flight'
      phaseStart = performance.now()
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
      stepRef.current = null
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

  const next = useCallback(() => stepRef.current?.(1), [])
  const prev = useCallback(() => stepRef.current?.(-1), [])

  return { sectionRef, stackRef, next, prev }
}
