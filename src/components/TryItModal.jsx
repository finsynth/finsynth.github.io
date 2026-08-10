import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PROMPTS } from '../data/examples'
import { AnswerThinking } from './AskParts'
import { submitAsk, EMAIL_RE } from '../utils/submitAsk'

// The hero's "Try It" modal. Two roads out of one prompt box, and both of them
// end in the visitor's inbox:
//
//  · a curated sample prompt → FinSynth "runs" it and reports that the workbook
//    is ready. The output itself is NOT shown on the page any more: all three
//    samples land on the same ready card — file name, an email box and one
//    "Send it on email" button, so the workbook is asked for and addressed in
//    the same tap rather than on a second screen.
//  · anything they typed themselves → we can't answer it on a static page, so
//    we ask where to send it and hand it to submitAsk.
//
// So both roads collect the same email with the same form; only where it sits
// (on the ready card, or on its own step) and the button label differ. Nothing
// is ever delivered in this tab; every road ends on the confirmation that says
// the result arrives by email.
//
// The modal is mounted only while open, so the effects below (scroll lock,
// focus capture, key handling) are plain mount/unmount work.

const LOAD_MS = 1500  // loader held under the prompt before the workbook is ready
const FILL_MS = 20    // per-char cadence when a sample prompt types itself in

// The ask landed. The visitor's job here is done, so the confirmation is the
// whole screen: we have their email, they can relax until we reach out. No
// further CTA — the only control left on the card is the close cross.
const CONFIRM_TITLE = 'Your request is in'
const CONFIRM_COPY = 'FinSynth is running it now. The completed, auditable output will arrive at'
const CONFIRM_TAIL = 'shortly.'

// Same beat for a workbook download: it arrives by email too, so the wording
// only swaps the thing being sent.
const DL_TITLE = 'Your workbook is on its way'
const DL_COPY = 'The cited workbook is being sent to'
const DL_TAIL = 'now.'

// The email is remembered so the form comes back pre-filled — sending is still
// a deliberate tap either way, never a silent re-send.
const EMAIL_KEY = 'fs-try-email'
const recallEmail = () => {
  try { return localStorage.getItem(EMAIL_KEY) || '' } catch { return '' }
}
const rememberEmail = (value) => {
  try { localStorage.setItem(EMAIL_KEY, value) } catch { /* storage blocked — ask again next time */ }
}

function PencilIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.1 2.5a1.7 1.7 0 0 1 2.4 2.4l-7.8 7.8-3.2.8.8-3.2 7.8-7.8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The Excel mark on the ready card's file row — same one the workbook bar uses.
function XlsMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="7" width="17" height="18" rx="1.8" fill="#107C41" />
      <path fill="#fff" d="M5.1 21.5l3.1-4.9-2.85-4.6h2.3l1.55 2.9c.15.3.25.5.3.65h.02c.1-.25.2-.47.32-.68l1.66-2.87h2.12l-2.92 4.58 3 4.92h-2.26l-1.8-3.36c-.08-.15-.15-.3-.21-.47h-.03c-.05.16-.12.3-.2.46l-1.85 3.37z" />
      <path fill="#21A366" d="M20 2h-2v7h13V3.5c0-.83-.67-1.5-1.5-1.5z" />
      <path fill="#107C41" d="M18 16h13v7H18zM18 9h13v7H18z" />
      <path fill="#185C37" d="M18 23h13v5.5c0 .83-.67 1.5-1.5 1.5H18z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="m2.6 5 4.5 3.4a1.5 1.5 0 0 0 1.8 0L13.4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="hero-try__spin" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.8" />
      <path d="M14.2 8A6.2 6.2 0 0 0 8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TryItModal({ onClose }) {
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)   // a sample prompt is filling itself in
  const [stage, setStage] = useState('compose') // compose | loading | ready | email | sent
  const [query, setQuery] = useState('')        // the prompt that was actually submitted
  const [result, setResult] = useState(null)    // the matched example, i.e. the workbook on offer
  const [email, setEmail] = useState(recallEmail)
  const [emailErr, setEmailErr] = useState('')
  // in flight. It's a flag rather than a stage because the same form is now
  // submitted from two different screens, and each has to stay put while it
  // sends instead of collapsing into a shared "sending" step.
  const [sending, setSending] = useState(false)

  const cardRef = useRef(null)
  const inputRef = useRef(null)
  const emailRef = useRef(null)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])

  const close = useCallback(() => { clearTimers(); onClose?.() }, [onClose])

  // Hold the page still behind the scrim. The scrollbar's width is handed back
  // as padding so locking the body doesn't shift the layout underneath.
  useEffect(() => {
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => { body.style.overflow = prevOverflow; body.style.paddingRight = prevPad }
  }, [])

  // Focus lands in the prompt box on open and goes back where it came from on
  // close, so the CTA that opened this doesn't lose the caret.
  useEffect(() => {
    const opener = document.activeElement
    inputRef.current?.focus()
    return () => { if (opener instanceof HTMLElement) opener.focus() }
  }, [])

  // Escape closes; Tab cycles inside the card. aria-modal claims the rest of
  // the page is inert, so keyboard focus has to actually stay in here.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return }
      if (e.key !== 'Tab') return
      const card = cardRef.current
      if (!card) return
      const focusable = card.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [close])

  // Grow the prompt box with its content, up to a ceiling.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 190)}px`
  }, [draft])

  // The loading beat before the workbook is reported ready.
  const playOutput = () => {
    setStage('loading')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('ready'); return }
    timers.current.push(setTimeout(() => setStage('ready'), LOAD_MS))
  }

  // Submit. A prompt that is one of the curated samples verbatim runs and lands
  // on its ready card, which asks for the email in place. Anything else goes
  // straight to the email step and is sent to us.
  const run = (text) => {
    const q = text.trim()
    if (!q) return
    clearTimers()
    setQuery(q)
    const found = PROMPTS.find((p) => p.prompt === q)
    setResult(found || null)
    setEmailErr('')
    if (found) { playOutput(); return }
    setStage('email')
  }

  // Clicking a sample types it into the prompt box character by character, then
  // submits it — the same fill-then-send beat the inline hero box plays.
  const pickSample = (i) => {
    clearTimers()
    const target = PROMPTS[i].prompt
    inputRef.current?.focus()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDraft(target); setTyping(false); run(target); return
    }
    setDraft('')
    setTyping(true)
    for (let c = 1; c <= target.length; c++) {
      timers.current.push(setTimeout(() => {
        setDraft(target.slice(0, c))
        if (c === target.length) { setTyping(false); run(target) }
      }, c * FILL_MS))
    }
  }

  const sendEmail = async (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setEmailErr('Enter a work email so we know where to send it')
      emailRef.current?.focus()
      return
    }
    setEmailErr('')
    rememberEmail(value)
    setSending(true)
    try {
      await submitAsk({
        prompt: query,
        email: value,
        // which workbook to send, when it's one of ours
        example: result?.id || null,
        source: result ? 'landing:hero-try-download' : 'landing:hero-try-it',
      })
    } catch { /* the confirmation reads the same either way — see .hero-try__done */ }
    setSending(false)
    setStage('sent')
  }

  // Back out of the email step to fix the wording of the request.
  const editRequest = () => {
    setStage('compose')
    setEmailErr('')
    setDraft(query)
    requestAnimationFrame(() => {
      const el = inputRef.current
      if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length }
    })
  }

  // Start over from the ready card or the confirmation.
  const reset = () => {
    clearTimers()
    setStage('compose'); setQuery(''); setResult(null)
    setDraft(''); setEmail(recallEmail()); setEmailErr('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  // The shared email row. Both screens render the same input and the same
  // submit — only the label on the button changes.
  const emailForm = (label, className = '') => (
    <>
      <form className={`hero-try__ask-form${className}`} onSubmit={sendEmail} noValidate>
        <input
          ref={emailRef}
          className={`hero-try__email${emailErr ? ' has-err' : ''}`}
          type="email"
          name="email"
          placeholder="you@fund.com"
          autoComplete="email"
          aria-label="Work email"
          aria-invalid={emailErr ? 'true' : undefined}
          aria-describedby={emailErr ? 'hero-try-err' : undefined}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr('') }}
          disabled={sending}
        />
        <button type="submit" className="hero-try__send" disabled={sending}>
          {sending ? <><Spinner /> Sending…</> : label}
        </button>
      </form>
      {emailErr && <p className="hero-try__err" id="hero-try-err" role="alert">{emailErr}</p>}
    </>
  )

  const composing = stage === 'compose'
  const askStage = stage === 'email'

  // Mounted on <body> rather than in place: the hero section is a stacking
  // context (position + z-index) with overflow hidden, so a fixed overlay left
  // inside it renders *under* the sticky navbar and gets clipped by the section.
  return createPortal(
    <div className="hero-try" role="dialog" aria-modal="true" aria-label="Try FinSynth">
      <div className="hero-try__scrim" onMouseDown={close} aria-hidden="true" />
      <div ref={cardRef} className="hero-try__card">
        {/* The email step is only ever reached by a typed request now — a
            sample collects its email on the ready card itself — so the way
            back out of it is always the composer. */}
        {askStage && !sending && (
          <button type="button" className="hero-try__edit" onClick={editRequest}>
            <PencilIcon />
            Edit your query
          </button>
        )}
        {/* "Ask something else" lives in the header beside the close cross (on
            request) — same pill as the edit button. Only on the ready card: the
            confirmation deliberately carries no CTA at all. */}
        {stage === 'ready' && !sending && (
          <button type="button" className="hero-try__edit" onClick={reset}>
            Ask something else
          </button>
        )}
        <button type="button" className="hero-try__close" onClick={close} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* The head carries the same invitation on the compose AND email steps,
            so submitting a prompt doesn't swap the framing for a bare input —
            the email step keeps the promise, and the ask-note by the input
            explains why the email is needed. */}
        {(composing || askStage) && (
          <div className={`hero-try__head${askStage ? ' is-ask' : ''}`}>
            <h2 className="hero-try__title">Give us your most complex problem</h2>
            <p className="hero-try__sub">
              We&rsquo;ll run it on FinSynth and get back to you with an auditable solution
            </p>
          </div>
        )}

        <div className="hero-try__body">
          {/* ── Prompt box + samples ── */}
          {composing && (
            <>
              <form
                className="hero-try__composer"
                onSubmit={(e) => { e.preventDefault(); run(draft) }}
              >
                <textarea
                  ref={inputRef}
                  className={`hero-try__textarea${typing ? ' is-typing' : ''}`}
                  rows={4}
                  value={draft}
                  placeholder="Build a full revenue decomposition for HEICO Corporation for the last 6 quarters…"
                  aria-label="Give us your most complex problem"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(draft) }
                  }}
                />
                <div className="hero-try__composer-foot">
                  <span className="hero-try__hint">
                    <kbd>Enter</kbd> to send · <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line
                  </span>
                  <button type="submit" className="hero-try__send" disabled={!draft.trim()}>
                    Send
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="hero-try__samples">
                <span className="hero-suggest__label">Or run one of ours</span>
                {PROMPTS.map((p, i) => (
                  <button
                    type="button"
                    className="hero-suggest__row"
                    key={p.id}
                    onClick={() => pickSample(i)}
                  >
                    {/* ours, numbered — a running 1 2 3 instead of per-prompt icons */}
                    <i className="hero-suggest__icon hero-suggest__icon--num" aria-hidden="true">
                      {i + 1}
                    </i>
                    <span className="hero-suggest__text">{p.prompt}</span>
                    <i className="hero-suggest__go" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </i>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Sample flow: the loader, then the workbook on offer ──
              The output is deliberately not rendered here. All three samples
              land on this same card: what was built, and the email box that
              sends it, both on the one screen. */}
          {(stage === 'loading' || stage === 'ready') && (
            <div className="hero-answer hero-try__answer">
              <p className="hero-answer__query">{query}</p>
              {stage === 'loading' ? (
                <AnswerThinking />
              ) : (
                <div className="hero-try__ready">
                  <p className="hero-try__ready-line">
                    <span className="hero-try__ready-ic" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3.2 8.4l3.1 3.1 6.5-6.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Done, your workbook is ready
                  </p>
                  <div className="hero-try__file">
                    <span className="hero-try__file-ic" aria-hidden="true"><XlsMark /></span>
                    {/* the filename alone — the row's shape counts (rows,
                        columns, cited) were dropped on request */}
                    <span className="hero-try__file-txt">
                      <b className="hero-try__file-name">{result.file}</b>
                    </span>
                  </div>
                  {/* the ask, in place: no second screen between the finished
                      workbook and the box that addresses it */}
                  {emailForm(<>Send it on email <MailIcon /></>, ' hero-try__ready-form')}
                  <p className="hero-try__ready-note">
                    Tell us where to send it and the workbook lands in your inbox with its sources
                  </p>
                </div>
              )}
            </div>
          )}
          {/* ── Typed prompt: email, then confirmation ── */}
          {askStage && (
            <div className="hero-try__ask">
              <p className="hero-try__echo-label">Your request</p>
              <div className="hero-try__echo">
                {query}
                {!sending && (
                  <button
                    type="button"
                    className="hero-try__echo-edit"
                    onClick={editRequest}
                    aria-label="Edit your query"
                  >
                    <PencilIcon />
                  </button>
                )}
              </div>
              {/* why the email is asked for at all — the reason sits right on
                  the input rather than in the heading */}
              <p className="hero-try__ask-note">
                You&rsquo;ll need to give your email, it&rsquo;s where we send your feedback
              </p>
              {emailForm('Send it to us')}
            </div>
          )}

          {stage === 'sent' && (
            <div className="hero-try__done">
              <span className="hero-try__done-ic is-ok" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M3.2 8.4l3.1 3.1 6.5-6.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="hero-try__done-title">{result ? DL_TITLE : CONFIRM_TITLE}</p>
              <p className="hero-try__done-copy" role="status">
                {result ? DL_COPY : CONFIRM_COPY}{' '}
                <b className="hero-try__done-addr">{email.trim()}</b>{' '}
                {result ? DL_TAIL : CONFIRM_TAIL}
              </p>
              {/* closing note in its own quiet grey panel. The booking link
                  used to ride along here; it was cut on request — this screen
                  is the end of a completed action, and a second call to action
                  on it only competes with the one the user just finished */}
              <div className="hero-try__done-panel" role="note">
                <p className="hero-try__done-note">
                  No need to keep this open, we&rsquo;ll take it from here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TryItModal
