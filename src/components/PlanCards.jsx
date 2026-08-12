import { usePlans } from '@clerk/clerk-react/experimental'
import { Check } from 'lucide-react'


function PlanCard({ plan }) {
  const price = `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`

  return (
    <article className={`plan-card${plan.isDefault ? '' : ' plan-card--paid'}`}>
      <header className="plan-card-head">
        <h3 className="plan-card-name">{plan.name}</h3>
        {plan.freeTrialEnabled && (
          <span className="plan-card-trial">{plan.freeTrialDays}-day free trial</span>
        )}
      </header>
      <p className="plan-card-price">
        {price}
        <span className="plan-card-per">/month</span>
      </p>
      {plan.annualMonthlyFee && plan.annualMonthlyFee.amount > 0 && plan.annualMonthlyFee.amount < plan.fee.amount && (
        <p className="plan-card-annual">
          {plan.annualMonthlyFee.currencySymbol}{plan.annualMonthlyFee.amountFormatted}/month billed annually
        </p>
      )}
      {plan.description && <p className="plan-card-desc">{plan.description}</p>}
      {plan.features.length > 0 && (
        <ul className="plan-card-features">
          {plan.features.map((f) => (
            <li key={f.id}><Check aria-hidden="true" /><span>{f.name}</span></li>
          ))}
        </ul>
      )}
      <button type="button" className="plan-card-cta" disabled>
        Coming soon
      </button>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="plan-card plan-card--skeleton" aria-hidden="true">
      <span className="sk sk-name" />
      <span className="sk sk-price" />
      <span className="sk sk-line" />
      <span className="sk sk-line" />
      <span className="sk sk-cta" />
    </div>
  )
}

export default function PlanCards({ audience }) {
  const { data: plans, isLoading, isError } = usePlans({ for: audience, pageSize: 20, keepPreviousData: true })

  if (isLoading) {
    return (
      <div className="plans-grid" data-count="2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (isError || !plans?.length) {
    return (
      <div className="plans-error">
        <p>Unable to load at the moment</p>
        <a
          className="plan-card-cta plans-error-cta"
          href="https://calendly.com/kartik-finsynth/intro"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talk to Sales
        </a>
      </div>
    )
  }

  return (
    <div className="plans-grid" data-count={plans.length}>
      {plans.map((p) => <PlanCard key={p.slug} plan={p} />)}
    </div>
  )
}
