const LINE = 'Backed by Accel & industry angels, trusted by investors from global funds'
const REPEATS = 4

export default function TrustedBy() {
  return (
    <section className="trusted-strip">
      <div className="trusted-strip-marquee">
        <div className="trusted-strip-track">
          {[0, 1].map(copy => (
            <div className="trusted-strip-group" key={copy} aria-hidden={copy === 1}>
              {Array.from({ length: REPEATS }).map((_, i) => (
                <span className="trusted-strip-item" key={i}>
                  {LINE}
                  <em aria-hidden="true">&bull;</em>
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="trusted-strip-fade left" />
        <span className="trusted-strip-fade right" />
      </div>
    </section>
  )
}
