import { useEffect, useRef, useState } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

// Locked copy — "How" section (§4, Updated Content 2026-07-21).
// Three beats, each a title + line, drive a live AI-chat panel.
const BEATS = [
  {
    icon: 'brief',
    title: 'Brief the task',
    line: "Ask it the way you'd brief an associate: pull the comparables, check the model, screen the filings.",
  },
  {
    icon: 'work',
    title: 'Watch it work',
    line: 'It reads the filings, opens your model, and runs the numbers, live.',
  },
  {
    icon: 'approve',
    title: 'Approve, and the answer lands',
    line: "Nothing touches your model without your yes. The moment you approve, it's delivered, cited.",
  },
]

// The conversation the three beats play out, briefing FinSynth like an associate.
const BRIEF = 'Pull the comparables, check the model, screen the filings.'
const WORK_TASKS = [
  ['Read 10-K, 10-Q filings', 'done'],
  ['Opened Model_Build.xlsx', 'done'],
  ['Running the numbers', 'live'],
]
const CITE = {
  src: 'SEC 10-K · FY2024 · p.31',
  quote: '“Total net sales of $391.0 billion for fiscal 2024…”',
}
const APPROVE_LEAD = 'Ready to update revenue in B14.'
const DIFF = { ref: 'B14', from: '$88.1B', to: '$94.9B' }
const DELIVERED = 'Delivered to B14 — cited to 10-Q Q3. Your model, your call.'

// ── Inline glyphs (no external icon dep) ──
const Spark = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5l1.4 3.9 3.9 1.4-3.9 1.4L8 12.1 6.6 8.2 2.7 6.8l3.9-1.4L8 1.5z" fill="currentColor" />
  </svg>
)
const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Spin = () => (
  <svg className="hiwc-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2a6 6 0 1 1-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const Mic = () => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="6.5" y="2.5" width="5" height="8.5" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 8.5a5 5 0 0 0 10 0M9 13.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
const SendArrow = () => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 14.5v-11M4.5 8L9 3.5 13.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const ClockGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 5v3.2l2.2 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const FileSheet = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2.5 6.5h11M6.5 6.5v7" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)
const FileDoc = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 1.5h5.5L13 5v8A1.5 1.5 0 0 1 11.5 14.5h-7A1.5 1.5 0 0 1 3 13V3A1.5 1.5 0 0 1 4 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
)
const Copy = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5.5A1.5 1.5 0 0 0 4 11h1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)
const Retry = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M12.5 6.5A5 5 0 1 0 13 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M12.8 3v3.5H9.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ThumbUp = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5 7l2.5-4.5a1.5 1.5 0 0 1 2 2L9 7h3.2a1.3 1.3 0 0 1 1.3 1.6l-1 4A1.3 1.3 0 0 1 11.2 13.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <rect x="2.3" y="7" width="2.7" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)
const ThumbDown = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
    <path d="M5 7l2.5-4.5a1.5 1.5 0 0 1 2 2L9 7h3.2a1.3 1.3 0 0 1 1.3 1.6l-1 4A1.3 1.3 0 0 1 11.2 13.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <rect x="2.3" y="7" width="2.7" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)
// Left-rail item glyphs, keyed to BEATS[i].icon
const BeatIcon = ({ name }) => {
  if (name === 'work') {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M2.5 10.5l3.5-4 3 3.5 3.5-5 5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'approve') {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2.5l6 2.2v4.3c0 3.5-2.4 6.3-6 8-3.6-1.7-6-4.5-6-8V4.7L10 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7.4 9.8l1.9 1.9L13 7.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v6A1.5 1.5 0 0 1 15.5 13H8l-3.5 3v-3H4.5A1.5 1.5 0 0 1 3 11.5v-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 7.5h7M6.5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const zoomRef = useSectionZoom()
  const [active, setActive] = useState(0)
  const [approved, setApproved] = useState(false)
  // Beat 1: the brief is typed live into the input bar below the thread.
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (active !== 0) {
      setTyped('')
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(BRIEF)
      return
    }
    setTyped('')
    let i = 0
    const t = setInterval(() => {
      i += 1
      setTyped(BRIEF.slice(0, i))
      if (i >= BRIEF.length) clearInterval(t)
    }, 45)
    return () => clearInterval(t)
  }, [active])

  // Reveal on scroll
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Drive the active beat from the pinned track's scroll progress. The panel
  // is pinned (sticky) for the whole track, so the screen stays put while the
  // three beats advance — beat 3 is reached with the panel still framed, never
  // after it has scrolled away.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia('(max-width: 900px)')
    // Reduced motion / stacked mobile layout: reveal the full thread at once.
    if (reduce || mq.matches) {
      setActive(BEATS.length - 1)
      return
    }
    let raf = 0
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (mq.matches) {
          setActive(BEATS.length - 1)
          return
        }
        const rect = track.getBoundingClientRect()
        const total = track.offsetHeight - window.innerHeight
        if (total <= 0) return
        const p = clamp(-rect.top / total, 0, 1)
        const idx = clamp(Math.floor(p * BEATS.length), 0, BEATS.length - 1)
        setActive((prev) => (prev === idx ? prev : idx))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Beat 3: the permission dialog pops over the input, then approves itself —
  // the viewer never has to click. Ask → beat → auto-approve → output lands.
  const [permitGone, setPermitGone] = useState(false)
  useEffect(() => {
    if (active < 2) {
      if (approved) setApproved(false)
      if (permitGone) setPermitGone(false)
      return
    }
    if (approved) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setApproved(true)
      setPermitGone(true)
      return
    }
    const t1 = setTimeout(() => setApproved(true), 1600)
    return () => clearTimeout(t1)
  }, [active, approved, permitGone])
  // linger on the "Approved" state a moment before the dialog slips away
  useEffect(() => {
    if (!approved || permitGone) return
    const t = setTimeout(() => setPermitGone(true), 900)
    return () => clearTimeout(t)
  }, [approved, permitGone])

  const select = (i) => {
    setApproved(false)
    setPermitGone(false)
    setActive(i)
  }

  // Status shown top-right of the chat header, per stage.
  const status =
    active >= 2 ? (approved ? 'Delivered · cited' : 'Awaiting approval')
    : active === 1 ? 'Working…'
    : 'Briefing…'

  const tasksDone = active >= 2 // once approved-stage is reached, work is finished

  return (
    <section className="hiw-section" id="how-it-works" ref={ref}>
      <div className="hiw-track" ref={trackRef}>
        <div className="hiw-pin">
          <div className="hiw-wrap" ref={zoomRef}>
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">Say hello to your new co-worker.</h2>
        </div>

        <div className="hiw-panel">
          <ol className="hiw-rail">
            {BEATS.map((beat, i) => (
              <li className={`hiw-item${active === i ? ' is-active' : ''}`} key={beat.title}>
                <button
                  type="button"
                  className="hiw-item-btn"
                  aria-pressed={active === i}
                  onClick={() => select(i)}
                >
                  <span className="hiw-item-icon"><BeatIcon name={beat.icon} /></span>
                  <span className="hiw-item-body">
                    <span className="hiw-item-title">{beat.title}</span>
                    <span className="hiw-item-desc">{beat.line}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="hiw-pane" aria-live="polite">
            <div className="hiw-chat">
              {/* header */}
              <div className="hiwc-bar">
                <span className="hiwc-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="hiwc-bar-div" aria-hidden="true" />
                <span className="hiwc-name">AI Assistant</span>
                <span className="hiwc-with">with</span>
                <span className="hiwc-chip"><Spark /> FinSynth</span>
                <span className="hiwc-status">
                  <span className="hiwc-dot" />
                  Real-time · {status}
                </span>
              </div>

              {/* conversation */}
              <div className="hiwc-thread">
                {/* 1 · the brief — while it's being typed below, the thread stays empty */}
                {active >= 1 && (
                  <div className="hiwc-msg hiwc-msg--user">
                    <div className="hiwc-bubble">{BRIEF}</div>
                  </div>
                )}

                {/* 2 · watch it work — thinking, then the tool calls */}
                {active >= 1 && (
                  <div className="hiwc-msg hiwc-msg--ai">
                    <span className="hiwc-ava"><Spark /></span>
                    <div className="hiwc-aibody">
                      {!tasksDone && (
                        <div className="hiwc-typing" aria-label="FinSynth is thinking">
                          <span /><span /><span />
                        </div>
                      )}
                      <div className="hiwc-tasks">
                        {WORK_TASKS.map(([label, tag]) => {
                          const state = tasksDone ? 'done' : tag
                          return (
                            <div className={`hiwc-task${state === 'live' ? ' hiwc-task--live' : ''}`} key={label}>
                              {state === 'live' ? <Spin /> : <Check />}
                              <span className="hiwc-task-a">{label}</span>
                              <span className="hiwc-task-tag">{state === 'live' ? 'live' : 'done'}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3 · the output lands after the permission overlay approves */}
                {active >= 2 && approved && (
                  <div className="hiwc-msg hiwc-msg--ai">
                    <span className="hiwc-ava"><Spark /></span>
                    <div className="hiwc-aibody">
                      <p className="hiwc-aitext">{DELIVERED}</p>
                      <div className="hiwc-cite">
                        <div className="hiwc-cite-src">{CITE.src}</div>
                        <p className="hiwc-cite-q">{CITE.quote}</p>
                      </div>
                      <span className="hiwc-delivered"><Check /> Delivered</span>
                      <div className="hiwc-react">
                        <button type="button" aria-label="Copy"><Copy /></button>
                        <button type="button" aria-label="Retry"><Retry /></button>
                        <button type="button" aria-label="Good answer"><ThumbUp /></button>
                        <button type="button" aria-label="Bad answer"><ThumbDown /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* permission dialog — pops over the input, then approves itself */}
              {active >= 2 && !permitGone && (
                <div className={`hiwc-permit${approved ? ' is-approved' : ''}`} role="alertdialog" aria-label="Approval request">
                  <p className="hiwc-aitext">{APPROVE_LEAD}</p>
                  <div className="hiwc-diff">
                    <span className="hiwc-diff-ref">{DIFF.ref}</span>
                    <span className="hiwc-diff-old">{DIFF.from}</span>
                    <span className="hiwc-diff-arr">→</span>
                    <span className="hiwc-diff-new">{DIFF.to}</span>
                  </div>
                  <p className="hiwc-note">Nothing is written to your model until you approve.</p>
                  {approved ? (
                    <span className="hiwc-delivered"><Check /> Approved</span>
                  ) : (
                    <button
                      type="button"
                      className="hiw-approve"
                      onClick={() => setApproved(true)}
                    >
                      Approve &amp; deliver
                    </button>
                  )}
                </div>
              )}

              {/* composer card — beat 1 types the brief here, live */}
              <div className="hiwc-input" aria-hidden="true">
                <div className="hiwc-composer">
                  <div className="hiwc-attach">
                    <span className="hiwc-file"><FileSheet /> Comps-Q2.xlsx</span>
                    <span className="hiwc-file"><FileDoc /> AAPL-10K.pdf</span>
                  </div>
                  <div className={`hiwc-prompt${active === 0 ? ' hiwc-prompt--typing' : ''}`}>
                    {active === 0 ? typed : 'Ask a follow-up…'}
                  </div>
                  <div className="hiwc-toolbar">
                    <span className="hiwc-tool hiwc-tool--plus"><Plus /></span>
                    <span className="hiwc-tool"><Spark /> FinSynth</span>
                    <span className="hiwc-tool"><ClockGlyph /> 30s</span>
                    <span className="hiwc-send"><SendArrow /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  )
}
