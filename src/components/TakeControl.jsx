import { useEffect, useRef } from 'react'

/* Speakeasy-style ASCII terrain: airy diagonal streaks of dots and glyphs
   that shimmer and dissolve on a black canvas */
function initAsciiCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  const stage = canvas.parentElement
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

  const CELL_W = 8
  const CELL_H = 10
  const MORPH = ['A', 'V', '/', '\\', '#', '-', '·', '.']

  function hash(a, b) {
    let h = (a * 374761393 + b * 668265263) ^ 0x5bf03635
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) >>> 0) / 4294967295
  }

  // mostly tiny dots; structural chars are the exception, like the reference
  function pickChar(r) {
    if (r < 0.22) return '·'
    if (r < 0.38) return '.'
    if (r < 0.56) return 'A'
    if (r < 0.70) return 'V'
    if (r < 0.80) return '/'
    if (r < 0.86) return '\\'
    if (r < 0.94) return '-'
    return '#'
  }

  function makeGlyph(seed, i, col, row, faint) {
    return {
      x: col * CELL_W,
      y: row * CELL_H,
      char: faint ? (hash(seed, i * 7) > 0.5 ? '·' : '.') : pickChar(hash(seed, i * 11 + 3)),
      baseA: faint
        ? 0.16 + hash(seed, i * 13 + 5) * 0.3
        : 0.34 + hash(seed, i * 17 + 7) * 0.55,
      phase: hash(seed, i * 19 + 11) * Math.PI * 2,
      speed: 0.25 + hash(seed, i * 23 + 13) * 0.6,
      blink: hash(seed, i * 29 + 17),
    }
  }

  // A cluster = several short diagonal streaks climbing left→right,
  // plus a halo of stray specks scattered around them
  function buildCluster(seed) {
    const glyphs = []
    let gi = 0
    const streaks = 6
    for (let s = 0; s < streaks; s++) {
      const startCol = Math.floor(hash(seed, s * 41) * 26)
      const startRow = 26 - startCol * 0.5 + (hash(seed, s * 43 + 1) - 0.5) * 12
      const len = 8 + Math.floor(hash(seed, s * 47 + 2) * 16)
      let row = startRow
      for (let c = 0; c < len; c++) {
        row -= 0.35 + hash(seed, s * 53 + c * 3) * 0.45
        const stack = 1 + Math.floor(hash(seed, s * 59 + c * 5) * 4)
        for (let d = 0; d < stack; d++) {
          if (hash(seed, s * 61 + c * 7 + d * 101) > 0.74) continue // gaps
          glyphs.push(makeGlyph(seed, gi++, startCol + c, row + d, false))
        }
      }
    }
    // halo specks
    for (let i = 0; i < 90; i++) {
      const col = hash(seed, i * 67 + 900) * 46 - 4
      const row = hash(seed, i * 71 + 901) * 34 - 6
      glyphs.push(makeGlyph(seed, gi++, col, row, true))
    }
    return glyphs
  }

  const CLUSTERS = [
    { seed: 7, glyphs: buildCluster(7), ax: 0.03, ay: 0.34 },
    { seed: 23, glyphs: buildCluster(23), ax: 0.76, ay: 0.04 },
  ]

  let W = 0
  let H = 0
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const r = stage.getBoundingClientRect()
    W = r.width
    H = r.height
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  let alive = true
  let rafId = null

  function draw(now) {
    if (!alive) return
    ctx.clearRect(0, 0, W, H)
    ctx.font = '400 10px "Geist Mono", ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const t = now / 1000
    const bucket = Math.floor(now / 1400) // slow dissolve/morph cycle
    const narrow = W < 760

    for (const cl of CLUSTERS) {
      if (narrow && cl.ax < 0.5) continue
      const ox = (narrow ? 0.5 : cl.ax) * W
      const oy = cl.ay * H
      for (let i = 0; i < cl.glyphs.length; i++) {
        const g = cl.glyphs[i]
        // some glyphs blink out entirely each cycle → dissolving terrain
        const gate = hash(cl.seed, i * 131 + bucket * 977)
        if (!reduceMotion && gate < 0.14 + g.blink * 0.1) continue
        // occasional char morph within a cycle
        let ch = g.char
        if (!reduceMotion && gate > 0.93) {
          ch = MORPH[Math.floor(hash(cl.seed, i * 139 + bucket) * MORPH.length)]
        }
        const tw = reduceMotion
          ? 1
          : 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * g.speed + g.phase))
        ctx.fillStyle = 'rgba(255,255,255,' + (g.baseA * tw).toFixed(3) + ')'
        ctx.fillText(ch, ox + g.x, oy + g.y)
      }
    }

    if (reduceMotion) return
    rafId = requestAnimationFrame(draw)
  }
  rafId = requestAnimationFrame(draw)

  return () => {
    alive = false
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
  }
}

export default function TakeControl() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    return initAsciiCanvas(canvasRef.current)
  }, [])

  return (
    <section className="take-control">
      <canvas ref={canvasRef} className="tc-canvas" aria-hidden="true" />
      <div className="tc-inner">
        <h2 className="tc-headline">
          Take control of every
          <br />
          model on your desk
        </h2>
        <div className="tc-actions">
          <a
            className="tc-btn tc-btn-rainbow"
            href="https://calendly.com/kartik-finsynth/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Talk to us</span>
          </a>
          <a
            className="tc-btn tc-btn-ghost"
            href="https://webapp.finsynth.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore FinSynth
          </a>
        </div>
      </div>
      <div className="tc-spectrum" aria-hidden="true" />
    </section>
  )
}
