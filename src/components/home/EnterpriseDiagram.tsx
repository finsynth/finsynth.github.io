/**
 * Isometric 3×3×3 assembly. No z-buffer: cells are painted back-to-front by i+j+k so near ones overlap correctly.
 */

// mostly hold: it sits beside sales copy, so it should settle and stay settled
const CYCLE_SECONDS = 7
const U = 95 // cube edge, in projection units
const C = 1.5 * U // half the 3-cube, so the lattice centres on 0

type Point = [number, number]

const P = (x: number, y: number, z: number): Point => [(x - y) * 0.866, (x + y) * 0.5 - z]
const pt = (p: Point) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

/* t/r/l = top, right, left face. The stroke lives in .ent-viz-face; the shaded faces are barely off white so each cube's edges stay legible. */
const FACE = { t: '#FFFFFF', r: '#F6F8FE', l: '#ECF0FC' }

/* Offsets are under one cube edge so a piece eases into place rather than flying across the panel. */
type Vec3 = [number, number, number]

const PIECES: { cells: Vec3[]; from: Vec3 }[] = [
  {
    cells: [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [0, 1, 0],
      [0, 2, 0],
    ],
    from: [-85, 0, 0],
  },
  {
    cells: [
      [1, 1, 0],
      [2, 1, 0],
      [1, 2, 0],
      [2, 2, 0],
    ],
    from: [0, 85, 0],
  },
  {
    cells: [
      [0, 0, 1],
      [1, 0, 1],
      [2, 0, 1],
    ],
    from: [0, -85, 0],
  },
  {
    cells: [
      [0, 1, 1],
      [1, 1, 1],
      [0, 2, 1],
      [1, 2, 1],
    ],
    from: [-85, 0, 0],
  },
  {
    cells: [
      [2, 1, 1],
      [2, 2, 1],
      [2, 1, 2],
      [2, 2, 2],
    ],
    from: [90, 0, 0],
  },
  {
    cells: [
      [0, 0, 2],
      [1, 0, 2],
      [2, 0, 2],
      [0, 1, 2],
      [0, 2, 2],
    ],
    from: [0, 0, 90],
  },
  {
    cells: [
      [1, 1, 2],
      [1, 2, 2],
    ],
    from: [0, 0, 110],
  },
]

// flattened and sorted back-to-front — see the paint-order note above
const CELLS = PIECES.flatMap((piece, pi) =>
  piece.cells.map((c) => ({ c, pi, d: c[0] + c[1] + c[2] })),
).sort((a, b) => a.d - b.d)

/* Per piece: off-screen, staggered slide-in, hold, fade. The stagger fits the first third (last piece lands ~41%), so the stack holds ~3.3s of 7. Reduced motion parks every piece assembled. */
const KEYFRAMES =
  PIECES.map((p, pi) => {
    const [fx, fy, fz] = p.from
    const dx = ((fx - fy) * 0.866).toFixed(1)
    const dy = ((fx + fy) * 0.5 - fz).toFixed(1)
    const inA = 3 + pi * (31 / PIECES.length)
    const inB = inA + 7
    return (
      `@keyframes entPiece${pi}{` +
      `0%{opacity:0;transform:translate(${dx}px,${dy}px)}` +
      `${inA.toFixed(1)}%{opacity:0;transform:translate(${dx}px,${dy}px)}` +
      `${inB.toFixed(1)}%{opacity:1;transform:translate(0,0)}` +
      `88%{opacity:1;transform:translate(0,0)}` +
      `97%{opacity:0;transform:translate(0,0)}` +
      `100%{opacity:0;transform:translate(${dx}px,${dy}px)}}`
    )
  }).join('') +
  '@media (prefers-reduced-motion: reduce){' +
  '.ent-viz-piece{animation:none!important;opacity:1!important;transform:none!important}}'

function Cell({ c, pi }: { c: Vec3; pi: number }) {
  const [i, j, k] = c
  const x0 = i * U - C,
    x1 = x0 + U
  const y0 = j * U - C,
    y1 = y0 + U
  const z0 = k * U,
    z1 = z0 + U

  const face = (pts: Point[], fill: string) => (
    <path key={fill} className="ent-viz-face" d={`M ${pts.map(pt).join(' L ')} Z`} fill={fill} />
  )

  return (
    <g
      className="ent-viz-piece"
      style={{ animation: `entPiece${pi} ${CYCLE_SECONDS}s ease-in-out infinite` }}
    >
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
      {CELLS.map((cell, idx) => (
        <Cell key={idx} {...cell} />
      ))}
    </svg>
  )
}
