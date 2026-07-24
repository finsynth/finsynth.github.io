import { useEffect, useRef } from 'react'

/* Grid Reveal — hover-fill perspective grid (tars.pro hero backdrop).
   The exact curved-horizon cell geometry is lifted from tars.pro (52 warped
   quadrilaterals fanning up into a dome). tars fills the whole grid on a
   single hover; here the fill follows the cursor as a soft spotlight — cells
   near the pointer fade in (blue gradient) and trail off as it moves away —
   which reads better in a standalone section. A slow ambient drift keeps the
   grid alive when untouched; reduced-motion visitors get one static frame.
   Fill opacity is driven per-cell in a rAF loop; the CSS opacity transition
   adds the trailing softness. viewBox is tars's original 1350x610. */

// warped-quadrilateral cells — fill in on proximity
const CELLS = [
  'M1107 75C1147.88 68.8135 1188.57 61.9551 1229 54V159.273C1188.57 164.046 1147.88 167.788 1107 171.5V75Z',
  'M1107 75C1066.51 81.1811 1025.82 86.4778 985 90.8903V181C1025.82 178.353 1066.51 175.174 1107 171.466V75Z',
  'M985 181C1025.68 178.357 1066.65 174.874 1107 171.177L1107 268.667C1066.65 269.9 1025.68 270.619 985 271.5V181Z',
  'M985 181.011V91C943.976 95.3738 902.248 98.9273 861 101.556V187.5C902.248 185.923 943.976 183.635 985 181.011Z',
  'M985 181C943.789 183.651 902.437 185.771 861 187.358V273.764C902.437 273.235 943.789 272.528 985 271.644V181Z',
  'M861 101.5C819.732 104.133 778.38 105.969 737 106.844V190.658C778.38 190.132 819.732 189.08 861 187.5V101.5Z',
  'M985 271.5C943.933 272.382 902.291 272.972 861 273.5V360C902.437 360.53 943.789 361.113 985 362V271.5Z',
  'M861 187.341C819.732 188.921 778.38 189.975 737 190.5V274.817C778.38 274.642 819.732 274.291 861 273.764V187.341Z',
  'M737 190.608C695.676 191.132 654.324 191.527 613 191V106.844C654.324 107.722 695.676 107.716 737 106.844V190.608Z',
  'M861 273.446C819.732 273.973 778.38 274.325 737 274.5V359C778.38 359.175 819.732 359.473 861 360V273.446Z',
  'M613 274.816V191.014C654.324 191.542 695.676 191.025 737 190.5V274.817C695.676 274.992 654.324 274.992 613 274.816Z',
  'M613 106.75C571.62 105.87 530.268 104.029 489 101.391V187.688C530.268 189.27 571.62 190.472 613 191V106.75Z',
  'M861 360C819.806 359.473 778.305 359.175 737 359V442.878C778.38 443.404 819.732 444.415 861 446V360Z',
  'M737 274.814C695.676 274.989 654.324 274.989 613 274.812V359C654.324 358.824 695.676 358.823 737 358.998V274.814Z',
  'M613 190.825C571.62 190.297 530.268 189.24 489 187.656V273.759C530.268 274.287 571.62 274.639 613 274.815V190.825Z',
  'M365 181.438L365 91C406.075 95.3773 447.701 98.7682 489 101.399L489 187.72C447.701 186.142 406.075 184.064 365 181.438Z',
  'M736.963 443C695.651 442.475 654.312 442.44 613 442.969V359C654.312 358.824 695.688 358.825 737 359L736.963 443Z',
  'M613 274.688C571.62 274.511 530.268 274.247 489 273.719V360C530.268 359.471 571.62 359.176 613 359V274.688Z',
  'M365 181.344C406.211 183.999 447.563 186.128 489 187.719V273.759C447.563 273.229 406.211 272.521 365 271.636L365 181.344Z',
  'M243 172C283.492 175.677 324.177 178.832 365 181.464V91C324.177 86.6132 283.492 81.3553 243 75.2266V172Z',
  'M737 527.942C695.676 527.057 654.324 527.062 613 527.954V442.781C654.253 442.248 695.734 442.298 736.987 442.828L737 527.942Z',
  'M489 360C530.132 359.472 571.757 359.176 613 359V442.814C571.62 443.344 530.268 444.407 489 446V360Z',
  'M365 271.5V362C406.075 361.122 447.701 360.544 489 360.017V273.659C447.701 273.131 406.075 272.378 365 271.5Z',
  'M365 181.431C324.176 178.81 283.491 175.667 243 172V267.856C283.491 269.078 324.176 270.626 365 271.5V181.431Z',
  'M243 75.2125C202.118 69.026 161.432 61.9551 121 54V159.273C161.433 164.046 202.118 168.288 243 172V75.2125Z',
  'M1348.86 0H1229V54C1269.27 46.0974 1309.29 37.3227 1349 27.6759L1348.86 0Z',
  'M1229 0H1108V75.174C1148.88 68.9824 1188.57 61.9034 1229 53.9375V0Z',
  'M1108 0H985V91.0678C1026.16 86.6544 1067.18 81.3564 1108 75.174V0Z',
  'M985 0H861V101.664C902.437 99.019 943.789 95.4867 985 91.0678V0Z',
  'M861 0H737V106.93C778.38 106.054 819.732 104.299 861 101.664V0Z',
  'M737 0H613V106.922C654.324 107.802 695.676 107.805 737 106.93V0Z',
  'M613 0H489V101.64C530.268 104.28 571.62 106.119 613 107V0Z',
  'M489 0H365V91.0264C406.211 95.451 447.563 98.9888 489 101.64V0Z',
  'M365 0H243V75.267C283.492 81.3903 324.177 86.6434 365 91.0264V0Z',
  'M121 54.0584V0H243V75.267C202.117 69.0845 161.432 62.015 121 54.0584Z',
  'M121 54V0H1V27.614C40.7109 37.2884 80.7296 46.0837 121 54Z',
]

// faint always-on wireframe — the arced latitude lines + straight longitude lines
const LINES = [
  'M612.8 527.266C654.194 526.382 695.617 526.378 737.012 527.254',
  'M489 446C612.747 441.341 737.251 441.333 861 445.979',
  'M985 362C779.504 358.002 570.499 358 365 361.994',
  'M242.771 268.174C527.952 277.045 822.735 277.041 1107.91 268.165',
  'M121.165 159.011C483.816 201.817 866.877 201.806 1229.52 158.976',
  'M1 27C437.914 134.333 912.086 134.333 1349 27',
  'M1229 0L1229 268', 'M1107 0L1107 362', 'M985 0C985 148.337 985 296.673 985 445',
  'M861 0C861 175.333 861 350.667 861 526', 'M737 0L737 610', 'M613 0L613 610',
  'M489 0L489 526', 'M365 0C365 148.337 365 296.673 365 445', 'M243 0L243 362',
  'M121 0L121 268', 'M1.25 0V159', 'M1349.25 0V159',
]

const VB_W = 1350
const VB_H = 610

function GridReveal({
  reach = 520,   // spotlight radius (viewBox units) where fill reaches zero
  core = 140,    // inner radius held at full fill
  idle = true,   // ambient drift when the pointer is away
  idleLevel = 0.45, // max fill during idle drift
  asBackground = false, // render as an absolutely-positioned backdrop layer (e.g. footer bg)
  pointerTargetRef = null, // element whose pointer moves drive the spotlight (defaults to the svg host)
}) {
  const svgRef = useRef(null)
  const cellRefs = useRef([])
  const centersRef = useRef([])
  const pointerRef = useRef({ x: null, y: null, active: false })
  const rafRef = useRef(0)

  useEffect(() => {
    const svg = svgRef.current
    const cells = cellRefs.current.filter(Boolean)
    if (!svg || !cells.length) return

    // cell centroids in viewBox space (bbox centre is plenty for hit-testing)
    centersRef.current = cells.map((el) => {
      const b = el.getBBox()
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
    })
    const centers = centersRef.current

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // one settled frame: soft fill fanning down from the top of the dome
      cells.forEach((el, i) => {
        el.style.transition = 'none'
        el.style.opacity = (0.5 - centers[i].y / VB_H * 0.4).toFixed(3)
      })
      return
    }

    // map client coords → viewBox user space via the SVG's own screen matrix,
    // so the hit-test stays correct under any preserveAspectRatio (the footer
    // backdrop uses `slice`, which scales + crops — a naive linear map is wrong)
    const toViewBox = (clientX, clientY) => {
      const ctm = svg.getScreenCTM()
      if (!ctm) return { x: 0, y: 0 }
      const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
      return { x: p.x, y: p.y }
    }

    const span = reach - core
    let t = 0

    const render = () => {
      const p = pointerRef.current
      let px, py, intensity
      if (p.active && p.x != null) {
        px = p.x; py = p.y; intensity = 1
      } else if (idle) {
        // slow Lissajous sweep across the grid so it breathes when untouched
        t += 0.0055
        px = VB_W / 2 + Math.cos(t) * 540
        py = 250 + Math.sin(t * 0.9) * 170
        intensity = idleLevel
      } else {
        for (let i = 0; i < cells.length; i++) cells[i].style.opacity = '0'
        rafRef.current = requestAnimationFrame(render)
        return
      }

      for (let i = 0; i < centers.length; i++) {
        const dx = centers[i].x - px
        const dy = centers[i].y - py
        const d = Math.sqrt(dx * dx + dy * dy)
        let o = d <= core ? 1 : d >= reach ? 0 : 1 - (d - core) / span
        o = o * o * (3 - 2 * o) // smoothstep
        cells[i].style.opacity = (o * intensity).toFixed(3)
      }
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    const onMove = (e) => {
      const v = toViewBox(e.clientX, e.clientY)
      pointerRef.current = { x: v.x, y: v.y, active: true }
    }
    const onLeave = () => { pointerRef.current.active = false }
    const onVisibility = () => {
      cancelAnimationFrame(rafRef.current)
      if (!document.hidden) rafRef.current = requestAnimationFrame(render)
    }

    const host = pointerTargetRef?.current || svg.parentElement
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reach, core, idle, idleLevel, pointerTargetRef])

  // shared inner grid — used both by the standalone section and the footer backdrop
  const svg = (
    <svg
      ref={svgRef}
      className="gridreveal__svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      preserveAspectRatio={asBackground ? 'xMidYMax slice' : 'xMidYMid meet'}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gr-fill" x1="675" y1="0" x2="675" y2="527" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6B84E8" />
          <stop offset="1" stopColor="#2438A8" />
        </linearGradient>
      </defs>
      <g className="gridreveal__lines">
        {LINES.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g className="gridreveal__cells">
        {CELLS.map((d, i) => (
          <path key={i} ref={(el) => { cellRefs.current[i] = el }} d={d} fill="url(#gr-fill)" />
        ))}
      </g>
    </svg>
  )

  // backdrop mode: no <section> chrome — an absolute layer that fills its host
  if (asBackground) {
    return (
      <div className="gridreveal--bg" aria-hidden="true">
        {svg}
      </div>
    )
  }

  return (
    <section className="gridreveal">
      <div className="gridreveal__stage">{svg}</div>
    </section>
  )
}

export default GridReveal
