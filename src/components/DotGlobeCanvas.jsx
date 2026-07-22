import { useEffect, useRef } from 'react'

// Dot-matrix globe (Antimetal-style hero backdrop). A point cloud is scattered
// evenly over a unit sphere (Fibonacci distribution); each point is tested
// against an equirectangular land mask so continents come out dense/bright and
// oceans stay a sparse faint haze. The whole thing spins slowly on a tilted
// axis, orthographically projected to 2D. Dots on the near hemisphere are
// larger/brighter than the far side, and 'lighter' compositing lets the dense
// centre bloom. Intro: every dot assembles inward from the sphere's rim on a
// staggered ease, so the ring collapses into the mapped globe. No WebGL / deps.
const MASK_SRC = '/assets/img/land-mask.png'

function DotGlobeCanvas({
  stageClassName = 'dot-globe__stage',
  ariaLabel = '',
  samples = 13000,     // fibonacci points before land filtering
  oceanKeep = 0.09,    // fraction of ocean points kept as faint filler
  tilt = -0.36,        // fixed view tilt (radians) — northern hemisphere up
  spinSpeed = 0.16,    // rotation, radians / second
  intro = 1.7,         // intro assemble duration (s)
}) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const stage = stageRef.current
    if (!cv || !stage) return

    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cw = 0, ch = 0, cx = 0, cy = 0, R = 0
    let raf = 0
    let points = []
    let mask = null, mw = 0, mh = 0
    let t0 = null

    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)

    const isLand = (lon, lat) => {
      const u = (lon + Math.PI) / (2 * Math.PI)
      const v = (Math.PI / 2 - lat) / Math.PI
      let px = (u * mw) | 0, py = (v * mh) | 0
      if (px < 0) px = 0; else if (px >= mw) px = mw - 1
      if (py < 0) py = 0; else if (py >= mh) py = mh - 1
      return mask[(py * mw + px) * 4] < 110 // land renders black in the mask
    }

    const buildPoints = () => {
      points = []
      const N = samples
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2
        const rad = Math.sqrt(Math.max(0, 1 - y * y))
        const theta = golden * i
        const x = Math.cos(theta) * rad
        const z = Math.sin(theta) * rad
        const lat = Math.asin(y)
        const lon = Math.atan2(z, x)
        const land = isLand(lon, lat)
        // keep every land point; thin the oceans down to a faint scatter
        if (!land && (i * 2654435761 % 1000) / 1000 > oceanKeep) continue
        points.push({ x, y, z, land, seed: (i % 97) / 97 })
      }
    }

    const size = () => {
      cw = Math.max(stage.clientWidth, 320)
      ch = Math.max(stage.clientHeight, 240)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.style.width = cw + 'px'
      cv.style.height = ch + 'px'
      cv.width = Math.floor(cw * dpr)
      cv.height = Math.floor(ch * dpr)
      cx = cw / 2
      cy = ch * 0.52
      R = Math.min(cw * 0.33, ch * 0.5)
    }

    const draw = (elapsed) => {
      const angle = spinSpeed * elapsed
      const cosA = Math.cos(angle), sinA = Math.sin(angle)
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt)
      const p = reduce ? 1 : Math.min(1, elapsed / intro)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      ctx.globalCompositeOperation = 'lighter'

      for (let k = 0; k < points.length; k++) {
        const pt = points[k]
        // spin about Y, then tilt about X
        const rx = pt.x * cosA + pt.z * sinA
        const rz = -pt.x * sinA + pt.z * cosA
        const ty = pt.y * cosT - rz * sinT
        const tz = pt.y * sinT + rz * cosT
        const tx = rx

        const front = (tz + 1) / 2 // 0 far … 1 near
        let sx = cx + tx * R
        let sy = cy - ty * R
        let alpha = pt.land ? 0.32 + 0.68 * front : (0.10 + 0.28 * front)
        let rr = pt.land ? 0.55 + front * 1.35 : 0.35 + front * 0.7

        // intro: assemble inward from the rim on a staggered ease
        if (p < 1) {
          const local = Math.max(0, Math.min(1, (p - pt.seed * 0.42) / 0.58))
          const e = easeOutCubic(local)
          const mag = Math.hypot(tx, ty) || 1e-4
          const rimx = cx + (tx / mag) * R * 1.05
          const rimy = cy - (ty / mag) * R * 1.05
          sx = rimx + (sx - rimx) * e
          sy = rimy + (sy - rimy) * e
          alpha *= e
        }

        if (alpha < 0.012) continue
        // gentle twinkle for life
        if (!reduce) alpha *= 0.86 + 0.14 * Math.sin(elapsed * 1.7 + pt.seed * 43)

        // cool white for land, dimmer steel-blue for ocean haze
        const c = pt.land
          ? `rgba(196,224,255,${alpha.toFixed(3)})`
          : `rgba(120,168,240,${alpha.toFixed(3)})`
        ctx.fillStyle = c
        ctx.beginPath()
        ctx.arc(sx, sy, rr, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (now) => {
      if (t0 == null) t0 = now
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => { size() }

    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      mw = c.width = 512; mh = c.height = 256
      const mctx = c.getContext('2d', { willReadFrequently: true })
      mctx.drawImage(img, 0, 0, mw, mh)
      mask = mctx.getImageData(0, 0, mw, mh).data
      buildPoints()
      size()
      if (reduce) draw(intro + 6) // one settled static frame
      else raf = requestAnimationFrame(frame)
    }
    img.src = MASK_SRC

    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [samples, oceanKeep, tilt, spinSpeed, intro])

  return (
    <div className={stageClassName} ref={stageRef}>
      <canvas ref={canvasRef} className="dot-globe__canvas" role="img" aria-label={ariaLabel} />
    </div>
  )
}

export default DotGlobeCanvas
