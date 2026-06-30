const ITEMS = [
  {
    title: 'No training on your data',
    desc: 'Powered by Anthropic Claude on a zero-retention API. Your filings, models, and research never train any AI system.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M22 6l13 5v9c0 9-5.6 14.6-13 17-7.4-2.4-13-8-13-17v-9z" />
        <path d="M16 22l4 4 9-9" />
      </svg>
    ),
  },
  {
    title: 'Your data stays yours',
    desc: 'Strict tenant isolation. Your spreadsheets, prompts, and outputs are never shared across clients or stored beyond your session.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="22" cy="11" rx="13" ry="5" />
        <path d="M9 11v22c0 2.8 5.8 5 13 5s13-2.2 13-5V11M9 22c0 2.8 5.8 5 13 5s13-2.2 13-5" />
      </svg>
    ),
  },
  {
    title: 'Encrypted end-to-end',
    desc: 'AES-256 at rest, TLS 1.3 in transit. Your data is protected at every point — from Excel to our servers.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="11" y="19" width="22" height="17" rx="2" />
        <path d="M16 19v-5a6 6 0 0 1 12 0v5" /><circle cx="22" cy="27" r="2" />
      </svg>
    ),
  },
  {
    title: 'Human-in-the-loop',
    desc: 'The agent proposes — you approve. No autonomous writes to your models without explicit sign-off on every action.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="22" cy="14" r="6" /><path d="M10 36c0-7 5.5-11 12-11s12 4 12 11" />
        <path d="M29 19l3 3 6-6" />
      </svg>
    ),
  },
];

export default function Security() {
  return (
    <section className="sec-trust" id="security">
      <div className="wrap">
        <div className="sec-trust-head">
          <p className="sec-trust-eyebrow">SECURITY &amp; TRUST</p>
          <h2>Built for institutional trust</h2>
          <p>Financial data is sensitive. FinSynth is designed so your numbers, models, and proprietary research never leave your control.</p>
        </div>
        <div className="sec-trust-grid">
          {ITEMS.map((it) => (
            <div className="sec-trust-card" key={it.title}>
              <span className="sec-trust-ic">{it.icon}</span>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
        <div className="sec-trust-foot">
          <a href="https://nj5uoj11j293i3fb-help.finsynth.ai/legal/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">View full privacy policy →</a>
        </div>
      </div>
    </section>
  );
}
