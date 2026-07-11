import { useState } from 'react'

const FAQS = [
  {
    q: 'Does FinSynth make up numbers?',
    a: "No figure is written without a citation to its source. If FinSynth can't find and cite a number, it won't invent one. And you approve every write before it lands.",
  },
  {
    q: 'Does my data or model ever leave my machine?',
    a: 'No. Excel runs locally. The backend never reads or stores your workbook.',
  },
  {
    q: 'Does it work with my existing models?',
    a: 'Yes, FinSynth works inside your existing workbooks. No template, no rebuild.',
  },
  {
    q: 'Which surfaces does it run on?',
    a: 'An Excel add-in and a webapp. Windows and Mac.',
  },
  {
    q: 'What data does it cover?',
    a: 'Filings, transcripts, reports, and presentations across 12,000+ global companies.',
  },
  {
    q: 'How is it different from a general AI assistant?',
    a: "It's built for financial work on Anthropic Claude — every number is cited to its source, and nothing is written to your model without your approval. Audit-friendly, citation-grounded and permission-gated by design.",
  },
  {
    q: 'How do I get access?',
    a: "FinSynth is currently available to select funds. Book a demo and we'll walk you through access for your team.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState(-1)

  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-sub">
            Clear, zero-fluff technical and operational answers about how FinSynth
            builds, cites, and secures your financial models.
          </p>
          <div className="faq-contact">
            <span className="faq-contact-line" aria-hidden="true" />
            <a className="faq-contact-chip" href="mailto:support@finsynth.ai">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              support@finsynth.ai
            </a>
          </div>
        </div>

        <div className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-a" hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
