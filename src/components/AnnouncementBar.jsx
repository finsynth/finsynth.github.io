export default function AnnouncementBar() {
  return (
    <div className="announce-bar">
      <a
        className="announce-link"
        href="https://calendly.com/kartik-finsynth/intro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="announce-tag">New</span>
        <span className="announce-text">FinSynth is now available to select funds — book a demo</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  )
}
