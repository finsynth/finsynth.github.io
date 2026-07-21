export default function BeforeAfter() {
  return (
    <section className="bsp-sec">
      <div className="wrap">
        <div className="bsp-head">
          <h2>The number is right.<br />And you can prove it.</h2>
          <p className="bsp-sub">
            FinSynth writes cited figures straight into your model —
            every cell traces back to the filing behind it.
          </p>
        </div>

        <div className="bsp-split">
          {/* Before: manual sourcing */}
          <div className="bsp-side bsp-side-dark">
            <p className="bsp-eyebrow"><span className="bsp-dot red" />Copy-paste from PDFs</p>
            <h3>You chase the number yourself.</h3>

            <div className="bsp-sheet" aria-hidden="true">
              <div className="bsp-row"><span className="bsp-num">1</span><span className="bsp-cell"></span></div>
              <div className="bsp-row bsp-bad">
                <span className="bsp-num">2</span>
                <span className="bsp-cell"><b>#REF!</b><i>Source not found</i></span>
              </div>
              <div className="bsp-row"><span className="bsp-num">3</span><span className="bsp-cell"></span></div>
            </div>

            <ul className="bsp-steps">
              <li><span>1.</span>Open the 200-page 10-K and Ctrl-F your way to the figure.</li>
              <li><span>2.</span>Copy it into the model. Retype it when the paste breaks.</li>
              <li><span>3.</span>Six weeks later, nobody remembers where it came from.</li>
            </ul>
          </div>

          {/* After: FinSynth */}
          <div className="bsp-side bsp-side-blue">
            <p className="bsp-eyebrow"><span className="bsp-dot" />FinSynth agent</p>
            <h3>FinSynth writes it, cited.</h3>

            <div className="bsp-sheet" aria-hidden="true">
              <div className="bsp-row"><span className="bsp-num">1</span><span className="bsp-cell"></span></div>
              <div className="bsp-row bsp-good">
                <span className="bsp-num">2</span>
                <span className="bsp-cell"><b>2,847,000</b><i>→ FY24 10-K, p.48, Note 12</i></span>
              </div>
              <div className="bsp-row"><span className="bsp-num">3</span><span className="bsp-cell"></span></div>
            </div>

            <ul className="bsp-steps">
              <li><span>1.</span>Ask for the figure in plain English — no filing to open, no Ctrl-F.</li>
              <li><span>2.</span>FinSynth writes the value into the cell, source attached.</li>
              <li><span>3.</span>Six weeks later, click the cell and jump straight to the filing.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
