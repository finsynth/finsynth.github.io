import CertSeals from '@/components/home/CertSeals'

const CheckIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
)

// The certification seals sit beside this heading and again on the add-in
// section's "Enterprise ready" stage — both from CertSeals, so the two rows
// can't drift apart. Compact here, because they share the band with a heading
// rather than filling a stage cell.

// Four points, two columns — the controls the customer holds.
const POINTS = [
  {
    key: 'gate',
    title: 'Permission-gated by design',
    body: "The agent can't make a single change without your explicit approval",
  },
  {
    key: 'notraining',
    title: 'No training on your data',
    body: 'By default your data is never shared, used to train AI models, or made accessible to other firms or third-party AI providers',
  },
  {
    key: 'access',
    title: 'Strict access controls',
    body: 'FinSynth runs a zero-trust, least-privilege access model with granular role-based controls',
  },
  {
    key: 'integrations',
    title: 'Custom integrations supported',
    body: 'Connect FinSynth to the data sources and tools your team already runs on',
  },
]

export default function Security() {
  return (
    <section className="secx" id="security">
      <div className="wrap" data-zoom>
        <div className="secx-frame" data-reveal="0.2">
          <div className="secx-head secx-reveal">
            <div className="secx-head-copy">
              <p className="secx-eyebrow">Security &amp; compliance</p>
              <h2>
                Enterprise-<span className="ttl-hl">ready</span>
              </h2>
            </div>
            <CertSeals compact />
          </div>

          <ul className="secx-grid">
            {POINTS.map((pt, i) => (
              <li
                key={pt.key}
                className="secx-point secx-reveal"
                style={{ '--d': `${0.08 + 0.07 * i}s` }}
              >
                <span className="secx-point-ic" aria-hidden="true">
                  {CheckIcon}
                </span>
                <div className="secx-point-body">
                  <h3 className="secx-point-title">{pt.title}</h3>
                  <p>{pt.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
