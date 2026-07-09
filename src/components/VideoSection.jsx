export default function VideoSection() {
  return (
    <section className="video-sec">
      <div className="wrap">
        <div className="video-head">
          <h2>See it work in Excel</h2>
          <p className="video-sub">A short walkthrough, from a blank model to a cited, populated one.</p>
          <p className="video-body">Watch FinSynth pull segment revenue from a 10-Q, drop it into the model, and attach the citation with an approval step before every write.</p>
        </div>
        <div className="video-card">
          <div className="yt-top">
            <span className="yt-av">F</span>
            <div className="yt-meta">
              <div className="t">Introducing FinSynth — The Auditable Excel Agent for Buy-Side Analysts</div>
              <div className="c">finsynthai</div>
            </div>
          </div>
          <a href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer" className="play" aria-label="Watch the demo"><i></i></a>
        </div>
      </div>
    </section>
  );
}
