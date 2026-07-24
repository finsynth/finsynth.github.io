import { useEffect, useRef, useState } from 'react'

// Scroll-driven "stacking steps" section (replicated from the Parker.ai
// walkthrough recording). Three full-height panels are position:sticky at the
// same dock point below the navbar; each panel carries a protruding colored
// tab (offset one third further right per step) above a dashed rule. As you
// scroll, each new panel rides up and covers the previous one while its tab
// clicks into the accumulating header row — the earlier tabs stay visible
// through the newer panel's transparent tab band. The whole animation is
// scrubbed by scroll position (no rAF, no keyframes), so it is compositor-
// cheap and inherently honors reduced motion. The only timed animation is the
// step-2 typewriter, which is IntersectionObserver-gated and skipped under
// prefers-reduced-motion.

const TYPED = 'Hey FinSynth, what changed in Q3 guidance?'

function Typewriter() {
  const ref = useRef(null)
  const [text, setText] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(TYPED)
      return
    }
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let i = 0
        timer = setInterval(() => {
          i += 1
          setText(TYPED.slice(0, i))
          if (i >= TYPED.length) clearInterval(timer)
        }, 55)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="steps-stack__input" ref={ref}>
      <span className={`steps-stack__typed${text.length < TYPED.length ? ' is-typing' : ''}`}>
        {text || <span className="steps-stack__placeholder">How can I help you today?</span>}
      </span>
      <span className="steps-stack__send" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M8 12.5v-9M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

const STEPS = [
  {
    key: 'research',
    tab: 'Step 1 - Research',
    color: '#ecb52c',
    copy: [
      ['First, FinSynth does the research.'],
      ['Filings.', 'Transcripts.', 'Comparables.', 'Consensus.', 'Your own model.'],
      ['All read.', 'All organized.', 'All in one place.'],
    ],
    media: (
      <div className="steps-stack__card steps-stack__card--checker" style={{ '--checker': '#f4dd9d' }}>
        <div className="steps-stack__app">
          <div className="steps-stack__hub" aria-hidden="true">
            <span className="steps-stack__hub-dot" />
          </div>
          <div className="steps-stack__pills">
            <span className="steps-stack__pill">10-K · 10-Q</span>
            <span className="steps-stack__pill">Transcripts</span>
            <span className="steps-stack__pill">Consensus</span>
          </div>
          <span className="steps-stack__pill steps-stack__pill--lone">Reading filings</span>
        </div>
      </div>
    ),
  },
  {
    key: 'ask',
    tab: 'Step 2 - Ask',
    color: '#8a7ed4',
    copy: [
      ['Ask questions.', 'Get analyst answers.'],
      ['FinSynth is trained on the models, methods, and filings top analysts use.'],
      ["So when you ask, you don't get generic AI. You get answers built for finance."],
    ],
    media: (
      <div className="steps-stack__card steps-stack__card--chat">
        <p className="steps-stack__greeting">Good evening, ANALYST</p>
        <Typewriter />
      </div>
    ),
  },
  {
    key: 'deliver',
    tab: 'Step 3 - Deliver',
    color: '#6ec987',
    copy: [
      ['Audit-ready output to grow conviction.'],
      ['Models.', 'Memos.', 'Comps.', 'Briefs.'],
      ['Built from your research.', 'Cited to your sources.', 'Ready to ship.'],
    ],
    media: (
      <div className="steps-stack__card steps-stack__card--checker" style={{ '--checker': '#b9e3c4' }}>
        <div className="steps-stack__doc" aria-hidden="true">
          <p className="steps-stack__doc-h">MEMO 2</p>
          <p className="steps-stack__doc-sub">DRAFT BRIEF</p>
          {[92, 78, 85, 60, 88, 72, 40].map((w, i) => (
            <span key={i} className="steps-stack__doc-line" style={{ width: `${w}%` }} />
          ))}
          <p className="steps-stack__doc-h" style={{ marginTop: 18 }}>MEMO 3</p>
          {[84, 66, 90].map((w, i) => (
            <span key={i} className="steps-stack__doc-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    ),
  },
]

function StepsStack() {
  return (
    <section className="steps-stack" aria-label="How FinSynth works, step by step">
      {STEPS.map((s, i) => (
        <div className="steps-stack__panel" key={s.key} style={{ '--i': i }}>
          {/* transparent tab band — earlier docked tabs show through it */}
          <div className="steps-stack__band">
            <div className="steps-stack__tab" style={{ background: s.color }}>
              {s.tab}
            </div>
          </div>
          <div className="steps-stack__content">
            <div className="steps-stack__grid">
              <div className="steps-stack__copy">
                {s.copy.map((group, g) => (
                  <p key={g}>
                    {group.map((line, l) => (
                      <span key={l}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                ))}
              </div>
              <div className="steps-stack__media">{s.media}</div>
            </div>
          </div>
        </div>
      ))}
      {/* dwell scroll distance for step 3 before the stack releases */}
      <div className="steps-stack__spacer" aria-hidden="true" />
    </section>
  )
}

export default StepsStack
