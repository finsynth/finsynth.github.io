import { ROLES, ABOUT_US, applyHref } from '../data/roles'

function Careers() {
  return (
    <>
      <header className="careers-head">
        <h1 className="careers-heading">Careers</h1>
        <h2 className="careers-sub">About FinSynth</h2>
        <p className="careers-about">{ABOUT_US}</p>
      </header>

      <h2 className="careers-sub">Job Openings</h2>
      {ROLES.map((role) => (
        <article className="role-card" id={role.key} key={role.key}>
          <div className="role-top">
            <div>
              <h2 className="role-title">{role.title}</h2>
              <p className="role-meta">{role.meta}</p>
            </div>
            <a
              className="role-apply"
              href={applyHref(role)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply
            </a>
          </div>

          <p className="role-about">{role.about}</p>

          {role.sections.map((s) => (
            <section className="role-section" key={s.heading}>
              <h3>{s.heading}</h3>
              <ul>
                {s.items.map((it, i) => (
                  <li key={i}>
                    {it.lead && <b>{it.lead}</b>}
                    {it.lead ? ' ' : ''}
                    {it.text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      ))}
    </>
  )
}

export default Careers
