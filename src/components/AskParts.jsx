// Pieces of the ask/answer UI shared across the hero surfaces.
//
//   BOOK_URL       — the demo-booking link (hero CTA, and anywhere else a
//                    "book a demo" action is offered)
//   AnswerThinking — the "FinSynth is working on it" beat held under a prompt
//                    in the Try It modal before the result lands

export const BOOK_URL = 'https://calendly.com/kartik-finsynth/intro'

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
