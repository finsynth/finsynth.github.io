import { useEffect, useRef } from 'react'

// Black-and-white pixelation of the Wall Street photo — the NYSE facade, its
// flag, and the towers behind it — over a plain white background. Before the
// reveal the hero is simply white paper.
//
// On scroll into view the mosaic assembles piece-by-piece: individual tiles drop
// and pop into their slots on scattered, staggered beats — like Lego bricks
// snapping into place — until the full image has settled edge-to-edge (tiles
// flush, no gaps). Then it resolves: the blocky mosaic dissolves into the sharp
// greyscale photo, so the pixels are only ever the way in — what's left on
// screen is the real photograph. Reduced motion → the resolved photo, once.
//
// Whole sequence runs ~2.4s (delay + duration + HOLD_MS + RESOLVE_MS). The
// bricks are the slow part by design, but the payoff is the sharp photo, so the
// assemble is kept short enough to reach it before attention moves on.
const SRC = '/assets/img/wall-street.png'

// fraction of the assemble timeline a single tile takes to drop + settle
const REVEAL_WINDOW = 0.16
// after the last brick lands: beat of stillness, then the de-pixelate crossfade
const HOLD_MS = 180
const RESOLVE_MS = 650
// ease-out-back overshoot so each brick snaps in with a tiny bounce
const BACK_C1 = 1.70158
const BACK_C3 = BACK_C1 + 1
// deterministic per-cell hash → scattered landing order (no Math.random)
const seed = (i, j) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

const PixelBayBridge = ({
  stageClassName = 'hero-s2-mosaic',
  ariaLabel = '',
  tile = 10,          // approximate pixel size of one chunky tile (css px)
  // Horizontal anchor of the crop (0 = left edge of the photo, 1 = right).
  focusX = 0.5,
  // Vertical anchor (0 = top of the photo, 1 = bottom). Tuned so the columns and
  // the flag — the parts that actually read as Wall Street once pixelated — sit
  // in the lower, unfaded half of the hero rather than behind the top fade.
  focusY = 0.55,
  duration = 1500,    // full assemble time (ms) — last brick lands here
  delay = 100,        // hold on white after scroll-in before bricks start (ms)
  paused = false,     // freeze mid-reveal (ask popup open)
  onRevealDone,       // fired once when the mosaic has fully settled
}) => {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const controlsRef = useRef(null)
  const doneCbRef = useRef(onRevealDone)
  doneCbRef.current = onRevealDone

  useEffect(() => {
    const cv = canvasRef.current
    const stage = stageRef.current
    if (!cv || !stage) return

    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // page background, normalised to r/g/b for the base + top readability fade
    const bgVar = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff'
    ctx.fillStyle = bgVar
    const hex = ctx.fillStyle
    const bgR = parseInt(hex.slice(1, 3), 16), bgG = parseInt(hex.slice(3, 5), 16), bgB = parseInt(hex.slice(5, 7), 16)

    const img = new Image()
    let imgReady = false

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let vw = 0, vh = 0
    let cols = 0, rows = 0, cell = 0, ox = 0, oy = 0
    let grays = null             // one 0–255 luminance per cell, from the photo
    let thresh = null            // per-cell start point (0→1) on the timeline
    let sharp = null             // full-res greyscale photo the mosaic resolves into
    let raf = 0, t0 = null, running = false, pausedAt = null
    let visible = false, done = false

    // luminance-only sampling: the mosaic and the photo it resolves into are both
    // black and white, so the crossfade reads as focus, never as a colour shift
    const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0

    // downsample the cover-cropped photo to the coarse grid and cache each
    // cell's tone, and bake the full-res greyscale plate for the resolve
    const build = () => {
      vw = Math.max(stage.clientWidth, 320)
      vh = Math.max(stage.clientHeight, 240)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.style.width = vw + 'px'
      cv.style.height = vh + 'px'
      cv.width = Math.floor(vw * dpr)
      cv.height = Math.floor(vh * dpr)

      cell = tile
      cols = Math.max(1, Math.round(vw / cell))
      rows = Math.max(1, Math.round(vh / cell))
      cell = vw / cols            // exact fit across the width
      ox = 0
      oy = vh - rows * cell       // anchor the grid to the bottom
      if (oy > 0) oy = 0

      if (!imgReady) { grays = null; sharp = null; return }

      // Lay the source out on the coarse grid and read one tone per cell.
      // Laid out as object-fit: cover, so the mosaic reaches every edge of the
      // hero: the source is portrait and the hero is wide, so anything short of
      // cover leaves cells that sample as plain page paper down the sides.
      const iw = img.naturalWidth, ih = img.naturalHeight
      const fx = Math.min(1, Math.max(0, focusX))
      const fy = Math.min(1, Math.max(0, focusY))
      const scale = Math.max(cols / iw, rows / ih)
      const dw = iw * scale, dh = ih * scale
      const dx = (cols - dw) * fx
      const dy = (rows - dh) * fy

      const small = document.createElement('canvas')
      small.width = cols; small.height = rows
      const sc = small.getContext('2d', { willReadFrequently: true })
      sc.imageSmoothingEnabled = true
      sc.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      sc.fillRect(0, 0, cols, rows)
      sc.drawImage(img, dx, dy, dw, dh)
      const data = sc.getImageData(0, 0, cols, rows).data

      grays = new Uint8Array(cols * rows)
      thresh = new Float32Array(cols * rows)
      const span = 1 - REVEAL_WINDOW   // keep the last brick's window in range
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          grays[k] = lum(data[k * 4], data[k * 4 + 1], data[k * 4 + 2])
          // build bottom-to-top: a tile's start point is driven mainly by its
          // row (bottom rows first, top rows last), with just a little jitter so
          // bricks within a band still land one-by-one rather than in a rigid line
          const rowBias = 1 - j / (rows - 1 || 1)      // 0 at bottom row → 1 at top
          thresh[k] = Math.min(span, Math.max(0, (0.85 * rowBias + 0.15 * seed(i, j)) * span))
        }
      }

      // The plate the mosaic resolves into: the same cover crop, at full canvas
      // resolution, drained of colour. Baked once per layout so the crossfade
      // itself stays a cheap blit.
      sharp = document.createElement('canvas')
      sharp.width = cv.width
      sharp.height = cv.height
      const pc = sharp.getContext('2d', { willReadFrequently: true })
      pc.scale(dpr, dpr)
      pc.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      pc.fillRect(0, 0, vw, vh)
      const canFilter = typeof pc.filter === 'string'
      if (canFilter) pc.filter = 'grayscale(1)'
      pc.drawImage(img, ox + dx * cell, oy + dy * cell, dw * cell, dh * cell)
      if (canFilter) pc.filter = 'none'
      else {
        // older Safari: no context filter, so desaturate by hand
        pc.setTransform(1, 0, 0, 1, 0, 0)
        const plate = pc.getImageData(0, 0, sharp.width, sharp.height)
        const px = plate.data
        for (let n = 0; n < px.length; n += 4) {
          px[n] = px[n + 1] = px[n + 2] = lum(px[n], px[n + 1], px[n + 2])
        }
        pc.putImageData(plate, 0, 0)
      }
    }

    // pA: mosaic assembly 0→1. pR: de-pixelate crossfade 0→1 (mosaic → photo).
    const draw = (pA, pR) => {
      // white paper base
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!grays) return

      // assemble the mosaic brick-by-brick: each tile fades, drops in from just
      // above, and pops into its slot with a small overshoot on its own beat.
      // Settled tiles sit flush (a hair of bleed kills seams) so the finished
      // image fills the hero edge-to-edge. Skipped entirely once the photo has
      // fully taken over — the blocks are underneath it and no longer visible.
      const bleed = 0.75
      if (pR < 1) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const k = j * cols + i
            const t = Math.min(1, Math.max(0, (pA - thresh[k]) / REVEAL_WINDOW))
            if (t <= 0) continue

            const a = 1 - (1 - t) * (1 - t)              // ease-out alpha
            const u = t - 1
            const back = 1 + BACK_C3 * u * u * u + BACK_C1 * u * u   // pop w/ overshoot
            const sc = 0.24 + 0.76 * back                // grow small → settle at 1
            const drop = (1 - t) * cell * 0.9            // fall into place from above

            const w = cell * sc + bleed, h = cell * sc + bleed
            const x = ox + i * cell + (cell - w) / 2
            const y = oy + j * cell + (cell - h) / 2 - drop

            const g = grays[k]
            ctx.globalAlpha = a
            ctx.fillStyle = `rgb(${g},${g},${g})`
            ctx.fillRect(x, y, w, h)
          }
        }
      }

      // …then the blocks give way to the real photograph. Every tile is already
      // the average tone of the patch it covers, so the fade reads as the image
      // pulling into focus rather than as one picture swapping for another.
      if (pR > 0 && sharp) {
        ctx.globalAlpha = pR < 1 ? pR * pR * (3 - 2 * pR) : 1   // smoothstep
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.drawImage(sharp, 0, 0)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      ctx.globalAlpha = 1

      // Top scrim → just enough paper over the sky for the heading to read.
      // Deliberately shallow and never fully opaque: a taller or solid scrim
      // whitens the upper half and the photo stops reading as the hero's
      // background at all — it looks like a band pinned to the bottom.
      const fadeH = vh * 0.34
      const grad = ctx.createLinearGradient(0, 0, 0, fadeH)
      grad.addColorStop(0, `rgba(${bgR},${bgG},${bgB},0.62)`)
      grad.addColorStop(0.55, `rgba(${bgR},${bgG},${bgB},0.3)`)
      grad.addColorStop(1, `rgba(${bgR},${bgG},${bgB},0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, vw, fadeH)
    }

    // elapsed → [assemble, resolve] progress. The first `delay` ms after
    // scroll-in stay on white; the resolve starts a beat after the last brick.
    const prog = (now) => {
      const e = now - t0 - delay
      const pA = Math.min(1, Math.max(0, e / duration))
      const pR = Math.min(1, Math.max(0, (e - duration - HOLD_MS) / RESOLVE_MS))
      return [pA, pR]
    }

    const redraw = () => {
      if (reduce || done) { draw(1, 1); return }
      if (t0 == null) { draw(0, 0); return }
      const [pA, pR] = prog(performance.now())
      draw(pA, pR)
    }

    const frame = (now) => {
      if (!running) return
      if (t0 == null) t0 = now
      const [pA, pR] = prog(now)
      draw(pA, pR)
      if (pR >= 1) { running = false; done = true; doneCbRef.current?.(); return }
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reduce || done || !visible || pausedRef.current) return
      running = true
      if (pausedAt != null && t0 != null) t0 += performance.now() - pausedAt
      pausedAt = null
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (running) pausedAt = performance.now()
      running = false
      cancelAnimationFrame(raf)
    }
    controlsRef.current = { start, stop }

    build()
    draw(reduce ? 1 : 0, reduce ? 1 : 0)
    if (reduce) { done = true; doneCbRef.current?.() }

    img.onload = () => { imgReady = true; build(); redraw() }
    img.onerror = () => { imgReady = false }
    img.src = SRC

    const onResize = () => { build(); redraw() }
    window.addEventListener('resize', onResize)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else if (!done) stop()
    }, { threshold: 0.12 })
    io.observe(stage)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      controlsRef.current = null
      io.disconnect()
      window.removeEventListener('resize', onResize)
      img.onload = img.onerror = null
    }
  }, [tile, focusX, focusY, duration, delay])

  // freeze/resume without rebuilding
  useEffect(() => {
    pausedRef.current = paused
    const c = controlsRef.current
    if (!c) return
    if (paused) c.stop()
    else c.start()
  }, [paused])

  return (
    <div className={stageClassName} ref={stageRef} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-s2-pixel-canvas" role="img" aria-label={ariaLabel} />
    </div>
  )
}

export default PixelBayBridge
