import { useEffect, useRef, useState } from 'react'
import GridReveal from '@/components/visuals/GridReveal'
import { LINKS } from '@/config/site'
import { SOLUTIONS } from '@/components/layout/Navbar'

const ASK_PROMPT =
  'What is FinSynth (finsynth.ai), and how does it compare to general AI assistants and specialized financial research tools?'
const q = encodeURIComponent(ASK_PROMPT)

const AGENTS = [
  { name: 'ChatGPT', href: `https://chatgpt.com/?q=${q}`, logo: '/assets/img/logos/chatgpt.svg' },
  { name: 'Claude', href: `https://claude.ai/new?q=${q}`, logo: '/assets/img/logos/claude.svg' },
  { name: 'Grok', href: `https://grok.com/?q=${q}`, logo: '/assets/img/logos/grok.svg' },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const askRef = useRef<HTMLDivElement>(null)
  const [askOpen, setAskOpen] = useState(false)
  const [copied, setCopied] = useState(false)

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
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!askOpen) return
    const onDown = (e: MouseEvent) => {
      if (askRef.current && !askRef.current.contains(e.target as Node)) setAskOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAskOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [askOpen])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ASK_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <footer className="footer-new" ref={ref}>
      <GridReveal asBackground pointerTargetRef={ref} idle idleLevel={0.28} reach={340} core={90} />
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-lockup foot-reveal">
            <div className="foot-brand">
              <img src="/assets/img/full-logo-white.svg" alt="FinSynth Logo" />
            </div>
            <div className="foot-cta-copy">
              {/* the break only holds beside the nav; stacked, the headline is one line */}
              <h3>
                See it in <br />
                your own workflows
              </h3>
            </div>
            <div className="foot-cta-actions">
              <a
                className="cta-cta"
                href={LINKS.bookCall}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cta-cta-label">Setup a call</span>
                <span className="cta-cta-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12L12 4" />
                    <path d="M5.5 4H12V10.5" />
                  </svg>
                </span>
              </a>
              <div className="foot-askai" ref={askRef}>
                <button
                  type="button"
                  className="foot-askai-btn"
                  aria-haspopup="menu"
                  aria-expanded={askOpen}
                  onClick={() => setAskOpen((v) => !v)}
                >
                  <span className="foot-askai-btn-label">Ask your AI</span>
                  <svg
                    className="foot-askai-btn-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0c.3 2.9 1.1 4.9 2.5 6.3S13.9 8.4 16 8.7c-2.9.3-4.9 1.1-6.3 2.5S8.3 15.1 8 16c-.3-2.9-1.1-4.9-2.5-6.3S2.1 8.3 0 8c2.9-.3 4.9-1.1 6.3-2.5S7.7 2.1 8 0z" />
                  </svg>
                </button>
                {askOpen && (
                  <div className="foot-askai-menu" role="menu">
                    {AGENTS.map((a) => (
                      <a
                        key={a.name}
                        className="foot-askai-item"
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setAskOpen(false)}
                      >
                        <img
                          className="foot-askai-logo"
                          src={a.logo}
                          alt=""
                          aria-hidden="true"
                          width="16"
                          height="16"
                        />
                        {a.name}
                      </a>
                    ))}
                    <button
                      type="button"
                      className="foot-askai-item foot-askai-copy"
                      role="menuitem"
                      onClick={copyPrompt}
                    >
                      <svg
                        className="foot-askai-logo"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        aria-hidden="true"
                      >
                        <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" />
                        <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
                      </svg>
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="foot-right">
            {/* reveal the grid as one block: per-column staggers left the headings at different heights mid-animation */}
            <div className="foot-grid-new foot-reveal">
              <div>
                <h4>Product</h4>
                <a href="/#excel">FinSynth for Excel</a>
                <a href="/#fia-agent">Fia</a>
                {/* not a link until it ships (same as the navbar) */}
                <span className="foot-soon">
                  FinSynth MCP
                  <br className="foot-soon-br" /> (coming soon)
                </span>
              </div>
              <div>
                <h4>Solutions</h4>
                {SOLUTIONS.map((s) => (
                  <a key={s.key} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
              <div>
                <h4>Company</h4>
                <a href="/#pricing">Pricing</a>
                <a href="/careers">Careers</a>
                <a href="/support">Support</a>
                <a href="/#security">Security</a>
                <a href={LINKS.bookCall} target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              </div>
              <div>
                <h4>Legal</h4>
                <a href={LINKS.privacyPolicy} target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                <a href={LINKS.termsOfService} target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
                <a href="/#security">Compliance</a>
              </div>
              <div>
                <h4>Social</h4>
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={LINKS.x} target="_blank" rel="noopener noreferrer">
                  X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the © line sits centred in front of the wordmark's lower half; the
          wordmark is decorative, the legal line is not, so only the span is
          hidden from assistive tech */}
      <div className="foot-wordmark">
        <span aria-hidden="true">FINSYNTH</span>
        <div className="foot-legal foot-reveal">
          <span className="foot-copyright">© 2026 FinSynth. All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
