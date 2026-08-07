import useReveal from '../hooks/useReveal'

/**
 * Three-way comparison — a generic AI copilot, Claude, and FinSynth — as a rated
 * table. A duplicate of the <Differentiator /> section (it reuses that section's
 * .dfx-head / .dfx-frame styling) with the argument restated per category.
 *
 * Two of the three columns name real products, so every cell in them has to be a
 * claim we could defend. The middle column is Claude as it actually ships,
 * Claude for Excel included: it works in the sheet, edits in place, and explains
 * what it changed. The gaps described are the ones that follow from being a chat
 * assistant rather than a model of record — never invented shortcomings.
 *
 * Three columns rather than two because the informed buyer isn't choosing
 * between AI and no AI, and isn't choosing between us and a toy either. The real
 * question is what changes when the evidence, not the answer, is the product —
 * and the middle column is the strongest version of the alternative.
 *
 * Scored per category rather than ticked: a tick column only says "yes/no",
 * where a rating says how well, and "Not yet" is a fairer read of a competitor's
 * gap than a blank cell. Each pill carries one line of plain language under it,
 * so a rating word never has to be taken on trust.
 *
 * Real <table> markup: this is tabular data, and the column headers need to be
 * announced with each cell.
 *
 * Tiers drive colour only — 'none' reads dashed and recessed, 'weak'/'mid' sit
 * neutral on the hairline, 'strong' comes forward in accent. No red/green: the
 * page is grey plus one blue, and a traffic-light palette would break it.
 */
const ROWS = [
  {
    cat: 'Source traceability',
    gen: { tier: 'weak', pill: 'Patchy', note: 'Sources in prose, when they appear at all' },
    cla: { tier: 'mid', pill: 'Cited', note: 'Names what it read, in the chat thread' },
    us: { tier: 'strong', pill: 'Cell-level', note: 'Every value links to the line it came from' },
  },
  {
    cat: 'Verifying a number',
    gen: { tier: 'none', pill: 'By hand', note: 'You rebuild the workings to check them' },
    cla: { tier: 'weak', pill: 'Readable', note: 'It shows its working; you still re-check it' },
    us: { tier: 'strong', pill: 'One click', note: 'Click the cell, land on the source' },
  },
  {
    cat: 'Audit trail export',
    gen: { tier: 'none', pill: 'Not yet', note: 'Nothing a reviewer can be handed' },
    cla: { tier: 'none', pill: 'Not yet', note: 'A chat log, not tied to the model' },
    us: { tier: 'strong', pill: 'First-class', note: 'Exports to IC, compliance, or the client' },
  },
  {
    cat: 'Spreadsheet safety',
    gen: { tier: 'none', pill: 'Copy-paste', note: 'Values land on top of live formulas' },
    cla: { tier: 'mid', pill: 'In-place', note: 'Edits the sheet and explains what changed' },
    us: { tier: 'strong', pill: 'Formula-safe', note: 'Arrives as a diff you accept cell by cell' },
  },
  {
    cat: 'Where the work happens',
    gen: { tier: 'weak', pill: 'Separate tab', note: 'Answers copied between apps' },
    cla: { tier: 'mid', pill: 'Side panel', note: 'In Excel, beside the sheet' },
    us: { tier: 'strong', pill: 'Native Excel', note: 'In the workbook you already use' },
  },
]

function Pill({ tier, pill, note }) {
  return (
    <>
      <span className={`vsx-pill vsx-pill--${tier}`}>{pill}</span>
      <span className="vsx-note">{note}</span>
    </>
  )
}

export default function Comparison() {
  const revealRef = useReveal({ threshold: 0.12 })

  return (
    <section className="dfx vsx" id="comparison">
      <div className="wrap">
        {/* The page's section-head format: title, secondary line stacked
            directly under it, no full stop on either (see .dfx-head). */}
        <div className="dfx-head">
          <h2 className="dfx-title">
            You already run a copilot<br />
            Here&rsquo;s what it <span className="ttl-hl">doesn&rsquo;t</span> do
          </h2>
          <p className="dfx-lede">
            Not AI against no AI. The same request through a generic copilot,
            through Claude, and through FinSynth
          </p>
        </div>

        <div className="dfx-frame" ref={revealRef}>
          <table className="vsx-table">
            <thead>
              <tr>
                <th scope="col" className="vsx-th vsx-th--cat">Category</th>
                <th scope="col" className="vsx-th vsx-th--gen">Generic AI copilot</th>
                <th scope="col" className="vsx-th vsx-th--cla">Claude</th>
                <th scope="col" className="vsx-th vsx-th--us">FinSynth</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr className="vsx-tr" key={r.cat} style={{ '--d': `${0.08 + 0.06 * i}s` }}>
                  <th scope="row" className="vsx-td vsx-td--cat">{r.cat}</th>
                  <td className="vsx-td vsx-td--gen"><Pill {...r.gen} /></td>
                  <td className="vsx-td vsx-td--cla"><Pill {...r.cla} /></td>
                  <td className="vsx-td vsx-td--us"><Pill {...r.us} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
