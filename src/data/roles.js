/**
 * The open roles, in one place. The footer's Careers column and the navbar's
 * Careers menu both read this list, so a role can't be open in one and gone
 * from the other — the same reason the certification seals are one array.
 *
 * There is still no careers page or careers inbox, so the only route an
 * applicant has is the address the site already publishes. `roleHref` builds a
 * mailto with the role in the subject, which is what makes these safe to render
 * as links: they land somewhere real. Swap it for a posting URL per role the
 * moment there is one.
 */
export const CAREERS_EMAIL = 'support@finsynth.ai'

export const ROLES = [
  { key: 'gtm', title: 'Founding GTM Lead', place: 'NYC' },
  { key: 'eng', title: 'Founding Engineer', place: 'NYC' },
]

// Location in brackets, so the role reads first and the city is the aside:
// "Founding Engineer (NYC)". Both the footer column and the navbar menu render this,
// and it is also the subject line an application arrives under.
export const roleLabel = (r) => `${r.title} (${r.place})`

export const roleHref = (r) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleLabel(r)}`)}`
