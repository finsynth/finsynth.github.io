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
  const [open, setOpen] = useState(0)

  return (
    <section className="faq" id="faq">
      <div className="wrap faq-wrap">
        <h2 className="faq-title">Questions analysts ask</h2>
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
                  <span className="faq-toggle" aria-hidden="true">{isOpen ? '×' : '+'}</span>
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
