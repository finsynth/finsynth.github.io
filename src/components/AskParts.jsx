// Pieces of the ask/answer UI shared by the hero's inline command box
// (HeroAsk, in Hero.jsx) and the hero's "Try It" modal (TryItModal.jsx).
//
// Both surfaces play the same curated sample-output flow, so the answer has to
// look identical in each — one prompt echo, one prose reply, the workbook, the
// cited table, and the booking CTA pinned at the bottom. Keeping that markup in
// one place is the only way it stays that way; it also means the existing
// .hero-answer__* CSS covers the modal with no new rules.

export const BOOK_URL = 'https://calendly.com/kartik-finsynth/intro'

// The little glyph in front of each suggested prompt. Names come from
// PROMPTS[].icon in src/data/examples.js — 'table' | 'refresh' | 'trend'.
export function PromptIcon({ name }) {
  const common = { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }
  if (name === 'table')
    return (
      <svg {...common}>
        <rect x="2" y="2.5" width="12" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 6h12M6 6v7.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  if (name === 'refresh')
    return (
      <svg {...common}>
        <path d="M13 8a5 5 0 1 1-1.46-3.54" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M13 2.5V5h-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M2.5 10.5l3.5-3.5 2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4.5h3.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The "FinSynth is working on it" beat held under the prompt before the answer
// lands — no fabricated word-by-word streaming, just an honest pause.
export function AnswerThinking() {
  return (
    <div className="hero-answer__thinking" aria-live="polite">
      <span className="hero-answer__brand">FinSynth</span>
      <span className="hero-answer__dots" aria-hidden="true"><i /><i /><i /></span>
    </div>
  )
}

// A settled answer: the prose reply, the workbook + cited table when the
// example has one, and the booking CTA.
export function AnswerResult({ result }) {
  return (
    <>
      <p className="hero-answer__body">{result.response}</p>
      <div className="hero-answer__after">
        {result.table && (
          <div className="hero-answer__xls">
            {result.table.note && (
              <p className="hero-answer__xls-note">{result.table.note}</p>
            )}
            <div className="hero-answer__xls-scroll">
              <table className="hero-answer__xls-tbl">
                <thead>
                  <tr>
                    {result.table.cols.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.table.rows.map((r, ri) => {
                    // aggregate rows (Median/Mean) are computed, not sourced — leave plain
                    const agg = r[0] === 'Median' || r[0] === 'Mean'
                    return (
                      <tr key={ri}>
                        {r.map((cell, ci) => {
                          // source-pulled figures render as blue Excel-style cited links
                          const cited = !agg && result.table.linkCols?.includes(ci) && cell && cell !== 'n/a'
                          return (
                            <td key={ci}>
                              {cited ? (
                                <span className="hero-answer__cell-link">{cell}</span>
                              ) : cell}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="hero-answer__cta">
          <span className="hero-answer__cta-copy">{result.cta}</span>
          <a className="hero-answer__cta-btn" href={BOOK_URL} target="_blank" rel="noopener noreferrer">
            Book a demo
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
