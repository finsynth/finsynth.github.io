// Outbound links shared across the page, kept in one place so the hero and the
// navbar can't drift apart:
//   BOOK_URL   — the demo-booking link (hero CTA, and anywhere else a
//                "book a demo" action is offered)
//   APP_HREF   — the "try it" / "go to app" action. The webapp guards /agent
//                itself: signed-out visitors are bounced to its sign-in and
//                land back on the agent, signed-in ones go straight there, so
//                the site never needs to know who is signed in.

export const BOOK_URL = 'https://calendly.com/kartik-finsynth/intro'

export const APP_HREF = 'https://webapp.finsynth.ai/agent'
