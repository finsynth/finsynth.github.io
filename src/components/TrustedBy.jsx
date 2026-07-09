const NAMES = [
  { name: 'Accel', role: 'Investor' },
  { name: 'TresVista', role: 'Partner' },
]

export default function TrustedBy() {
  // Repeat the list so the marquee track is long enough to loop seamlessly
  const track = Array.from({ length: 6 }, () => NAMES).flat()
  return (
    <section className="trusted-strip">
      <p className="trusted-strip-eyebrow">Trusted by partners &amp; clients</p>
      <div className="trusted-strip-marquee">
        <div className="trusted-strip-track">
          {[0, 1].map(copy => (
            <div className="trusted-strip-group" key={copy} aria-hidden={copy === 1}>
              {track.map((item, i) => (
                <span className="trusted-strip-item" key={`${copy}-${i}`}>
                  {item.name}
                  <em>{item.role}</em>
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
