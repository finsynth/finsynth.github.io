import { Check } from 'lucide-react'
import { BOOK_URL, APP_HREF } from '@/components/layout/AskParts'
import EnterpriseDiagram from '@/components/home/EnterpriseDiagram'

const FEATURES = [
  'Custom credit allocation',
  'Custom contracts and SLAs',
  'Dedicated support',
  'Custom integrations',
]

export default function EnterpriseBanner() {
  return (
    <aside className="ent-panel">
      <div className="ent-copy">
        {/* One sentence, no full stops — a mid-sentence stop split this into
            two short lines that read as a heading plus a caption. */}
        <p className="ent-lede">Custom setup, custom terms, one conversation away</p>

        <ul className="ent-list">
          {FEATURES.map((f) => (
            <li key={f}>
              <Check className="ent-check" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="ent-ctas">
          <a className="ent-cta" href={BOOK_URL} target="_blank" rel="noopener noreferrer">
            Talk to Us
          </a>
          <a
            className="ent-cta ent-cta--ghost"
            href={APP_HREF}
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
