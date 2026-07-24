import { useEffect, useRef } from 'react'

// Dot-matrix San Francisco bridge (Antimetal-style hero backdrop). The bridge
// photo is sampled on a coarse grid and re-drawn as a field of glowing dots:
// each dot keeps its sampled colour, and its size/brightness follow the
// pixel's luminance, so the towers, cables, and city lights come out bright
// while the water fades to a faint haze. Cover-crops the source to the stage
// (bottom-anchored so the skyline stays put). Intro: the mosaic hero's
// left-to-right staggered reveal — each cell pops in (ease-out-back) on a
// column-swept + randomised delay. A gentle per-dot twinkle keeps the
// field alive. No WebGL / deps. Static frame for reduced-motion visitors.
const IMG_SRC = '/assets/img/bay-bridge.png'

function DotBridgeCanvas({
  stageClassName = 'dot-globe__stage',
  ariaLabel = '',
  step = 10,          // px between dot centres (before density clamp)
  intro = 1.7,        // intro assemble duration (s)
  paused = false,     // freeze the field on its current frame
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
    const mouse = { x: -9999, y: -9999 }

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cw = 0, ch = 0
    let dots = []
    let raf = 0
    let t0 = null
    let running = false
    let pausedAt = null
    let img = null
    let imgLoaded = false
    let base = null // low-res sampled photo, drawn under the dots so the
                    // gaps between cells carry the scene's own colours
                    // (sky blue, bridge brown, building tones) — never white

    const build = () => {
      if (!imgLoaded) return
      cw = Math.max(stage.clientWidth, 320)
      ch = Math.max(stage.clientHeight, 240)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.style.width = cw + 'px'
      cv.style.height = ch + 'px'
      cv.width = Math.floor(cw * dpr)
      cv.height = Math.floor(ch * dpr)

      // keep the dot count bounded on very wide screens
      const cols = Math.min(190, Math.max(60, Math.floor(cw / step)))
      const rows = Math.max(30, Math.floor(cols * (ch / cw)))

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

      const s = document.createElement('canvas')
      s.width = cols
      s.height = rows
      const sc = s.getContext('2d', { willReadFrequently: true })
      sc.drawImage(img, sx, sy, sW, sH, 0, 0, cols, rows)
      const data = sc.getImageData(0, 0, cols, rows).data
      // soften the sampled frame a touch so the dot grid still reads as
      // texture on top of it, then keep it as the gap-filling underlay
      sc.fillStyle = 'rgba(255,255,255,0.22)'
      sc.fillRect(0, 0, cols, rows)
      base = s

      const stepX = cw / cols, stepY = ch / rows
      dots = []
      // Paint each cell in its TRUE sampled colour (like the tile-mosaic hero),
      // lifted toward light so the field reads as a bright daylight mosaic —
      // the real teals, sunset orange and warm city lights of the photo — rather
      // than dark embers glowing on a night ground. LIFT mirrors the mosaic's
      // resting lit state — kept small so the photo's saturation holds.
      const LIFT = 10
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4
          const lum = (0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255
          // keep every cell — skipping darks left pale holes in the mosaic
          const x = i * stepX + stepX / 2
          const y = j * stepY + stepY / 2
          // deterministic per-dot phase for stagger + twinkle
          const seed = Math.abs((Math.sin(i * 127.1 + j * 311.7) * 43758.5453) % 1)
          const rr = Math.min(255, data[k] + LIFT)
          const gg = Math.min(255, data[k + 1] + LIFT)
          const bb = Math.min(255, data[k + 2] + LIFT)
          dots.push({
            x, y,
            r: rr, g: gg, b: bb,
            lum,
            // rounded-rect cell dims — near-touching tiles so the photo's
            // colour reads solid (small dots on the light wash washed it out)
            sw: stepX * (0.78 + 0.2 * lum),
            sh: stepY * (0.74 + 0.22 * lum),
            seed,
            // left-to-right sweep + per-cell scatter (matches the mosaic hero)
            delay: (x / cw) * 0.9 + seed * 0.8,
            rnd: Math.random(), // fixed hover-fade threshold — same dots always vanish
            a: 1,               // smoothed hover alpha
          })
        }
      }
    }

    const draw = (elapsed) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      // underlay: the blurred sampled photo fills the gaps between cells with
      // each region's own colour — no white grid lines. Fades in with the intro.
      if (base) {
        ctx.imageSmoothingEnabled = true
        ctx.globalAlpha = reduce ? 1 : Math.min(elapsed / (intro * 0.7), 1)
        ctx.drawImage(base, 0, 0, cw, ch)
        ctx.globalAlpha = 1
      }
      // normal compositing on the light wash — true photo colours, no glow

      const R = step * 12 // hover influence radius
      const mx = mouse.x, my = mouse.y

      const revealDur = 0.55

      for (let k = 0; k < dots.length; k++) {
        const dt = dots[k]
        // fully solid tiles — any translucency lets the pale wash bleed
        // through and desaturates the photo colours
        let alpha = 1
        let scale = 1

        // intro: left-to-right staggered reveal — each cell pops in with a
        // slight ease-out-back overshoot while its alpha ramps up
        if (!reduce) {
          const q = (elapsed - dt.delay) / revealDur
          if (q <= 0) continue
          if (q < 1) {
            const u = q - 1
            scale = 1 + 2.2 * u * u * u + 1.2 * u * u
            alpha *= Math.min(q * 1.6, 1)
          }
        }

        // hover: random dots near the cursor fade out — odds rise toward the
        // centre (max 90%). rnd is fixed per dot, so the same dots always
        // vanish at a given cursor spot (erased pixels, not a uniform dome).
        if (!reduce) {
          let target = 1
          const dm = Math.hypot(dt.x - mx, dt.y - my)
          if (dm < R) {
            const f = 1 - dm / R
            const ease = f * f * (3 - 2 * f)
            if (dt.rnd < ease * 1.25) target = 0 // full clear-out near the centre
          }
          dt.a += (target - dt.a) * 0.2
          if (dt.a < 0.02) continue
          alpha *= dt.a
        }
        // gentle twinkle for life — kept subtle so tiles stay solid-colour
        if (!reduce) alpha *= 0.94 + 0.06 * Math.sin(elapsed * 1.9 + dt.seed * 47)

        if (alpha < 0.015) continue
        const sw = dt.sw * scale, sh = dt.sh * scale
        ctx.fillStyle = `rgba(${dt.r},${dt.g},${dt.b},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.roundRect(dt.x - sw / 2, dt.y - sh / 2, sw, sh, Math.min(sh * 0.4, 3))
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (now) => {
      if (!running) return
      if (t0 == null) t0 = now
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(frame)
    }

    // pause/resume: shift the clock by the time spent frozen so the intro and
    // twinkle pick up exactly where they stopped instead of jumping ahead
    const start = () => {
      if (running || reduce || !imgLoaded || pausedRef.current) return
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

    const onResize = () => build()
    const onMove = (ev) => {
      const rect = cv.getBoundingClientRect()
      mouse.x = ev.clientX - rect.left
      mouse.y = ev.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    img = new Image()
    img.onload = () => {
      imgLoaded = true
      build()
      if (reduce || pausedRef.current) draw(intro + 6) // one settled static frame
      else start()
    }
    img.src = IMG_SRC

    cv.addEventListener('mousemove', onMove)
    cv.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      // drop the load callback so a disposed instance (StrictMode double-mount)
      // can't start a ghost draw loop after cleanup
      if (img) img.onload = null
      running = false
      cancelAnimationFrame(raf)
      controlsRef.current = null
      cv.removeEventListener('mousemove', onMove)
      cv.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [step, intro])

  // pause/resume without rebuilding — the canvas holds its last painted frame
  useEffect(() => {
    pausedRef.current = paused
    const c = controlsRef.current
    if (!c) return
    if (paused) c.stop()
    else c.start()
  }, [paused])

  return (
    <div className={stageClassName} ref={stageRef}>
      <canvas ref={canvasRef} className="dot-globe__canvas" role="img" aria-label={ariaLabel} />
    </div>
  )
}

export default DotBridgeCanvas
