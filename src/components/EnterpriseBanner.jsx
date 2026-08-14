import { Check } from 'lucide-react'
import { BOOK_URL, SIGNIN_HREF } from './AskParts'
import EnterpriseDiagram from './EnterpriseDiagram'


const FEATURES = [
  'Custom credit allocation',
  'Custom contracts and SLAs',
  'Dedicated support',
  'Custom integrations',
]

/**
 * The row that closes the pricing section: the sales-touch tier has no checkout
 * to enter, so it is pitched rather than priced, with the isometric stack from
 * the Claude Design source (Enterprise Pricing Card) beside the copy.
 *
 * It leads with what the tier is for and then what it includes. The "Enterprise"
 * tier name that used to sit above the lede is gone: the plan cards it echoed
 * are Clerk's, this panel is the only thing in the row that isn't a card, and
 * the label was reading as a heading on a section that already has one. The
 * design's "FinSynth, shaped around how the desk already runs" line lived in
 * that slot too and is in git history if either is ever wanted back.
 *
 * The ground is the design's grainy blue; the type is the page's own — Geist
 * rather than the design's Source Serif 4, at the page's body size. The buttons
 * are an addition: the design has no button, and without one the section has no
 * route to sales, and no route to the free tier for a reader who came straight
 * to the bottom of the pricing section.
 */
export default function EnterpriseBanner() {
  return (
    <aside className="ent-panel">
      <div className="ent-copy">
        {/* One sentence, no stops at all — the mid-sentence one split this into
            two short lines that read as a heading plus a caption. */}
        <p className="ent-lede">
          For funds that need custom terms, deeper integrations and a team on
          call, scoped with you
        </p>

        <ul className="ent-list">
          {FEATURES.map((f) => (
            <li key={f}>
              <Check className="ent-check" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="ent-ctas">
          <a
            className="ent-cta"
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk to Us
          </a>
          {/* Signed-out route only, unlike the hero's version of this button:
              anyone reading an enterprise pitch is being asked to start, and a
              signed-in user lands on the same app either way. */}
          <a
            className="ent-cta ent-cta--ghost"
            href={SIGNIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try for free
          </a>
        </div>
      </div>

      <div className="ent-viz">
        <EnterpriseDiagram />
      </div>
    </aside>
  )
}
