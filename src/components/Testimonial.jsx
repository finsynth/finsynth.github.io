import useReveal from '../hooks/useReveal'
import useCardStack from '../hooks/useCardStack'

const QUOTES = [
  {
    quote:
      '"It cut my model build time by 80%. What used to be two days of pulling numbers and building, I get through in an afternoon now."',
    name: 'Long-only Analyst',
    role: 'Long-only fund',
  },
  {
    quote:
      '"This is the first tool I can trust with confidence for any research I do in Excel."',
    name: 'L/S Analyst',
    role: 'Long-short equity fund',
  },
  {
    quote:
      '"We\'re seeing the actual leverage of an AI tool, the outputs aren\'t just good-looking, they\'re easily verifiable."',
    name: 'Long-only Portfolio Manager',
    role: 'Long-only fund',
  },
]

// ← / → chevrons for the deck controls
const Chevron = ({ back }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={back ? 'M10 3.5L5.5 8l4.5 4.5' : 'M6 3.5L10.5 8 6 12.5'}
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

export default function Testimonial() {
  const revealRef = useReveal()
  const { sectionRef, stackRef, next, prev } = useCardStack(QUOTES.length)
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

          {/* Card stack — front card flies up and tucks behind automatically.
              The arrows sit on the deck's corner for anyone who wants to go at
              their own pace, or back to a quote that has already passed. They
              live outside .testi-stack: the hook animates that element's direct
              children, so a control inside it would be dealt as a card. */}
          <div className="testi-deck">
            <div className="testi-nav">
              <button
                type="button" className="testi-navbtn" onClick={prev}
                aria-label="Previous testimonial" aria-controls="testi-stack"
              >
                <Chevron back />
              </button>
              <button
                type="button" className="testi-navbtn" onClick={next}
                aria-label="Next testimonial" aria-controls="testi-stack"
              >
                <Chevron />
              </button>
            </div>
            <div className="testi-stack" id="testi-stack" ref={stackRef}>
              {QUOTES.map(t => (
                <div className="testi-card" key={t.name}>
                  <blockquote className="testi-quote">{t.quote}</blockquote>
                  <div className="testi-author">
                    <div className="testi-meta">
                      <span className="testi-name">{t.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
