import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/react'
import { initGrid } from '../utils/gridCanvas'
import { BOOK_URL, SIGNIN_HREF, APP_HREF } from './AskParts'
import MosaicCanvas from './MosaicCanvas'
import TileMosaicCanvas from './TileMosaicCanvas'
import DotBridgeCanvas from './DotBridgeCanvas'
import BayBridgePixelCanvas from './BayBridgePixelCanvas'
import { MatrixDecode } from '@/components/remocn/matrix-decode'

const SEGMENTS = [
  'Hedge Funds',
  'Asset Managers',
  'Family Offices',
  'Sell Side',
]

const TYPE_MS = 28      // per character
const HOLD_MS = 1500    // full word on screen
const SELECT_MS = 380   // selection highlight before delete

function RotatingSegment() {
  const [text, setText] = useState(SEGMENTS[0])
  const [phase, setPhase] = useState('idle') // idle | typing | hold | selected
  const rootRef = useRef(null)
  const decodeRef = useRef(null)
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
    const timers = []
    const t = (fn, ms) => { if (alive) timers.push(setTimeout(fn, ms)) }

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
      t(() => { setText(''); typeNext() }, SELECT_MS)
    }

    t(() => { setPhase('hold'); t(select, HOLD_MS) }, 400)

    return () => { alive = false; timers.forEach(clearTimeout) }
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
          <b className="hr-handle tl" /><b className="hr-handle tr" />
          <b className="hr-handle bl" /><b className="hr-handle br" />
        </span>
      </span>
    </>
  )
}

// Exa-style side replicas: small square tiles flanking the copy at the section
// edges — zoomed crops of the hero's own Wall Street photo. Two loose columns a
// side, the outermost flush with (and cut by) the edge. Decorative only; CSS
// drops them under 1280px where they'd crowd the cell.
const SIDE_TILES = {
  left: [
    { top: '29%', x: -20, s: 64, bg: '72% 26%' },
    { top: '46%', x: -20, s: 64, bg: '18% 52%' },
    { top: '63%', x: -20, s: 64, bg: '38% 68%' },
    { top: '21%', x: 66, s: 54, bg: '58% 10%' },
    { top: '39%', x: 74, s: 58, bg: '22% 42%' },
    { top: '57%', x: 66, s: 54, bg: '86% 58%' },
    { top: '31%', x: 140, s: 46, bg: '66% 30%' },
    { top: '49%', x: 143, s: 46, bg: '48% 84%' },
  ],
  right: [
    { top: '32%', x: -20, s: 64, bg: '30% 30%' },
    { top: '49%', x: -20, s: 64, bg: '64% 74%' },
    { top: '66%', x: -20, s: 64, bg: '42% 22%' },
    { top: '24%', x: 66, s: 54, bg: '14% 20%' },
    { top: '42%', x: 74, s: 58, bg: '70% 62%' },
    { top: '60%', x: 66, s: 54, bg: '75% 46%' },
    { top: '35%', x: 140, s: 46, bg: '52% 12%' },
  ],
}

function HeroSideTiles() {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div className={`hero-side hero-side--${side}`} key={side} aria-hidden="true">
          {SIDE_TILES[side].map((t, i) => (
            <span
              key={i}
              className="hero-tile"
              style={{
                top: t.top,
                [side]: `${t.x}px`,
                width: `${t.s}px`,
                height: `${t.s}px`,
                backgroundPosition: t.bg,
              }}
            />
          ))}
        </div>
      ))}
    </>
  )
}

function Hero({ variant = 'grid', bgImage, bgGlass = false, bare = false }) {
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
  const canvasRef = useRef(null)
  useEffect(() => {
    if (mosaic) return
    return initGrid(canvasRef.current)
  }, [mosaic])

  // "Try Now" sends signed-out visitors through sign-in and already-signed-in
  // ones straight to the agent — same split the navbar makes, so a returning
  // user isn't asked to sign in again from the hero.
  const { isSignedIn } = useUser()

  // A "Best viewed on desktop" popup and a standing advisory banner used to open
  // this section on phones. Both are gone: the page is laid out for phones now,
  // and an apology in front of a working page only teaches the visitor to leave.
  // Git history has the markup if the gate is ever wanted back.

  return (
    <section className={`hero-s2${mosaic && !dot && !photo ? ' hero-s2--mosaic' : ''}${dot ? ' hero-s2--globe' : ''}${photo ? ' hero-s2--photo' : ''}${bgGlass ? ' hero-s2--glass' : ''}${bare ? ' hero-s2--bare' : ''}`}>
      {/* bare mode omits the background entirely — the copy is overlaid on top
          of an external backdrop (the pixel-bridge scroll scene) */}
      {!bare && (bgImage ? (
        <div
          className="hero-s2-mosaic hero-s2-imgbg"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      ) : photo ? (
        <BayBridgePixelCanvas stageClassName="hero-s2-mosaic" ariaLabel="" />
      ) : dot ? (
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
      ))}
      {/* the side collage only earns its place on the bare hero, where the
          flanks are otherwise empty — over the photo it's crops of the same
          picture laid on the picture */}
      {bare && <HeroSideTiles />}
      <span className="stat-pill" aria-hidden="true"></span>
      <div className="hero-s2-wrap">

        {/* ── ONE BIG CELL ── */}
        <div className={`hero-cell${mosaic ? ' hero-cell--mosaic' : ''}${variant === 'tiles' ? ' hero-cell--tiles' : ''}`}>
          {/* Soft white radial wash behind the copy — lifts the text off the
              photo without hiding it. Sized to the copy block (pill → trust
              line) and clamped to the cell so it never spills past the hero. */}
          {photo && !bare && <div className="hero-glow" aria-hidden="true" />}

          {/* Backers — a glass pill leading the copy stack: "Backed by
              [Accel]", the mark standing in for its own name. The alt text
              carries the name for anyone who can't see the logo, so the line
              still reads. */}
          <p className="hero-backers">
            <span className="hero-backers-label">Backed by</span>
            <img
              className="hero-backers-mark"
              src="/assets/img/accel-logo-brand.svg"
              alt="Accel"
            />
          </p>

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
            <span className="hero-title-row">purpose-built for <RotatingSegment /></span>
          </h1>

          <p className="hero-s2-lede">
            Eliminate verification tax, take your research from drafts to
            decision-making
          </p>

          {/* CTAs — the primary ask is the call; "Try Now" is the self-serve
              path beside it, handing the visitor to sign-in rather than to a
              demo modal. The old "Explore" button and its Try It modal are in
              git history if they're ever wanted back. */}
          <div className="hero-s2-ctas">
            <a
              className="hero-s2-cta"
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Us
            </a>
            <a
              className="hero-s2-cta hero-s2-cta--ghost"
              href={isSignedIn ? APP_HREF : SIGNIN_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Now
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

          <p className="hero-s2-trust">
            Trusted by investors from global funds
          </p>

        </div>

      </div>
    </section>
  )
}

export default Hero
