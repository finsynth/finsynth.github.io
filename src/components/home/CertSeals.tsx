/**
 * One list for both places it renders: it is a factual claim, and a second copy would drift.
 * `pending` = not yet awarded (dimmed, "In progress" pill). `sub` sits on its own line because
 * `name` is a display glyph sized to its plate and "SOC 2 Type II" would wrap.
 */
export const SEALS = [
  { key: 'soc2', top: 'AICPA', name: 'SOC 2', sub: 'Type II' },
  { key: 'gdpr', top: 'EU', name: 'GDPR', pending: true },
  { key: 'iso', top: 'ISO/IEC', name: '27001', pending: true },
]

/**
 * `compact` shrinks the seals for the Security head band, where they sit beside
 * a heading rather than filling a stage cell on their own.
 */
export default function CertSeals({ compact = false }) {
  return (
    <ul className={`xvs-certs${compact ? ' xvs-certs--compact' : ''}`}>
      {SEALS.map((s) => (
        <li key={s.key} className={`xvs-seal${s.pending ? ' xvs-seal--pending' : ''}`}>
          <span className="xvs-seal-top">{s.top}</span>
          <span className="xvs-seal-rule" />
          <span className="xvs-seal-name">{s.name}</span>
          {s.sub && <span className="xvs-seal-sub">{s.sub}</span>}
          {s.pending && <span className="xvs-seal-pill">In progress</span>}
        </li>
      ))}
    </ul>
  )
}
