// Outbound links shared across the page, re-exported from the site config so
// the hero, navbar and banners can't drift apart:
//   BOOK_URL   — the demo-booking link (hero CTA, and anywhere else a
//                "book a demo" action is offered)
//   APP_HREF   — the "try it" / "go to app" action
import { LINKS } from '@/config/site'

export const BOOK_URL = LINKS.bookCall
export const APP_HREF = LINKS.app
