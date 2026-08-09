import { useEffect, useRef } from 'react'

// The dithered-halftone canvas engine, extracted so it can render both the
// standalone "SF Mosaic" section and the hero background. A photo is sampled
// into a grid of wide cells, ordered-dithered (Bayer 8×8) against luminance,
// then painted in a single blue ink. Two modes tune the look:
//
//   'halftone' (default) — sparse: dots turn on only where the image is dark,
//     small fixed-size dots, generous whitespace. A quiet background texture.
//   'mosaic' — image-forward: a near-full replica (very low dither threshold)
//     sampled from a PANORAMA composite (the bridge's towers repeated on the
//     left so several connectors span the width). Dot size grows with darkness
//     — tiny in highlights, cells nearly filled in shadows. Single ink, no
//     colour ramp, no idle twinkle. Matches design_handoff_mosaic_hero.
//
// Both modes reveal left-to-right on load, honour an optional blank centre
// corridor (clearBand) so overlaid copy stays legible, and fade out in a soft
// lens around the cursor. Falls back to a static render for reduced motion.
const IMG_SRC = '/assets/img/sf-mosaic.webp'
const INK = '#5778da'

// Bayer 8×8 ordered-dither threshold matrix
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
]

// Blank a soft-edged corridor down the centre so overlaid copy reads as open sky.
// Returns false when a cell should be dropped for the corridor.
function corridorOn(clearBand, cx, w) {
  if (!clearBand) return true
  const dist = Math.abs(cx - w / 2) / w // 0 (centre) .. 0.5 (edge)
  const inner = clearBand.halfWidthFrac
  const outer = inner + clearBand.featherFrac
  if (dist < inner) return false
  if (dist < outer && Math.random() > (dist - inner) / (outer - inner)) return false
  return true
}

function MosaicCanvas({
  mode = 'halftone',    // 'halftone' (sparse single-ink) | 'mosaic' (dense replica)
  cover = false,        // fill the stage's full height, cover-cropping the source
  tileSize = 9,
  shape = 'rounded',
  bars = false,         // vertical-bar treatment: narrow full-height marks stack into continuous strips
  hoverLens = true,
  density = 1,          // >1 turns more dots on (denser skyline) — halftone only
  dotScale = 1,         // >1 paints bigger dots (more solid read) — halftone only
  clearBand = null,     // { halfWidthFrac, featherFrac } — blank vertical corridor down the centre
  stageClassName = 'sf-mosaic__stage',
  ariaLabel = 'A San Francisco skyline rendered as an animated blue halftone.',
}) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const stage = stageRef.current
    if (!cv || !stage) return

    const isMosaic = mode === 'mosaic'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: -9999, y: -9999 }
    let cells = []
    let cols = 0, rows = 0
    let dpr = 1, w = 0, h = 0, tw = 0, th = 0
    let startT = 0
    let raf = 0
    let img = null
    let imgLoaded = false
    let visible = true // gated by IntersectionObserver so the rAF loop idles off-screen
    let killed = false // set on cleanup — a late img.onload must not revive the loop

    const startLoop = () => {
      if (reduce || killed || !visible || !imgLoaded) return
      cancelAnimationFrame(raf)
      const loop = (now) => { draw(now); if (visible && !killed) raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    const stopLoop = () => cancelAnimationFrame(raf)

    // Build a panorama by repeating two tower slices on the left, so several
    // bridge connectors span the width (mosaic mode only).
    const panorama = (im) => {
      const s1 = { sx: im.width * 0.03, sw: im.width * 0.24 }
      const s2 = { sx: im.width * 0.10, sw: im.width * 0.26 }
      const totalW = Math.round(s1.sw + s2.sw + im.width)
      const pc = document.createElement('canvas')
      pc.width = totalW
      pc.height = im.height
      const pctx = pc.getContext('2d')
      pctx.drawImage(im, s1.sx, 0, s1.sw, im.height, 0, 0, s1.sw, im.height)
      pctx.drawImage(im, s2.sx, 0, s2.sw, im.height, s1.sw, 0, s2.sw, im.height)
      pctx.drawImage(im, 0, 0, im.width, im.height, s1.sw + s2.sw, 0, im.width, im.height)
      return pc
    }

    const build = () => {
      if (!imgLoaded) return
      const src = isMosaic ? panorama(img) : img

      const cs = getComputedStyle(stage)
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const cssW = stage.clientWidth - padX // content-box width
      w = Math.max(cssW, 320)
      const aspect = src.height / src.width

      // Source crop rect. Default: full image, canvas height follows aspect.
      // cover: canvas fills the stage's height and the source is cover-cropped
      // (like background-size: cover) — sides trimmed when the source is wider,
      // top trimmed (skyline anchored to the bottom) when it's taller.
      let sx = 0, sy = 0, sW = src.width, sH = src.height
      if (cover) {
        h = Math.max(Math.round(stage.clientHeight), 240)
        const targetA = w / h
        const srcA = src.width / src.height
        if (srcA > targetA) {
          sW = src.height * targetA
          sx = (src.width - sW) / 2
        } else {
          sH = src.width / targetA
          sy = src.height - sH
        }
      } else {
        h = Math.round(w * aspect)
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.height = h + 'px'

      const t = tileSize
      tw = t * 1.8 // rectangular cells (wide)
      th = t
      cols = Math.floor(w / tw)
      rows = Math.floor(h / th)

      // sample the source at grid resolution
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(src, sx, sy, sW, sH, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data

      cells = new Array(cols * rows)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
          const cx = c * tw + tw / 2

          // darkness with a contrast boost so the bridge reads at rest.
          // bars lean on darkness to gate bar length, so give them extra contrast.
          const gamma = bars ? 0.9 : isMosaic ? 0.75 : 0.65
          const boost = bars ? 1.35 : isMosaic ? 1.15 : 1.3
          const d = Math.min(1, Math.pow(1 - lum, gamma) * boost * density)
          const thr = (BAYER[(r % 8) * 8 + (c % 8)] + 0.5) / 64
          // bars: standard dither so bright areas drop cells (short/sparse bars)
          // and dark areas stay solid (full-height strips) — the image reads by
          // bar length. mosaic: near-full replica (only brightest cells drop out).
          const gate = bars ? thr : isMosaic ? thr * 0.22 : thr
          const on = d > gate && corridorOn(clearBand, cx, w)

          cells[r * cols + c] = {
            on,
            d,                                             // darkness → dot size (mosaic)
            delay: (c / cols) * 0.9 + Math.random() * 0.8, // left-to-right reveal
            rnd: Math.random(),                            // hover fade threshold
            a: 1,                                          // smoothed alpha
          }
        }
      }

      startT = performance.now()
      cancelAnimationFrame(raf)
      if (reduce) {
        drawStatic()
      } else {
        startLoop()
      }
    }

    const paintCell = (ctx, cx, cy, sw, sh, rad) => {
      const x = cx - sw / 2, y = cy - sh / 2
      if (shape === 'circle') {
        ctx.beginPath()
        ctx.ellipse(cx, cy, sw / 2, sh / 2, 0, 0, 6.2832)
        ctx.fill()
      } else if (shape === 'square') {
        ctx.fillRect(x, y, sw, sh)
      } else {
        ctx.beginPath()
        ctx.roundRect(x, y, sw, sh, rad)
        ctx.fill()
      }
    }

    // dot dimensions for a cell of darkness d (before per-frame reveal scale)
    // bars: width tracks darkness (thin cables → wide towers), height slightly
    // overfills the row so vertically-adjacent on-cells merge into one strip.
    const dotSize = (d) => (
      bars
        ? { sw: tw * (0.18 + 0.32 * d), sh: th * 1.06 }
        : isMosaic
          ? { sw: tw * (0.14 + 0.72 * d), sh: th * (0.14 + 0.68 * d) }
          : { sw: tw * 0.52 * dotScale, sh: th * 0.46 * dotScale }
    )

    // corner radius for a painted mark — rounded bar ends vs. rounded dots
    const cellRadius = (sw, sh) => (
      bars
        ? Math.min(sw * 0.5, 2.5)
        : Math.min(sh * (isMosaic ? 0.4 : 0.28), isMosaic ? 4 : 5)
    )

    // static, full-reveal render for reduced-motion visitors
    const drawStatic = () => {
      const ctx = cv.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = INK
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[r * cols + c]
          if (!cell.on) continue
          const cx = c * tw + tw / 2, cy = r * th + th / 2
          const { sw, sh } = dotSize(cell.d)
          if (sw <= 0.2) continue
          ctx.globalAlpha = 1
          paintCell(ctx, cx, cy, sw, sh, cellRadius(sw, sh))
        }
      }
      ctx.globalAlpha = 1
    }

    const draw = (now) => {
      const ctx = cv.getContext('2d')
      const t = tileSize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const elapsed = (now - startT) / 1000
      const revealDur = 0.55
      const mx = mouse.x, my = mouse.y
      const R = t * 7
      ctx.fillStyle = INK
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[r * cols + c]
          if (!cell.on) continue
          let p = (elapsed - cell.delay) / revealDur
          if (p <= 0) continue
          if (p > 1) p = 1
          // ease-out-back for a small pop
          const e = p === 1 ? 1 : 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2)
          const cx = c * tw + tw / 2, cy = r * th + th / 2
          const scale = e
          let alpha = Math.min(p * 1.6, 1)
          if (p === 1) {
            let target = 1
            // hover: cells near the cursor randomly fade (odds rise toward centre)
            if (hoverLens) {
              // distance to the nearest point on the cell's horizontal bar
              const x0 = c * tw
              const nx = Math.max(x0, Math.min(mx, x0 + tw))
              const dx = nx - mx, dy = cy - my
              const d = Math.sqrt(dx * dx + dy * dy)
              if (d < R) {
                const f = 1 - d / R
                const ease = f * f * (3 - 2 * f)
                if (cell.rnd < ease * 0.9) target = 0
              }
            }
            cell.a += (target - cell.a) * 0.14 // smooth fade in/out
            alpha = cell.a
            if (alpha < 0.02) continue
          }
          const base = dotSize(cell.d)
          const sw = base.sw * scale, sh = base.sh * scale
          if (sw <= 0.2) continue
          ctx.globalAlpha = alpha
          paintCell(ctx, cx, cy, sw, sh, cellRadius(sw, sh))
        }
      }
      ctx.globalAlpha = 1
    }

    const onMove = (ev) => {
      const rect = cv.getBoundingClientRect()
      mouse.x = ev.clientX - rect.left
      mouse.y = ev.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onResize = () => build()

    img = new Image()
    img.onload = () => { if (killed) return; imgLoaded = true; build() }
    img.src = IMG_SRC

    cv.addEventListener('mousemove', onMove)
    cv.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    // Only paint while the canvas is on (or near) screen — a scrolled-past hero
    // must not keep the rAF loop running and contending with page scroll.
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting
            if (visible) startLoop()
            else stopLoop()
          },
          { rootMargin: '160px' }
        )
      : null
    io?.observe(stage)

    return () => {
      killed = true
      if (img) img.onload = null
      cancelAnimationFrame(raf)
      io?.disconnect()
      cv.removeEventListener('mousemove', onMove)
      cv.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [mode, cover, tileSize, shape, bars, hoverLens, density, dotScale, clearBand])

  return (
    <div className={stageClassName} ref={stageRef}>
      <canvas
        ref={canvasRef}
        className="sf-mosaic__canvas"
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  )
}

export default MosaicCanvas
