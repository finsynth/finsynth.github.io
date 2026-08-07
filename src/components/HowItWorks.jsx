import { useCallback, useEffect, useRef, useState } from 'react'
import { PROMPTS, citeFor, matchExample } from '../data/examples'
import { submitAsk, askMailto, CONTACT_EMAIL, EMAIL_RE } from '../utils/submitAsk'

// "How" section (§4, Updated Content 2026-07-21) — a live AI-chat panel that
// briefs itself: the request types into the composer, and the visitor takes it
// from there with a question of their own.
//
// Nothing here is driven by the page's scroll position. The walkthrough used to
// be a three-beat reel — brief, work, approve — labelled in a clickable rail
// beside the panel and stepped by scroll through a tall pinned track; the panel
// itself also sat on the shared scroll-scrubbed dolly zoom (useSectionZoom), so
// it scaled under the reader on the way past. All of it is gone, and so are the
// beats: beat 2 had stopped putting anything in the thread, and beat 3's
// approval dialog — a permission prompt that popped over the composer and then
// approved itself — was our own UI performing for the viewer rather than
// answering their question. What's left is one thing that happens: the brief
// writes itself into a real input, and rests there as a suggestion.
//
// The approval story itself isn't lost; it's made properly in <Differentiator />
// ("Nothing reaches your model without your approval", with the diff diagram).
const BRIEF = "Track how Meta's guidance has compared to what it actually delivered, over the last twelve quarters."

// ── Ask mode ──
// The composer is a real input, and what comes back depends on what was asked:
//
// - One of the three worked examples (typed, edited or seeded from a chip) has
//   a real answer on hand — the cited table under /assets/xlsx — so the thread
//   answers it: response, workbook, table, and every sourced figure clickable
//   through to the document it came from.
// - Anything else we genuinely cannot answer here. We say exactly that, and
//   take an email so the cited model can follow.
const ANSWER_MS = 1500  // "FinSynth is working" beat before a known answer lands
const ASK_PROMISE =
  "We don't have an answer to that one yet — but let us run it on FinSynth and " +
  'get back to you with the cited model. Where should we send it?'
const ASK_THANKS =
  'Thanks! We’ll reach out to you with your cited results soon. Meanwhile, try it on ' +
  'one of these or any other AI agent, specialized tool, or anything you might be ' +
  'using internally. Compare the results for yourself.'
const ASK_DOWNLOAD =
  'Download available: The full cited spreadsheet for each example is available to download.'
// Sits under an answered example, beside the workbook: the same invitation the
// email card makes, since the point of showing the citations is the comparison.
const ANSWER_COMPARE =
  'Run the same prompt on any other AI agent, specialized tool, or whatever you ' +
  'use internally, and compare the citations.'
// Shown instead of ASK_THANKS when the ask could not be delivered (no
// VITE_ASK_ENDPOINT set, endpoint down, visitor offline). Promising to reach out
// when we have no way to reach out would lose the lead and break the promise, so
// the visitor gets a one-tap mail-to that carries the question and their email.
const ASK_FALLBACK =
  'Almost there — one tap to send it. Your mail app will open with this question ' +
  'and your email already filled in. Meanwhile, try it on one of these or any ' +
  'other AI agent, specialized tool, or anything you might be using internally. ' +
  'Compare the results for yourself.'

// "try it on one of these" — the tools an analyst would reach for instead.
// Each opens in a new tab; the prompt is one click away on the clipboard.
const COMPARE_TOOLS = [
  { label: 'ChatGPT', href: 'https://chatgpt.com/' },
  { label: 'Claude', href: 'https://claude.ai/new' },
  { label: 'Gemini', href: 'https://gemini.google.com/app' },
  { label: 'Perplexity', href: 'https://www.perplexity.ai/' },
]

// ── Inline glyphs (no external icon dep) ──
const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Mail = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.5 4.5l5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
const Copy = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5.5A1.5 1.5 0 0 0 4 11h1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)
const Download = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2.5v7M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const Sparkle = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2l1.1 3.3L12.5 6.5 9.1 7.7 8 11 6.9 7.7 3.5 6.5 6.9 5.3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12.5 10.5l.5 1.4 1.4.6-1.4.5-.5 1.5-.5-1.5-1.4-.5 1.4-.6z" fill="currentColor" />
  </svg>
)
// the workbook's own icon, so the handoff reads as a real .xlsx
const ExcelGlyph = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="1" y="7" width="17" height="18" rx="1.8" fill="#107C41" />
    <path fill="#fff" d="M5.1 21.5l3.1-4.9-2.85-4.6h2.3l1.55 2.9c.15.3.25.5.3.65h.02c.1-.25.2-.47.32-.68l1.66-2.87h2.12l-2.92 4.58 3 4.92h-2.26l-1.8-3.36c-.08-.15-.15-.3-.21-.47h-.03c-.05.16-.12.3-.2.46l-1.85 3.37z" />
    <path fill="#21A366" d="M20 2h-2v7h13V3.5c0-.83-.67-1.5-1.5-1.5z" />
    <path fill="#107C41" d="M18 16h13v7H18zM18 9h13v7H18z" />
    <path fill="#185C37" d="M18 23h13v5.5c0 .83-.67 1.5-1.5 1.5H18z" />
  </svg>
)
const DocGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 2h5l3 3v9H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9 2v3h3M6 8.5h4M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
const Close = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const ExternalArrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 10l4.5-4.5M6.8 5.5h3.7v3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function HowItWorks() {
  const ref = useRef(null)
  const threadRef = useRef(null)
  const inputRef = useRef(null)
  const emailRef = useRef(null)
  const docCloseRef = useRef(null)
  // 0 until the panel comes into view, then bumped on every replay ("New chat"),
  // which is what restarts the self-typing brief below.
  const [reelRun, setReelRun] = useState(0)

  // ── Ask mode ──
  // `engaged` flips the moment the visitor touches the composer: the demo reel
  // stops typing into it and it behaves as a plain input. `ask` holds the
  // submitted prompt and takes the thread over entirely.
  const [draft, setDraft] = useState('')
  const [engaged, setEngaged] = useState(false)
  // { prompt, example, kind } — kind 'answer' when the prompt matched a worked
  // example (we have its cited sheet), 'ask' when it didn't (we take an email)
  const [ask, setAsk] = useState(null)
  // 'answer' kind: working → answered · 'ask' kind: capture → sending → sent
  const [stage, setStage] = useState('capture')
  // the document behind a clicked figure, shown over the chat
  const [cite, setCite] = useState(null)
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  // did the ask actually reach us? drives which sent card the visitor sees
  const [delivered, setDelivered] = useState(false)
  const [copied, setCopied] = useState(false)
  const asking = ask !== null

  // The brief is typed live into the input bar below the thread. Once the
  // visitor has engaged with the composer (or asked something), the reel stops
  // writing there — their cursor is never fought over.
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (!reelRun || engaged || asking) {
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
  }, [reelRun, engaged, asking])
  // The caret and the ink colour belong to the typing itself: once the brief has
  // landed it rests as an ordinary placeholder suggestion, since a blinking
  // caret in a field nobody has focused reads as a live cursor.
  const typing = reelRun > 0 && typed.length > 0 && typed.length < BRIEF.length

  // Submitting the composer hands the thread over to the visitor's own prompt.
  // A prompt we have a cited sheet for gets answered; anything else gets the
  // honest "not yet — leave us your email" card.
  const send = useCallback(() => {
    const prompt = draft.trim()
    if (!prompt) return
    const match = matchExample(prompt)
    setAsk({ prompt, example: match || null, kind: match ? 'answer' : 'ask' })
    setStage(match ? 'working' : 'capture')
    setCite(null)
    setEmail('')
    setEmailErr('')
    setCopied(false)
    setDraft('')
  }, [draft])

  // Drop a curated example into the composer rather than firing it off, so the
  // visitor can edit it into their own question first.
  const useExample = (ex) => {
    setEngaged(true)
    setDraft(ex.prompt)
    const el = inputRef.current
    if (el) {
      el.focus()
      // caret to the end
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = el.value.length })
    }
  }

  const sendEmail = async (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setEmailErr('Enter a work email so we know where to send it.')
      emailRef.current?.focus()
      return
    }
    setEmailErr('')
    setStage('sending')
    let ok = false
    try {
      const res = await submitAsk({ prompt: ask.prompt, email: value, example: ask.example?.id })
      ok = Boolean(res?.delivered)
    } catch {
      ok = false
    }
    // Only confirm what actually happened. If it didn't land, the sent card
    // switches to the mail-to fallback rather than promising a follow-up.
    setDelivered(ok)
    setStage('sent')
  }

  // Hold the working state a beat before a known answer lands, so the panel
  // reads as FinSynth doing the work rather than a lookup table firing.
  useEffect(() => {
    if (ask?.kind !== 'answer' || stage !== 'working') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('answered')
      return
    }
    const t = setTimeout(() => setStage('answered'), ANSWER_MS)
    return () => clearTimeout(t)
  }, [ask, stage])

  // Escape closes the source document, the way it closes any viewer; opening one
  // puts the keyboard inside it so Escape and Tab land somewhere sensible.
  useEffect(() => {
    if (!cite) return
    docCloseRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setCite(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cite])

  const copyPrompt = () => {
    if (!ask) return
    navigator.clipboard?.writeText(ask.prompt).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1800) },
      () => {}
    )
  }

  // "New chat" gives a genuinely fresh panel: it clears the visitor's own
  // conversation *and* replays the self-typing brief. Just dropping ask mode
  // left whatever the reel had already finished sitting there, which is not what
  // a new-chat button means anywhere else.
  const newChat = () => {
    setAsk(null)
    setStage('capture')
    setCite(null)
    setEmail('')
    setEmailErr('')
    setDelivered(false)
    setDraft('')
    setEngaged(false)
    threadRef.current?.scrollTo({ top: 0 })
    setReelRun((n) => n + 1)
  }

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

  // Kick the brief off the first time the section comes into view, so it types
  // for someone who is looking at it rather than into an empty screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setReelRun((n) => (n === 0 ? 1 : n))
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // ask mode: keep the newest card in view as the flow advances
  useEffect(() => {
    if (!asking) return
    const thread = threadRef.current
    if (!thread) return
    const t = setTimeout(() => {
      thread.scrollTo({
        top: thread.scrollHeight,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    }, 60)
    return () => clearTimeout(t)
  }, [asking, stage])

  // The walkthrough's self-typing brief only shows while the field is genuinely
  // untouched — it steps aside as soon as the visitor takes the composer over.
  // The beat deliberately changes nothing else here: the composer resizing
  // mid-beat read as a glitch.
  const ghost = !engaged && !asking && !draft

  // keep the composer sized to what's been typed, up to a few lines
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`
  }, [draft])

  return (
    <section className="hiw-section" id="how-it-works" ref={ref}>
      {/* backdrop = the testimonial glass-column wash (royal-blue glow behind
          frosted vertical panels dissolving to white), contained inside the
          page rails — see .hiw-pin::before */}
      <div className="hiw-pin">
        <div className="hiw-wrap">
        <div className="hiw-head">
          <p className="hiw-eyebrow">HOW IT WORKS</p>
          <h2 className="hiw-title">Say hello to your new <span className="ttl-hl">co-worker</span></h2>
        </div>

        <div className="hiw-panel">
          <div className="hiw-pane" aria-live="polite">
            <div className="hiw-chat">
              {/* header — mirrors the production app toolbar: logo left,
                  history / new / menu on the right */}
              <div className="hiwc-bar">
                <img className="hiwc-logo" src="/assets/img/icon-64.png" alt="FinSynth" />
                <span className="hiwc-actions">
                  <span className="hiwc-iconbtn" title="History" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                  </span>
                  {/* the one live control in the toolbar: clears the visitor's
                      conversation and hands the panel back to the walkthrough */}
                  <button
                    type="button"
                    className="hiwc-iconbtn hiwc-iconbtn--btn"
                    title="New chat"
                    aria-label="New chat"
                    onClick={newChat}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </button>
                  <span className="hiwc-iconbtn" title="More" aria-hidden="true">
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
                {/* ── the visitor's own question ──
                    The three worked examples have a cited sheet on hand, so
                    they get answered here in full, every sourced figure
                    clickable through to its document. Anything else we can't
                    answer without actually running it, so we say so and take an
                    email rather than invent a table. */}
                {asking && (
                  <>
                    <div className="hiwc-msg hiwc-msg--user">
                      <div className="hiwc-bubble">{ask.prompt}</div>
                    </div>
                    <div className="hiwc-msg hiwc-msg--ai">
                      <div className="hiwc-aibody">
                        {ask.kind === 'answer' ? (
                          stage === 'working' ? (
                            <div className="hiwc-working">
                              <span className="hiwc-working-name">FinSynth</span>
                              <span className="hiwc-working-dots" aria-hidden="true"><i /><i /><i /></span>
                              <span className="sr-only">Working on your question</span>
                            </div>
                          ) : (
                            <div className="hiwc-res">
                              <p className="hiwc-res-lead">{ask.example.response}</p>
                              <div className="hiwc-res-sheet">
                                <div className="hiwc-res-bar">
                                  <span className="hiwc-res-ic"><ExcelGlyph /></span>
                                  <span className="hiwc-res-file">{ask.example.file}</span>
                                  <a
                                    className="hiwc-res-dl"
                                    href={ask.example.download}
                                    download
                                    aria-label={`Download ${ask.example.file}`}
                                  >
                                    <Download />
                                    Download
                                  </a>
                                </div>
                                {ask.example.table.note && (
                                  <p className="hiwc-res-note">{ask.example.table.note}</p>
                                )}
                                <div className="hiwc-res-scroll">
                                  <table className="hiwc-res-tbl">
                                    <thead>
                                      <tr>
                                        {ask.example.table.cols.map((c) => <th key={c}>{c}</th>)}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ask.example.table.rows.map((r, ri) => (
                                        <tr key={ri}>
                                          {r.map((cell, ci) => {
                                            // a sourced figure is a real control: it opens
                                            // the document the number was read out of
                                            const c = citeFor(ask.example, ri, ci)
                                            return (
                                              <td key={ci}>
                                                {c ? (
                                                  <button
                                                    type="button"
                                                    className={`hiwc-cell-link${cite?.id === c.id ? ' is-open' : ''}`}
                                                    onClick={() => setCite(c)}
                                                    title={`Open the source: ${c.doc}`}
                                                  >
                                                    {cell}
                                                  </button>
                                                ) : cell}
                                              </td>
                                            )
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <p className="hiwc-res-cta">
                                <span className="hiwc-ask-ic"><Sparkle /></span>
                                {ask.example.cta}
                              </p>
                              <p className="hiwc-ask-dl-lead">{ANSWER_COMPARE}</p>
                              <div className="hiwc-ask-tools">
                                <button type="button" className="hiwc-ask-copy" onClick={copyPrompt}>
                                  <Copy />
                                  {copied ? 'Prompt copied' : 'Copy prompt'}
                                </button>
                                {COMPARE_TOOLS.map((t) => (
                                  <a
                                    key={t.label}
                                    className="hiwc-ask-tool"
                                    href={t.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {t.label}
                                    <ExternalArrow />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )
                        ) : stage === 'sent' ? (
                          <div className="hiwc-ask">
                            <p className="hiwc-ask-lead">
                              <span className={`hiwc-ask-ic${delivered ? ' hiwc-ask-ic--ok' : ''}`}>
                                {delivered ? <Check /> : <Mail />}
                              </span>
                              {delivered ? ASK_THANKS : ASK_FALLBACK}
                            </p>
                            {!delivered && (
                              <p className="hiwc-ask-send-row">
                                <a
                                  className="hiwc-ask-send hiwc-ask-send--link"
                                  href={askMailto({ prompt: ask.prompt, email })}
                                >
                                  <Mail />
                                  Send it to us
                                </a>
                                <span className="hiwc-ask-send-note">
                                  goes to {CONTACT_EMAIL}
                                </span>
                              </p>
                            )}
                            <div className="hiwc-ask-tools">
                              <button type="button" className="hiwc-ask-copy" onClick={copyPrompt}>
                                <Copy />
                                {copied ? 'Prompt copied' : 'Copy prompt'}
                              </button>
                              {COMPARE_TOOLS.map((t) => (
                                <a
                                  key={t.label}
                                  className="hiwc-ask-tool"
                                  href={t.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t.label}
                                  <ExternalArrow />
                                </a>
                              ))}
                            </div>
                            <div className="hiwc-ask-dl">
                              <p className="hiwc-ask-dl-lead">{ASK_DOWNLOAD}</p>
                              <div className="hiwc-ask-dl-row">
                                {PROMPTS.map((ex) => (
                                  <a
                                    key={ex.id}
                                    className={`hiwc-ask-dl-btn${ask.example?.id === ex.id ? ' is-match' : ''}`}
                                    href={ex.download}
                                    download
                                  >
                                    <Download />
                                    <span className="hiwc-ask-dl-txt">
                                      <span className="hiwc-ask-dl-name">{ex.label}</span>
                                      <span className="hiwc-ask-dl-file">{ex.file}</span>
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="hiwc-ask">
                            <p className="hiwc-ask-lead">
                              <span className="hiwc-ask-ic"><Sparkle /></span>
                              {ASK_PROMISE}
                            </p>
                            <form className="hiwc-ask-form" onSubmit={sendEmail} noValidate>
                              <input
                                ref={emailRef}
                                className={`hiwc-ask-email${emailErr ? ' has-err' : ''}`}
                                type="email"
                                name="email"
                                placeholder="you@fund.com"
                                autoComplete="email"
                                aria-label="Work email"
                                aria-invalid={emailErr ? 'true' : undefined}
                                aria-describedby={emailErr ? 'hiwc-ask-err' : undefined}
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value)
                                  if (emailErr) setEmailErr('')
                                }}
                                disabled={stage === 'sending'}
                              />
                              <button type="submit" className="hiwc-ask-send" disabled={stage === 'sending'}>
                                {stage === 'sending' ? <><Spin /> Sending…</> : 'Send me the answer'}
                              </button>
                            </form>
                            {emailErr && (
                              <p className="hiwc-ask-err" id="hiwc-ask-err" role="alert">{emailErr}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* The brief is not echoed back into the thread: it is already
                    visible being typed into the composer below, and a bubble
                    repeating it verbatim pushed the actual work off screen. The
                    visitor's own submitted prompt still echoes (above) — there
                    the composer has been cleared, so nothing else shows the ask. */}

                {/* Beats 2 and 3 no longer put anything in the thread. The
                    tool-call card (read the filings → building the track →
                    "wrote to B4:M9") is gone, as is the written answer that
                    used to stream in under it: both were our copy standing in
                    for a result, and the thread reads as a fresh chat waiting
                    for a real question instead. What's left of the walkthrough
                    is the brief typing itself into the composer and the
                    approval overlay over it. */}
              </div>

              {/* ── source document ──
                  What a click on a blue figure opens: the filing that figure was
                  read out of, the cited line marked. This is the cross-check the
                  answer promises, standing in for the webapp's source view — the
                  excerpt is built from the same row as the cell, so the number on
                  the page is always the number that was clicked. */}
              {cite && (
                <div className="hiwc-doc" role="dialog" aria-modal="true" aria-label={`Source: ${cite.doc}`}>
                  <div className="hiwc-doc-scrim" onMouseDown={() => setCite(null)} />
                  <div className="hiwc-doc-sheet">
                    <div className="hiwc-doc-bar">
                      <span className="hiwc-doc-ic"><DocGlyph /></span>
                      <span className="hiwc-doc-titles">
                        <span className="hiwc-doc-name">{cite.doc}</span>
                        <span className="hiwc-doc-meta">{cite.meta}</span>
                      </span>
                      <button
                        type="button"
                        ref={docCloseRef}
                        className="hiwc-doc-x"
                        onClick={() => setCite(null)}
                        aria-label="Close source document"
                      >
                        <Close />
                      </button>
                    </div>
                    <div className="hiwc-doc-body">
                      <p className="hiwc-doc-section">{cite.section}</p>
                      {cite.unit && <p className="hiwc-doc-unit">{cite.unit}</p>}
                      {cite.quote && (
                        <blockquote className="hiwc-doc-quote">
                          {cite.quote.map((part, i) => (
                            part.hit
                              ? <mark key={i} className="hiwc-doc-mark">{part.t}</mark>
                              : <span key={i}>{part.t}</span>
                          ))}
                        </blockquote>
                      )}
                      {cite.lines && (
                        <dl className="hiwc-doc-lines">
                          {cite.lines.map((l) => (
                            <div className={`hiwc-doc-line${l.hit ? ' is-hit' : ''}`} key={l.label}>
                              <dt>{l.label}</dt>
                              <dd>
                                {l.hit ? <mark className="hiwc-doc-mark">{l.value}</mark> : l.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <p className="hiwc-doc-note">{cite.note}</p>
                    </div>
                    <div className="hiwc-doc-foot">
                      <span className="hiwc-doc-trace">
                        Cited figure <b>{cite.cell}</b>
                      </span>
                      <a
                        className="hiwc-doc-open"
                        href={cite.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cite.hrefLabel}
                        <ExternalArrow />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* composer card — a real input, not a mock. Left alone it plays
                  the walkthrough (beat 1 types the brief into it as a ghost);
                  touched, it hands over completely and takes a live question.
                  The example chips above it seed the field rather than firing,
                  so a suggestion can be edited into the visitor's own ask. */}
              <div className="hiwc-input">
                {/* The chips stay put once an exchange has resolved, so the next
                    example is one click away rather than behind "New chat" —
                    they only stand down while a request is in flight. */}
                {stage !== 'working' && stage !== 'sending' && (
                  <div className="hiwc-egs">
                    <span className="hiwc-egs-label">Try</span>
                    <div className="hiwc-egs-row">
                      {PROMPTS.map((ex) => (
                        <span className="hiwc-eg" key={ex.id}>
                          <button
                            type="button"
                            className="hiwc-eg-use"
                            onClick={() => useExample(ex)}
                            title={ex.prompt}
                          >
                            {ex.label}
                          </button>
                          <a
                            className="hiwc-eg-dl"
                            href={ex.download}
                            download
                            title={`Download ${ex.file}`}
                            aria-label={`Download the cited spreadsheet for: ${ex.label}`}
                          >
                            <Download />
                          </a>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <form
                  className="hiwc-composer"
                  onSubmit={(e) => { e.preventDefault(); send() }}
                >
                  <div className="hiwc-field">
                    <textarea
                      ref={inputRef}
                      className="hiwc-textarea"
                      rows={1}
                      value={draft}
                      placeholder={ghost ? '' : 'Ask FinSynth anything…'}
                      aria-label="Ask FinSynth"
                      onFocus={() => setEngaged(true)}
                      onChange={(e) => { setEngaged(true); setDraft(e.target.value) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                      }}
                    />
                    {/* the walkthrough's self-typing brief, shown only while the
                        field is untouched and empty. Before the panel is in view
                        the field reads as an ordinary placeholder; once the brief
                        has typed itself it stays there as the suggestion. */}
                    {ghost && (
                      <div
                        className={`hiwc-prompt hiwc-ghost${typing ? ' hiwc-prompt--typing' : ''}`}
                        aria-hidden="true"
                      >
                        {reelRun ? typed : 'Ask FinSynth anything…'}
                      </div>
                    )}
                  </div>
                  <div className="hiwc-toolbar">
                    <span className="hiwc-tool hiwc-tool--plus" aria-hidden="true"><Plus /></span>
                    <button
                      type="submit"
                      className={`hiwc-send${draft.trim() ? '' : ' is-disabled'}`}
                      disabled={!draft.trim()}
                      aria-label="Send"
                    >
                      <SendArrow />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
