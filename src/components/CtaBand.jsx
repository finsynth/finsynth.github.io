export default function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="cta-card">
          <div className="cta-card-left">
            <span className="cta-divider" aria-hidden="true" />
            <h2>Take control of every<br />model on your desk</h2>
            <div className="cta-card-actions">
              <a
                className="cta-card-primary"
                href="https://calendly.com/kartik-finsynth/intro"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a call
              </a>
              <a
                className="cta-card-secondary"
                href="https://webapp.finsynth.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try the web app
              </a>
            </div>
            <p className="cta-card-note">A 20-minute call — we'll run a live analysis on a company you cover, citations and all.</p>
          </div>

          <div className="cta-fan" aria-hidden="true">
            <div className="fan-card fan-1">
              <span className="fan-tag">Comps in your workbook</span>
              <div className="fan-title">Comps_Model.xlsx</div>
              <div className="fan-row fan-row-head"><span>TICKER</span><span>P/E</span><span>REV</span></div>
              <div className="fan-row"><span className="fan-tick">AAPL</span><span>29.1x</span><span className="fan-pos">+6.1%</span></div>
              <div className="fan-row"><span className="fan-tick">MSFT</span><span>33.6x</span><span className="fan-pos">+15.7%</span></div>
              <div className="fan-row"><span className="fan-tick">GOOGL</span><span>24.3x</span><span className="fan-pos">+13.9%</span></div>
              <div className="fan-row"><span className="fan-tick">META</span><span>26.8x</span><span className="fan-pos">+18.9%</span></div>
            </div>
            <div className="fan-card fan-2">
              <span className="fan-tag">Every cell cited</span>
              <div className="fan-cell"><span className="fan-ref">B4</span><span>Revenue</span><span className="fan-val">$391.0B</span><span className="fan-cite">10-K</span></div>
              <div className="fan-cell"><span className="fan-ref">B5</span><span>Margin</span><span className="fan-val">46.2%</span><span className="fan-cite">10-K</span></div>
              <div className="fan-cell"><span className="fan-ref">B6</span><span>Services</span><span className="fan-val">$96.2B</span><span className="fan-cite">10-Q</span></div>
            </div>
            <div className="fan-card fan-3 fan-dark">
              <span className="fan-tag">Benchmark accuracy</span>
              <span className="fan-big">94%</span>
              <span className="fan-cap">SpreadsheetBench win rate</span>
            </div>
            <div className="fan-card fan-4">
              <span className="fan-tag">You approve every write</span>
              <div className="fan-prompt">Pull Q3 segment revenue</div>
              <div className="fan-approve"><span className="fan-chip">Approved</span><span>B4 · $94.9B</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
