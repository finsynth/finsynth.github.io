import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  // Whether the hero or footer is currently on screen — nav stays visible in either.
  const anchorVisible = useRef(true);

  useEffect(() => {
    const hero = document.querySelector('.hero-s2');
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
    const targets = [hero, footer].filter(Boolean);
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
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-link" href="#use-cases">Use cases</a>
          <a className="nav-link" href="#security">Security</a>
          <a className="nav-link" href="#faq">FAQ</a>
        </div>
        <div className="navbar-right">
          <a className="nav-signin" href="https://app.finsynth.ai/" target="_blank" rel="noopener noreferrer">Sign in</a>
          <a className="nav-demo" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Book a demo</a>
        </div>
      </div>
    </nav>
  );
}
