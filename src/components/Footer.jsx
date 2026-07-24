import { useEffect, useRef } from 'react';
import GridReveal from './GridReveal';

const ASK_PROMPT = 'Tell me about FinSynth (finsynth.ai), the auditable spreadsheet agent for buy-side analysts.';
const q = encodeURIComponent(ASK_PROMPT);

const AGENTS = [
  { name: 'ChatGPT', href: `https://chatgpt.com/?q=${q}`, logo: '/assets/img/logos/chatgpt.svg' },
  { name: 'Claude', href: `https://claude.ai/new?q=${q}`, logo: '/assets/img/logos/claude.svg' },
  { name: 'Gemini', href: 'https://gemini.google.com/app', logo: '/assets/img/logos/gemini.svg' },
  { name: 'Grok', href: `https://grok.com/?q=${q}`, logo: '/assets/img/logos/grok.svg' },
];

export default function Footer() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="footer-new" ref={ref}>
      <GridReveal asBackground pointerTargetRef={ref} idle idleLevel={0.28} reach={340} core={90} />
      <div className="wrap">
        <div className="foot-cols">
          {/* LEFT — brand + headline + CTA, aligned as one lockup */}
          <div className="foot-lockup foot-reveal">
            <div className="foot-brand">
              <img src="/assets/img/full-logo-white.svg" alt="FinSynth Logo" />
            </div>
            <div className="foot-cta-copy">
              <h2>Your new co-worker's<br />ready when you are.</h2>
            </div>
            <a
              className="cta-cta"
              href="https://calendly.com/kartik-finsynth/intro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cta-cta-label">Setup a call</span>
              <span className="cta-cta-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12L12 4" />
                  <path d="M5.5 4H12V10.5" />
                </svg>
              </span>
            </a>
          </div>

          {/* RIGHT — nav columns above, Ask-AI below */}
          <div className="foot-right">
            <div className="foot-grid-new foot-reveal">
              <div className="foot-reveal">
                <h4>Product</h4>
                <a href="#use-cases">Use cases</a>
                <a href="#security">Security</a>
              </div>
              <div className="foot-reveal">
                <h4>Legal</h4>
                <a href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <a href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/terms-of-service.pdf" target="_blank" rel="noopener noreferrer">Terms</a>
                <a href="#security">Compliance</a>
              </div>
              <div className="foot-social foot-reveal">
                <h4>Social</h4>
                <div className="foot-social-row">
                  <a href="https://www.linkedin.com/company/finsynthai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.53C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.73C24 .78 23.2 0 22.22 0z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/FinsynthAI" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.23 2.25h6.83l4.71 6.23 5.47-6.23zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="foot-legal foot-reveal">
          <div className="foot-askai">
            <span className="foot-askai-eyebrow">Ask AI about FinSynth</span>
            <div className="foot-askai-row">
              {AGENTS.map((a) => (
                <a
                  key={a.name}
                  className="foot-askai-chip"
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="foot-askai-logo" src={a.logo} alt="" aria-hidden="true" width="15" height="15" />
                  {a.name}
                </a>
              ))}
            </div>
          </div>
          <span className="foot-copyright">© 2026 FinSynth. All rights reserved.</span>
        </div>
      </div>

      <div className="foot-wordmark" aria-hidden="true">
        <span>FINSYNTH</span>
      </div>
    </footer>
  );
}
