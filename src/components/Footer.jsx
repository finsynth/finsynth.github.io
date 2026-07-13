export default function Footer() {
  return (
    <footer className="footer-new">
      <div className="wrap">
        <div className="foot-brand">
          <img src="/assets/img/full-logo-white.svg" alt="FinSynth Logo" />
        </div>
        <div className="foot-grid-new">
          <div>
            <h4>Product</h4>
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <a href="#customers">Customers</a>
            <a href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Book a demo</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#customers">About</a>
            <a href="mailto:support@finsynth.ai">Contact</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/terms-of-service.pdf" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="#security">Compliance</a>
          </div>
          <div>
            <h4>Social</h4>
            <a href="https://www.linkedin.com/company/finsynthai/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://x.com/FinsynthAI" target="_blank" rel="noopener noreferrer">X</a>
          </div>
        </div>
        <div className="foot-legal">
          <span>© 2026 FinSynth. All Rights Reserved.</span>
          <span>Built on Anthropic Claude · Backed by Accel</span>
        </div>
      </div>
    </footer>
  );
}
