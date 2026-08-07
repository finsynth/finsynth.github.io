// Where a prompt + email captured in the "Say hello to your new co-worker"
// composer actually goes.
//
// This site deploys to GitHub Pages (see CNAME), which serves static files and
// nothing else — there is no serverless function we can add here. So delivery
// has to be a third-party endpoint that accepts a JSON POST from the browser:
// a Formspree / Basin / Getform form endpoint, a HubSpot forms URL, a Zapier or
// Make catch hook, or a Google Apps Script web app. We use a Formspree form; the
// URL is hardcoded in ENDPOINT below (public by design — it ships in the bundle
// either way), with an optional VITE_ASK_ENDPOINT override for local testing.
//
// If the POST fails, submitAsk reports
// { delivered: false } and the composer does NOT tell the visitor we'll be in
// touch. It hands them a pre-filled mail-to instead, so the ask still reaches
// support@finsynth.ai under their own send. Nothing is silently dropped either
// way; the only difference is whether it arrives automatically.

// Formspree endpoint for the "FinSynth landing asks" form. Hardcoded on purpose:
// this URL is public by design (it ships in the client bundle either way), and
// the site deploys as a prebuilt bundle, so there is no build-time env to read.
// An env override still wins if VITE_ASK_ENDPOINT is ever set.
const ENDPOINT = import.meta.env?.VITE_ASK_ENDPOINT || 'https://formspree.io/f/mnpanynp'

export const configured = Boolean(ENDPOINT)

// The one shape an address has to have before we promise to mail anything to
// it. Shared so the section composer and the hero's Try It modal reject the
// same strings and phrase the same complaint.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// A visitor should not sit on a spinner because a form host is having a bad day.
const TIMEOUT_MS = 8000

export async function submitAsk({ prompt, email, example, source = 'landing:how-it-works' }) {
  const payload = {
    prompt,
    email,
    // which curated example the prompt matched, if any — lets whoever picks
    // this up start from the workbook that already exists
    example: example || null,
    // which composer captured it — the section one below the fold, or the
    // hero's Try It modal. Same inbox, different intent worth telling apart.
    source,
    page: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString(),
  }

  if (!ENDPOINT) {
    // eslint-disable-next-line no-console
    console.warn(
      '[FinSynth] VITE_ASK_ENDPOINT is not set — this ask was NOT delivered. ' +
        'The visitor is being offered the mail-to fallback.',
      payload
    )
    return { delivered: false, reason: 'unconfigured' }
  }

  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = ctl ? setTimeout(() => ctl.abort(), TIMEOUT_MS) : null
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctl?.signal,
    })
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(`[FinSynth] ask endpoint responded ${res.status}`, payload)
      return { delivered: false, reason: `http_${res.status}` }
    }
    return { delivered: true }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[FinSynth] ask endpoint unreachable', err, payload)
    return { delivered: false, reason: 'network' }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

// The fallback: everything we captured, packed into a mail the visitor sends
// themselves. Used whenever delivered === false.
export const CONTACT_EMAIL = 'support@finsynth.ai'

export function askMailto({ prompt, email }) {
  const subject = 'Run this on FinSynth — cited answer request'
  const body = [
    'Please run this on FinSynth and send me the cited answer.',
    '',
    'Question:',
    prompt,
    '',
    `Reply to: ${email}`,
  ].join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
