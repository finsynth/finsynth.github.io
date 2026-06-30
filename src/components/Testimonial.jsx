export default function Testimonial() {
  return (
    <section className="testi-sec">
      <div className="wrap">
        <div className="testi-card">
          <div className="testi-stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <blockquote className="testi-quote">
            "FinSynth does in an hour what used to take my juniors three days — and every number links back to the filing. It's the first AI tool our compliance team actually signed off on."
          </blockquote>
          <div className="testi-author">
            <span className="testi-avatar" style={{ background: '#3550C8' }}>MC</span>
            <div className="testi-meta">
              <span className="testi-name">Maria Chen</span>
              <span className="testi-role">Portfolio Manager, Buy-side fund</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
