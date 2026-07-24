import useReveal from '../hooks/useReveal'
import useCardStack from '../hooks/useCardStack'

const QUOTES = [
  {
    quote:
      '"It cut my model build time by 80%. What used to be two days of pulling numbers & building, I get through in an afternoon now."',
    name: 'Long-only Analyst',
    role: 'Long-only fund',
    initials: 'LO',
    color: '#3550C8',
  },
  {
    quote:
      '"Honestly, the citations and quality of global coverage stands out for me. It\'s easier now to work on and review any research in Excel."',
    name: 'L/S Portfolio Manager',
    role: 'Long-short equity fund',
    initials: 'PM',
    color: '#17593B',
  },
  {
    quote:
      '"We cover twice the names we used to, same headcount. Model-build time just isn\'t the bottleneck anymore."',
    name: 'Buy-side Analyst',
    role: 'Asset manager',
    initials: 'BA',
    color: '#2438A8',
  },
]

export default function Testimonial() {
  const revealRef = useReveal()
  const { sectionRef, stackRef } = useCardStack(QUOTES.length)
  return (
    <section className="testi-sec" id="customers" ref={sectionRef}>
      {/* the stack cycles through the quotes on an automatic timer */}
      <div className="testi-pin" ref={revealRef}>
        <div className="wrap">

          {/* Head */}
          <div className="testi-head">
            <p className="hiw-eyebrow">Customers</p>
            <h2>Hear what the analysts<br />have to <span className="ttl-hl">say</span></h2>
          </div>

          {/* Card stack — front card flies up and tucks behind automatically */}
          <div className="testi-stack" ref={stackRef}>
            {QUOTES.map(t => (
              <div className="testi-card" key={t.name}>
                <blockquote className="testi-quote">{t.quote}</blockquote>
                <div className="testi-author">
                  <span className="testi-avatar" style={{ background: t.color }}>{t.initials}</span>
                  <div className="testi-meta">
                    <span className="testi-name">{t.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
