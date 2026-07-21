import { useState } from 'react'

// FinSynth demo video. Accepts a YouTube embed URL
// (https://www.youtube.com/embed/VIDEO_ID) or a hosted file
// (e.g. /assets/finsynth-demo.mp4 dropped into public/assets).
// Until it's set, the play button falls back to booking a live demo.
const VIDEO_URL = ''

export default function VideoCard() {
  const [playing, setPlaying] = useState(false)
  const isFile = /\.(mp4|webm|mov)$/i.test(VIDEO_URL)

  return (
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
          {VIDEO_URL && (
            <button className="play" onClick={() => setPlaying(true)} aria-label="Play the FinSynth demo"><i></i></button>
          )}
        </>
      )}
    </div>
  )
}
