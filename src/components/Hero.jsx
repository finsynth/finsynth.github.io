import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { initGrid } from '../utils/gridCanvas'
import MosaicCanvas from './MosaicCanvas'
import TileMosaicCanvas from './TileMosaicCanvas'
import DotBridgeCanvas from './DotBridgeCanvas'
import BayBridgePixelCanvas from './BayBridgePixelCanvas'

const ROLES = [
  'buy-side analysts',
  'hedge funds',
  'asset managers',
  'equity research',
]

const TYPE_MS = 28      // per character
const HOLD_MS = 1500    // full word on screen
const SELECT_MS = 380   // selection highlight before delete

const BOOK_URL = 'https://calendly.com/kartik-finsynth/intro'

// Each suggested prompt is its own worked example ("sheet"): the prompt the
// user asks, the answer FinSynth streams back (`response`), the workbook it
// would hand off (`file`), and a tailored closing CTA. Choosing a prompt runs
// its example end to end; a free-typed query falls back to DEFAULT_RESULT.
const PROMPTS = [
  {
    icon: 'trend',
    prompt:
      "Pull Apple's gross margin for the last nine quarters, and flag any quarter it moved more than 200 basis points.",
    response:
      "Nine quarters, checked one by one against a real threshold. Nothing here crossed 200bps, and FinSynth says so instead of manufacturing a story that isn't there.",
    file: 'Apple_Gross_Margin.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD millions unless noted · fiscal year Oct–Sep · as-of 2026-07-22',
      cols: ['Quarter', 'Period Ending', 'Revenue', 'Gross Profit', 'Gross Margin', 'QoQ Δ (bps)', '>200 bps'],
      // source-pulled figures rendered as blue cited links (computed columns stay plain)
      linkCols: [2, 3],
      rows: [
        ['Q2 2024', '30-Mar-24', '90,753', '42,271', '46.6%', '', ''],
        ['Q3 2024', '29-Jun-24', '85,777', '39,678', '46.3%', '(32)', ''],
        ['Q4 2024', '28-Sep-24', '94,930', '43,879', '46.2%', '(3)', ''],
        ['Q1 2025', '28-Dec-24', '124,300', '58,275', '46.9%', '66', ''],
        ['Q2 2025', '29-Mar-25', '95,359', '44,867', '47.1%', '17', ''],
        ['Q3 2025', '28-Jun-25', '94,036', '43,718', '46.5%', '(56)', ''],
        ['Q4 2025', '27-Sep-25', '102,466', '48,341', '47.2%', '69', ''],
        ['Q1 2026', '27-Dec-25', '143,756', '69,231', '48.2%', '98', ''],
        ['Q2 2026', '28-Mar-26', '111,184', '54,781', '49.3%', '111', ''],
      ],
    },
  },
  {
    icon: 'table',
    prompt:
      'Build a comparables table for the ten largest semiconductor names on EV/EBITDA, P/E, and revenue growth.',
    response:
      "Ten names, median and mean calculated automatically. It also catches the details an analyst would: SK hynix flagged as KRW-listed, Intel's P/E marked n/a on negative earnings, not left as a broken number.",
    file: 'Semiconductor_Comps.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD · Mkt Cap in $B · P/E and EV/EBITDA trailing (TTM) · Rev growth = latest completed FY (YoY) · as-of 2026-07-22',
      cols: ['Company', 'Ticker', 'Mkt Cap ($B)', 'P/E (TTM)', 'EV/EBITDA', 'Rev Growth (FY YoY)', 'Growth FY'],
      // source-pulled figures rendered as blue cited links (computed columns / aggregate rows stay plain)
      linkCols: [2, 3, 4, 5],
      rows: [
        ['NVIDIA', 'NVDA', '5,020.8', '31.75', '30.09', '65.5%', 'FY2026'],
        ['Taiwan Semiconductor', 'TSM', '2,202.2', '27.58', '18.49', '31.6%', 'FY2025'],
        ['Broadcom', 'AVGO', '1,838.8', '64.32', '44.77', '23.9%', 'FY2025'],
        ['SK hynix', '000660.KS', '1,220.5', '17.38', '14.33', '46.8%', 'FY2025'],
        ['Micron', 'MU', '1,096.4', '21.91', '15.72', '48.9%', 'FY2025'],
        ['AMD', 'AMD', '887.7', '181.55', '118.34', '34.3%', 'FY2025'],
        ['ASML', 'ASML', '694.3', '57.54', '44.97', '9.8%', 'FY2025'],
        ['Intel', 'INTC', '530.0', 'n/a', '38.23', '-0.5%', 'FY2025'],
        ['Applied Materials', 'AMAT', '448.2', '53.10', '48.22', '4.4%', 'FY2025'],
        ['Lam Research', 'LRCX', '402.7', '60.82', '51.18', '23.7%', 'FY2025'],
        ['Median', '', '992.1', '53.10', '41.50', '27.7%', ''],
        ['Mean', '', '1,434.2', '57.33', '42.43', '28.8%', ''],
      ],
    },
  },
  {
    icon: 'refresh',
    prompt:
      "Track how Meta's guidance has compared to what it actually delivered, over the last twelve quarters.",
    response:
      'Twelve quarters of guidance versus actuals, categorized and summarized: 7 quarters beat the top of the range, 5 landed inside it, 0 missed. A track record, not just a data pull.',
    file: 'Meta_Guidance_vs_Actual.xlsx',
    cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
    table: {
      note: 'USD millions · Guidance = next-quarter revenue range (stated in $B, shown here in $M) · Actual = reported total revenue · as-of 2026-07-22',
      cols: ['Quarter', 'Guide Low', 'Guide High', 'Guide Mid', 'Actual Rev', 'Act − Mid', 'Act vs Mid %', 'Act − High', 'Result vs Range'],
      // source-pulled figures rendered as blue cited links (computed columns stay plain)
      linkCols: [1, 2, 4],
      rows: [
        ['Jun-23A', '29,500', '32,000', '30,750', '31,999', '1,249', '4.1%', '(1)', 'In range'],
        ['Sep-23A', '32,000', '34,500', '33,250', '34,146', '896', '2.7%', '(354)', 'In range'],
        ['Dec-23A', '36,500', '40,000', '38,250', '40,111', '1,861', '4.9%', '111', 'Above high'],
        ['Mar-24A', '34,500', '37,000', '35,750', '36,455', '705', '2.0%', '(545)', 'In range'],
        ['Jun-24A', '36,500', '39,000', '37,750', '39,071', '1,321', '3.5%', '71', 'Above high'],
        ['Sep-24A', '38,500', '41,000', '39,750', '40,589', '839', '2.1%', '(411)', 'In range'],
        ['Dec-24A', '45,000', '48,000', '46,500', '48,385', '1,885', '4.1%', '385', 'Above high'],
        ['Mar-25A', '39,500', '41,800', '40,650', '42,314', '1,664', '4.1%', '514', 'Above high'],
        ['Jun-25A', '42,500', '45,500', '44,000', '47,516', '3,516', '8.0%', '2,016', 'Above high'],
        ['Sep-25A', '47,500', '50,500', '49,000', '51,242', '2,242', '4.6%', '742', 'Above high'],
        ['Dec-25A', '56,000', '59,000', '57,500', '59,893', '2,393', '4.2%', '893', 'Above high'],
        ['Mar-26A', '53,500', '56,500', '55,000', '56,311', '1,311', '2.4%', '(189)', 'In range'],
      ],
    },
  },
]

// Fallback for a query the user types themselves (not one of the examples).
const DEFAULT_RESULT = {
  response:
    "On it. I've pulled the figures, traced each one back to its source filing, and staged the update for your review. Nothing is written to your model until you approve every cell.",
  file: 'FinSynth_Output.xlsx',
  cta: 'Click any number to cross-check and our webapp takes you straight to the source, the relevant passage highlighted.',
  table: {
    cols: ['Metric', 'Value', 'Source'],
    linkCols: [1],
    rows: [
      ['Revenue', '$391.0B', '10-K · p.31'],
      ['Gross margin', '46.2%', '10-K · p.32'],
      ['Operating income', '$123.2B', '10-K · p.31'],
    ],
  },
}

const LOAD_MS = 1500    // loader held under the prompt before the result appears
const FILL_MS = 20      // per-char cadence when a prompt types itself in

// The workbook bar beneath a result table: just the Excel icon and the file
// name. The booking CTA lives once, pinned at the bottom of the answer, rather
// than repeated here inside the table.
function XlsDownload({ file }) {
  return (
    <div className="hero-answer__xls-bar">
      <span className="hero-answer__xls-ic" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 32 32">
          <rect x="1" y="7" width="17" height="18" rx="1.8" fill="#107C41" />
          <path fill="#fff" d="M5.1 21.5l3.1-4.9-2.85-4.6h2.3l1.55 2.9c.15.3.25.5.3.65h.02c.1-.25.2-.47.32-.68l1.66-2.87h2.12l-2.92 4.58 3 4.92h-2.26l-1.8-3.36c-.08-.15-.15-.3-.21-.47h-.03c-.05.16-.12.3-.2.46l-1.85 3.37z" />
          <path fill="#21A366" d="M20 2h-2v7h13V3.5c0-.83-.67-1.5-1.5-1.5z" />
          <path fill="#107C41" d="M18 16h13v7H18zM18 9h13v7H18z" />
          <path fill="#185C37" d="M18 23h13v5.5c0 .83-.67 1.5-1.5 1.5H18z" />
        </svg>
      </span>
      <span className="hero-answer__xls-name">{file}</span>
    </div>
  )
}

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
            {status === 'loading' ? (
              <div className="hero-answer__thinking" aria-live="polite">
                <span className="hero-answer__brand">FinSynth</span>
                <span className="hero-answer__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            ) : (
              <>
                  <p className="hero-answer__body">{result.response}</p>
                  <div className="hero-answer__after">
                    {result.table && (
                      <div className="hero-answer__xls">
                        <XlsDownload key={result.file} file={result.file} />
                        {result.table.note && (
                          <p className="hero-answer__xls-note">{result.table.note}</p>
                        )}
                        <div className="hero-answer__xls-scroll">
                          <table className="hero-answer__xls-tbl">
                            <thead>
                              <tr>
                                {result.table.cols.map((c) => <th key={c}>{c}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {result.table.rows.map((r, ri) => {
                                // aggregate rows (Median/Mean) are computed, not sourced — leave plain
                                const agg = r[0] === 'Median' || r[0] === 'Mean'
                                return (
                                <tr key={ri}>
                                  {r.map((cell, ci) => {
                                    // source-pulled figures render as blue Excel-style cited links
                                    const cited = !agg && result.table.linkCols?.includes(ci) && cell && cell !== 'n/a'
                                    return (
                                      <td key={ci}>
                                        {cited ? (
                                          <span className="hero-answer__cell-link">{cell}</span>
                                        ) : cell}
                                      </td>
                                    )
                                  })}
                                </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    <div className="hero-answer__cta">
                      <span className="hero-answer__cta-copy">{result.cta}</span>
                      <a className="hero-answer__cta-btn" href={BOOK_URL} target="_blank" rel="noopener noreferrer">
                        Book a demo
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  </div>
              </>
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

function RotatingRole({ paused = false }) {
  const [text, setText] = useState(ROLES[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected

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
  }, [paused])

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

function Hero({ variant = 'grid', frozen = false, onAskOpenChange, bgImage, bare = false }) {
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
  const paused = frozen || askOpen
  // stable identity: HeroAsk re-reports on callback change, so a fresh
  // function every render would make the OTHER heroes clobber the shared
  // "a popup is open" state back to false the moment one hero sets it
  const handleAskOpen = useCallback((v) => {
    setAskOpen(v)
    onAskOpenChange?.(v)
  }, [onAskOpenChange])
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
    <section className={`hero-s2${mosaic && !dot && !photo ? ' hero-s2--mosaic' : ''}${dot ? ' hero-s2--globe' : ''}${photo ? ' hero-s2--photo' : ''}${bare ? ' hero-s2--bare' : ''}`}>
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
          {/* Soft white radial glow behind the copy — lifts the text off the
              pixel mosaic without hiding it */}
          {photo && (
            <svg className="hero-glow" viewBox="0 0 851 897" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <ellipse cx="437" cy="386" rx="414" ry="392" fill="url(#paint0_radial_83_3717)" />
              <ellipse cx="414" cy="505" rx="414" ry="392" fill="url(#paint1_radial_83_3717)" />
              <defs>
                <radialGradient id="paint0_radial_83_3717" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(437 386) rotate(89.9989) scale(424.48 448.303)">
                  <stop stopColor="white" />
                  <stop offset="0.87954" stopColor="#F6F7F7" stopOpacity="0.04" />
                </radialGradient>
                <radialGradient id="paint1_radial_83_3717" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(414 505) rotate(89.9989) scale(424.48 448.303)">
                  <stop stopColor="white" />
                  <stop offset="0.87954" stopColor="#F6F7F7" stopOpacity="0.04" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* Backed-by-Accel pill */}
          <div className="hero-excel-pill">
            <span>Backed by</span>
            <img src="/assets/img/accel-logo-brand.svg" alt="Accel" height="19" />
          </div>

          {/* Heading */}
          <h1 className="hero-s2-title">
            The auditable spreadsheet<br />
            agent for <RotatingRole paused={paused} />
          </h1>

          {/* Supporting claims — shown as compact chips, two per row */}
          <ul className="hero-s2-claims" aria-label="What FinSynth delivers">
            <li className="hero-s2-claim">Global coverage</li>
            <li className="hero-s2-claim">Cell-level citations</li>
            <li className="hero-s2-claim hero-s2-claim--excel" aria-label="Built for Excel">
              Built for
              <span className="hero-s2-claim__ic" aria-hidden="true">
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
            </li>
            <li className="hero-s2-claim">Enterprise ready</li>
          </ul>

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
              href="https://web-agent.finsynth.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign in
            </a>
          </div>

          <p className="hero-s2-trust">
            Backed by Accel &amp; industry angels. Trusted by investors from global funds.
          </p>

          {/* Input box + prompts, kept together below the content (mosaic hero only) */}
          {mosaic && <HeroAsk onOverlayChange={handleAskOpen} />}
        </div>

      </div>
    </section>
  )
}

export default Hero
