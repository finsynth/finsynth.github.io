/**
 * One small diagram per reason in "Why analysts choose FinSynth".
 *
 * These are drawn rather than photographed on purpose: each one depicts the
 * specific claim in the row beside it, so the visual carries an argument
 * instead of decorating. All four share a 240×150 viewBox and take their colour
 * from CSS custom properties, so they follow the section's theme.
 *
 * To swap any of these for a real product screenshot, replace the component
 * with <img src="/assets/img/….png" alt="" /> — .wac-visual already crops and
 * frames whatever it is handed.
 */

const VB = '0 0 240 150'

// 01 · Every model, cited to the exact line.
// A model cell, a leader line, and the filing line it came from.
export const CitedToTheLine = () => (
  <svg className="wv" viewBox={VB} role="img" aria-hidden="true">
    {/* the model grid */}
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        {[0, 1, 2].map((c) => (
          <rect
            key={c}
            className="wv-cell"
            x={12 + c * 34}
            y={26 + r * 24}
            width="34"
            height="24"
          />
        ))}
      </g>
    ))}
    {/* the traced figure */}
    <rect className="wv-cell-hit" x="46" y="50" width="34" height="24" rx="2" />
    <text className="wv-num" x="63" y="66">1,842</text>

    {/* leader from the cell to the source line */}
    <path className="wv-lead" d="M82 62 C 108 62, 118 78, 146 78" />
    <circle className="wv-dot" cx="146" cy="78" r="2.6" />

    {/* the filing */}
    <rect className="wv-doc" x="152" y="14" width="76" height="122" rx="7" />
    <text className="wv-tag" x="162" y="32">10-K</text>
    {[46, 58, 90, 102, 114].map((y) => (
      <rect key={y} className="wv-txt" x="162" y={y} width={y === 102 ? 40 : 56} height="4" rx="2" />
    ))}
    {/* the exact line */}
    <rect className="wv-hl" x="158" y="70" width="64" height="14" rx="3" />
    <rect className="wv-txt-hit" x="162" y="75" width="50" height="4" rx="2" />
  </svg>
)

// 02 · Domain expertise, not a chatbot with a finance skin.
// A finance-native function resolving into a real series.
export const DomainExpertise = () => (
  <svg className="wv" viewBox={VB} role="img" aria-hidden="true">
    {/* formula bar */}
    <rect className="wv-doc" x="12" y="20" width="216" height="30" rx="7" />
    <text className="wv-fx" x="24" y="39">fx</text>
    <text className="wv-code" x="44" y="39">=FS.GROSSMARGIN(&quot;AAPL&quot;, 9Q)</text>

    {/* resolved series */}
    <rect className="wv-panel" x="12" y="62" width="216" height="74" rx="7" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
      const h = [22, 26, 31, 29, 35, 40, 38, 45, 50][i]
      return (
        <rect
          key={i}
          className={i === 8 ? 'wv-bar wv-bar--last' : 'wv-bar'}
          x={26 + i * 21}
          y={124 - h}
          width="12"
          height={h}
          rx="2"
        />
      )
    })}
    <line className="wv-axis" x1="22" y1="126" x2="218" y2="126" />
  </svg>
)

// 03 · End-to-end execution, inside your actual workflow.
// The change proposed in the sheet, waiting on the analyst.
export const EndToEnd = () => (
  <svg className="wv" viewBox={VB} role="img" aria-hidden="true">
    <rect className="wv-panel" x="12" y="16" width="216" height="118" rx="7" />
    {/* header row */}
    <line className="wv-rule" x1="12" y1="44" x2="228" y2="44" />
    <text className="wv-hd" x="26" y="36">Revenue</text>
    <text className="wv-hd wv-hd--r" x="212" y="36">Q3</text>

    {/* untouched rows */}
    {[62, 80].map((y) => (
      <g key={y}>
        <rect className="wv-txt" x="26" y={y - 4} width="52" height="4" rx="2" />
        <rect className="wv-txt" x="176" y={y - 4} width="36" height="4" rx="2" />
      </g>
    ))}

    {/* the proposed change, waiting on one click */}
    <rect className="wv-hl" x="18" y="94" width="204" height="26" rx="5" />
    <circle className="wv-ok" cx="32" cy="107" r="8" />
    <path className="wv-ok-tick" d="M28.4 107.4 l 2.6 2.6 L 36 104.4" />
    <text className="wv-lbl" x="48" y="110">Gross profit</text>
    <text className="wv-old" x="150" y="110">1,842</text>
    <line className="wv-strike" x1="135" y1="106.5" x2="166" y2="106.5" />
    <path className="wv-arrow" d="M170 106.5 h 9 m -3.5 -3 l 3.5 3 l -3.5 3" />
    <text className="wv-new" x="203" y="110">1,907</text>
  </svg>
)

// 04 · Embedded in your systems, not a walled garden.
// One hub, wired into what the desk already pays for.
export const Embedded = () => {
  const NODES = [
    { y: 24, label: 'Bloomberg' },
    { y: 58, label: 'FactSet' },
    { y: 92, label: 'Capital IQ' },
    { y: 126, label: 'Snowflake' },
  ]
  return (
    <svg className="wv" viewBox={VB} role="img" aria-hidden="true">
      {/* the hub */}
      <rect className="wv-hub" x="14" y="59" width="46" height="32" rx="8" />
      <path className="wv-hub-mark" d="M28 69 h 18 M28 75 h 12 M28 81 h 18" />

      {NODES.map((n) => (
        <g key={n.label}>
          <path className="wv-wire" d={`M60 75 C 92 75, 96 ${n.y} , 128 ${n.y}`} />
          <rect className="wv-chip" x="128" y={n.y - 11} width="98" height="22" rx="11" />
          <circle className="wv-chip-dot" cx="141" cy={n.y} r="3" />
          <text className="wv-chip-tx" x="151" y={n.y + 4}>{n.label}</text>
        </g>
      ))}
    </svg>
  )
}
