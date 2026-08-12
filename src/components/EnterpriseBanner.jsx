import { Check } from 'lucide-react'


const FEATURES = [
  'Custom credit allocation',
  'Dedicated support',
  'Custom contracts and SLAs',
  'Custom integrations',
]

export default function EnterpriseBanner() {
  return (
    <aside className="ent-banner">
      <div className="ent-copy">
        <h3 className="ent-title">Enterprise</h3>
        <p className="ent-sub">For funds that need FinSynth shaped around how the desk already runs.</p>
      </div>
      <ul className="ent-features">
        {FEATURES.map((f) => (
          <li key={f}><Check aria-hidden="true" /><span>{f}</span></li>
        ))}
      </ul>
      <a
        className="plan-card-cta ent-cta"
        href="https://calendly.com/kartik-finsynth/intro"
        target="_blank"
        rel="noopener noreferrer"
      >
        Talk to Us
      </a>
    </aside>
  )
}
