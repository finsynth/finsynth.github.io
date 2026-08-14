// Outbound links shared across the page, kept in one place so the hero and the
// navbar can't drift apart:
//   BOOK_URL   — the demo-booking link (hero CTA, and anywhere else a
//                "book a demo" action is offered)
//   SIGNIN_HREF/APP_HREF — the two ends of the "try it" action: signed-out
//                visitors go through sign-in and land on the agent, signed-in
//                ones go straight there

export const BOOK_URL = 'https://calendly.com/kartik-finsynth/intro'

export const SIGNIN_HREF = 'https://webapp.finsynth.ai/signin?redirectPath=%2Fagent'
export const APP_HREF = 'https://webapp.finsynth.ai/agent'
