import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/react';
import useMediaQuery from '../hooks/useMediaQuery';
import { ROLES, roleHref, roleLabel } from '../data/roles';
import { SIGNIN_HREF, APP_HREF } from './AskParts';

// The two products live in the same page, so "Product" is a jump menu rather
// than a route switch.
const PRODUCTS = [
  { key: 'excel', label: 'FinSynth for Excel', href: '#excel' },
  { key: 'fia', label: 'Fia', href: '#fia-agent' },
];

// The footer's Careers column, again up here. Same ROLES, so the two can't
// disagree about what's open; each links to its posting on /careers.
const CAREERS = ROLES.map((r) => ({ key: r.key, label: roleLabel(r), href: roleHref(r) }));

/**
 * One nav dropdown. `id` is what the bar's single open-menu state holds, so
 * opening one closes the other instead of leaving two cards hanging open.
 *
 * `flat` is the phone form: inside the mobile sheet there is no hover and no
 * room to float a card, so the group is a disclosure row — the title sits at
 * the same rank as the plain links (Security, FAQ) and tapping it folds its
 * items out underneath. It is a separate render rather than a CSS override
 * because the desktop trigger's mouseenter, emulated on touch just before the
 * tap, would toggle the menu shut the moment it opened. Flat rows carry their
 * own boolean (`flatOpen`/`onToggle`) instead of the bar's single open-menu
 * id: in the sheet both groups can sit expanded at once.
 */
function NavDrop({ id, label, items, open, setOpen, flat, flatOpen, onToggle, onNavigate }) {
  const isOpen = flat ? flatOpen : open === id;

  if (flat) {
    return (
      <div className={`nav-drop nav-drop--flat${isOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="nav-link nav-drop-btn"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {label}
          <svg className="nav-drop-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.75 4.5 6 7.75 9.25 4.5" />
          </svg>
        </button>
        <div className="nav-drop-fold">
          <div className="nav-drop-fold-inner">
            {items.map((it) => (
              <a key={it.key} className="nav-drop-item" href={it.href} onClick={onNavigate}>
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`nav-drop${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(id)}
      onMouseLeave={() => setOpen((cur) => (cur === id ? null : cur))}
    >
      <button
        type="button"
        className="nav-link nav-drop-btn"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {label}
        <svg className="nav-drop-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.75 4.5 6 7.75 9.25 4.5" />
        </svg>
      </button>
      <div className="nav-drop-menu">
        <div className="nav-drop-card">
          {items.map((it) => (
            <a
              key={it.key}
              className="nav-drop-item"
              href={it.href}
              onClick={() => setOpen(null)}
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
    const { isSignedIn: signedIn } = useUser();
    
  const [hidden, setHidden] = useState(false);
  // which desktop menu is open, by id — 'product' | 'careers' | null
  const [openMenu, setOpenMenu] = useState(null);
  // the sheet's disclosure rows are independent of each other, so a set rather
  // than a single id — both groups can sit expanded at once
  const [openFlats, setOpenFlats] = useState(() => new Set());
  const toggleFlat = (id) =>
    setOpenFlats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  // Below this width the link row doesn't fit next to the logo and the CTAs, so
  // it moves behind a button. Same breakpoint as the CSS that lays out the sheet.
  const compact = useMediaQuery('(max-width: 900px)');
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastY = useRef(0);
  // the whole link row, so an outside click is measured against both menus at
  // once rather than each drop watching for itself
  const linksRef = useRef(null);
  const sheetRef = useRef(null);
  const burgerRef = useRef(null);
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
    if (hidden) {
      setOpenMenu(null);
      setSheetOpen(false);
    }
  }, [hidden]);

  // Rotating a phone or dragging a desktop window across the breakpoint swaps
  // which navigation is on screen; the other one's state has to go with it.
  useEffect(() => {
    setSheetOpen(false);
    setOpenMenu(null);
    setOpenFlats(new Set());
  }, [compact]);

  // Close the sheet on Escape or on a tap anywhere outside it, including the
  // page behind — with the links stacked over content, the tap that dismisses
  // is the one people reach for first.
  useEffect(() => {
    if (!sheetOpen) return;
    const onDown = (e) => {
      if (!sheetRef.current?.contains(e.target) && !burgerRef.current?.contains(e.target)) {
        setSheetOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSheetOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  // The sheet's disclosure state goes with the sheet: reopening starts folded.
  useEffect(() => {
    if (!sheetOpen) setOpenFlats(new Set());
  }, [sheetOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e) => {
      if (!linksRef.current?.contains(e.target)) setOpenMenu(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  // Every link in the sheet is a jump on this page, so the sheet has to get out
  // of the way of what it just scrolled to.
  const closeSheet = () => setSheetOpen(false);

  return (
    <nav className={`navbar${hidden ? ' nav-hidden' : ''}${sheetOpen ? ' nav-sheet-open' : ''}`}>
      <div className="navbar-inner">
        <img
          className="navbar-logo"
          src="/assets/img/full-logo.svg"
          alt="FinSynth Logo"
          onClick={() => window.location.href = 'https://finsynth.ai/'}
        />
        {compact ? (
          <div
            id="nav-sheet"
            className={`navbar-sheet${sheetOpen ? ' is-open' : ''}`}
            ref={sheetRef}
            hidden={!sheetOpen}
          >
            <NavDrop id="product" label="Product" items={PRODUCTS} flat flatOpen={openFlats.has('product')} onToggle={() => toggleFlat('product')} onNavigate={closeSheet} />
            <a className="nav-link" href="#security" onClick={closeSheet}>Security</a>
            <a className="nav-link" href="#faq" onClick={closeSheet}>FAQ</a>
            {/* last in the row: hiring is the least of what a visitor came for */}
            <NavDrop id="careers" label="Careers" items={CAREERS} flat flatOpen={openFlats.has('careers')} onToggle={() => toggleFlat('careers')} onNavigate={closeSheet} />
            {/* both actions come down here, stacked as buttons at the foot of
                the panel — the bar itself keeps only the burger */}
            <div className="nav-sheet-actions">
              <a className="nav-signin nav-sheet-btn" href={signedIn ? APP_HREF : SIGNIN_HREF} target="_blank" rel="noopener noreferrer">
                {signedIn ? 'Go to app' : 'Sign in'}
              </a>
              {!signedIn && (
                <a className="nav-demo nav-sheet-btn" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Talk to Us</a>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-links" ref={linksRef}>
            <NavDrop id="product" label="Product" items={PRODUCTS} open={openMenu} setOpen={setOpenMenu} />
            <a className="nav-link" href="#security">Security</a>
            <a className="nav-link" href="#faq">FAQ</a>
            {/* last in the row: hiring is the least of what a visitor came for,
                and the menu has room to open inward from there */}
            <NavDrop id="careers" label="Careers" items={CAREERS} open={openMenu} setOpen={setOpenMenu} />
          </div>
        )}
        <div className="navbar-right">
          {!compact && (
            signedIn ? (
              <a className="nav-signin" href={APP_HREF} target="_blank" rel="noopener noreferrer">Go to app</a>
            ) : (
              <a className="nav-signin" href={SIGNIN_HREF} target="_blank" rel="noopener noreferrer">Sign in</a>
            )
          )}
          {/* on compact this moves into the sheet's footer, beside Sign in */}
          {!signedIn && !compact && (
            <a className="nav-demo" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Talk to Us</a>
          )}
          {compact && (
            <button
              type="button"
              className={`nav-burger${sheetOpen ? ' is-open' : ''}`}
              ref={burgerRef}
              aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sheetOpen}
              aria-controls="nav-sheet"
              onClick={() => setSheetOpen((v) => !v)}
            >
              <span className="nav-burger-bars" aria-hidden="true">
                <i /><i /><i />
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
