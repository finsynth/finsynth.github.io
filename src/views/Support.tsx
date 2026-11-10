import { Headphones, ArrowUpRight } from 'lucide-react'
import { LINKS } from '@/config/site'

function Support() {
  return (
    <main className="panel-page" aria-labelledby="support-title">
      <div className="panel-bg" aria-hidden="true" />
      <div className="panel-content">
        <div className="panel-icon" aria-hidden="true">
          <Headphones size={26} strokeWidth={1.6} />
        </div>
        <h1 className="panel-heading" id="support-title">
          How can we help?
        </h1>
        <p className="panel-lede">
          Have a question or running into an issue? Send us the details and our team will help.
        </p>
        <a
          className="hero-s2-cta panel-cta"
          href={LINKS.supportForm}
          target="_blank"
          rel="noopener noreferrer"
        >
          Raise a ticket <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </div>
    </main>
  )
}

export default Support
