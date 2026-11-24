import { useCallback, useEffect, useRef } from 'react'

/**
 * Cyclic card stack on a timer. Attach `stackRef` to the element whose direct children are the cards;
 * `sectionRef` only pauses the loop offscreen.
 * Hover pauses at rest only: a card in flight always lands first.
 * `next`/`prev` run the same flight (prev in reverse); clicks during a flight are ignored, not queued.
 * No-op under reduced motion (CSS shows a plain column; next/prev do nothing).
 */
const PEEK = 24 // px each deeper card peeks out below the one in front
const SCALE_STEP = 0.05 // scale lost per unit of depth
const HOLD_MS = 2800 // rest time with a card at the front
const FLIGHT_MS = 950 // duration of the up-and-over flight
const FADE = 0.92 // opacity the flying card sheds at the apex of its arc

export default function useCardStack(count: number) {
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  // set up by the effect below; a no-op before mount and under reduced motion
  const stepRef = useRef<((d: 1 | -1) => void) | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    if (!section || !stack) return
    if (count < 2) return // one card: nothing to cycle, nothing to page
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(stack.children) as HTMLElement[]
    let raf = 0
    let base = 0 // index of the card currently at the front
    let phase: 'hold' | 'flight' = 'hold'
    let dir: 1 | -1 = 1 // 1 = flight plays forward, -1 = the same flight in reverse
    let phaseStart = 0
    let visible = false
    let hovered = false // true while the pointer is over the deck — pauses at rest

    const ease = (t: number) => t * t * (3 - 2 * t) // smoothstep

    const render = (t: number) => {
      // t: 0 at rest → 1 when the front card has landed at the back
      const cardH = cards[0] ? cards[0].offsetHeight : 320
      const lift = cardH * 0.6 + 40 // apex clears the stack's top edge
      cards.forEach((el, i) => {
        const raw = (i - base + count * 2) % count // 0 = front slot
        let y: number, s: number, z: number, o: number
        if (raw === 0 && t > 0) {
          // The card fades across the arc: at the apex it overlaps the new front card, and two opaque quotes read as a duplicated section.
          const landDepth = count - 1
          y = landDepth * PEEK * t - lift * Math.sin(Math.PI * t)
          s = 1 - landDepth * SCALE_STEP * t
          z = t < 0.5 ? count * 2 + 1 : 1
          o = 1 - FADE * Math.sin(Math.PI * t)
        } else {
          // resting in the stack, sliding one slot forward during a flight
          const d = Math.max(0, raw - t)
          y = d * PEEK
          s = 1 - d * SCALE_STEP
          z = count * 2 - Math.round(d)
          o = 1
        }
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
        el.style.zIndex = String(z)
        el.style.opacity = o.toFixed(3)
      })
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible) {
        phaseStart = now // hold the timer while offscreen
        return
      }
      const elapsed = now - phaseStart
      if (phase === 'hold') {
        // hovering pauses at the resting card; a flight in progress is never
        // interrupted — it falls through to the flight branch and completes
        if (hovered) {
          phaseStart = now
          return
        }
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
    stepRef.current = (d: 1 | -1) => {
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

    const onEnter = () => {
      hovered = true
    }
    const onLeave = () => {
      hovered = false
    }
    stack.addEventListener('pointerenter', onEnter)
    stack.addEventListener('pointerleave', onLeave)

    cards.forEach((el) => {
      el.style.willChange = 'transform, opacity'
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
        el.style.opacity = ''
        el.style.willChange = ''
      })
    }
  }, [count])

  const next = useCallback(() => stepRef.current?.(1), [])
  const prev = useCallback(() => stepRef.current?.(-1), [])

  return { sectionRef, stackRef, next, prev }
}
