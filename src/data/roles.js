/**
 * The open roles, in one place. The footer's Careers column and the navbar's
 * Careers menu both read this list, so a role can't be open in one and gone
 * from the other — the same reason the certification seals are one array.
 *
 * Each role links straight to its own Tally form, which carries the full job
 * description as text blocks above the fields and hosts the resume upload —
 * there is no careers page on this site (one existed briefly; git history has
 * it if postings ever need to live on our own domain). `formId` is the
 * trailing segment of the form's share URL (https://tally.so/r/<id>), public
 * by design — it ships in the bundle either way. A role without a formId
 * falls back to the mailto the site always published, so its link never
 * points at a dead URL.
 */
export const CAREERS_EMAIL = 'support@finsynth.ai'

export const ROLES = [
  { key: 'eng', title: 'Founding Engineer', place: 'New York', formId: 'GxEy8Q' },
  { key: 'gtm', title: 'Founding GTM Lead', place: 'New York', formId: '' },
]

// Location in brackets, so the role reads first and the city is the aside:
// "Founding GTM Lead (New York)". Both the footer column and the navbar menu
// render this, and it is also the subject line a fallback application
// arrives under.
export const roleLabel = (r) => `${r.title} (${r.place})`

export const roleHref = (r) =>
  r.formId
    ? `https://tally.so/r/${r.formId}`
    : `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleLabel(r)}`)}`

// Tally links leave the site, so they should open in a new tab; the mailto
// fallback should not (a blank tab behind the mail composer). The navbar and
// footer both key their target/rel off this.
export const roleExternal = (r) => Boolean(r.formId)
