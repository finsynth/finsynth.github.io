// Every site-wide URL, address and default in one place. Components import
// from here instead of hardcoding, so a changed link is a one-line edit.
// Values that can be overridden per environment are added alongside the
// PUBLIC_* env reads, also here.

export const SITE = {
  url: 'https://finsynth.ai',
  name: 'FinSynth',
  title: 'FinSynth | Auditable AI research infrastructure',
  description:
    'FinSynth is building auditable AI research infrastructure for investment research teams. ' +
    'Its AI agent helps teams execute complex research workflows while tracing every output back ' +
    'to its source, making AI-generated research verifiable and decision-ready. FinSynth is ' +
    'backed by Accel and industry veterans.',
  ogImage: '/assets/img/og-card.png',
} as const

export const LINKS = {
  // the webapp guards /agent itself: signed-out visitors are sent through its
  // sign-in and land back here, so the site never needs to know who is signed in
  app: 'https://webapp.finsynth.ai/agent',
  bookCall: 'https://calendly.com/kartik-finsynth/intro',
  createOrg: 'https://accounts.finsynth.ai/create-organization',
  supportForm: 'https://forms.office.com/r/kD0Y2Fmexb',
  privacyPolicy: 'https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf',
  termsOfService: 'https://nj5uoj11j293i3fb-help.finsynth.ai/legal/terms-of-service.pdf',
  linkedin: 'https://www.linkedin.com/company/finsynthai/',
  x: 'https://x.com/FinsynthAI',
} as const

export const EMAILS = {
  support: 'support@finsynth.ai',
} as const
