import { useEffect, useRef } from 'react'

// Full-colour pixelation of the whole Bay Bridge sunset photo — sky, bridge,
// skyline, and water — over a plain white background. The photo is only ever
// sampled for tile colours; before the reveal the hero is simply white paper.
//
// On scroll into view the mosaic assembles piece-by-piece: individual tiles drop
// and pop into their slots on scattered, staggered beats — like Lego bricks
// snapping into place — until the full image has settled edge-to-edge (tiles
// flush, no gaps). Reduced motion → the finished mosaic, painted once.
const SRC = '/assets/img/bay-bridge.png'

// fraction of the whole timeline a single tile takes to drop + settle
const REVEAL_WINDOW = 0.16
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
  tile = 15,          // approximate pixel size of one chunky tile (css px)
  duration = 3800,    // full assemble time (ms) — last brick lands here
  delay = 250,        // hold on white after scroll-in before bricks start (ms)
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
    let colors = null            // Uint8 rgb per cell, sampled from the photo
    let thresh = null            // per-cell start point (0→1) on the timeline
    let raf = 0, t0 = null, running = false, pausedAt = null
    let visible = false, done = false

    // downsample the cover-cropped photo to the coarse grid and cache each
    // cell's colour
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

      if (!imgReady) { colors = null; return }

      // object-fit: cover the stage with the source (used only to sample tile
      // colours — the photo itself is never drawn, the background stays white)
      const iw = img.naturalWidth, ih = img.naturalHeight
      const targetA = cols / rows, srcA = iw / ih
      let sx = 0, sy = 0, sW = iw, sH = ih
      if (srcA > targetA) { sW = ih * targetA; sx = (iw - sW) / 2 }
      else { sH = iw / targetA; sy = (ih - sH) / 2 }

      const small = document.createElement('canvas')
      small.width = cols; small.height = rows
      const sc = small.getContext('2d', { willReadFrequently: true })
      sc.imageSmoothingEnabled = true
      sc.drawImage(img, sx, sy, sW, sH, 0, 0, cols, rows)
      const data = sc.getImageData(0, 0, cols, rows).data

      colors = new Uint8Array(cols * rows * 3)
      thresh = new Float32Array(cols * rows)
      const span = 1 - REVEAL_WINDOW   // keep the last brick's window in range
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          colors[k * 3] = data[k * 4]
          colors[k * 3 + 1] = data[k * 4 + 1]
          colors[k * 3 + 2] = data[k * 4 + 2]
          // build bottom-to-top: a tile's start point is driven mainly by its
          // row (bottom rows first, top rows last), with just a little jitter so
          // bricks within a band still land one-by-one rather than in a rigid line
          const rowBias = 1 - j / (rows - 1 || 1)      // 0 at bottom row → 1 at top
          thresh[k] = Math.min(span, Math.max(0, (0.85 * rowBias + 0.15 * seed(i, j)) * span))
        }
      }
    }

    const draw = (p) => {
      // white paper base
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!colors) return

      // assemble the mosaic brick-by-brick: each tile fades, drops in from just
      // above, and pops into its slot with a small overshoot on its own beat.
      // Settled tiles sit flush (a hair of bleed kills seams) so the finished
      // image fills the hero edge-to-edge.
      const bleed = 0.75
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          const t = reduce ? 1 : Math.min(1, Math.max(0, (p - thresh[k]) / REVEAL_WINDOW))
          if (t <= 0) continue

          const a = 1 - (1 - t) * (1 - t)              // ease-out alpha
          const u = t - 1
          const back = 1 + BACK_C3 * u * u * u + BACK_C1 * u * u   // pop w/ overshoot
          const sc = 0.24 + 0.76 * back                // grow small → settle at 1
          const drop = (1 - t) * cell * 0.9            // fall into place from above

          const w = cell * sc + bleed, h = cell * sc + bleed
          const x = ox + i * cell + (cell - w) / 2
          const y = oy + j * cell + (cell - h) / 2 - drop

          ctx.globalAlpha = a
          ctx.fillStyle = `rgb(${colors[k * 3]},${colors[k * 3 + 1]},${colors[k * 3 + 2]})`
          ctx.fillRect(x, y, w, h)
        }
      }
      ctx.globalAlpha = 1

      // top fade → dissolve the sky into the page paper so the heading reads
      const fadeH = vh * 0.5
      const grad = ctx.createLinearGradient(0, 0, 0, fadeH)
      grad.addColorStop(0, `rgb(${bgR},${bgG},${bgB})`)
      grad.addColorStop(0.55, `rgba(${bgR},${bgG},${bgB},0.5)`)
      grad.addColorStop(1, `rgba(${bgR},${bgG},${bgB},0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, vw, fadeH)
    }

    // progress 0→1, but the first `delay` ms after scroll-in stay on white
    const prog = (now) => Math.min(1, Math.max(0, (now - t0 - delay) / duration))

    const redraw = () => {
      const p = reduce || done ? 1 : (t0 == null ? 0 : prog(performance.now()))
      draw(p)
    }

    const frame = (now) => {
      if (!running) return
      if (t0 == null) t0 = now
      const p = prog(now)
      draw(p)
      if (p >= 1) { running = false; done = true; doneCbRef.current?.(); return }
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
    draw(reduce ? 1 : 0)
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
  }, [tile, duration, delay])

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
