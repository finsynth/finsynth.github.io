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
        <a className="nav-link" href="#how-it-works">How it works</a>
        <a className="nav-link" href="#p-accuracy">Product</a>
        <a className="nav-link" href="#security">Security</a>
      </div>
      <div className="navbar-right">
        <a className="nav-demo" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Book a demo</a>
      </div>
    </nav>
  );
}
