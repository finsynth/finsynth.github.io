import useReveal from '../hooks/useReveal'

/**
 * "The difference" — the argument of the page, made straight after the demo.
 *
 * Outreach lands on people who are already sold on agents, so "why use an
 * agent" is redundant for them and a feature list reads as fluff. The only
 * question they still have is what makes FinSynth different from whatever they
 * already run. So this section does one job and nothing else: it stakes the
 * claim on auditability, trust, and verifiability, framed against the accuracy
 * claim every competitor leads with.
 *
 * Deliberately no stats and no feature grid — numbers ("80% faster") read as
 * noise to an informed buyer, and the table-stakes items (security, compliance,
 * privacy) live further down the page in <Security />.
 *
 * Each row carries a diagram rather than a screenshot or a stock image: the
 * claims are about mechanics (where a number came from, what order the work
 * happened in, what needs approving), and a schematic states that faster than a
 * cropped UI shot — and stays legible at any width. Drawn in the same hairline
 * language as the rest of the page; classes carry the colours so the tokens in
 * :root remain the single source (see .dfx-art-* in index.css).
 */

/* 01 — a cell in the model, wired to the exact line of the filing behind it */
const ProvenanceArt = (
  <svg
    className="dfx-art-svg" viewBox="0 0 320 176" role="img"
    aria-label="A cell in the model linked to the page and line of the filing it was read from."
  >
    <text className="dfx-art-tag" x="2" y="10">MODEL</text>
    <rect className="dfx-art-frame" x="2.5" y="18.5" width="127" height="139" rx="6" />
    <g className="dfx-art-hair">
      <line x1="2.5" y1="46.5" x2="129.5" y2="46.5" />
      <line x1="2.5" y1="74.5" x2="129.5" y2="74.5" />
      <line x1="2.5" y1="102.5" x2="129.5" y2="102.5" />
      <line x1="2.5" y1="130.5" x2="129.5" y2="130.5" />
      <line x1="45.5" y1="18.5" x2="45.5" y2="157.5" />
      <line x1="88.5" y1="18.5" x2="88.5" y2="157.5" />
    </g>
    <rect className="dfx-art-cell" x="46" y="75" width="42" height="27" />
    <text className="dfx-art-val" x="67" y="92">142.8</text>

    {/* the link itself — dashed, because it is a reference and not a data flow */}
    <path className="dfx-art-link" d="M92 88 C 128 88 156 64 193 64" />
    <circle className="dfx-art-dot" cx="90" cy="88" r="2.2" />
    <circle className="dfx-art-dot" cx="195" cy="64" r="2.2" />

    <text className="dfx-art-tag" x="190" y="10">FILING</text>
    <rect className="dfx-art-frame" x="190.5" y="18.5" width="127" height="139" rx="6" />
    <g className="dfx-art-bar">
      <rect x="202" y="34" width="98" height="4" rx="2" />
      <rect x="202" y="48" width="84" height="4" rx="2" />
      <rect x="202" y="82" width="100" height="4" rx="2" />
      <rect x="202" y="96" width="76" height="4" rx="2" />
      <rect x="202" y="110" width="94" height="4" rx="2" />
      <rect x="202" y="124" width="62" height="4" rx="2" />
    </g>
    <rect className="dfx-art-band" x="197" y="56" width="108" height="16" rx="3" />
    <rect className="dfx-art-bar--on" x="202" y="62" width="72" height="4" rx="2" />
    <text className="dfx-art-tag dfx-art-tag--on" x="202" y="149">P. 47 · LINE 12</text>
  </svg>
)

/* 02 — the trail as an ordered object: every step, in sequence, exportable */
const TrailArt = (
  <svg
    className="dfx-art-svg" viewBox="0 0 320 176" role="img"
    aria-label="An ordered trail: what was read, what was derived, what was assumed, exported as one record."
  >
    <text className="dfx-art-tag" x="2" y="10">TRAIL</text>
    <rect className="dfx-art-frame" x="2.5" y="18.5" width="315" height="139" rx="6" />
    <g className="dfx-art-hair">
      <line x1="36.5" y1="30" x2="36.5" y2="146" />
      <line x1="36.5" y1="57.5" x2="317.5" y2="57.5" />
      <line x1="36.5" y1="87.5" x2="317.5" y2="87.5" />
      <line x1="36.5" y1="117.5" x2="317.5" y2="117.5" />
    </g>
    {[
      { y: 42, label: 'READ', w: 148 },
      { y: 72, label: 'DERIVED', w: 126 },
      { y: 102, label: 'ASSUMED', w: 94 },
      { y: 132, label: 'EXPORTED', w: 138, on: true },
    ].map(s => (
      <g key={s.label}>
        <rect
          className={`dfx-art-node${s.on ? ' dfx-art-node--on' : ''}`}
          x="33" y={s.y - 3.5} width="7" height="7" rx="2"
        />
        <text className={`dfx-art-tag${s.on ? ' dfx-art-tag--on' : ''}`} x="52" y={s.y + 3}>
          {s.label}
        </text>
        <rect
          className={s.on ? 'dfx-art-bar--on' : 'dfx-art-bar'}
          x="150" y={s.y - 2} width={s.w} height="4" rx="2"
        />
      </g>
    ))}
  </svg>
)

/* 03 — the change arrives as a diff waiting on you, not as a write */
const ControlArt = (
  <svg
    className="dfx-art-svg" viewBox="0 0 320 176" role="img"
    aria-label="A proposed change shown as a diff, with accept and reject controls, running locally."
  >
    <text className="dfx-art-tag" x="2" y="10">PROPOSED CHANGE</text>
    <rect className="dfx-art-frame" x="2.5" y="18.5" width="315" height="95" rx="6" />
    <line className="dfx-art-hair" x1="30.5" y1="18.5" x2="30.5" y2="113.5" />

    <g className="dfx-art-bar">
      <rect x="44" y="36" width="214" height="4" rx="2" />
      <rect x="44" y="58" width="176" height="4" rx="2" />
      <rect x="44" y="100" width="148" height="4" rx="2" />
    </g>
    {/* the old value is struck, not gone: the diff shows both sides */}
    <line className="dfx-art-strike" x1="40" y1="60" x2="226" y2="60" />
    <text className="dfx-art-sign" x="12" y="63">–</text>
    <text className="dfx-art-sign dfx-art-sign--on" x="12" y="85">+</text>
    <rect className="dfx-art-bar--on" x="44" y="80" width="196" height="4" rx="2" />

    <rect className="dfx-art-chip dfx-art-chip--on" x="2.5" y="128.5" width="95" height="27" rx="8" />
    <path
      className="dfx-art-check" d="M17 142.5l4 4 7.5-8"
      fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    />
    <text className="dfx-art-tag dfx-art-tag--on" x="36" y="146">ACCEPT</text>
    <rect className="dfx-art-chip" x="107.5" y="128.5" width="93" height="27" rx="8" />
    <text className="dfx-art-tag" x="124" y="146">REJECT</text>
    <text className="dfx-art-tag" x="216" y="146">RUNS LOCALLY</text>
  </svg>
)

const PROOFS = [
  {
    label: 'Provenance',
    claim: 'Click any cell, land on the line it came from.',
    detail:
      'Not a citation pointing at a 300-page filing. The document, the page, the line, and the exact figure the agent read to get there.',
    art: ProvenanceArt,
  },
  {
    label: 'Audit trail',
    claim: 'The trail is a first-class object, not a log file.',
    detail:
      'Every step in order — what was read, what was derived, what was assumed. Reviewable by you, exportable to whoever asks: IC, compliance, or the client.',
    art: TrailArt,
  },
  {
    label: 'Control',
    claim: 'Nothing reaches your model without your approval.',
    detail:
      'The agent proposes its change as a diff. You accept or reject it cell by cell, and the work runs locally. The workbook stays yours.',
    art: ControlArt,
  },
]

export default function Differentiator() {
  const revealRef = useReveal({ threshold: 0.12 })

  return (
    <section className="dfx" id="difference">
      <div className="wrap">
        {/* The claim is the section head, and the whole of it: the "most accurate
            / most auditable" pair that used to sit here was cut, and so was the
            outro line at the foot ("Accuracy is a claim. Auditability is a
            receipt.") with its link across to the walkthrough — which now plays
            above this section anyway, so the link pointed backwards. The title
            carries the correction alone, with the lede stacked under it as its
            secondary line — the page's section-head format (see .dfx-head).
            No full stop on either: heads are labels, not sentences. */}
        <div className="dfx-head">
          <h2 className="dfx-title">
            Most <span className="ttl-hl">auditable</span>
          </h2>
          <p className="dfx-lede">
            A number you can trace to its source before the meeting
          </p>
        </div>

        <div className="dfx-frame" ref={revealRef}>
          {/* what "auditable" actually means — three abreast, since the proofs are
              peers rather than a sequence and read as one set side by side */}
          <ul className="dfx-rows">
            {PROOFS.map((p, i) => (
              <li className="dfx-row" key={p.label} style={{ '--d': `${0.1 + 0.08 * i}s` }}>
                <span className="dfx-row-idx" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="dfx-row-body">
                  <p className="dfx-row-label">{p.label}</p>
                  <h3 className="dfx-row-claim">{p.claim}</h3>
                  <p className="dfx-row-detail">{p.detail}</p>
                </div>
                <div className="dfx-art">{p.art}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
