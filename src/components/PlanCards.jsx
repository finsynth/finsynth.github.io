import { useCallback, useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/clerk-react'
import { CheckoutButton, usePlans, useSubscription } from '@clerk/clerk-react/experimental'
import useEmblaCarousel from 'embla-carousel-react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

// Where a finished checkout's "Continue" lands.
const APP_HREF = 'https://webapp.finsynth.ai/agent'


function PlanCta({ plan, audience, isActive, revalidate, onNeedAuth, onNeedOrg }) {
  const { isSignedIn } = useUser()
  const { organization } = useOrganization()

  if (isActive) {
    return (
      <button type="button" className="plan-card-cta plan-card-cta--current" disabled>
        Current plan
      </button>
    )
  }

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
      onSubscriptionComplete={() => revalidate()}
    >
      <button type="button" className="plan-card-cta">Subscribe</button>
    </CheckoutButton>
  )
}

function PlanCard({ plan, audience, onNeedAuth, onNeedOrg }) {
  const price = `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`

  const { isSignedIn } = useUser()
  const { data: subscription, revalidate } = useSubscription({ for: audience })
  
  const isActive = Boolean(isSignedIn && subscription?.subscriptionItems?.some(
    (item) => item.status === 'active' && item.plan?.id === plan.id,
  ))

  return (
    <article className="plan-card">
      <header className="plan-card-head">
        <h3 className="plan-card-name">{plan.name}</h3>
        {isActive && <span className="plan-card-active">Active</span>}
        <span className="plan-card-aud">{audience === 'organization' ? 'Organization' : 'Individual'}</span>
      </header>
      {plan.freeTrialEnabled && (
        <span className="plan-card-trial">{plan.freeTrialDays}-day free trial</span>
      )}
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
      <PlanCta plan={plan} audience={audience} isActive={isActive} revalidate={revalidate} onNeedAuth={onNeedAuth} onNeedOrg={onNeedOrg} />
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

export default function PlanCards({ onNeedAuth, onNeedOrg }) {
  const user = usePlans({ for: 'user', pageSize: 20, keepPreviousData: true })
  const org = usePlans({ for: 'organization', pageSize: 20, keepPreviousData: true })

  const isLoading = user.isLoading || org.isLoading
  const isError = user.isError && org.isError
  const plans = [...(user.data || []), ...(org.data || [])]

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [snaps, setSnaps] = useState([])
  const [selected, setSelected] = useState(0)
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const update = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
      setSnaps(emblaApi.scrollSnapList())
      setSelected(emblaApi.selectedScrollSnap())
    }

    update()

    emblaApi.on('select', update)
    emblaApi.on('reInit', update)

    return () => {
      emblaApi.off('select', update)
      emblaApi.off('reInit', update)
    }
  }, [emblaApi, plans.length])

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
    <div className="plans-carousel">
      <div className="plans-carousel-viewport" ref={emblaRef}>
        <div className="plans-carousel-row">
          {plans.map((p) => (
            <div className="plans-slide" key={p.slug}>
              <PlanCard
                plan={p}
                audience={p.forPayerType === 'org' ? 'organization' : 'user'}
                onNeedAuth={onNeedAuth}
                onNeedOrg={onNeedOrg}
              />
            </div>
          ))}
        </div>
      </div>
      {(canPrev || canNext) && (
        <div className="plans-carousel-nav">
          <button type="button" className="plans-carousel-btn" onClick={scrollPrev} disabled={!canPrev} aria-label="Previous plans">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="plans-carousel-dots" role="tablist" aria-label="Plan pages">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === selected}
                aria-label={`Go to plans page ${i + 1}`}
                className={`plans-carousel-dot${i === selected ? ' is-active' : ''}`}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>
          <button type="button" className="plans-carousel-btn" onClick={scrollNext} disabled={!canNext} aria-label="Next plans">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
