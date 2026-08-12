import { useOrganization, useUser } from '@clerk/clerk-react'
import { CheckoutButton, usePlans } from '@clerk/clerk-react/experimental'
import { Check } from 'lucide-react'

// Where a finished checkout's "Continue" lands.
const APP_HREF = 'https://webapp.finsynth.ai/agent'

const CHECKOUT_PORTAL_ID = 'plans-checkout-portal'


function PlanCta({ plan, audience, onNeedAuth, onNeedOrg }) {
  const { isSignedIn } = useUser()
  const { organization } = useOrganization()

  if (!isSignedIn) {
    return (
      <button type="button" className="plan-card-cta" onClick={onNeedAuth} disabled={!onNeedAuth}>
        Get started
      </button>
    )
  }
  if (audience === 'organization' && !organization) {
    return (
      <button type="button" className="plan-card-cta" onClick={onNeedOrg} disabled={!onNeedOrg}>
        Create workspace
      </button>
    )
  }
  return (
    <CheckoutButton
      planId={plan.id}
      planPeriod="month"
      for={audience}
      newSubscriptionRedirectUrl={APP_HREF}
      checkoutProps={{ portalId: CHECKOUT_PORTAL_ID }}
    >
      <button type="button" className="plan-card-cta">Subscribe</button>
    </CheckoutButton>
  )
}

function PlanCard({ plan, audience, onNeedAuth, onNeedOrg }) {
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
      <PlanCta plan={plan} audience={audience} onNeedAuth={onNeedAuth} onNeedOrg={onNeedOrg} />
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

export default function PlanCards({ audience, onNeedAuth, onNeedOrg }) {
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
          Talk to Us
        </a>
      </div>
    )
  }

  return (
    <div className="plans-grid" data-count={plans.length}>
      {plans.map((p) => (
        <PlanCard key={p.slug} plan={p} audience={audience} onNeedAuth={onNeedAuth} onNeedOrg={onNeedOrg} />
      ))}
    </div>
  )
}
