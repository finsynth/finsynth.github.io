import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ROLES, ABOUT_US, applyHref } from '../data/roles'

function Careers() {
  useEffect(() => {
    document.title = 'FinSynth AI - Careers'
    return () => {
      document.title = 'FinSynth AI - Auditable spreadsheet agent'
    }
  }, [])

  // The navbar/footer role links land on /careers#<key>. The postings are
  // client-rendered, so the browser's native anchor jump fires before they
  // exist — repeat it once the page has mounted.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  // Tally's "redirect on completion" sends the applicant back here with
  // ?applied=1 (set in the form's settings), so the thank-you is our page,
  // not Tally's "create your own form" screen. Read once at mount — the flag
  // shouldn't survive into copied/bookmarked URLs, so strip it after reading.
  const applied = new URLSearchParams(window.location.search).has('applied')
  useEffect(() => {
    if (applied) window.history.replaceState(null, '', window.location.pathname)
  }, [applied])

  return (
    <div className="mainContainer">
      <Navbar />
      <main className="careers-container">
        {applied && (
          <div className="careers-applied" role="status">
            <b>Application received.</b> Thank you for applying — we read every
            application and will be in touch.
          </div>
        )}
        <header className="careers-head">
          <h1 className="careers-heading">Careers</h1>
          <p className="careers-about">{ABOUT_US}</p>
        </header>

        {ROLES.map((role) => (
          <article className="role-card" id={role.key} key={role.key}>
            <div className="role-top">
              <div>
                <h2 className="role-title">{role.title}</h2>
                <p className="role-meta">{role.meta}</p>
              </div>
              {/* Tally hosts the application form (fields + resume upload);
                  opening it in a new tab keeps the postings on screen while
                  the candidate applies. */}
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
      </main>
      <Footer />
    </div>
  )
}

export default Careers
