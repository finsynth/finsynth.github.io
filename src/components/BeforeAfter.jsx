import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'

// Per-tab cards. The "before" side is always a fragmented manual flow (stacked
// step cards); the "after" side gets a composition tailored to that tab's
// content — a model grid, a coverage tile-wall, a cited answer, or a live diff —
// so no two tabs look alike. Each tab also carries its own accent tone.
const SHEETS = [
  {
    tab: 'Model building',
    tone: 'indigo',
    oldLead: 'Every model starts from a blank sheet — every comp pulled by hand.',
    newLead: 'A model in minutes, comps across the whole peer set.',
    before: [
      { icon: 'grid', label: 'Open a blank workbook' },
      { icon: 'bars', label: 'Pull each peer by hand' },
    ],
    cost: 'Hours before the first number',
    after: {
      kind: 'grid',
      chips: ['Model in minutes', 'Comps auto-filled'],
      grid: {
        cols: ['Peer', 'EV/EBITDA', 'Rev'],
        rows: [
          ['AAPL', '18.4×', '$391B'],
          ['MSFT', '22.1×', '$245B'],
          ['NVDA', '31.7×', '$61B'],
        ],
        hot: [1, 2],
      },
    },
  },
  {
    tab: 'Coverage & scale',
    tone: 'emerald',
    oldLead: 'The names you can cover are capped by the hours in the day.',
    newLead: '2× the names, same headcount — filings read in minutes.',
    before: [
      { icon: 'bolt', label: 'Capped by hours in the day' },
      { icon: 'doc', label: 'A full day per filing' },
    ],
    cost: 'Half the coverage you want',
    after: {
      kind: 'tiles',
      chips: ['2× the names', 'Summaries in minutes'],
      tiles: ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'AVGO', 'TSLA', '+42'],
    },
  },
  {
    tab: 'Trust & verification',
    tone: 'violet',
    oldLead: 'Tracing one number back to its filing eats the afternoon.',
    newLead: 'Minutes, citation attached — an answer you can defend in the room.',
    before: [
      { icon: 'scan', label: 'Hours tracing one number' },
      { icon: 'quote', label: 'Hope the source is right' },
    ],
    cost: 'An answer you can’t fully defend',
    after: {
      kind: 'highlight',
      chips: ['4 min, cited', 'Defensible'],
      label: 'FY24 revenue',
      text: 'Total net sales were ',
      mark: '$391.0B',
      cite: 'SEC 10-K · p.31',
    },
  },
  {
    tab: 'Monitoring & earnings',
    tone: 'amber',
    oldLead: 'Every release means re-keying the model by hand.',
    newLead: 'The model updates itself the moment the release hits, citations attached.',
    before: [
      { icon: 'grid', label: 'Re-key the model by hand' },
      { icon: 'bars', label: 'Manual consensus check' },
    ],
    cost: 'A scramble every earnings day',
    after: {
      kind: 'diff',
      chips: ['Auto-updated', 'Gaps flagged'],
      trigger: 'Earnings hit · 8:31am',
      ref: 'B14',
      from: '$88.1B',
      to: '$94.9B',
      cite: '10-Q · Q3',
    },
  },
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const smooth = (t) => t * t * (3 - 2 * t) // smoothstep — eases the zoom in/out

const OUTRO = 'FinSynth does it all'
const ZOOM_MIN = 0.86 // scale when the section is fully outside the locked zone

// ── Inline monochrome glyphs (no external icon dep) ──
const GLYPHS = {
  doc: <path d="M4 2h6l3 3v9H4z M10 2v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" />,
  grid: (
    <>
      <rect x="2.5" y="2.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  bars: <path d="M3 12V7M7 12V3M11 12V9" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />,
  scan: (
    <>
      <circle cx="7" cy="6.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.4 9L12 11.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  bolt: <path d="M8 2L4 8h3l-1 4 4-6H7z" fill="currentColor" />,
  quote: <path d="M3 4h4v4H4v3M7 4h4v4H8v3" fill="none" stroke="currentColor" strokeWidth="1.2" />,
  tool: (
    <>
      <circle cx="7" cy="7" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.5v2.5l1.6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </>
  ),
  check: <path d="M3 7.5l2.5 2.5L11 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  down: <path d="M7 2.5v9M3.5 8L7 11.5 10.5 8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />,
  arrowR: <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  alert: (
    <>
      <path d="M7 2.5L12.5 12h-11z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 6v2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10.2" r=".7" fill="currentColor" />
    </>
  ),
  cite: (
    <>
      <path d="M4 2h5l3 3v9H4z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9 2v3h3M5.8 8h4.4M5.8 10.4h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
}

function Glyph({ name }) {
  return (
    <svg className="ba-gl" viewBox="0 0 14 14" aria-hidden="true">
      {GLYPHS[name] || GLYPHS.doc}
    </svg>
  )
}

// "Before" — a fragmented manual flow: stacked step cards joined by a down
// arrow, ending in the cost of doing it by hand.
function BeforeGraph({ sheet }) {
  return (
    <div className="ba-flow">
      {sheet.before.map((s, i) => (
        <div className="ba-frag-row" key={i}>
          <div className="ba-frag">
            <span className="ba-frag-ic"><Glyph name={s.icon} /></span>
            <span>{s.label}</span>
          </div>
          {i < sheet.before.length - 1 && (
            <span className="ba-frag-arrow" aria-hidden="true"><Glyph name="down" /></span>
          )}
        </div>
      ))}
      <div className="ba-cost">
        <Glyph name="alert" />
        <span>{sheet.cost}</span>
      </div>
    </div>
  )
}

// A mini spreadsheet card — the model + comps FinSynth builds.
function AfterGrid({ data }) {
  return (
    <div className="ba-sheet">
      <div className="ba-sheet-bar"><i /><i /><i /><span>Model_Build.xlsx</span></div>
      <table className="ba-tbl">
        <thead>
          <tr>{data.cols.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => (
                <td key={ci} className={data.hot && data.hot[0] === ri && data.hot[1] === ci ? 'hot' : ''}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// A tile-wall of tickers — coverage at scale.
function AfterTiles({ tiles }) {
  return (
    <div className="ba-tiles">
      {tiles.map((t, i) => (
        <span className={`ba-tile${t.startsWith('+') ? ' ba-tile--more' : ''}`} key={i}>{t}</span>
      ))}
    </div>
  )
}

// A cited answer — highlighted value with its source attached.
function AfterHighlight({ a }) {
  return (
    <div className="ba-hl">
      <span className="ba-hl-label">{a.label}</span>
      <p className="ba-hl-text">{a.text}<mark>{a.mark}</mark></p>
      <span className="ba-hl-cite"><Glyph name="cite" />{a.cite}</span>
    </div>
  )
}

// A live diff — the model updating itself the moment a release lands.
function AfterDiff({ a }) {
  return (
    <div className="ba-diffcard">
      <div className="ba-diff-trigger"><span className="ba-live" />{a.trigger}</div>
      <div className="ba-diff-row">
        <span className="ba-diff-ref">{a.ref}</span>
        <span className="ba-diff-from">{a.from}</span>
        <span className="ba-diff-arrow"><Glyph name="arrowR" /></span>
        <span className="ba-diff-to">{a.to}</span>
      </div>
      <span className="ba-hl-cite"><Glyph name="cite" />{a.cite}</span>
    </div>
  )
}

// "After" — a composition tailored to the tab, plus the outcome chips.
function AfterGraph({ sheet }) {
  const a = sheet.after
  return (
    <div className="ba-after">
      <div className="ba-after-canvas">
        {a.kind === 'grid' && <AfterGrid data={a.grid} />}
        {a.kind === 'tiles' && <AfterTiles tiles={a.tiles} />}
        {a.kind === 'highlight' && <AfterHighlight a={a} />}
        {a.kind === 'diff' && <AfterDiff a={a} />}
      </div>
      <div className="ba-chips">
        {a.chips.map((c, i) => (
          <span className="ba-chip" key={i}><Glyph name="check" />{c}</span>
        ))}
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const ref = useReveal()
  const trackRef = useRef(null)
  const zoomRef = useRef(null)
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState(0)
  const lastStep = active === SHEETS.length - 1

  // Typewriter outro (Parker ends its stepper with a typed line). Types out
  // once the final step is reached; resets if the user scrolls back up.
  useEffect(() => {
    if (!lastStep) {
      setTyped(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(OUTRO.length)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(i)
      if (i >= OUTRO.length) clearInterval(id)
    }, 32)
    return () => clearInterval(id)
  }, [lastStep])

  // Scroll-driven stepper + zoom. Two things are scrubbed off the section's
  // scroll position: (1) the active tab (Parker-style pinned "how it works"),
  // and (2) a dolly-zoom — the content scales up as the section locks into the
  // pinned view and scales back down as it leaves. Both are disabled on narrow
  // screens, where the panel scrolls normally and tabs stay click-only.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const mq = window.matchMedia('(max-width: 760px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const LOCK = 72 // matches .bsp-pin sticky top offset

    const onScroll = () => {
      const wrap = zoomRef.current
      if (mq.matches) {
        if (wrap) wrap.style.transform = ''
        return
      }
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const total = track.offsetHeight - vh
      if (total <= 0) return

      // Active step
      const p = clamp(-rect.top / total, 0, 1)
      setActive(clamp(Math.floor(p * SHEETS.length), 0, SHEETS.length - 1))

      // Zoom: ramp 0→1 as the top rises to the lock line, hold at 1 while
      // pinned, then ramp 1→0 as the bottom passes back up through it.
      if (wrap && !reduce) {
        const span = vh - LOCK
        const pIn = clamp((vh - rect.top) / span, 0, 1)
        const pOut = clamp((vh - rect.bottom) / span, 0, 1)
        const z = smooth(clamp(Math.min(pIn, 1 - pOut), 0, 1))
        wrap.style.transform = `scale(${(ZOOM_MIN + (1 - ZOOM_MIN) * z).toFixed(4)})`
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Clicking a tab scrolls to that step so the pinned view follows along.
  const goTo = (i) => {
    const track = trackRef.current
    if (!track || window.matchMedia('(max-width: 760px)').matches) {
      setActive(i)
      return
    }
    const total = track.offsetHeight - window.innerHeight
    const targetP = (i + 0.5) / SHEETS.length
    window.scrollTo({ top: track.offsetTop + targetP * total, behavior: 'smooth' })
  }

  return (
    <section className="bsp-sec" ref={ref}>
      <div className="bsp-track" ref={trackRef}>
        <div className="bsp-pin">
          <div className="wrap" ref={zoomRef}>
            <div className="bsp-head">
              <p className="hiw-eyebrow">Before &amp; after</p>
              <h2>What happens when<br />analysts use FinSynth</h2>
              <p className="bsp-sub">
                None of this required hiring.{' '}
                <span>It just required FinSynth.</span>
              </p>
            </div>

            <div className="accwb whywb">
              <nav className="whywb-tabs" role="tablist" aria-label="What happens when analysts use FinSynth">
                {SHEETS.map((s, i) => (
                  <button
                    key={s.tab}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    className={`whywb-tab${i === active ? ' active' : ''}${i < active ? ' done' : ''}${i > active ? ' upcoming' : ''}`}
                    onClick={() => goTo(i)}
                  >
                    <span className="whywb-tab-label">{s.tab}</span>
                  </button>
                ))}
              </nav>

              <div className="whywb-stage">
                {SHEETS.map((sheet, si) => (
                  <div
                    className={`whywb-sheet ba-tone--${sheet.tone}${si === active ? ' on' : ''}`}
                    key={sheet.tab}
                    aria-hidden={si !== active}
                  >
                    <div className="ba-split">
                      <div className="ba-panel ba-panel--old">
                        <span className="ba-kick ba-kick--old">
                          <span className="ba-dot red" />Before FinSynth
                        </span>
                        <p className="ba-lead">{sheet.oldLead}</p>
                        <BeforeGraph sheet={sheet} />
                      </div>

                      <div className="ba-panel ba-panel--new">
                        <span className="ba-kick ba-kick--new">
                          <span className="ba-dot" />After FinSynth
                        </span>
                        <p className="ba-lead ba-lead--new">{sheet.newLead}</p>
                        <AfterGraph sheet={sheet} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`whywb-outro${lastStep ? ' on' : ''}`} aria-hidden={!lastStep}>
              <span className="whywb-outro-text">{OUTRO.slice(0, typed)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
