const SIDE_QUOTES = [
  {
    quote:
      '"We needed a faster way to keep models current through earnings season. FinSynth refreshes the figures and attaches the citation, so review takes minutes instead of hours."',
    name: 'Daniel Wright',
    role: 'Head of Research / Long-short equity fund',
    initials: 'DW',
    color: '#17593B',
  },
  {
    quote:
      '"It rebuilt our comps sheet from the new 10-Q without breaking a single formula — same formats, same structure, every cell cited. Highly recommend."',
    name: 'Priya Sharma',
    role: 'Senior Analyst / Global asset manager',
    initials: 'PS',
    color: '#2438A8',
  },
]

export default function Testimonial() {
  return (
    <section className="testi-sec" id="customers">
      <div className="wrap">

        {/* Head */}
        <div className="testi-head">
          <h2>Trusted by the analysts<br />moving fastest.</h2>
          <p className="testi-head-sub">
            Buy-side teams use FinSynth to build, update, and audit models
            without leaving Excel.
          </p>
        </div>

        {/* Featured + side cards */}
        <div className="testi-grid">
          <div className="testi-feature">
            <div className="testi-feature-brand">
              <span className="testi-feature-mark" aria-hidden="true">◆</span>
              Meridian Capital
            </div>
            <blockquote className="testi-feature-quote">
              "FinSynth does in an hour what used to take my juniors three days
              — and every number links back to the filing. It's the first AI
              tool our compliance team actually signed off on."
            </blockquote>
            <div className="testi-author">
              <span className="testi-avatar" style={{ background: '#3550C8' }}>MC</span>
              <div className="testi-meta">
                <span className="testi-name">Maria Chen</span>
                <span className="testi-role">Portfolio Manager / Meridian Capital</span>
              </div>
            </div>
          </div>

          <div className="testi-side">
            {SIDE_QUOTES.map(t => (
              <div className="testi-card-sm" key={t.name}>
                <blockquote className="testi-sm-quote">{t.quote}</blockquote>
                <div className="testi-author">
                  <span className="testi-avatar" style={{ background: t.color }}>{t.initials}</span>
                  <div className="testi-meta">
                    <span className="testi-name">{t.name}</span>
                    <span className="testi-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
