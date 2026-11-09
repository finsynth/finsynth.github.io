import { useEffect, useRef, useState } from 'react'
import { BOOK_URL, APP_HREF } from '@/components/layout/AskParts'
import BayBridgePixelCanvas from '@/components/visuals/BayBridgePixelCanvas'
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

  // Hovering holds the carousel on the word under the pointer. The word is
  // snapped whole first: the pointer can land mid-type or mid-delete, and
  // freezing "Famil" or an empty cell is worse than not freezing at all. The
  // scramble is played after, so it decodes the finished word — MatrixDecode
  // reads its text off a ref every frame, so the state set just above is the
  // value it picks up.
  const hold = () => {
    setHovered(true)
    setText(SEGMENTS[wordRef.current])
    setPhase('hold')
    decodeRef.current?.play()
  }

  return (
    <>
      {/* static copy for screen readers; the animated span is decorative */}
      <span className="sr-only">{SEGMENTS[0]}</span>
      <span
        ref={rootRef}
        className={`hero-rotate ${phase}${hl ? ' is-hl' : ''}`}
        aria-hidden="true"
        onMouseEnter={hold}
        onMouseLeave={() => setHovered(false)}
      >
        {/* hover anywhere on the word (incl. caret/frame) parks the carousel on
            it and scrambles it matrix-style, then it decodes back left to
            right; the cycle picks up again on the way out */}
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
      <BayBridgePixelCanvas stageClassName="hero-s2-mosaic" ariaLabel="" />
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">
        {/* ── ONE BIG CELL ── */}
        <div className="hero-cell hero-cell--mosaic">
          {/* Soft white radial wash behind the copy — lifts the text off the
              photo without hiding it. Sized to the copy block (pill → trust
              line) and clamped to the cell so it never spills past the hero. */}
          <div className="hero-glow" aria-hidden="true" />

          {/* Backers — a glass pill leading the copy stack: "Backed by
              [Accel]", the mark standing in for its own name. The alt text
              carries the name for anyone who can't see the logo, so the line
              still reads. */}
          <p className="hero-backers">
            <span className="hero-backers-label">Backed by</span>
            <img className="hero-backers-mark" src="/assets/img/accel-logo-brand.svg" alt="Accel" />
          </p>

          {/* Heading — two rows, breaking on the comma:
              · the <br /> puts the clause break at the comma, so the rotating
                segment rides the second row with "purpose-built for" rather
                than taking a third row of its own.
              · .hero-nounphrase glues "research infrastructure" so that when
                row one does have to wrap (narrow laptops), it breaks after
                "AI" instead of splitting the noun phrase. Phones relax it:
                below 560px letting the phrase split is what lets the type
                grow past ~20px at all (styles/global.css documents the numbers).
              Below 1100px neither row fits and the headline runs to three rows;
              .hero-s2-title reserves that height there so the rotating segment
              can't shove the CTAs around mid-cycle. */}
          <h1 className="hero-s2-title">
            {/* each row is its own block with the leading moved into a margin,
                so text selection paints two separate white strips instead of
                one merged slab (margins aren't covered by ::selection) */}
            <span className="hero-title-row">
              Auditable AI <span className="hero-nounphrase">research infrastructure,</span>
            </span>
            <span className="hero-title-row">
              <span className="hero-nobreak">purpose-built</span> for <RotatingSegment />
            </span>
          </h1>

          <p className="hero-s2-lede">
            Eliminate verification tax, take your research from drafts to decision-making
          </p>

          {/* CTAs — the primary ask is the call; "Try for free" is the
              self-serve path beside it, handing the visitor to sign-in rather
              than to a demo modal. It names the price rather than the action,
              which is the part a visitor weighing the two buttons wants. The
              old "Explore" button and its Try It modal are in git history if
              they're ever wanted back. */}
          <div className="hero-s2-ctas">
            <a className="hero-s2-cta" href={BOOK_URL} target="_blank" rel="noopener noreferrer">
              Talk to Us
            </a>
            <a
              className="hero-s2-cta hero-s2-cta--ghost"
              href={APP_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              Try for free
              {/* the arrow only shows on hover, but its slot is always in the
                  layout (see .hero-s2-cta-arrow) — the button can't change
                  width under the pointer without shoving "Talk to Us" sideways,
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

          {/* the trust line in full ink (.hero-s2-trust--ink): the 62%-grey base
              was the faintest thing on the hero. Reviewed against a two-tone
              version (claim in ink, lead-in grey), glass segment chips and a
              tracked-caps eyebrow; all rejected 2026-09-11, all in git. */}
          <p className="hero-s2-trust hero-s2-trust--ink">Trusted by investors from global funds</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
