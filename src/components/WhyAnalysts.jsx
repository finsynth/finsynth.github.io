import useReveal from '../hooks/useReveal'
import { CitedToTheLine, DomainExpertise, EndToEnd, Embedded } from './WhyAnalystsVisuals'

/**
 * "Why analysts choose FinSynth" — the four differentiators laid out as a
 * table: an index column, the claim stacked over its supporting line, and a
 * diagram of that claim. Hairline row rules do the work of table borders so it
 * reads as a spec sheet rather than a card grid. The verifiable stats sit below
 * it as a single proof row.
 */
const REASONS = [
  {
    claim: 'Every model, cited to the exact line.',
    detail:
      'Auditable Excel models, every figure traced to the exact line it came from, whether that’s a 10-K, a call transcript, or a PDF someone emailed you.',
    Visual: CitedToTheLine,
  },
  {
    claim: 'Domain expertise, not a chatbot with a finance skin.',
    detail:
      'Finance is in FinSynth’s DNA. Built to understand filings, models, and the way analysts actually work.',
    Visual: DomainExpertise,
  },
  {
    claim: 'End-to-end execution, inside your actual workflow.',
    detail:
      'FinSynth reads the filing, updates the model, proposes the change, the same way an associate would, start to finish. Lives inside your workflow, your model, your cells, your sheet, not bolted on as a separate add-in.',
    Visual: EndToEnd,
  },
  {
    claim: 'Embedded in your systems, not a walled garden.',
    detail:
      'Connects directly into Bloomberg, FactSet, Capital IQ, Snowflake, your internal databases, and any third-party provider you already pay for.',
    Visual: Embedded,
  },
]

const STATS = [
  { value: '12,000+', label: 'companies' },
  { value: '80%', label: 'less build time' },
  { value: '2x', label: 'more coverage' },
  { value: '90%', label: 'less time auditing' },
  { value: '20 yrs', label: 'of back-data' },
]

export default function WhyAnalysts() {
  const revealRef = useReveal({ threshold: 0.08 })

  return (
    <section className="wac-sec" id="why-finsynth" ref={revealRef}>
      <div className="wac-stage">
        <h2 className="wac-heading">
          Why analysts choose <span className="ttl-hl">FinSynth</span>
        </h2>

        {/* The four reasons, in the same framed-column language as the proofs in
            <Differentiator />: four abreast inside one hairline frame, divided by
            vertical rules, each column running index → claim → detail → diagram.
            They were stacked rows with the diagram alongside; as peers rather
            than a sequence they scan better side by side, and the four drawings
            landing on one line at the foot reads as one set.

            Still a headed list, so the claims stay real headings for assistive
            tech and the reading order survives the grid. */}
        <div className="wac-frame">
          <ul className="wac-table">
            {REASONS.map((r, i) => (
              <li className="wac-row" key={r.claim}>
                <span className="wac-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {/* takes the slack, so the diagrams sit on one line however
                    unevenly the claims and details above them wrap */}
                <div className="wac-row-body">
                  <h3 className="wac-claim">{r.claim}</h3>
                  <p className="wac-detail">{r.detail}</p>
                </div>
                {/* decorative: the claim above it already carries the meaning */}
                <div className="wac-visual" aria-hidden="true">
                  <r.Visual />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* verifiable proof row */}
        <dl className="wac-stats">
          {STATS.map((s) => (
            <div className="wac-stat" key={s.label}>
              <dt className="wac-stat-value">{s.value}</dt>
              <dd className="wac-stat-label">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="wac-cta-row">
          {/* A text link, not a button of any kind: the page's buttons belong to
              the hero and the footer band, and mid-page this is an aside. Even
              an outline read as a second CTA competing with them, so what's left
              is the words and an arrow that moves on hover. */}
          <a
            className="wac-cta"
            href="https://calendly.com/kartik-finsynth/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            See it on your workflow
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8h9M9 4.5L12.5 8 9 11.5"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
