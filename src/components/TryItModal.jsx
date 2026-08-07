import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PROMPTS } from '../data/examples'
import { AnswerResult, AnswerThinking, PromptIcon } from './AskParts'
import { submitAsk, askMailto, CONTACT_EMAIL, EMAIL_RE } from '../utils/submitAsk'

// The hero's "Try It" modal. Two roads out of one prompt box:
//
//  · a curated sample prompt → the sample-output flow the hero already plays.
//    Nothing is asked of the visitor; they get the prose reply, the workbook
//    and the cited table straight away.
//  · anything they typed themselves → we can't answer it on a static page, so
//    we ask where to send it and hand it to submitAsk. Email is requested at
//    that point and not a moment earlier: nobody pays a toll before they've
//    seen what the thing does.
//
// The modal is mounted only while open, so the effects below (scroll lock,
// focus capture, key handling) are plain mount/unmount work.

const LOAD_MS = 1500  // loader held under the prompt before a sample answer lands
const FILL_MS = 20    // per-char cadence when a sample prompt types itself in

const CONFIRM_COPY =
  "Thanks! We'll process your request and send the completed output to your email shortly."

// Shown when the ask could NOT be delivered (VITE_ASK_ENDPOINT unset, or the
// POST failed). We do not promise mail we never sent — the visitor gets a
// pre-filled mail-to instead, so the request still reaches us under their send.
const FALLBACK_COPY =
  'Almost there — one tap to send it. Your mail app will open with your request and your email already filled in.'

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
  const [stage, setStage] = useState('compose') // compose | loading | answer | email | sending | sent
  const [query, setQuery] = useState('')        // the prompt that was actually submitted
  const [result, setResult] = useState(null)    // the matched example's answer
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [delivered, setDelivered] = useState(false)

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

  // Submit. A prompt that is one of the curated samples verbatim plays the
  // sample-output flow; anything else goes to the email step.
  const run = (text) => {
    const q = text.trim()
    if (!q) return
    clearTimers()
    setQuery(q)
    const found = PROMPTS.find((p) => p.prompt === q)
    if (!found) { setStage('email'); return }
    setResult(found)
    setStage('loading')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('answer'); return }
    timers.current.push(setTimeout(() => setStage('answer'), LOAD_MS))
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
      setEmailErr('Enter a work email so we know where to send it.')
      emailRef.current?.focus()
      return
    }
    setEmailErr('')
    setStage('sending')
    let ok = false
    try {
      const res = await submitAsk({ prompt: query, email: value, source: 'landing:hero-try-it' })
      ok = Boolean(res?.delivered)
    } catch { ok = false }
    // Only confirm what actually happened.
    setDelivered(ok)
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

  // Start over from a finished answer or confirmation.
  const reset = () => {
    clearTimers()
    setStage('compose'); setQuery(''); setResult(null)
    setDraft(''); setEmail(''); setEmailErr(''); setDelivered(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const composing = stage === 'compose'
  const sending = stage === 'sending'
  // only the answer needs the full table width; every other state stays narrow
  const wide = stage === 'answer' && !!result?.table

  // Mounted on <body> rather than in place: the hero section is a stacking
  // context (position + z-index) with overflow hidden, so a fixed overlay left
  // inside it renders *under* the sticky navbar and gets clipped by the section.
  return createPortal(
    <div className="hero-try" role="dialog" aria-modal="true" aria-label="Try FinSynth">
      <div className="hero-try__scrim" onMouseDown={close} aria-hidden="true" />
      <div ref={cardRef} className={`hero-try__card${wide ? ' is-wide' : ''}`}>
        <button type="button" className="hero-try__close" onClick={close} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* The invitation to write a prompt only makes sense while there is a
            prompt box to write in; past that the visitor's own request is the
            heading. The eyebrow stays throughout so the card keeps its badge. */}
        <div className={`hero-try__head${composing ? '' : ' is-compact'}`}>
          <span className="hero-try__eyebrow">Try FinSynth</span>
          {composing && (
            <>
              <h2 className="hero-try__title">Give us your most complex problem.</h2>
              <p className="hero-try__sub">
                We'll run it on FinSynth and get back to you with an auditable solution.
              </p>
            </>
          )}
        </div>

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
                  rows={3}
                  value={draft}
                  placeholder="Build a comparables table for the ten largest semiconductor names on EV/EBITDA, P/E, and revenue growth…"
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
                    <i className="hero-suggest__icon" aria-hidden="true">
                      <PromptIcon name={p.icon} />
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

          {/* ── Sample-output flow: the loader, then the cited answer ── */}
          {(stage === 'loading' || stage === 'answer') && (
            <div className="hero-answer hero-try__answer">
              <p className="hero-answer__query">{query}</p>
              {stage === 'loading' ? <AnswerThinking /> : <AnswerResult result={result} />}
            </div>
          )}
          {stage === 'answer' && (
            <button type="button" className="hero-try__back" onClick={reset}>
              Ask something else
            </button>
          )}

          {/* ── Custom prompt: email, then confirmation ── */}
          {(stage === 'email' || sending) && (
            <div className="hero-try__ask">
              <p className="hero-try__echo-label">Your request</p>
              <p className="hero-try__echo">{query}</p>
              <p className="hero-try__ask-lead">
                We'll run this on FinSynth and send you the completed output, sources cited.
                Where should it go?
              </p>
              <form className="hero-try__ask-form" onSubmit={sendEmail} noValidate>
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
                  {sending ? <><Spinner /> Sending…</> : 'Send it to me'}
                </button>
              </form>
              {emailErr && <p className="hero-try__err" id="hero-try-err" role="alert">{emailErr}</p>}
              {!sending && (
                <button type="button" className="hero-try__back" onClick={editRequest}>
                  Edit request
                </button>
              )}
            </div>
          )}

          {stage === 'sent' && (
            <div className="hero-try__done">
              <span className={`hero-try__done-ic${delivered ? ' is-ok' : ''}`} aria-hidden="true">
                {delivered ? (
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M3.2 8.4l3.1 3.1 6.5-6.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <rect x="1.6" y="3.2" width="12.8" height="9.6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.2 4.4L8 8.6l5.8-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <p className="hero-try__done-copy" role="status">
                {delivered ? CONFIRM_COPY : FALLBACK_COPY}
              </p>
              {!delivered && (
                <p className="hero-try__done-row">
                  <a
                    className="hero-try__send hero-try__send--link"
                    href={askMailto({ prompt: query, email })}
                  >
                    Send it to us
                  </a>
                  <span className="hero-try__done-note">goes to {CONTACT_EMAIL}</span>
                </p>
              )}
              <button type="button" className="hero-try__back" onClick={reset}>
                Ask something else
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TryItModal
