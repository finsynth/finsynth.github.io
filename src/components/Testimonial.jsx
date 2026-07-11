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
                <p className="testi-eyebrow">Customer</p>
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

        {/* Outcomes */}
        <div className="testi-outcomes-head">
          <h2>Real outcomes from real desks.</h2>
          <p className="testi-head-sub">Numbers from analysts running FinSynth in production.</p>
        </div>

        <div className="testi-stat-row">
          <div className="testi-stat-left">
            <div className="testi-stat-num">10×</div>
            <div className="testi-stat-label">Faster model turnaround</div>
            <div className="testi-stat-org">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" /><path d="M12 22V11.5M4 6.5l8 5 8-5" />
              </svg>
              Meridian Capital
            </div>
          </div>
          <div className="testi-stat-right">
            <span className="testi-stat-mark" aria-hidden="true">"</span>
            <p className="testi-stat-quote">
              We update every model the morning a filing drops. What used to eat
              the first week of earnings season now takes a day — and the PM can
              trace any cell himself.
            </p>
            <div className="testi-stat-foot">
              <div className="testi-author">
                <span className="testi-avatar" style={{ background: '#0E1A3A' }}>JO</span>
                <div className="testi-meta">
                  <span className="testi-name">James Okafor</span>
                  <span className="testi-role">Portfolio Manager · Meridian Capital</span>
                </div>
              </div>
              <div className="testi-stat-org">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" /><path d="M12 22V11.5M4 6.5l8 5 8-5" />
                </svg>
                Meridian Capital
              </div>
            </div>
          </div>
        </div>

        {/* Credibility */}
        <div className="testi-cred">
          <div className="testi-cred-item">
            <p className="testi-eyebrow">Built on</p>
            <div className="testi-cred-body">
              <svg className="testi-cred-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.83 4h-3.9L3 20h4l1.45-3.9h7.02L16.9 20h4L13.83 4zm-4.1 8.9L11.9 7l2.16 5.9H9.73z" />
              </svg>
              <div className="testi-cred-text">
                <span className="testi-cred-title">Anthropic Claude</span>
                <span className="testi-cred-sub">Powered by frontier AI models</span>
              </div>
            </div>
          </div>

          <div className="testi-cred-item">
            <p className="testi-eyebrow">Backed by</p>
            <div className="testi-cred-body">
              <div className="testi-cred-text">
                <span className="testi-cred-title">Accel</span>
                <span className="testi-cred-sub">Alongside hedge fund managers &amp; AI experts</span>
              </div>
            </div>
          </div>

          <div className="testi-cred-item">
            <p className="testi-eyebrow">Founded by</p>
            <div className="testi-cred-founders">
              <div className="testi-author">
                <span className="testi-avatar" style={{ background: '#0E1A3A' }}>KA</span>
                <div className="testi-meta">
                  <span className="testi-name">Kartik Agarwal</span>
                  <span className="testi-role">CEO</span>
                </div>
              </div>
              <div className="testi-author">
                <span className="testi-avatar" style={{ background: '#2438A8' }}>AM</span>
                <div className="testi-meta">
                  <span className="testi-name">Akshay Sunil Masare</span>
                  <span className="testi-role">CTO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
