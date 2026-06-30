export default function Navbar() {
  return (
    <nav className="navbar">
      <img
        className="navbar-logo"
        src="/assets/img/full-logo.svg"
        alt="FinSynth Logo"
        onClick={() => window.location.href = 'https://finsynth.ai/'}
      />
      <div className="navbar-links">
        <a className="nav-link" href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">Privacy</a>
        <a className="nav-link" href="mailto:support@finsynth.ai">Pricing</a>
        <a className="nav-link" href="mailto:support@finsynth.ai">Case Studies</a>
        <a className="nav-link" href="mailto:support@finsynth.ai">Enterprise</a>
        <a className="nav-link" href="mailto:support@finsynth.ai">Changelog</a>
      </div>
      <div className="navbar-right">
        <a className="nav-signin" href="https://webapp.finsynth.ai" target="_blank" rel="noopener noreferrer">Log In</a>
        <a className="nav-demo" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Book Demo</a>
      </div>
    </nav>
  );
}
