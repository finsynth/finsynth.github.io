import { useEffect, useRef, useState, useCallback } from 'react'

const QUERY = "Pull Apple's FY2024 revenue from the 10-K and write it to B14"

const STEPS = [
  { num: '01', title: 'You ask', desc: 'Type a plain-English instruction into the composer.' },
  { num: '02', title: 'Agent runs tool calls', desc: 'FinSynth fetches filings, quotes, and reads your model cells.' },
  { num: '03', title: 'Agent proposes a write', desc: 'Every proposed cell change is surfaced before anything is written.' },
  { num: '04', title: 'You approve. Cell written with citation.', desc: 'One click confirms the write and locks in the source link.' },
]

const TOOL_ROWS = [
  { type: 'step', step: 'Step 1', label: 'Fetching timestamp' },
  { type: 'step', step: 'Step 2', label: 'search_filings: "Apple 10-K FY2024 revenue"' },
  { type: 'nested', label: 'Resolved → fetch_filing', pills: ['Form: 10-K', 'Period: FY2024', 'Filed: 2024-11-01'] },
  { type: 'step', step: 'Step 4', label: 'Reading model from B12:B18' },
  { type: 'step', step: 'Step 5', label: 'Proposing write → B14: $391.0B', highlight: true },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [showUserBubble, setShowUserBubble] = useState(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const [showToolCalls, setShowToolCalls] = useState(false)
  const [visibleToolRows, setVisibleToolRows] = useState(0)
  const [showAITyping, setShowAITyping] = useState(false)
  const [showAIBubble, setShowAIBubble] = useState(false)

  const sectionRef = useRef(null)
  const messagesRef = useRef(null)
  const timeoutsRef = useRef([])
  const runAnimRef = useRef(null)

  const scrollToBottom = () => {
    const el = messagesRef.current
    if (el && el.scrollHeight > el.clientHeight) {
      el.scrollTop = el.scrollHeight
    }
  }

  useEffect(() => {
    if (showUserBubble || showToolCalls || showAIBubble) scrollToBottom()
  }, [showUserBubble, showToolCalls, visibleToolRows, showAIBubble])

  const runAnimation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    setTypedText('')
    setActiveStep(0)
    setShowUserBubble(false)
    setShowTypingIndicator(false)
    setShowToolCalls(false)
    setVisibleToolRows(0)
    setShowAITyping(false)
    setShowAIBubble(false)

    const q = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timeoutsRef.current.push(id)
    }

    let t = 800

    // Type query char by char
    for (let i = 1; i <= QUERY.length; i++) {
      const slice = QUERY.slice(0, i)
      q(() => setTypedText(slice), t)
      t += 24
    }

    // Typing complete → step 01, user bubble
    t += 250
    q(() => {
      setActiveStep(1)
      setShowUserBubble(true)
      setTypedText('')
    }, t)

    t += 500
    q(() => setShowTypingIndicator(true), t)

    t += 1000
    q(() => {
      setShowTypingIndicator(false)
      setShowToolCalls(true)
      setActiveStep(2)
    }, t)

    // Tool rows one by one
    for (let i = 1; i <= TOOL_ROWS.length; i++) {
      const idx = i
      q(() => {
        setVisibleToolRows(idx)
        if (idx === 5) setActiveStep(3)
      }, t + idx * 420)
    }

    t += TOOL_ROWS.length * 420 + 700

    q(() => setShowAITyping(true), t)

    t += 1200
    q(() => {
      setShowAITyping(false)
      setShowAIBubble(true)
      setActiveStep(4)
    }, t)

    // Loop after pause
    t += 5500
    q(() => runAnimRef.current?.(), t)
  }, [])

  runAnimRef.current = runAnimation

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        io.disconnect()
        runAnimation()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => {
      io.disconnect()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [runAnimation])

  return (
    <section className="hiw-section" ref={sectionRef}>
      <div className="hiw-wrap">
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">The agent works. You <em>approve.</em></h2>
        </div>
        <div className="hiw-cols">

          {/* Left: numbered steps */}
          <div className="hiw-steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`hiw-step${activeStep === i + 1 ? ' active' : ''}`}>
                <span className="hiw-step-num">{step.num}</span>
                <div className="hiw-step-body">
                  <div className="hiw-step-title">{step.title}</div>
                  <div className="hiw-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: chat window */}
          <div className="hiw-chat">
            <div className="hiw-chat-bar">
              <span className="hiw-bar-dot"></span>
              <span className="hiw-bar-name">FinSynth AI</span>
              <span className="hiw-bar-status">Excel add-in · connected</span>
            </div>

            <div className="hiw-messages" ref={messagesRef}>
              {showUserBubble && (
                <div className="hiw-row hiw-row-user">
                  <div className="hiw-bubble hiw-bubble-user">{QUERY}</div>
                  <div className="hiw-avatar">R</div>
                </div>
              )}

              {showTypingIndicator && (
                <div className="hiw-row hiw-row-ai">
                  <div className="hiw-typing"><span /><span /><span /></div>
                </div>
              )}

              {showToolCalls && (
                <div className="hiw-tool-card">
                  <div className="hiw-tool-label">Agent tool calls</div>
                  {TOOL_ROWS.slice(0, visibleToolRows).map((row, i) =>
                    row.type === 'nested' ? (
                      <div key={i} className="hiw-tool-nested">
                        <span className="hiw-tool-resolved">Resolved → fetch_filing</span>
                        <div className="hiw-tool-pills">
                          {row.pills.map(p => <span key={p} className="hiw-tool-pill">{p}</span>)}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="hiw-tool-row">
                        <span className="hiw-tool-dot" />
                        <span className="hiw-tool-step">{row.step}</span>
                        <span className={`hiw-tool-text${row.highlight ? ' hiw-tool-hl' : ''}`}>{row.label}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {showAITyping && (
                <div className="hiw-row hiw-row-ai">
                  <div className="hiw-typing"><span /><span /><span /></div>
                </div>
              )}

              {showAIBubble && (
                <div className="hiw-row hiw-row-ai">
                  <div className="hiw-bubble hiw-bubble-ai">
                    Apple reported total net sales of <strong>$391.0B</strong> in FY2024{' '}
                    <span className="hiw-chip-sec">SEC 10-K FY2024</span>{' '}
                    Writing <strong>$391.0B</strong> to{' '}
                    <span className="hiw-chip-cell">B14</span>{' '}
                    in your active model — approve to confirm.
                  </div>
                </div>
              )}

            </div>

            <div className="hiw-composer">
              <input
                className="hiw-input"
                type="text"
                placeholder="Ask FinSynth..."
                value={typedText}
                readOnly
                tabIndex={-1}
              />
              <button className="hiw-send" aria-label="Send">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M1.5 7.5L13.5 1.5L7.5 13.5L6 8.5L1.5 7.5Z" fill="white" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
