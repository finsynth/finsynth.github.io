import useReveal from '../hooks/useReveal'

const GROUPS = [
  {
    label: 'Model building',
    cards: [
      {
        old: 'Hours to build a model from scratch.',
        now: 'A model built in minutes — 80% less time to build and update models.',
      },
      {
        old: 'A day pulling valuation multiples for 15 peers, one by one.',
        now: 'A comparables table across your whole peer set, in minutes.',
      },
    ],
  },
  {
    label: 'Coverage & scale',
    cards: [
      {
        old: 'Coverage capped by the hours in the day.',
        now: '2× the names, same headcount.',
      },
      {
        old: 'A full day reading filings before you can speak on a new name.',
        now: 'The business summary, drivers, and citations, in minutes.',
      },
    ],
  },
  {
    label: 'Trust & verification',
    cards: [
      {
        old: '3 hours to trace one number back to its filing.',
        now: '4 minutes, citation attached.',
      },
      {
        old: 'An answer you hope is right.',
        now: 'An answer you can defend in the room.',
      },
    ],
  },
  {
    label: 'Monitoring & earnings',
    cards: [
      {
        old: 'A frantic afternoon re-keying the model after every earnings release.',
        now: 'The model updates itself the moment the release hits, citations attached.',
      },
      {
        old: 'Manually cross-referencing your numbers against sell-side consensus.',
        now: 'Your model checked against consensus automatically, gaps flagged.',
      },
    ],
  },
]

export default function BeforeAfter() {
  const ref = useReveal()
  return (
    <section className="bsp-sec" ref={ref}>
      <div className="wrap">
        <div className="bsp-head">
          <h2>What happens when<br />analysts use FinSynth</h2>
        </div>

        <div className="why-groups">
          {GROUPS.map((group) => (
            <div className="why-group" key={group.label}>
              <p className="why-group-label">{group.label}</p>
              <div className="why-cards">
                {group.cards.map((card, i) => (
                  <div className="why-card" key={i}>
                    <div className="why-old">
                      <span className="why-tag old">
                        <span className="why-dot red" />The old way
                      </span>
                      <p>{card.old}</p>
                    </div>

                    <span className="why-arrow" aria-hidden="true">↓</span>

                    <div className="why-new">
                      <span className="why-tag new">
                        <span className="why-dot" />The FinSynth way
                      </span>
                      <p>{card.now}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="why-closing">
          None of this required hiring.{' '}
          <span>It just required FinSynth.</span>
        </p>
      </div>
    </section>
  )
}
