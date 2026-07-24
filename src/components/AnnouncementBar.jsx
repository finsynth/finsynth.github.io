// The live announcement. Set to `null` when there is nothing to announce and
// the bar renders nothing at all (no empty strip) — the banner only shows when
// there is an actual announcement.
const ANNOUNCEMENT = {
  tag: 'New',
  text: 'FinSynth is now available to select funds — book a demo',
  href: 'https://calendly.com/kartik-finsynth/intro',
}

export default function AnnouncementBar() {
  if (!ANNOUNCEMENT) return null
  const { tag, text, href } = ANNOUNCEMENT
  return (
    <div className="announce-bar">
      <a
        className="announce-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {tag && <span className="announce-tag">{tag}</span>}
        <span className="announce-text">{text}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  )
}
