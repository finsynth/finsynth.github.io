import { useEffect, useRef } from 'react'

// Full-colour tile mosaic, adapted from the "Golden Gate — Mosaic" demo. The
// source photo is downsampled to one colour per tile and painted as a grid of
// rounded tiles. The tiles rest in the lit state the pointer ripple used to
// reveal on hover — grown and lightened — with no cursor interaction. On top
// of that resting look, an ambient shimmer plays autonomously (Antimetal-hero
// style): tiles first assemble left-to-right on a staggered ease-out-back pop
// (the mosaic hero's reveal), then slow cluster waves and a per-tile twinkle
// roll through the tiles
// forever. Fills the stage's full height, cover-cropping the source, and
// honours an optional blank centre corridor so overlaid copy stays legible.
// Static lit grid for reduced-motion visitors.
const IMG_SRC = '/assets/img/sf-mosaic.png'

// fully-applied "hover" state, baked in as the peak of the resting look
const LIT_GROW = 0.42  // extra scale at full intensity
const LIT_LIFT = 46    // rgb add per channel at full intensity
const LIT_FLOOR = 0.5  // minimum intensity — the field never drops below this
const REVEAL_DUR = 550   // per-tile pop duration (ms)
const REVEAL_TOTAL = 2300 // sweep (900) + scatter (800) + pop (550)

function TileMosaicCanvas({
  tileSize = 15,
  gap = 2,
  reach = 420,          // retained for prop compatibility (no longer used)
  centerWash = false,   // permanently lighten tiles behind the centre text area
  clearBand = null,     // { halfWidthFrac, featherFrac } — blank vertical corridor down the centre
  hoverReveal = false,  // grayscale at rest; cursor reveals true colour in a scattered blob
  revealRadius = 250,   // hoverReveal: lens radius (px)
  paused = false,       // freeze the shimmer on its current frame
  stageClassName = 'sf-mosaic__stage',
  ariaLabel = 'A San Francisco skyline rendered as a tile mosaic.',
}) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const controlsRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const stage = stageRef.current
    if (!cv || !stage) return

    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cw = 0, ch = 0
    let cols = 0, rows = 0, tiles = []
    let img = null
    let imgLoaded = false
    let raf = 0
    let running = false
    let visible = false
    let born = 0 // timestamp of first paint — anchors the intro bloom
    // hoverReveal cursor, in canvas coordinates (tracked on window because the
    // canvas itself is pointer-events:none under the hero copy)
    const mouse = { x: -1e5, y: -1e5 }

    const roundRect = (c2d, x, y, w, h, r) => {
      c2d.beginPath()
      c2d.roundRect(x, y, w, h, r)
      c2d.closePath()
    }

    // Paint every tile at a fixed intensity (1 = fully lit). Used for the
    // reduced-motion static frame and as the pre-image fallback.
    const paintStatic = () => {
      const stepX = cw / cols, stepY = ch / rows
      const tw = stepX - gap, th = stepY - gap
      const rad = Math.min(3, tw * 0.22)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      const w2 = tw * (1 + LIT_GROW), h2 = th * (1 + LIT_GROW)
      for (const t of tiles) {
        if (!t.on) continue
        const ox = t.x + gap / 2 - (w2 - tw) / 2
        const oy = t.y + gap / 2 - (h2 - th) / 2
        ctx.fillStyle = `rgb(${Math.min(255, t.r + LIT_LIFT) | 0},${Math.min(255, t.g + LIT_LIFT) | 0},${Math.min(255, t.b + LIT_LIFT) | 0})`
        roundRect(ctx, ox, oy, w2, h2, rad + 2)
        ctx.fill()
      }
    }

    // One animation frame: intro bloom ring, then rolling cluster waves with
    // a per-tile twinkle. Everything derives from `now` + per-tile phase, so
    // the motion is continuous and interruption-free.
    const frame = (now) => {
      if (!running) return
      const stepX = cw / cols, stepY = ch / rows
      const tw = stepX - gap, th = stepY - gap
      const rad = Math.min(3, tw * 0.22)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      const el = now - born
      const intro = el < REVEAL_TOTAL

      for (const t of tiles) {
        if (!t.on) continue

        // intro: left-to-right staggered reveal — each tile pops in with a
        // slight ease-out-back overshoot while its alpha ramps up
        let scaleE = 1, revealA = 1
        if (intro) {
          const q = (el - t.delay) / REVEAL_DUR
          if (q <= 0) continue
          if (q < 1) {
            const u = q - 1
            scaleE = 1 + 2.2 * u * u * u + 1.2 * u * u
            revealA = Math.min(q * 1.6, 1)
          }
        }

        // slow cluster waves drifting through the field
        const w1 = Math.sin(t.cx * 0.010 + now * 0.00040 + t.ph * 3.1)
        const w2 = Math.sin(t.cy * 0.012 - now * 0.00031 + t.ph * 1.7)
        let a = Math.max(0, w1 * w2)
        a = a * a * (3 - 2 * a) // smoothstep — soft cluster edges
        // twinkle: each tile breathes on its own phase inside a cluster
        a *= 0.62 + 0.38 * Math.sin(now * 0.0016 + t.ph * 43.7)

        const lit = LIT_FLOOR + (1 - LIT_FLOOR) * a

        const grow = (1 + LIT_GROW * lit) * scaleE
        const w3 = tw * grow, h3 = th * grow
        const ox = t.x + gap / 2 - (w3 - tw) / 2
        const oy = t.y + gap / 2 - (h3 - th) / 2
        let lift = LIT_LIFT * lit
        let cr = t.r, cg = t.g, cb = t.b
        if (hoverReveal) {
          // scattered colour lens: odds of revealing rise toward the cursor,
          // but each tile rolls its own threshold — so the blob's edge is
          // noisy (some tiles inside stay gray, strays outside light up).
          // The blend amount is smoothed per tile: fast in, slow out, which
          // leaves a colour trail behind a moving cursor.
          const dx = t.cx - mouse.x, dy = t.cy - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          let target = 0
          if (d < revealRadius) {
            const f = 1 - d / revealRadius
            const ease = f * f * (3 - 2 * f)
            if (t.rnd < ease * 1.25) target = 1
          }
          t.m += (target - t.m) * (target > t.m ? 0.28 : 0.05)
          const m = t.m
          // blend rest-gray → vivid pre-wash colour, and suppress the white
          // shimmer lift on revealed tiles so the colour reads saturated
          cr = t.gy + (t.vr - t.gy) * m
          cg = t.gy + (t.vg - t.gy) * m
          cb = t.gy + (t.vb - t.gy) * m
          lift *= 1 - 0.8 * m
        }
        ctx.globalAlpha = revealA
        ctx.fillStyle = `rgb(${Math.min(255, cr + lift) | 0},${Math.min(255, cg + lift) | 0},${Math.min(255, cb + lift) | 0})`
        roundRect(ctx, ox, oy, w3, h3, rad + 2 * lit)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reduce || !imgLoaded || !visible || pausedRef.current) return
      running = true
      if (!born) born = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    controlsRef.current = { start, stop }

    const build = () => {
      if (!imgLoaded) return
      cw = Math.max(stage.clientWidth, 320)
      ch = Math.max(stage.clientHeight, 240)
      cv.style.width = cw + 'px'
      cv.style.height = ch + 'px'
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.floor(cw * dpr)
      cv.height = Math.floor(ch * dpr)

      cols = Math.max(8, Math.floor(cw / tileSize))
      rows = Math.max(6, Math.floor(ch / tileSize))

      // cover-crop the source to the stage's aspect, skyline anchored bottom
      let sx = 0, sy = 0, sW = img.width, sH = img.height
      const targetA = cw / ch
      const srcA = img.width / img.height
      if (srcA > targetA) {
        sW = img.height * targetA
        sx = (img.width - sW) / 2
      } else {
        sH = img.width / targetA
        sy = img.height - sH
      }

      // sample: downscale the crop to exactly cols × rows
      const s = document.createElement('canvas')
      s.width = cols
      s.height = rows
      const sc = s.getContext('2d', { willReadFrequently: true })
      sc.drawImage(img, sx, sy, sW, sH, 0, 0, cols, rows)
      const data = sc.getImageData(0, 0, cols, rows).data

      const stepX = cw / cols, stepY = ch / rows
      tiles = new Array(cols * rows)
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4
          const x = i * stepX, y = j * stepY
          let r = data[k], g = data[k + 1], b = data[k + 2]
          // keep the raw sampled colour before the centre wash mutes it — the
          // hover reveal shows THIS, saturation-boosted, so colour punches
          // through even inside the washed text corridor
          const lum0 = 0.2126 * r + 0.7152 * g + 0.0722 * b
          const SAT = 1.45
          const vr = Math.max(0, Math.min(255, lum0 + (r - lum0) * SAT))
          const vg = Math.max(0, Math.min(255, lum0 + (g - lum0) * SAT))
          const vb = Math.max(0, Math.min(255, lum0 + (b - lum0) * SAT))

          // Resting wash behind the centre text area: a feathered ellipse
          // blending tile colours toward the page background.
          if (centerWash) {
            const nx = (x + stepX / 2 - cw / 2) / (cw * 0.32)
            const ny = (y + stepY / 2 - ch * 0.46) / (ch * 0.52)
            const d0 = Math.hypot(nx, ny)
            if (d0 < 1) {
              const n = 1 - d0
              const wash = n * n * (3 - 2 * n) * 0.85 // smoothstep, capped
              r = r + (251 - r) * wash
              g = g + (252 - g) * wash
              b = b + (254 - b) * wash
            }
          }

          // blank the soft-edged centre corridor so the copy reads clean
          let on = true
          if (clearBand) {
            const dist = Math.abs(x + stepX / 2 - cw / 2) / cw
            const inner = clearBand.halfWidthFrac
            const outer = inner + clearBand.featherFrac
            if (dist < inner) on = false
            else if (dist < outer && Math.random() > (dist - inner) / (outer - inner)) on = false
          }

          const cx = x + stepX / 2, cy = y + stepY / 2
          // deterministic per-tile phase — keeps the twinkle stable across rebuilds
          const ph = (Math.sin(i * 127.1 + j * 311.7) * 43758.5453) % 1

          // second deterministic hash, uncorrelated with the twinkle phase,
          // for the hover-reveal scatter threshold
          const rnd = Math.abs((Math.sin(i * 269.5 + j * 183.3) * 24634.6345) % 1)

          tiles[j * cols + i] = {
            x, y, cx, cy,
            // left-to-right sweep + per-tile scatter (matches the mosaic hero)
            delay: (i / cols) * 900 + Math.abs(ph) * 800,
            ph: Math.abs(ph),
            r: r | 0, g: g | 0, b: b | 0,
            // vivid reveal colour (pre-wash, saturation-boosted)
            vr: vr | 0, vg: vg | 0, vb: vb | 0,
            // rest-state gray (luminance of the washed tile colour)
            gy: (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0,
            rnd,
            m: 0, // smoothed colour-reveal amount
            on,
          }
        }
      }

      // reduced motion gets the settled lit grid; otherwise leave the canvas
      // clear so the reveal starts from nothing (no full-grid flash)
      if (reduce) paintStatic()
      else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, cw, ch)
      }
    }

    const onResize = () => build()

    // hoverReveal: track the pointer on the window (the canvas can't receive
    // events itself) and convert to canvas space each move; park the lens
    // far off-canvas when the pointer leaves the viewport.
    const onMove = (ev) => {
      const rect = cv.getBoundingClientRect()
      mouse.x = ev.clientX - rect.left
      mouse.y = ev.clientY - rect.top
    }
    const onOut = () => { mouse.x = -1e5; mouse.y = -1e5 }
    if (hoverReveal && !reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onOut)
      document.addEventListener('mouseleave', onOut)
    }

    // run the loop only while the canvas is actually on screen
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; visible ? start() : stop() },
      { threshold: 0.05 }
    )

    img = new Image()
    img.onload = () => {
      imgLoaded = true
      born = performance.now() // reveal clock starts at load (like the mosaic hero)
      build()
      io.observe(stage)
    }
    img.src = IMG_SRC

    window.addEventListener('resize', onResize)

    return () => {
      // drop the load callback so a disposed instance (StrictMode double-mount)
      // can't re-observe and start a ghost draw loop after cleanup
      if (img) img.onload = null
      stop()
      controlsRef.current = null
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onOut)
      document.removeEventListener('mouseleave', onOut)
    }
  }, [tileSize, gap, reach, centerWash, clearBand, hoverReveal, revealRadius])

  // pause/resume without rebuilding the mosaic — the canvas simply holds its
  // last painted frame while the loop is stopped
  useEffect(() => {
    pausedRef.current = paused
    const c = controlsRef.current
    if (!c) return
    if (paused) c.stop()
    else c.start()
  }, [paused])

  return (
    <div className={stageClassName} ref={stageRef}>
      {/* no pointer interaction — the shimmer plays on its own */}
      <canvas
        ref={canvasRef}
        className="sf-mosaic__canvas"
        style={{ cursor: 'default', pointerEvents: 'none' }}
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  )
}

export default TileMosaicCanvas
