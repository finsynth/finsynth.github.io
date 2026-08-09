import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Support() {
  useEffect(() => {
    document.title = 'FinSynth AI - Support'
    return () => {
      document.title = 'FinSynth AI - Auditable spreadsheet agent'
    }
  }, [])

  return (
    <div className="mainContainer">
      <Navbar />
      <div className="support-container">
        <div className="support-heading">Support</div>
        <div className="support-content">
          <div className="support-description">
            If you&apos;re facing an issue or have a question, our support team is here for you. Click below to raise a
            ticket and we&apos;ll get back to you as soon as possible.
          </div>
          <button className="button button-cta">
            <a
              className="button-cta-link"
              href="https://forms.office.com/r/kD0Y2Fmexb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raise Ticket
            </a>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Support
