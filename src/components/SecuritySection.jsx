export default function SecuritySection() {
  return (
    <section className="security-new" id="features">
      <div className="wrap">
        <div className="sec-head">
          <span className="crop tl"></span><span className="crop br"></span>
          <h2>Everything an analyst does, in your spreadsheet</h2>
          <p>FinSynth builds and maintains real, auditable models inside Excel — every number traced to a primary source, every write approved by you.</p>
        </div>
        <div className="sec-table">
          <div className="sec-row">
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="7" y="7" width="30" height="30" rx="3" />
                <path d="M7 16h30M16 16v21M22 22h9M22 28h9M22 34h9" />
              </svg>
              <h3>Build models from scratch</h3>
              <p className="body-text">Describe the analysis in plain English and FinSynth assembles a fully structured model — schedules, drivers, and formulas — ready to audit.</p>
            </div>
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M30 9l5 5-17 17-6 1 1-6 17-17z" />
                <path d="M9 35h12" />
              </svg>
              <h3>Update &amp; extend existing models</h3>
              <p className="body-text">Point FinSynth at the model you already use. It refreshes figures, adds periods, and extends logic without breaking your structure.</p>
            </div>
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="8" y="6" width="22" height="28" rx="2" />
                <path d="M14 14h10M14 20h10M14 26h6" />
                <circle cx="31" cy="31" r="6" /><path d="M35.5 35.5 39 39" />
              </svg>
              <h3>Cell-level citations</h3>
              <p className="body-text">Click any cell to see the exact filing, page, and quote behind the number — SEC documents, live quotes, or your own inputs.</p>
            </div>
          </div>
          <div className="sec-row">
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 6h14l8 8v24H12z" /><path d="M26 6v8h8" />
                <path d="M17 22h10M17 28h10" />
              </svg>
              <h3>Source-grounded numbers</h3>
              <p className="body-text">Every figure is extracted verbatim from primary documents — filings, transcripts, and decks — never inferred or hallucinated.</p>
            </div>
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="22" cy="14" r="6" /><path d="M10 36c0-7 5.5-11 12-11s12 4 12 11" />
                <path d="M30 20l3 3 6-6" />
              </svg>
              <h3>Human-in-the-loop by design</h3>
              <p className="body-text">The agent proposes — you approve. Every cell change is previewed as a diff with no autonomous writes to your model.</p>
            </div>
            <div className="sec-cell">
              <svg className="lineic" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="6" y="9" width="32" height="26" rx="2" />
                <path d="M6 17h32M14 9v26M22 17v18M30 17v18M6 26h32" />
              </svg>
              <h3>Native to Excel</h3>
              <p className="body-text">Runs as an add-in alongside your real workbook. Your macros, formulas, and shortcuts keep working — nothing leaves your environment.</p>
            </div>
          </div>
        </div>
        <div className="privacy-btn-row">
          <a className="btn-black" href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer">Contact Sales</a>
        </div>
      </div>
    </section>
  );
}
