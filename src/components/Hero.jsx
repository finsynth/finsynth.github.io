import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { initGrid } from '../utils/gridCanvas'
import { PROMPTS, DEFAULT_RESULT } from '../data/examples'
import { AnswerResult, AnswerThinking, PromptIcon, BOOK_URL } from './AskParts'
import MosaicCanvas from './MosaicCanvas'
import TileMosaicCanvas from './TileMosaicCanvas'
import DotBridgeCanvas from './DotBridgeCanvas'
import BayBridgePixelCanvas from './BayBridgePixelCanvas'
import TryItModal from './TryItModal'

const SEGMENTS = [
  'Hedge Funds',
  'Asset Managers',
  'Family Offices',
  'Sell Side',
]

const TYPE_MS = 28      // per character
const HOLD_MS = 1500    // full word on screen
const SELECT_MS = 380   // selection highlight before delete

const LOAD_MS = 1500    // loader held under the prompt before the result appears
const FILL_MS = 20      // per-char cadence when a prompt types itself in

// Interactive ask demo: clicking the input pops a command-palette overlay
// (3D zoom-in over a dimmed scrim) listing suggested prompts. Choosing one
// types itself into the input and submits; the box then expands into an
// overlay that shows a "responding" animation and streams a canned answer.
function HeroAsk({ onOverlayChange }) {
  const [value, setValue] = useState('')
  const [menu, setMenu] = useState(false)       // suggestion palette open
  const [typing, setTyping] = useState(false)  // a prompt is filling itself in
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(DEFAULT_RESULT) // active example's answer/file/cta
  const inputRef = useRef(null)
  const shellRef = useRef(null)
  const timers = useRef([])

  // Opening the palette lifts the box into a popup: the page stays put behind
  // the scrim while the shell itself glides up to the upper third of the
  // viewport and zooms forward, leaving room for the palette to unfold below.
  const openMenu = () => {
    const shell = shellRef.current
    if (shell) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const rect = shell.getBoundingClientRect()
      const lift = reduce ? 0 : Math.min(0, window.innerHeight * 0.22 - rect.top)
      shell.style.setProperty('--pop-lift', `${lift}px`)
    }
    setMenu(true)
  }

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])

  // close the palette on Escape while it's open
  useEffect(() => {
    if (!menu) return
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); inputRef.current?.blur() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const ask = (text) => {
    const q = text.trim()
    if (!q) return
    clearTimers()
    setMenu(false)
    setTyping(false)
    setQuery(q)
    // Each example prompt has its own answer/file/cta; anything typed freehand
    // falls back to the generic result.
    const found = PROMPTS.find((p) => p.prompt === q) || DEFAULT_RESULT
    setResult(found)
    // Hold a loader under the prompt for a beat, then reveal the result — no
    // fabricated word-by-word streaming; the answer simply lands once "ready".
    setStatus('loading')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setStatus('done'); return }
    timers.current.push(setTimeout(() => setStatus('done'), LOAD_MS))
  }

  // Type the chosen prompt into the input character by character, then submit.
  const pickPrompt = (i) => {
    clearTimers()
    setMenu(false)
    setStatus('idle')
    setQuery('')
    const target = PROMPTS[i].prompt
    inputRef.current?.focus()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setValue(target); setTyping(false); ask(target); return }
    setValue('')
    setTyping(true)
    for (let c = 1; c <= target.length; c++) {
      timers.current.push(setTimeout(() => {
        setValue(target.slice(0, c))
        if (c === target.length) { setTyping(false); ask(target) }
      }, c * FILL_MS))
    }
  }

  const close = () => {
    clearTimers()
    setMenu(false)
    setTyping(false)
    setStatus('idle')
    setQuery('')
    setValue('')
  }

  const open = status !== 'idle'
  // widen the box only once the result table has actually rendered — while the
  // loader is up the box stays at its compact input width, so the loading state
  // never shows an oversized empty panel
  const wide = open && !!result.table && status === 'done'

  // Keep the lifted box pinned just below the sticky nav. The initial --pop-lift
  // is measured once (at menu open) from the compact input's position, but the
  // box then grows through the thinking → responding → table stages and the
  // hero re-centers it, which used to push its top up behind the nav. Re-pin on
  // each height change: measure the box's true layout top (transform off, no
  // paint), then set the lift so its top lands a hair below the nav.
  useLayoutEffect(() => {
    if (!open) return
    const shell = shellRef.current
    if (!shell) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nav = document.querySelector('.navbar')
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 0
    const prevTransition = shell.style.transition
    const prevLift = shell.style.getPropertyValue('--pop-lift')
    // measure the untransformed flow top + height without animating or painting
    shell.style.transition = 'none'
    shell.style.setProperty('--pop-lift', '0px')
    const box = shell.getBoundingClientRect()
    const layoutTop = box.top
    const boxH = box.height
    shell.style.setProperty('--pop-lift', prevLift)
    void shell.offsetHeight
    shell.style.transition = prevTransition
    // center the popup in the viewport (between the nav and the bottom edge);
    // fall back to pinning just below the nav if the box is too tall to center.
    // negative lift = up; clamp to <=0 so we never shove it below its flow slot
    const centeredTop = Math.max(navBottom + 16, (window.innerHeight - boxH) / 2)
    shell.style.setProperty('--pop-lift', `${Math.min(0, centeredTop - layoutTop)}px`)
  }, [open, status, wide])

  // report popup state up so the page can freeze its animated backdrop for the
  // whole interaction: palette open, prompt typing itself in, and the answer
  // overlay — without this the background lurches back to life mid-flow
  useEffect(() => { onOverlayChange?.(menu || open || typing) }, [menu, open, typing, onOverlayChange])

  return (
    <div className="hero-ask">
      {(menu || open || typing) && (
        <div
          className="hero-ask__scrim"
          onMouseDown={() => close()}
          aria-hidden="true"
        />
      )}
      <div ref={shellRef} className={`hero-cmd-shell${open ? ' is-open' : ''}${wide ? ' is-wide' : ''}${menu && !open ? ' is-menu' : ''}${typing ? ' is-typing' : ''}`}>
        {open && (
          <div className="hero-answer" role="dialog" aria-label="FinSynth response">
            <button type="button" className="hero-answer__close" onClick={close} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <p className="hero-answer__query">{query}</p>
            {status === 'loading' ? <AnswerThinking /> : <AnswerResult result={result} />}
          </div>
        )}

        {/* Suggestion palette — pops over the input on focus with a 3D zoom */}
        {menu && !open && (
          <div className="hero-suggest" role="listbox" aria-label="Suggested prompts">
            <span className="hero-suggest__label">Try asking</span>
            {PROMPTS.map((p, i) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                className="hero-suggest__row"
                key={i}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickPrompt(i)}
              >
                <i className="hero-suggest__icon" aria-hidden="true">
                  <PromptIcon name={p.icon} />
                </i>
                <span className="hero-suggest__text">{p.prompt}</span>
                <i className="hero-suggest__go" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </i>
              </button>
            ))}
          </div>
        )}

        {status === 'idle' && (
        <form
          className="hero-cmd"
          onSubmit={(e) => { e.preventDefault(); if (value.trim()) ask(value); else if (menu) pickPrompt(0) }}
        >
          <span className="hero-cmd__lead" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2.2 8h11.6M8 2C5.8 4 5.8 12 8 14M8 2c2.2 2 2.2 10 0 12" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </span>
          {/* read-only: the demo only runs the curated prompts, never a free-typed
              query. Clicking opens the suggestion palette instead of accepting text. */}
          <input
            ref={inputRef}
            className="hero-cmd__input"
            type="text"
            readOnly
            placeholder="Ask FinSynth to pull Apple's gross margin for the last nine quarters…"
            aria-label="Ask FinSynth"
            value={value}
            onFocus={() => { if (!open) openMenu() }}
            onClick={() => { if (!open) openMenu() }}
          />
          {/* enabled once the palette is open or a prompt has been picked (typing
              in / value present); shows the Enter affordance */}
          <button type="submit" className="hero-cmd__submit" aria-label="Submit" disabled={!menu && !value.trim()}>
            <span className="hero-cmd__submit-copy">Enter</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 3v4.5a2 2 0 0 1-2 2H3.5M6 6.5 3 9.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        )}
      </div>
    </div>
  )
}

function RotatingSegment({ paused = false }) {
  const [text, setText] = useState(SEGMENTS[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected
  const rootRef = useRef(null)
  const [hl, setHl] = useState(false) // user's text selection covers the word

  // While the user's own selection sweeps over the word, the blue cell frame
  // would blend into the blue ::selection text — flip it to black instead.
  useEffect(() => {
    const onSel = () => {
      const el = rootRef.current
      if (!el) return
      const sel = document.getSelection()
      setHl(Boolean(sel && sel.rangeCount && !sel.isCollapsed && sel.containsNode(el, true)))
    }
    document.addEventListener('selectionchange', onSel)
    return () => document.removeEventListener('selectionchange', onSel)
  }, [])

  useEffect(() => {
    // paused (ask popup open): drop all timers so the word freezes as-is;
    // on resume the effect re-runs and the cycle picks up from the held word
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let word = 0
    let alive = true
    const timers = []
    const t = (fn, ms) => { if (alive) timers.push(setTimeout(fn, ms)) }

    const typeNext = () => {
      word = (word + 1) % SEGMENTS.length
      const target = SEGMENTS[word]
      setPhase('typing')
      for (let i = 1; i <= target.length; i++) t(() => setText(target.slice(0, i)), i * TYPE_MS)
      t(() => setPhase('hold'), target.length * TYPE_MS + 250)
      t(select, target.length * TYPE_MS + HOLD_MS)
    }

    const select = () => {
      setPhase('selected')
      t(() => { setText(''); typeNext() }, SELECT_MS)
    }

    t(() => { setPhase('hold'); t(select, HOLD_MS) }, 400)

    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [paused])

  return (
    <>
      {/* static copy for screen readers; the animated span is decorative */}
      <span className="sr-only">{SEGMENTS[0]}</span>
      <span ref={rootRef} className={`hero-rotate ${phase}${hl ? ' is-hl' : ''}`} aria-hidden="true">
        <em className="hero-s2-accent">{text}</em>
        <i className="hr-caret" />
        <span className="hr-frame">
          <b className="hr-handle tl" /><b className="hr-handle tr" />
          <b className="hr-handle bl" /><b className="hr-handle br" />
        </span>
      </span>
    </>
  )
}

function Hero({ variant = 'grid', frozen = false, onAskOpenChange, bgImage, bgGlass = false, bare = false }) {
  // 'mosaic' — dithered halftone bg; 'tiles' — full-colour tile-ripple bg;
  // 'globe' — Antimetal-style dot-matrix SF bridge on a blue wash.
  // All share the same content layout (the "mosaic hero").
  const globe = variant === 'globe'
  // both 'globe' and 'mosaic' render the DotBridge tile-mosaic on the bright wash
  const dot = variant === 'globe' || variant === 'mosaic'
  // 'photo' — the Bay Bridge sunset photo pixelated in full colour (no separate
  // backdrop layer; the pixel photo is the whole scene)
  const photo = variant === 'photo'
  const mosaic = variant === 'mosaic' || variant === 'tiles' || globe || photo
  // while any ask popup (palette or answer) is up, hold everything animated
  // still — this hero's own popup, or another hero's via the `frozen` prop
  const [askOpen, setAskOpen] = useState(false)
  // the Try It modal is the other thing that covers the page, and it wants the
  // same stillness behind its scrim
  const [tryOpen, setTryOpen] = useState(false)
  const paused = frozen || askOpen || tryOpen
  // stable identity: HeroAsk re-reports on callback change, so a fresh
  // function every render would make the OTHER heroes clobber the shared
  // "a popup is open" state back to false the moment one hero sets it
  const handleAskOpen = useCallback((v) => setAskOpen(v), [])
  // one report upward covering both overlays, so Home's body.ask-freeze is on
  // whenever either is up rather than whichever spoke last
  const overlayOpen = askOpen || tryOpen
  useEffect(() => { onAskOpenChange?.(overlayOpen) }, [overlayOpen, onAskOpenChange])
  const canvasRef = useRef(null)
  useEffect(() => {
    if (mosaic) return
    return initGrid(canvasRef.current)
  }, [mosaic])

  // Mobile-only "best on desktop" notice — shown once per session as a popup on
  // small screens, then a slim banner stays at the top of the hero as a reminder
  const [showDesktopNote, setShowDesktopNote] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem('fs-desktop-note') === 'seen') return
    } catch { /* storage blocked — still show the notice */ }
    if (window.matchMedia('(max-width: 768px)').matches) setShowDesktopNote(true)
  }, [])
  const dismissDesktopNote = useCallback(() => {
    setShowDesktopNote(false)
    try { sessionStorage.setItem('fs-desktop-note', 'seen') } catch { /* no-op */ }
  }, [])

  return (
    <section className={`hero-s2${mosaic && !dot && !photo ? ' hero-s2--mosaic' : ''}${dot ? ' hero-s2--globe' : ''}${photo ? ' hero-s2--photo' : ''}${bgGlass ? ' hero-s2--glass' : ''}${bare ? ' hero-s2--bare' : ''}`}>
      {/* Mobile-only popup shown first on small screens (once per session) */}
      {showDesktopNote && (
        <div className="hero-desktop-modal" role="dialog" aria-modal="true" aria-labelledby="hero-desktop-modal-title">
          <div className="hero-desktop-modal__scrim" onClick={dismissDesktopNote} />
          <div className="hero-desktop-modal__card">
            <span className="hero-desktop-modal__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3.5" width="20" height="13" rx="1.8" />
                <path d="M8 20.5h8M12 16.5v4" />
              </svg>
            </span>
            <h2 id="hero-desktop-modal-title" className="hero-desktop-modal__title">Best viewed on desktop</h2>
            <button type="button" className="hero-desktop-modal__btn" onClick={dismissDesktopNote}>
              Continue on mobile
            </button>
          </div>
        </div>
      )}
      {/* Mobile-only advisory — hidden on laptop/desktop via CSS media query */}
      <div className="hero-mobile-banner" role="note">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.2" />
          <path d="M5.5 13.5h5M8 11v2.5" />
        </svg>
        <span>For the best experience, view on desktop</span>
      </div>
      {/* bare mode omits the background entirely — the copy is overlaid on top
          of an external backdrop (the pixel-bridge scroll scene) */}
      {!bare && (bgImage ? (
        <div
          className="hero-s2-mosaic hero-s2-imgbg"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      ) : photo ? (
        <BayBridgePixelCanvas stageClassName="hero-s2-mosaic" ariaLabel="" paused={paused} />
      ) : dot ? (
        <DotBridgeCanvas stageClassName="hero-s2-mosaic hero-s2-globe" ariaLabel="" paused={paused} />
      ) : variant === 'tiles' ? (
        <TileMosaicCanvas stageClassName="hero-s2-mosaic" ariaLabel="" centerWash hoverReveal paused={paused} />
      ) : mosaic ? (
        <MosaicCanvas
          mode="mosaic"
          cover
          bars
          stageClassName="hero-s2-mosaic"
          ariaLabel=""
          tileSize={9}
        />
      ) : (
        <canvas ref={canvasRef} className="hero-s2-canvas" data-grid-hero aria-hidden="true"></canvas>
      ))}
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">

        {/* ── ONE BIG CELL ── */}
        <div className={`hero-cell${mosaic ? ' hero-cell--mosaic' : ''}${variant === 'tiles' ? ' hero-cell--tiles' : ''}`}>
          {/* Soft white radial wash behind the copy — lifts the text off the
              photo without hiding it. Sized to the copy block (pill → trust
              line) and clamped to the cell so it never spills past the hero. */}
          {photo && <div className="hero-glow" aria-hidden="true" />}

          {/* Backed-by-Accel pill */}
          <div className="hero-excel-pill">
            <span>Backed by</span>
            <img src="/assets/img/accel-logo-brand.svg" alt="Accel" height="19" />
          </div>

          {/* Heading — two rows, breaking on the comma:
              · the <br /> puts the clause break at the comma, so the rotating
                segment rides the second row with "purpose-built for" rather
                than taking a third row of its own.
              · the nbsp glues "research infrastructure" so that when row one
                does have to wrap (narrow laptops), it breaks after "AI"
                instead of splitting the noun phrase.
              Below 1100px neither row fits and the headline runs to three rows;
              .hero-s2-title reserves that height there so the rotating segment
              can't shove the CTAs around mid-cycle. */}
          <h1 className="hero-s2-title">
            {/* each row is its own block with the leading moved into a margin,
                so text selection paints two separate white strips instead of
                one merged slab (margins aren't covered by ::selection) */}
            <span className="hero-title-row">Auditable AI research&nbsp;infrastructure,</span>
            <span className="hero-title-row">purpose-built for <RotatingSegment paused={paused} /></span>
          </h1>

          <p className="hero-s2-lede">
            Eliminate verification tax, take your research from drafts to
            decision-making.
          </p>

          {/* CTAs — the two primaries: book a call, or run it yourself right
              here. Sign-in lives in the navbar only; returning users don't need
              it competing with the hero's asks. */}
          <div className="hero-s2-ctas">
            <a
              className="hero-s2-cta"
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Us
            </a>
            <button
              type="button"
              className="hero-s2-cta hero-s2-cta--try"
              onClick={() => setTryOpen(true)}
            >
              Try It
            </button>
          </div>

          <p className="hero-s2-trust">
            Trusted by investors from global funds.
          </p>

          {/* Input box + prompts, kept together below the content (mosaic hero only) */}
          {mosaic && <HeroAsk onOverlayChange={handleAskOpen} />}
        </div>

      </div>

      {/* "Try It" — the full prompt box, out of the hero's cramped inline row.
          Mounted only while open so its focus capture and scroll lock are
          plain mount/unmount work. */}
      {tryOpen && <TryItModal onClose={() => setTryOpen(false)} />}
    </section>
  )
}

export default Hero
