/**
 * The certification seals, rendered in two places: the "Enterprise ready" stage
 * of the add-in section, where they are the evidence for that claim, and the
 * Security section's head band, where they caption the section they belong to.
 *
 * One component rather than two copies of the markup, because the list is a
 * factual claim about what we hold — a duplicated array would drift the moment
 * a certification lands, and one of the two would start saying something untrue.
 *
 * `pending` marks one not yet awarded: it reads back from the certified seals
 * and carries an "In progress" pill on its lower edge, so the row never implies
 * a certification we don't hold.
 *
 * `sub` qualifies the name where the name alone would be imprecise — SOC 2 is
 * two different audits and we hold the Type II. It sits on its own small line
 * rather than in `name`, because the name is a display glyph sized to fill a
 * square plate and "SOC 2 Type II" would wrap inside it.
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
      {SEALS.map(s => (
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
