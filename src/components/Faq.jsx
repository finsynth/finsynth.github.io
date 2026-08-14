import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

const FAQS = [
  {
    q: 'How do I get access, and what does it cost?',
    a: 'Sign-up with your email and get started immediately with limited credits. Talk to us to upgrade.',
  },
  {
    q: 'Does FinSynth make up numbers?',
    a: "No. Every figure is written with a citation to its source. If FinSynth can't find and cite a number, it won't invent one, and nothing gets written without your approval.",
  },
  {
    q: 'What data does FinSynth cover?',
    a: 'Filings, transcripts, reports, and presentations across 12,000+ global companies.',
  },
  {
    q: 'How is FinSynth different from a general AI assistant?',
    a: 'FinSynth is purpose-built and fine-tuned for public markets. Workflow depth, domain integrations, and auditability are much stronger for investment research use cases.',
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
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)

  const CONTACT_EMAIL = 'support@finsynth.ai'
  const copyEmail = () => {
    const done = () => {
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1800)
    }
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = CONTACT_EMAIL
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* no-op */ }
      document.body.removeChild(ta)
      done()
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(done).catch(fallback)
    } else {
      fallback()
    }
  }
  const openMail = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}`
  }
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  useLayoutEffect(() => {
    if (open < 0) {
      setRail(r => ({ ...r, on: false }))
      return
    }
    const btn = btnRefs.current[open]
    const inner = innerRefs.current[open]
    if (!btn) return
    // Compute the rail's resting position from intrinsic button heights rather
    // than btn.offsetTop: the entrance animation (fill-mode: both) leaves an
    // identity-matrix transform on each .faq-item, which makes the item its own
    // offsetParent, so offsetTop is always 0. Summing button heights + item
    // borders also lands the rail correctly while a sibling answer is still
    // mid-collapse (its animated height would otherwise skew a live measurement).
    const secondItem = btnRefs.current[1]?.parentElement
    const borderTop = secondItem
      ? parseFloat(getComputedStyle(secondItem).borderTopWidth) || 0
      : 0
    let top = 0
    for (let i = 0; i < open; i++) {
      top += btnRefs.current[i]?.offsetHeight || 0
      top += borderTop // every item past the first adds a hairline border above it
    }
    // span the full open item: question button + expanded answer
    const height = btn.offsetHeight + (inner ? inner.scrollHeight : 0)
    setRail({ top, height, on: true })
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
          <h2 className="faq-title">Curious about FinSynth?<br />We got you <span className="ttl-hl">covered</span></h2>
          <div className="faq-contact">
            <span className="faq-contact-line" aria-hidden="true" />
            <div
              className={`faq-contact-chip${copied ? ' is-copied' : ''}`}
              onDoubleClick={openMail}
              title="Double-click to email us"
            >
              <svg className="faq-contact-mail" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <span className="faq-contact-email">{CONTACT_EMAIL}</span>
              <button
                type="button"
                className="faq-contact-action"
                onClick={copyEmail}
                aria-label={copied ? 'Email address copied to clipboard' : `Copy email address ${CONTACT_EMAIL}`}
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
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
