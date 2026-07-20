// Giant "FINSYNTH" wordmark rendered as a gooey/metaball dot-matrix.
// Each letter is a 5×7 grid of circles; an SVG "goo" filter (blur → alpha
// threshold) merges neighbouring circles into organic blobs. Circles drift
// on a slow per-dot loop so the word gently breathes. GPU-safe (transform
// only) and disabled under prefers-reduced-motion via CSS.

const CELL = 100
const R = 58
const COLS = 5
const ADVANCE = 7 // letter width (5) + gap (2), in cells

// 5-wide × 7-tall glyph bitmaps.
const GLYPHS = {
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  N: ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
}

const WORD = 'FINSYNTH'

// Deterministic pseudo-random in [-1, 1] from an integer seed — keeps the
// drift organic without Math.random (stable across renders).
function rnd(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

const dots = []
let idx = 0
WORD.split('').forEach((ch, li) => {
  const xBase = li * ADVANCE * CELL
  GLYPHS[ch].forEach((row, r) => {
    row.split('').forEach((v, c) => {
      if (v !== '1') return
      dots.push({
        key: idx,
        cx: xBase + (c + 0.5) * CELL,
        cy: (r + 0.5) * CELL,
        tx: (rnd(idx) * 15).toFixed(1),
        ty: (rnd(idx + 101) * 15).toFixed(1),
        dur: (3.8 + Math.abs(rnd(idx + 7)) * 2.8).toFixed(2),
        delay: (Math.abs(rnd(idx + 23)) * 2.4).toFixed(2),
      })
      idx++
    })
  })
})

const VB_W = (WORD.length - 1) * ADVANCE * CELL + COLS * CELL // 5400
const VB_H = 7 * CELL // 700
const PAD = 72

export default function GooWordmark() {
  return (
    <svg
      className="goo-wm"
      viewBox={`${-PAD} ${-PAD} ${VB_W + PAD * 2} ${VB_H + PAD * 2}`}
      role="img"
      aria-label="FinSynth"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="goo-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
          />
        </filter>
      </defs>
      <g filter="url(#goo-filter)">
        {dots.map((d) => (
          <circle
            key={d.key}
            className="goo-dot"
            cx={d.cx}
            cy={d.cy}
            r={R}
            style={{ '--tx': `${d.tx}px`, '--ty': `${d.ty}px`, '--dur': `${d.dur}s`, '--delay': `${d.delay}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
