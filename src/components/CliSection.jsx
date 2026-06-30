export default function CliSection() {
  return (
    <section className="cli-new">
      <div className="wrap cli-grid">
        <div>
          <h2>Our Manifest</h2>
          <p className="lede">Finance deserves better tools. We built FinSynth because we believe analysts should spend their time thinking — not hunting for data, formatting cells, or second-guessing numbers they can't trace.</p>
          <div className="cli-steps">
            <div className="step">
              <div className="sl">Every number has a source.</div>
              <p className="note">Cell-level citations that trace every output back to its origin — a filing, a quote, or your own input. No black boxes.</p>
            </div>
            <div className="step">
              <div className="sl">The analyst is always in control.</div>
              <p className="note">The agent proposes. You approve. Nothing changes in your model without your explicit sign-off.</p>
            </div>
            <div className="step">
              <div className="sl">Your workflow, not ours.</div>
              <p className="note">Excel native — your existing macros, shortcuts, and models keep working. FinSynth fits around you.</p>
            </div>
          </div>
          <a className="learn" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Talk to us ›</a>
        </div>
        <div className="etch-frame">
          <div className="term">
            <div className="term-bar"><i></i><i></i><i></i><span>FinSynth · Excel Add-in</span></div>
            <div className="term-body">
              <span className="p">▮ Agent</span> <span className="dim">Running DCF model on AAPL · claude-sonnet-4-6</span><br />
              <span className="dim">Sources: 10-K (2024), live quote, analyst consensus</span><br />
              <br />
              <span className="p">»</span> Populated cells B12:B24 with revenue forecasts<br />
              <span className="p">»</span> Each cell linked to source citation<br />
              <span className="p">»</span> <span className="dim">Awaiting your approval before writing to sheet...</span><br />
              <span className="p">»</span> <span className="cursor"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
