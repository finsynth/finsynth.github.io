import { Check } from 'lucide-react'
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
 * It reads like the plan cards above it — tier name as the title, one line of
 * what the tier is for, then what it includes — so there is no second headline
 * between the two. The design's "FinSynth, shaped around how the desk already
 * runs" line lived there and is in git history if it is ever wanted back.
 *
 * The ground is the design's grainy blue; the type is the page's own — Geist
 * rather than the design's Source Serif 4, at the page's body size. The CTA is
 * an addition: the design has no button, but without one the section has no
 * route to sales.
 */
export default function EnterpriseBanner() {
  return (
    <aside className="ent-panel">
      <div className="ent-copy">
        <h3 className="ent-title">Enterprise</h3>
        <p className="ent-lede">
          For funds that need custom terms, deeper integrations and a team on call.
          We scope it with you.
        </p>

        <ul className="ent-list">
          {FEATURES.map((f) => (
            <li key={f}>
              <Check className="ent-check" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <a
          className="ent-cta"
          href="https://calendly.com/kartik-finsynth/intro"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talk to Us
        </a>
      </div>

      <div className="ent-viz">
        <EnterpriseDiagram />
      </div>
    </aside>
  )
}
