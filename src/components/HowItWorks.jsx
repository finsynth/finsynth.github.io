import { useEffect, useRef, useState } from 'react'
import useSectionZoom from '../hooks/useSectionZoom'

// Locked copy — "How" section (§4, Updated Content 2026-07-21).
// Three beats, each a title + line, drive a live AI-chat panel.
const BEATS = [
  {
    icon: 'brief',
    title: 'Brief the task',
    line: "Ask it the way you'd brief an associate.",
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
const BRIEF = "Track how Meta's guidance has compared to what it actually delivered, over the last twelve quarters."
// Watch-it-work: the one or two tool calls this brief actually triggers.
const WORK_TASKS = [
  ['Read META 10-Qs & earnings releases', 'done'],
  ['Building the guidance vs. actuals track', 'live'],
]
// Approve: a single confirm question; on yes, the write lands as a new tool call.
const APPROVE_Q = 'Write the 12-quarter guidance vs. actuals to your model?'
const WROTE = 'Wrote guidance vs. actuals to B4:M9 · cited to filings'

// ── Inline glyphs (no external icon dep) ──
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
// small "jump to source" chip trailing a cited figure
const Cite = () => (
  <svg className="hiwc-cx" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 4.5L5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default function HowItWorks() {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const threadRef = useRef(null)
  const answerRef = useRef(null)
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
    }, 24)
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
  // once the answer lands, scroll the thread (never the page) to reveal it
  useEffect(() => {
    if (!(active >= 2 && approved)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => {
      const thread = threadRef.current
      const answer = answerRef.current
      if (!thread || !answer) return
      const top =
        answer.getBoundingClientRect().top -
        thread.getBoundingClientRect().top +
        thread.scrollTop -
        12
      thread.scrollTo({ top, behavior: 'smooth' })
    }, 60)
    return () => clearTimeout(t)
  }, [active, approved])

  const select = (i) => {
    setApproved(false)
    setPermitGone(false)
    setActive(i)
  }

  const tasksDone = active >= 2 // once approved-stage is reached, work is finished

  return (
    <section className="hiw-section" id="how-it-works" ref={ref}>
      <div className="hiw-track" ref={trackRef}>
        <div className="hiw-pin">
          {/* backdrop = the testimonial glass-column wash (royal-blue glow behind
              frosted vertical panels dissolving to white), contained inside the
              page rails — see .hiw-pin::before */}
          <div className="hiw-wrap" ref={zoomRef}>
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">Say hello to your new <span className="ttl-hl">co-worker</span></h2>
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
              {/* header — mirrors the production app toolbar: logo left,
                  history / new / menu on the right */}
              <div className="hiwc-bar">
                <img className="hiwc-logo" src="/assets/img/icon-64.png" alt="FinSynth" />
                <span className="hiwc-actions" aria-hidden="true">
                  <span className="hiwc-iconbtn" title="History">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                  </span>
                  <span className="hiwc-iconbtn" title="New chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </span>
                  <span className="hiwc-iconbtn" title="More">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <circle cx="12" cy="5" r="1.6" />
                      <circle cx="12" cy="12" r="1.6" />
                      <circle cx="12" cy="19" r="1.6" />
                    </svg>
                  </span>
                </span>
              </div>

              {/* conversation */}
              <div className="hiwc-thread" ref={threadRef}>
                {/* 1 · the brief — while it's being typed below, the thread stays empty */}
                {active >= 1 && (
                  <div className="hiwc-msg hiwc-msg--user">
                    <div className="hiwc-bubble">{BRIEF}</div>
                  </div>
                )}

                {/* 2 · watch it work — just the tool calls this brief triggers.
                    3 · once approved, the write lands, then the answer streams in. */}
                {active >= 1 && (
                  <div className="hiwc-msg hiwc-msg--ai">
                    <div className="hiwc-aibody">
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
                        {active >= 2 && approved && (
                          <div className="hiwc-task hiwc-task--wrote">
                            <Check />
                            <span className="hiwc-task-a">{WROTE}</span>
                            <span className="hiwc-task-tag">done</span>
                          </div>
                        )}
                      </div>

                      {/* the written answer lands under the tool call */}
                      {active >= 2 && approved && (
                        <div className="hiwc-answer" ref={answerRef}>
                          <p className="hiwc-p">
                            Every guidance and actual figure links back to the
                            originating earnings release; midpoint, variances, and the range verdict
                            are live formulas.
                          </p>
                          <p className="hiwc-p hiwc-p--head">
                            What the 12-quarter record shows (next-quarter total-revenue guidance vs.
                            delivered):
                          </p>
                          <div className="hiwc-table-wrap">
                            <table className="hiwc-table">
                              <thead>
                                <tr><th>Metric</th><th>Result</th></tr>
                              </thead>
                              <tbody>
                                <tr><td>Above top of range</td><td>7 of 12 <Cite /></td></tr>
                                <tr><td>Within range</td><td>5 of 12 <Cite /></td></tr>
                                <tr><td>Below range</td><td>0 <Cite /></td></tr>
                                <tr><td>Avg actual vs. guide midpoint</td><td>+3.9% <Cite /></td></tr>
                              </tbody>
                            </table>
                          </div>
                          <ul className="hiwc-bullets">
                            <li>
                              <strong>Never missed</strong> the low end once in three years. The
                              story is systematic conservatism.
                            </li>
                            <li>
                              <strong>Beats widened through 2025</strong>: five straight quarters
                              above the top of the range (Dec-24A → Dec-25A), peaking at{' '}
                              <strong>+8.0% above midpoint in Jun-25A</strong> <Cite /> — a
                              step-change from the ~in-range prints of 2023.
                            </li>
                            <li>
                              <strong>Most recent quarter (Mar-26A)</strong> landed within range but
                              near the top (+2.4% vs. mid) <Cite />, a slight moderation from the
                              blowout 2025 pattern.
                            </li>
                          </ul>
                          <p className="hiwc-p hiwc-p--muted">
                            One convention note: guidance is issued in $B (0.5B increments) and stored
                            here in $M for exact comparison against reported revenue; units are
                            flagged in the header note <Cite />. Meta's forward guide for Q2-26 (given
                            on the Mar-26A call) is $58–61B — outside this actuals window since Q2-26
                            reports next week; I can add it once it prints.
                          </p>
                        </div>
                      )}

                      {active >= 2 && approved && (
                        <div className="hiwc-react">
                          <button type="button" aria-label="Copy"><Copy /></button>
                          <button type="button" aria-label="Retry"><Retry /></button>
                          <button type="button" aria-label="Good answer"><ThumbUp /></button>
                          <button type="button" aria-label="Bad answer"><ThumbDown /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* permission overlay — covers the composer, asks a single yes/no */}
              {active >= 2 && !permitGone && (
                <div className={`hiwc-permit${approved ? ' is-approved' : ''}`} role="alertdialog" aria-label="Approval request">
                  {approved ? (
                    <span className="hiwc-delivered"><Check /> Approved</span>
                  ) : (
                    <>
                      <button type="button" className="hiwc-permit-x" aria-label="Deny" tabIndex={-1} aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                      <p className="hiwc-permit-q">{APPROVE_Q}</p>
                      <div className="hiwc-permit-actions">
                        <button type="button" className="hiw-decline" tabIndex={-1} aria-hidden="true">
                          Deny
                        </button>
                        <button
                          type="button"
                          className="hiw-approve"
                          onClick={() => setApproved(true)}
                        >
                          Approve
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* composer card — beat 1 types the brief here, live. On the
                  approval state it collapses to a compact, no-attachment bar
                  with a disabled send (the answer has already landed). */}
              <div className={`hiwc-input${tasksDone ? ' hiwc-input--compact' : ''}`} aria-hidden="true">
                <div className="hiwc-composer">
                  {!tasksDone && (
                    <div className="hiwc-attach">
                      <span className="hiwc-file"><FileSheet /> Comps-Q2.xlsx</span>
                      <span className="hiwc-file"><FileDoc /> AAPL-10K.pdf</span>
                    </div>
                  )}
                  <div className={`hiwc-prompt${active === 0 ? ' hiwc-prompt--typing' : ''}`}>
                    {active === 0 ? typed : 'Ask a follow-up…'}
                  </div>
                  <div className="hiwc-toolbar">
                    <span className="hiwc-tool hiwc-tool--plus"><Plus /></span>
                    <span className={`hiwc-send${tasksDone ? ' is-disabled' : ''}`}><SendArrow /></span>
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
