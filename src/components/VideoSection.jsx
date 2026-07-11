import { useState } from 'react'

// FinSynth demo video. Accepts a YouTube embed URL
// (https://www.youtube.com/embed/VIDEO_ID) or a hosted file
// (e.g. /assets/finsynth-demo.mp4 dropped into public/assets).
// Until it's set, the play button falls back to booking a live demo.
const VIDEO_URL = ''

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)
  const isFile = /\.(mp4|webm|mov)$/i.test(VIDEO_URL)

  return (
    <section className="video-sec">
      <div className="wrap">
        <div className="video-head">
          <p className="setup-eyebrow">DEMO</p>
          <h2>See it work in Excel</h2>
          <p className="video-sub">A short walkthrough, from a blank model to a cited, populated one.</p>
          <p className="video-body">Watch FinSynth pull segment revenue from a 10-Q, drop it into the model, and attach the citation with an approval step before every write.</p>
        </div>
        <div className="video-card">
          {playing && VIDEO_URL ? (
            isFile ? (
              <video className="video-frame" src={VIDEO_URL} controls autoPlay />
            ) : (
              <iframe
                className="video-frame"
                src={`${VIDEO_URL}${VIDEO_URL.includes('?') ? '&' : '?'}autoplay=1`}
                title="FinSynth demo"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <>
              <div className="yt-top">
                <span className="yt-av">F</span>
                <div className="yt-meta">
                  <div className="t">Introducing FinSynth — The Auditable Excel Agent for Buy-Side Analysts</div>
                  <div className="c">finsynthai</div>
                </div>
              </div>
              {VIDEO_URL ? (
                <button className="play" onClick={() => setPlaying(true)} aria-label="Play the FinSynth demo"><i></i></button>
              ) : (
                <a href="https://calendly.com/kartik-finsynth/intro" target="_blank" rel="noopener noreferrer" className="play" aria-label="Watch the demo"><i></i></a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
