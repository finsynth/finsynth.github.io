/**
 * Isometric 3×3×3 assembly — seven pieces fly in from off-axis, hold, fade,
 * repeat. Ported from the Claude Design source (Enterprise Pricing Card), drawn
 * as white cubes outlined in the page accent so it sits on the paper.
 *
 * The projection is a plain isometric one: P() flattens a lattice point, and
 * each cell paints only the three faces a viewer can see (top, right, left).
 * Cells are drawn back-to-front by i+j+k so the near ones overlap correctly —
 * there is no z-buffer here, only paint order.
 */

// seconds per full assemble → hold → fade cycle
const CYCLE_SECONDS = 2
const U = 95                 // cube edge, in projection units
const C = 1.5 * U            // half the 3-cube, so the lattice centres on 0

const P = (x, y, z) => [(x - y) * 0.866, (x + y) * 0.5 - z]
const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

/* t/r/l = top, right, left face. Every piece is the same white cube outlined in
   the page accent (the stroke lives in .ent-viz-face), so the design's four
   blue tints collapse to one recipe: the two shaded faces are barely off white
   and only exist so a cube's own edges stay legible against its neighbours. */
const FACE = { t: '#FFFFFF', r: '#F6F8FE', l: '#ECF0FC' }

// each piece names its cells and the offset it flies in from
const PIECES = [
  { cells: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 2, 0]], from: [-170, 0, 0] },
  { cells: [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0]], from: [0, 170, 0] },
  { cells: [[0, 0, 1], [1, 0, 1], [2, 0, 1]], from: [0, -170, 0] },
  { cells: [[0, 1, 1], [1, 1, 1], [0, 2, 1], [1, 2, 1]], from: [-170, 0, 0] },
  { cells: [[2, 1, 1], [2, 2, 1], [2, 1, 2], [2, 2, 2]], from: [180, 0, 0] },
  { cells: [[0, 0, 2], [1, 0, 2], [2, 0, 2], [0, 1, 2], [0, 2, 2]], from: [0, 0, 180] },
  { cells: [[1, 1, 2], [1, 2, 2]], from: [0, 0, 220] },
]

// flattened and sorted back-to-front — see the paint-order note above
const CELLS = PIECES
  .flatMap((piece, pi) => piece.cells.map((c) => ({ c, pi, d: c[0] + c[1] + c[2] })))
  .sort((a, b) => a.d - b.d)

/* One keyframe track per piece: hold off-screen, slide in on a staggered beat,
   hold assembled, then fade before the loop restarts. The reduced-motion rule
   parks every piece assembled instead of removing it. */
const KEYFRAMES = PIECES.map((p, pi) => {
  const [fx, fy, fz] = p.from
  const dx = ((fx - fy) * 0.866).toFixed(1)
  const dy = ((fx + fy) * 0.5 - fz).toFixed(1)
  const inA = 4 + pi * (60 / PIECES.length)
  const inB = inA + 8
  return `@keyframes entPiece${pi}{`
    + `0%{opacity:0;transform:translate(${dx}px,${dy}px)}`
    + `${inA.toFixed(1)}%{opacity:0;transform:translate(${dx}px,${dy}px)}`
    + `${inB.toFixed(1)}%{opacity:1;transform:translate(0,0)}`
    + `86%{opacity:1;transform:translate(0,0)}`
    + `96%{opacity:0;transform:translate(0,0)}`
    + `100%{opacity:0;transform:translate(${dx}px,${dy}px)}}`
}).join('')
  + '@media (prefers-reduced-motion: reduce){'
  + '.ent-viz-piece{animation:none!important;opacity:1!important;transform:none!important}}'

function Cell({ c, pi }) {
  const [i, j, k] = c
  const x0 = i * U - C, x1 = x0 + U
  const y0 = j * U - C, y1 = y0 + U
  const z0 = k * U, z1 = z0 + U

  const face = (pts, fill) => (
    <path key={fill} className="ent-viz-face" d={`M ${pts.map(pt).join(' L ')} Z`} fill={fill} />
  )

  return (
    <g className="ent-viz-piece" style={{ animation: `entPiece${pi} ${CYCLE_SECONDS}s ease-in-out infinite` }}>
      {face([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], FACE.t)}
      {face([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], FACE.r)}
      {face([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], FACE.l)}
    </g>
  )
}

export default function EnterpriseDiagram() {
  return (
    <svg className="ent-viz-svg" viewBox="-430 -572.5 860 860" aria-hidden="true" focusable="false">
      <style>{KEYFRAMES}</style>
      {/* ground axes, sunk to the lattice floor so the stack reads as seated */}
      <g style={{ transform: `translateY(${(1.5 * U + 0.5).toFixed(1)}px)` }}>
        <path className="ent-viz-axis" d={`M ${pt(P(-560, 0, 0))} L ${pt(P(560, 0, 0))}`} />
        <path className="ent-viz-axis" d={`M ${pt(P(0, -560, 0))} L ${pt(P(0, 560, 0))}`} />
      </g>
      {CELLS.map((cell, idx) => <Cell key={idx} {...cell} />)}
    </svg>
  )
}
