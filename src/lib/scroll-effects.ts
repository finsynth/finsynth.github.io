/**
 * Adds `is-in` to `el` the first time at least `threshold` of it is visible
 * in the viewport, then stops observing. CSS keys the entrance off `is-in`.
 * @returns cleanup that stops observing
 */
export function reveal(el: Element, threshold = 0.15) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        el.classList.add('is-in')
        io.disconnect()
      }
    },
    { threshold },
  )
  io.observe(el)
  return () => io.disconnect()
}

const ZOOM_MIN = 0.9
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

const registry = new Set<HTMLElement>()
let wired = false
let scheduled = false
let raf = 0
let mqMobile: MediaQueryList | null = null

/**
 * One frame for every zoomed element: scale from ZOOM_MIN up to 1 while it
 * enters from the bottom, back down while it leaves at the top. On phones the
 * transform and will-change are cleared instead.
 */
function apply() {
  scheduled = false
  const vh = window.innerHeight
  const mobile = mqMobile?.matches
  registry.forEach((el) => {
    if (mobile) {
      // dropping will-change too: off-zoom it only rasterises the text soft
      if (el.style.transform) el.style.transform = ''
      if (el.style.willChange) el.style.willChange = ''
      return
    }
    if (!el.style.willChange) el.style.willChange = 'transform'
    const rect = el.getBoundingClientRect()
    // scroll distance over which the zoom ramps: half a viewport, or less for
    // short sections so they reach full size; +1 keeps it above zero
    const span = Math.min(vh * 0.5, rect.height * 0.6 + 1)
    if (span <= 0) return
    const pIn = clamp((vh - rect.top) / span, 0, 1)
    const pOut = clamp(rect.bottom / span, 0, 1)
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

/**
 * Scroll-scrubbed dolly zoom on `el`. All zoomed elements share one scroll
 * listener and one rAF. Put it on an inner wrapper, never on an ancestor of a
 * `position: sticky` child (a transform breaks sticky). Skipped for reduced
 * motion.
 * @returns cleanup that unregisters `el` and clears its inline styles
 */
export function zoom(el: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
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
}

/** Applies reveal / zoom to static markup: `data-reveal="<threshold>"`, `data-zoom`. */
export function bindScrollEffects(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    reveal(el, Number(el.dataset.reveal) || undefined)
  })
  root.querySelectorAll<HTMLElement>('[data-zoom]').forEach((el) => {
    zoom(el)
  })
}
