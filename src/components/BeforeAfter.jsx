import { Fragment, useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'

// Each tab is one theme of the analyst's day. A tab holds a short list of
// paired lines — the old, manual way on the left and the FinSynth way on the
// right — so every panel reads as a direct before → after comparison. Each tab
// carries its own accent tone (see .ba-tone--* in index.css).
const SHEETS = [
  {
    tab: 'Model building',
    tone: 'indigo',
    pairs: [
      {
        old: 'Hours to build a model from scratch',
        neu: 'A model built in minutes, with 80% less time to build and update models.',
      },
      {
        old: 'A day pulling valuation multiples for 15 peers, one by one',
        neu: 'A comparables table across your whole peer set, in minutes.',
      },
    ],
  },
  {
    tab: 'Coverage & scale',
    tone: 'emerald',
    pairs: [
      {
        old: 'Coverage capped by hours in the day',
        neu: '2× the names, same headcount.',
      },
      {
        old: 'A full day reading filings before you can speak on a new name',
        neu: 'The business summary, drivers, and citations, in minutes.',
      },
    ],
  },
  {
    tab: 'Trust & verification',
    tone: 'violet',
    pairs: [
      {
        old: '3 hours to trace one number back to its filing',
        neu: '4 minutes, citation attached.',
      },
      {
        old: 'An answer you hope is right',
        neu: 'An answer you can defend in the room.',
      },
    ],
  },
  {
    tab: 'Monitoring & earnings',
    tone: 'amber',
    pairs: [
      {
        old: 'A frantic afternoon re-keying the model after every earnings release',
        neu: 'The model updates itself the moment the release hits, citations attached.',
      },
      {
        old: 'Manually cross-referencing your numbers against sell-side consensus',
        neu: 'Your model checked against consensus automatically, gaps flagged.',
      },
    ],
  },
]

const OUTRO = 'None of this required hiring. It just required FinSynth.'

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

// One before → after comparison row: the old, manual line on the left and the
// FinSynth outcome on the right, each led by a bullet. A single full-height
// separator on the parent .ba-cmp divides the two columns.
function ComparisonRow({ pair }) {
  return (
    <div className="ba-cmp-row">
      <div className="ba-cmp-side ba-cmp-old">
        <p><span className="ba-cmp-dot" aria-hidden="true" /><span>{pair.old}</span></p>
      </div>
      <div className="ba-cmp-side ba-cmp-new">
        <p><span className="ba-cmp-dot" aria-hidden="true" /><span>{pair.neu}</span></p>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const ref = useReveal()
  const panelRefs = useRef([])
  const anchorRefs = useRef([])
  const [typed, setTyped] = useState(0)
  const [outroOn, setOutroOn] = useState(false)
  const [active, setActive] = useState(0)

  // Track which panel is docked so every visible pill can reflect the current
  // tab: earlier pills stay on screen through the transparent bands beneath,
  // and drop back to the outline state once their panel is covered.
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      let a = 0
      panelRefs.current.forEach((el, i) => {
        if (!el) return
        const dock = parseFloat(getComputedStyle(el).top) || 0
        if (el.getBoundingClientRect().top <= dock + 6) a = i
      })
      setActive(a)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Typewriter outro — types out once the last panel has docked into view.
  useEffect(() => {
    const last = panelRefs.current[SHEETS.length - 1]
    if (!last) return
    const io = new IntersectionObserver(
      ([entry]) => setOutroOn(entry.isIntersecting && entry.intersectionRatio > 0.55),
      { threshold: [0.55] }
    )
    io.observe(last)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!outroOn) {
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
  }, [outroOn])

  // Clicking a tab scrolls to that panel's dock point. Each panel is sticky, so
  // once docked its own offsetTop/getBoundingClientRect reports the *stuck*
  // position, not its flow position — that makes every already-docked panel look
  // like it's "here", so backward jumps silently do nothing. Instead we measure
  // a zero-height, non-sticky anchor rendered just before each panel: its
  // document position always equals the panel's true flow top, so the target
  // stays correct whether we're scrolling up or down.
  const goTo = (i) => {
    const a = anchorRefs.current[i]
    const el = panelRefs.current[i]
    if (!a || !el) return
    const dock = parseFloat(getComputedStyle(el).top) || 0
    const top = a.getBoundingClientRect().top + window.scrollY - dock + 2
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section className="bsp-sec" ref={ref}>
      {/* header scrolls away normally; panels dock just below the navbar */}
      <div className="wrap bstk-head-wrap">
        <div className="bsp-head bstk-head">
          <p className="hiw-eyebrow">Before &amp; after</p>
          <h2>What happens when<br />analysts use <span className="ttl-hl">FinSynth</span></h2>
        </div>
      </div>

      {/* Parker-style stack: each panel is sticky at the same dock point; the
          next one scrolls up and covers it while its tab (offset one quarter
          further right) clicks into the accumulating tab rail. The tab band is
          transparent so earlier docked tabs stay visible through it. */}
      {SHEETS.map((sheet, si) => (
        <Fragment key={sheet.tab}>
        {/* non-sticky flow anchor: a sibling right before the sticky panel, so
            its document position always equals the panel's true flow top. Tab
            clicks measure this to dock the panel from any scroll position (see
            goTo). It must NOT wrap the panel — the panels stay direct siblings
            of the section so each sticks across the whole stack. */}
        <span className="bstk-anchor" aria-hidden="true" ref={(el) => { anchorRefs.current[si] = el }} />
        <div
          className={`bstk-panel${si === SHEETS.length - 1 ? ' bstk-panel--last' : ''}`}
          ref={(el) => { panelRefs.current[si] = el }}
        >
          <div className="bstk-band">
            <div className="wrap bstk-band-wrap">
              {/* the first panel lays down the full rail — every tab visible
                  and clickable from the start. Later panels carry only their
                  own pill, which lands on its slot in the rail below; the
                  docked panel's pill runs solid, already-merged ones keep the
                  hairline, and not-yet-merged ones read as dotted placeholders. */}
              {(si === 0 ? SHEETS : [sheet]).map((s) => {
                const ti = SHEETS.indexOf(s)
                return (
                  <button
                    key={s.tab}
                    type="button"
                    className={`bstk-tab${ti === active ? ' is-active' : ti > active ? ' is-upcoming' : ''}`}
                    style={{ '--i': ti }}
                    onClick={() => goTo(ti)}
                  >
                    {s.tab}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bstk-content">
            <div className="wrap">
              <div className={`bstk-sheet ba-tone--${sheet.tone}`}>
                {/* one centered Before → After label above the paired rows */}
                <div className="bstk-rule" aria-hidden="true">
                  <span className="bstk-pill">Before<em>→</em>After</span>
                  <span className="guide-node guide-node--l" />
                  <span className="guide-node guide-node--r" />
                </div>
                <div className="ba-cmp">
                  <span className="guide-node guide-node--t" aria-hidden="true" />
                  <span className="guide-node guide-node--b" aria-hidden="true" />
                  {sheet.pairs.map((pair, pi) => (
                    <ComparisonRow key={pi} pair={pair} />
                  ))}
                </div>
              </div>

              {si === SHEETS.length - 1 && (
                <div className={`whywb-outro${outroOn ? ' on' : ''}`} aria-hidden={!outroOn}>
                  <span className="whywb-outro-text">{OUTRO.slice(0, typed)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        </Fragment>
      ))}

      {/* dwell scroll distance for the last panel before the stack releases */}
      <div className="bstk-spacer" aria-hidden="true" />
    </section>
  )
}
