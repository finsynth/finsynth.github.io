import { Component } from 'react'
import { useClerk } from '@clerk/clerk-react'
import useSectionZoom from '../hooks/useSectionZoom'
import PlanCards from './PlanCards'
import EnterpriseBanner from './EnterpriseBanner'

// Modal flows land back here — the visitor never leaves the section.
const PLANS_URL = '/#plans'

/**
 * The cards run on Clerk's experimental surface — if it throws, only this
 * section may die, never the page. React unmounts the whole tree on an
 * uncaught render error, so the boundary is not optional here.
 */
class PlansBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) {
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
    return this.props.children
  }
}


function PlanFlow() {
  const clerk = useClerk()

  const onNeedAuth = () => clerk.openSignUp({
    forceRedirectUrl: PLANS_URL,
    fallbackRedirectUrl: PLANS_URL,
    signInForceRedirectUrl: PLANS_URL,
  })

  const onNeedOrg = () => clerk.openCreateOrganization({
    afterCreateOrganizationUrl: PLANS_URL,
  })

  return <PlanCards onNeedAuth={onNeedAuth} onNeedOrg={onNeedOrg} />
}

export default function PlansSection() {
  const zoomRef = useSectionZoom()

  return (
    <section className="plans" id="plans">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Pricing</p>
        <h2 className="plans-title">Pick a plan, start <span className="ttl-hl">today</span></h2>
        <p className="plans-sub">Start free and upgrade when the work demands it — or bring the whole desk on an organization plan.</p>

        <div className="plans-table">
          <PlansBoundary>
            <PlanFlow />
          </PlansBoundary>
          <EnterpriseBanner />
        </div>
      </div>
    </section>
  )
}
