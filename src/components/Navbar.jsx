import { useEffect, useRef, useState } from 'react';
import useSignedIn from '../hooks/useSignedIn';

// The two products live in the same page, so "Product" is a jump menu rather
// than a route switch.
const PRODUCTS = [
  { key: 'excel', label: 'FinSynth for Excel', href: '#excel' },
  { key: 'fia', label: 'Fia', href: '#fia-agent' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const signedIn = useSignedIn();
  const lastY = useRef(0);
  const productRef = useRef(null);
  // Whether the hero or footer is currently on screen — nav stays visible in either.
  const anchorVisible = useRef(true);

  useEffect(() => {
    const heroes = Array.from(document.querySelectorAll('.hero-s2'));
    const footer = document.querySelector('.footer-new');

    const update = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // Near the very top there's nothing to hide behind — keep it shown.
      const atTop = y < 80;

      if (anchorVisible.current || atTop || !goingDown) {
        setHidden(false);
      } else {
        setHidden(true);
      }
      lastY.current = y;
    };

    const onScroll = () => window.requestAnimationFrame(update);

    let observer;
    const targets = [...heroes, footer].filter(Boolean);
    if (targets.length) {
      const seen = new Set();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) seen.add(e.target);
            else seen.delete(e.target);
          });
          anchorVisible.current = seen.size > 0;
          update();
        },
        { threshold: 0 }
      );
      targets.forEach((t) => observer.observe(t));
    }

    lastY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  // A menu left open while the bar slides away would hang in mid-air.
  useEffect(() => {
    if (hidden) setProductOpen(false);
  }, [hidden]);

  useEffect(() => {
    if (!productOpen) return;
    const onDown = (e) => {
      if (!productRef.current?.contains(e.target)) setProductOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setProductOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [productOpen]);

  return (
    <nav className={`navbar${hidden ? ' nav-hidden' : ''}`}>
      <div className="navbar-inner">
        <img
          className="navbar-logo"
          src="/assets/img/full-logo.svg"
          alt="FinSynth Logo"
          onClick={() => window.location.href = 'https://finsynth.ai/'}
        />
        <div className="navbar-links">
          <div
            className={`nav-drop${productOpen ? ' is-open' : ''}`}
            ref={productRef}
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button
              type="button"
              className="nav-link nav-drop-btn"
              aria-haspopup="true"
              aria-expanded={productOpen}
              onClick={() => setProductOpen((o) => !o)}
            >
              Product
              <svg className="nav-drop-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.75 4.5 6 7.75 9.25 4.5" />
              </svg>
            </button>
            <div className="nav-drop-menu">
              <div className="nav-drop-card">
                {PRODUCTS.map((p) => (
                  <a
                    key={p.key}
                    className="nav-drop-item"
                    href={p.href}
                    onClick={() => setProductOpen(false)}
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a className="nav-link" href="#security">Security</a>
          <a className="nav-link" href="#faq">FAQ</a>
        </div>
        <div className="navbar-right">
          {signedIn ? (
            <a className="nav-signin" href="https://webapp.finsynth.ai/agent" target="_blank" rel="noopener noreferrer">Go to app</a>
          ) : (
            <a className="nav-signin" href="https://webapp.finsynth.ai/signin?redirectPath=%2Fagent" target="_blank" rel="noopener noreferrer">Sign in</a>
          )}
          <a className="nav-demo" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Talk to Us</a>
        </div>
      </div>
    </nav>
  );
}
