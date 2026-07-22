import { useEffect, useRef, useState } from 'react'
import { initGrid } from '../utils/gridCanvas'
import MosaicCanvas from './MosaicCanvas'
import TileMosaicCanvas from './TileMosaicCanvas'
import DotBridgeCanvas from './DotBridgeCanvas'

const ROLES = [
  'buy-side analysts',
  'hedge funds',
  'asset managers',
  'equity research',
]

const TYPE_MS = 45      // per character
const HOLD_MS = 2600    // full word on screen
const SELECT_MS = 620   // selection highlight before delete

// Prompt pills shown on the mosaic hero (Twenty-style "ask it anything" row)
const PROMPTS = [
  { text: "Pull Apple's gross margin for the last three quarters.", icon: 'trend' },
  { text: 'Build a comparables table for Nvidia, AMD, and Broadcom on EV/EBITDA.', icon: 'table' },
  { text: "Update my Microsoft model for this quarter's numbers.", icon: 'refresh' },
]

// Same canned answer for every prompt (per spec). ~30 words.
const DEMO_ANSWER =
  "On it. I've pulled the figures, traced each one back to its source filing, and staged the update for your review — nothing is written to your model until you approve every cell."

const THINK_MS = 1700   // "responding" animation before the answer streams in
const WORD_MS = 45      // per-word reveal cadence
const FILL_MS = 20      // per-char cadence when a prompt types itself in

// Interactive ask demo: clicking the input pops a command-palette overlay
// (3D zoom-in over a dimmed scrim) listing suggested prompts. Choosing one
// types itself into the input and submits; the box then expands into an
// overlay that shows a "responding" animation and streams a canned answer.
function HeroAsk() {
  const [value, setValue] = useState('')
  const [menu, setMenu] = useState(false)       // suggestion palette open
  const [typing, setTyping] = useState(false)  // a prompt is filling itself in
  const [status, setStatus] = useState('idle') // idle | thinking | responding
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(0)         // words revealed so far
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

  const words = DEMO_ANSWER.split(' ')

  const ask = (text) => {
    const q = text.trim()
    if (!q) return
    clearTimers()
    setMenu(false)
    setTyping(false)
    setQuery(q)
    setShown(0)
    setStatus('thinking')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStatus('responding')
      setShown(words.length)
      return
    }
    timers.current.push(setTimeout(() => {
      setStatus('responding')
      for (let i = 1; i <= words.length; i++) {
        timers.current.push(setTimeout(() => setShown(i), i * WORD_MS))
      }
    }, THINK_MS))
  }

  // Type the chosen prompt into the input character by character, then submit.
  const pickPrompt = (i) => {
    clearTimers()
    setMenu(false)
    setStatus('idle')
    setQuery('')
    setShown(0)
    const target = PROMPTS[i].text
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
    setShown(0)
  }

  const open = status !== 'idle'

  return (
    <div className="hero-ask">
      {menu && !open && (
        <div className="hero-ask__scrim" onMouseDown={() => setMenu(false)} aria-hidden="true" />
      )}
      <div ref={shellRef} className={`hero-cmd-shell${open ? ' is-open' : ''}${menu && !open ? ' is-menu' : ''}${typing ? ' is-typing' : ''}`}>
        {open && (
          <div className="hero-answer" role="dialog" aria-label="FinSynth response">
            <button type="button" className="hero-answer__close" onClick={close} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <p className="hero-answer__query">{query}</p>
            {status === 'thinking' ? (
              <div className="hero-answer__thinking" aria-live="polite">
                <span className="hero-answer__brand">FinSynth</span>
                <span className="hero-answer__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            ) : (
              <p className="hero-answer__body" aria-live="polite">
                {words.map((w, i) => (
                  <span key={i} className={`hero-answer__w${i < shown ? ' in' : ''}`}>{w} </span>
                ))}
              </p>
            )}
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
                <span className="hero-suggest__text">{p.text}</span>
                <i className="hero-suggest__go" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </i>
              </button>
            ))}
          </div>
        )}

        {status !== 'responding' && (
        <form
          className="hero-cmd"
          onSubmit={(e) => { e.preventDefault(); ask(value) }}
        >
          <span className="hero-cmd__lead" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2.2 8h11.6M8 2C5.8 4 5.8 12 8 14M8 2c2.2 2 2.2 10 0 12" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="hero-cmd__input"
            type="text"
            placeholder="Ask FinSynth to pull, model, or audit any number…"
            aria-label="Ask FinSynth"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => { if (!open) openMenu() }}
            onClick={() => { if (!open) openMenu() }}
          />
          <button type="submit" className="hero-cmd__submit" aria-label="Submit">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        )}
      </div>
    </div>
  )
}

function PromptIcon({ name }) {
  const common = { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }
  if (name === 'table')
    return (
      <svg {...common}>
        <rect x="2" y="2.5" width="12" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 6h12M6 6v7.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  if (name === 'refresh')
    return (
      <svg {...common}>
        <path d="M13 8a5 5 0 1 1-1.46-3.54" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M13 2.5V5h-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M2.5 10.5l3.5-3.5 2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4.5h3.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RotatingRole() {
  const [text, setText] = useState(ROLES[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let word = 0
    let alive = true
    const timers = []
    const t = (fn, ms) => { if (alive) timers.push(setTimeout(fn, ms)) }

    const typeNext = () => {
      word = (word + 1) % ROLES.length
      const target = ROLES[word]
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
  }, [])

  return (
    <>
      {/* static copy for screen readers; the animated span is decorative */}
      <span className="sr-only">{ROLES[0]}</span>
      <span className={`hero-rotate ${phase}`} aria-hidden="true">
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

function Hero({ variant = 'grid' }) {
  // 'mosaic' — dithered halftone bg; 'tiles' — full-colour tile-ripple bg;
  // 'globe' — Antimetal-style dot-matrix SF bridge on a blue wash.
  // All share the same content layout (the "mosaic hero").
  const globe = variant === 'globe'
  // both 'globe' and 'mosaic' render the DotBridge tile-mosaic on the bright wash
  const dot = variant === 'globe' || variant === 'mosaic'
  const mosaic = variant === 'mosaic' || variant === 'tiles' || globe
  const canvasRef = useRef(null)
  useEffect(() => {
    if (mosaic) return
    return initGrid(canvasRef.current)
  }, [mosaic])

  return (
    <section className={`hero-s2${mosaic && !dot ? ' hero-s2--mosaic' : ''}${dot ? ' hero-s2--globe' : ''}`}>
      {dot ? (
        <DotBridgeCanvas stageClassName="hero-s2-mosaic hero-s2-globe" ariaLabel="" />
      ) : variant === 'tiles' ? (
        <TileMosaicCanvas stageClassName="hero-s2-mosaic" ariaLabel="" centerWash hoverReveal />
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
      )}
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">

        {/* ── ONE BIG CELL ── */}
        <div className={`hero-cell${mosaic ? ' hero-cell--mosaic' : ''}${variant === 'tiles' ? ' hero-cell--tiles' : ''}`}>
          {/* Backed-by-Accel pill */}
          <div className="hero-excel-pill">
            <span>Backed by</span>
            <img src="/assets/img/accel-logo-brand.svg" alt="Accel" height="19" />
          </div>

          {/* Heading */}
          <h1 className="hero-s2-title">
            The auditable spreadsheet agent for{' '}
            <RotatingRole />
          </h1>

          {/* Supporting paragraph */}
          <p className="hero-s2-sub">
            Works inside your{' '}
            <span className="excel-inline" aria-hidden="true" style={{display:'inline-flex',verticalAlign:'-3px',marginRight:'5px'}}>
              <svg width="17" height="17" viewBox="0 0 32 32" aria-hidden="true">
                <path fill="#185C37" d="M20 16l-11-2v14.5c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5V23z" />
                <path fill="#21A366" d="M20 2h-9.5C9.67 2 9 2.67 9 3.5V9l11 7 5.5 2L31 16V9z" />
                <path fill="#107C41" d="M9 9h11v7H9z" />
                <path fill="#33C481" d="M29.5 2H20v7h11V3.5c0-.83-.67-1.5-1.5-1.5z" />
                <path fill="#107C41" d="M31 16H20v7h11z" />
                <path fill="#134A2C" d="M16.67 7H9v18h7.67c.73 0 1.33-.6 1.33-1.33V8.33C18 7.6 17.4 7 16.67 7z" opacity=".4" />
                <rect x="1" y="7" width="17" height="18" rx="1.8" fill="#107C41" />
                <path fill="#fff" d="M5.1 21.5l3.1-4.9-2.85-4.6h2.3l1.55 2.9c.15.3.25.5.3.65h.02c.1-.25.2-.47.32-.68l1.66-2.87h2.12l-2.92 4.58 3 4.92h-2.26l-1.8-3.36c-.08-.15-.15-.3-.21-.47h-.03c-.05.16-.12.3-.2.46l-1.85 3.37z" />
              </svg>
            </span>
            Excel. Every number traces back to its source.
          </p>

          {/* CTAs — primary demo + secondary sign-in */}
          <div className="hero-s2-ctas">
            <a
              className="hero-s2-cta"
              href="https://calendly.com/kartik-finsynth/intro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a demo
            </a>
            <a
              className="hero-s2-cta hero-s2-cta--ghost"
              href="https://app.finsynth.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign in
            </a>
          </div>

          {/* Trust line */}
          <p className="hero-trust-line">
            Trusted by investors from leading global hedge funds and asset managers
          </p>

          {/* Input box + prompts, kept together below the content (mosaic hero only) */}
          {mosaic && <HeroAsk />}
        </div>

      </div>
    </section>
  )
}

export default Hero
