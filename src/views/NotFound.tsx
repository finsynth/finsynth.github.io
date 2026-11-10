import { Compass } from 'lucide-react'

function NotFound() {
  return (
    <main className="panel-page" aria-labelledby="not-found-title">
      <div className="panel-bg" aria-hidden="true" />
      <div className="panel-content panel-content--wide">
        <div className="panel-icon" aria-hidden="true">
          <Compass size={26} strokeWidth={1.6} />
        </div>
        <h1 className="panel-heading" id="not-found-title">
          Page not found
        </h1>
        <p className="panel-lede">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <a className="hero-s2-cta panel-cta" href="/">
          Back to home
        </a>
      </div>
    </main>
  )
}

export default NotFound
