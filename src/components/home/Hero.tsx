import { useEffect, useRef, useState } from 'react'
import { APP_HREF, ADDIN_URL } from '@/components/layout/AskParts'
import WallStreetPixelCanvas from '@/components/visuals/WallStreetPixelCanvas'
import { MatrixDecode } from '@/components/visuals/matrix-decode'
import { SEGMENTS } from '@/data/segments'

const TYPE_MS = 28 // per character
const HOLD_MS = 1500 // full word on screen
const SELECT_MS = 380 // selection highlight before delete

function RotatingSegment() {
  const [text, setText] = useState(SEGMENTS[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected
  const rootRef = useRef<HTMLSpanElement>(null)
  const decodeRef = useRef<{ play: () => void }>(null)
  const [hl, setHl] = useState(false) // user's text selection covers the word
  const [hovered, setHovered] = useState(false) // pointer over the word — cycle held
  // which SEGMENT is on screen. A ref, not state: the cycle stops and restarts
  // every time it's held (hover), and a local counter would resume
  // from the top and type a word other than the one the reader is looking at.
  const wordRef = useRef(0)

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
    // hovered: drop all timers so the word freezes as-is; on resume the effect
    // re-runs and the cycle picks up from the held word rather than restarting
    // the list
    if (hovered) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const t = (fn: () => void, ms: number) => {
      if (alive) timers.push(setTimeout(fn, ms))
    }

    const typeNext = () => {
      wordRef.current = (wordRef.current + 1) % SEGMENTS.length
      const target = SEGMENTS[wordRef.current]
      setPhase('typing')
      for (let i = 1; i <= target.length; i++) t(() => setText(target.slice(0, i)), i * TYPE_MS)
      t(() => setPhase('hold'), target.length * TYPE_MS + 250)
      t(select, target.length * TYPE_MS + HOLD_MS)
    }

    const select = () => {
      setPhase('selected')
      t(() => {
        setText('')
        typeNext()
      }, SELECT_MS)
    }

    t(() => {
      setPhase('hold')
      t(select, HOLD_MS)
    }, 400)

    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [hovered])

  // Snap the whole word first: the pointer can land mid-type or mid-delete. MatrixDecode reads its text off a ref each frame, so it decodes the word set just above.
  const hold = () => {
    setHovered(true)
    setText(SEGMENTS[wordRef.current])
    setPhase('hold')
    decodeRef.current?.play()
  }

  return (
    <>
      <span
        ref={rootRef}
        className={`hero-rotate ${phase}${hl ? ' is-hl' : ''}`}
        onMouseEnter={hold}
        onMouseLeave={() => setHovered(false)}
      >
        <MatrixDecode
          ref={decodeRef}
          as="em"
          className="hero-s2-accent"
          text={text}
          charset="!@#$%^&*()_+-=<>?/\|"
          revealDuration={60}
          speed={1}
          trigger="manual"
        />
        <i className="hr-caret" />
        <span className="hr-frame">
          <b className="hr-handle tl" />
          <b className="hr-handle tr" />
          <b className="hr-handle bl" />
          <b className="hr-handle br" />
        </span>
      </span>
    </>
  )
}

function Hero() {
  return (
    <section className="hero-s2 hero-s2--photo">
      <WallStreetPixelCanvas stageClassName="hero-s2-mosaic" />
      <div className="hero-s2-wrap">
        <div className="hero-cell hero-cell--mosaic">
          <div className="hero-glow" aria-hidden="true" />

          <p className="hero-backers">
            <span className="hero-backers-label">Backed by</span>
            <img className="hero-backers-mark" src="/assets/img/accel-logo-brand.svg" alt="Accel" />
          </p>

          {/* .hero-nounphrase keeps "research infrastructure" together when row
              one wraps (relaxed below 560px, see global.css). Below 1100px
              .hero-s2-title reserves three rows so the rotating word can't move
              the CTAs. */}
          <h1 className="sr-only">
            Auditable AI research infrastructure, purpose-built for investment teams
          </h1>
          <p className="hero-s2-title" aria-hidden="true">
            {/* each row is its own block with the leading moved into a margin,
                so text selection paints two separate white strips instead of
                one merged slab (margins aren't covered by ::selection) */}
            <span className="hero-title-row">
              Auditable AI <span className="hero-nounphrase">research infrastructure,</span>
            </span>
            <span className="hero-title-row">
              <span className="hero-nobreak">purpose-built</span> for <RotatingSegment />
            </span>
          </p>

          <p className="hero-s2-lede">
            Eliminate verification tax, take your research from drafts to decision-making
          </p>

          {/* one primary, one secondary: Try for free, and Add to Excel linking to the AppSource listing */}
          <div className="hero-s2-ctas">
            <a className="hero-s2-cta" href={APP_HREF} target="_blank" rel="noopener noreferrer">
              Try for free
            </a>
            <a
              className="hero-s2-cta hero-s2-cta--ghost"
              href={ADDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* drawn inline in Excel's greens since the repo has no Office
                  logo asset */}
              <svg
                className="hero-s2-cta-excel"
                viewBox="0 0 32 32"
                aria-hidden="true"
                focusable="false"
              >
                <path fill="#33C481" d="M10 2h18a2 2 0 0 1 2 2v5H10z" />
                <path fill="#21A366" d="M10 9h20v7H10z" />
                <path fill="#107C41" d="M10 16h20v7H10z" />
                <path fill="#185C37" d="M10 23h20v5a2 2 0 0 1-2 2H10z" />
                <rect x="2" y="8" width="16" height="16" rx="2" fill="#107C41" />
                <path
                  d="M6.5 12.5 13.5 19.5M13.5 12.5 6.5 19.5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Add to Excel
              {/* the arrow only shows on hover, but its slot is always in the
                  layout (see .hero-s2-cta-arrow) — the button can't change
                  width under the pointer without shoving the primary sideways,
                  since the row is centred */}
              <svg
                className="hero-s2-cta-arrow"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <p className="hero-s2-trust hero-s2-trust--ink">Trusted by investors from global funds</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
