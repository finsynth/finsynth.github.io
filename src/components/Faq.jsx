import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

const FAQS = [
  {
    q: 'How do I get access, and what does it cost?',
    a: "FinSynth is currently available to select funds. Book a demo and we'll walk you through access for your team.",
  },
  {
    q: 'Does FinSynth make up numbers?',
    a: "No. Every figure is written with a citation to its source. If FinSynth can't find and cite a number, it won't invent one, and nothing gets written to your model without your approval first.",
  },
  {
    q: 'Does my data or model ever leave my machine?',
    a: "No. Excel operations run locally, on your machine. FinSynth's backend never reads, stores, or transmits your workbook.",
  },
  {
    q: 'Does FinSynth work with my existing models?',
    a: 'Yes, FinSynth works inside your existing Excel workbooks. No template, no rebuild required.',
  },
  {
    q: 'Which surfaces does FinSynth run on?',
    a: 'An Excel add-in and a webapp, the same agent either way.',
  },
  {
    q: 'What data does FinSynth cover?',
    a: 'Filings, transcripts, reports, and presentations across 12k+ global companies.',
  },
  {
    q: 'How is FinSynth different from a general AI assistant?',
    a: "It's built specifically for financial work: it cites every number to its source, and never writes to your model without your approval.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState(-1)
  const ref = useRef(null)
  const zoomRef = useSectionZoom()
  const listRef = useRef(null)
  const btnRefs = useRef([])
  const innerRefs = useRef([])
  const [rail, setRail] = useState({ top: 0, height: 0, on: false })

  useLayoutEffect(() => {
    if (open < 0) {
      setRail(r => ({ ...r, on: false }))
      return
    }
    const btn = btnRefs.current[open]
    const inner = innerRefs.current[open]
    if (!btn) return
    // span the full open item: question button + expanded answer
    const height = btn.offsetHeight + (inner ? inner.scrollHeight : 0)
    setRail({ top: btn.offsetTop, height, on: true })
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="wrap faq-grid" ref={zoomRef}>
        <div className="faq-intro">
          <p className="faq-eyebrow">Frequently Asked Questions</p>
          <h2 className="faq-title">Curious about FinSynth?<br />We got you covered.</h2>
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

        <div className="faq-list" ref={listRef}>
          <span
            className={`faq-rail${rail.on ? ' on' : ''}`}
            aria-hidden="true"
            style={{ '--rail-top': `${rail.top}px`, '--rail-h': `${rail.height}px` }}
          />
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  ref={el => (btnRefs.current[i] = el)}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-toggle" aria-hidden="true" />
                </button>
                <div className="faq-a" role="region" aria-hidden={!isOpen}>
                  <div className="faq-a-inner" ref={el => (innerRefs.current[i] = el)}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
