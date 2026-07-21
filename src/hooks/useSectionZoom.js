import { useEffect, useRef } from 'react'

/**
 * Scroll-scrubbed dolly zoom, generalized from the Before/After section.
 * The element scales up from ZOOM_MIN → 1 as it rises into view and back
 * down 1 → ZOOM_MIN as it leaves the top — so every section "zooms in" on
 * entry and "zooms out" on exit, scrubbed off scroll position.
 *
 * Attach the returned ref to an INNER content wrapper (not a section that
 * contains a `position: sticky` child — a transform on the ancestor breaks
 * sticky). All registered elements share one scroll listener + rAF loop.
 *
 * Disabled on narrow screens and when the user prefers reduced motion.
 */
const ZOOM_MIN = 0.9 // scale when the section is fully outside the settle band
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const smooth = (t) => t * t * (3 - 2 * t) // smoothstep easing

const registry = new Set()
let wired = false
let scheduled = false
let raf = 0
let mqMobile = null

function apply() {
  scheduled = false
  const vh = window.innerHeight
  const mobile = mqMobile && mqMobile.matches
  registry.forEach((el) => {
    if (mobile) {
      if (el.style.transform) el.style.transform = ''
      return
    }
    const rect = el.getBoundingClientRect()
    // Ramp distance adapts to the section's own height: short sections settle
    // when centered, tall sections hold at full scale through the middle.
    const span = Math.min(vh * 0.5, rect.height * 0.6 + 1)
    if (span <= 0) return
    const pIn = clamp((vh - rect.top) / span, 0, 1) // 0 entering bottom → 1 arrived
    const pOut = clamp(rect.bottom / span, 0, 1) // 1 in view → 0 exited top
    const z = smooth(clamp(Math.min(pIn, pOut), 0, 1))
    el.style.transform = `scale(${(ZOOM_MIN + (1 - ZOOM_MIN) * z).toFixed(4)})`
  })
}

function onScroll() {
  if (scheduled) return
  scheduled = true
  raf = requestAnimationFrame(apply)
}

function wire() {
  if (wired) return
  wired = true
  mqMobile = window.matchMedia('(max-width: 760px)')
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  apply()
}

function unwire() {
  if (!wired) return
  wired = false
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
}

export default function useSectionZoom() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.transformOrigin = 'center center'
    el.style.willChange = 'transform'
    registry.add(el)
    wire()
    onScroll()

    return () => {
      registry.delete(el)
      el.style.transform = ''
      el.style.willChange = ''
      if (registry.size === 0) unwire()
    }
  }, [])

  return ref
}
