import { useEffect, useRef } from 'react';

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
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand foot-reveal">
            <img src="/assets/img/full-logo-white.svg" alt="FinSynth Logo" />
          </div>
          <div className="foot-grid-new">
            <div className="foot-reveal">
              <h4>Product</h4>
              <a href="#how-it-works">How it works</a>
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
              <a href="https://www.linkedin.com/company/finsynthai/" target="_blank" rel="noopener noreferrer">
                <span className="foot-icon">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.53C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.73C24 .78 23.2 0 22.22 0z"/>
                  </svg>
                </span>
                LinkedIn
              </a>
              <a href="https://x.com/FinsynthAI" target="_blank" rel="noopener noreferrer">
                <span className="foot-icon">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.23 2.25h6.83l4.71 6.23 5.47-6.23zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64z"/>
                  </svg>
                </span>
                X
              </a>
            </div>
          </div>
        </div>
        <div className="foot-legal foot-reveal">
          <span>© 2026 FinSynth · Backed by Accel</span>
        </div>
      </div>
    </footer>
  );
}
