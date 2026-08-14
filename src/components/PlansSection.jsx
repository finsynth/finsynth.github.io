import { Component } from 'react'
import { PricingTable, useUser, useOrganizationList } from '@clerk/react'
import useSectionZoom from '../hooks/useSectionZoom'
import EnterpriseBanner from './EnterpriseBanner'

// Where a finished checkout's "Continue" lands. External URL — leaves via the
// router bridge in App.jsx.
const APP_HREF = 'https://webapp.finsynth.ai/agent'

/**
 * The tables run on Clerk's fast-moving billing surface — if it throws, only
 * this section may die, never the page. React unmounts the whole tree on an
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


function CreateOrgButton() {
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  const { isLoaded: orgsLoaded, userMemberships } = useOrganizationList({
    userMemberships: { pageSize: 1 },
  })

  if (!userLoaded) return null
  if (isSignedIn && (!orgsLoaded || userMemberships.count > 0)) return null

  return (
    <a
      className="plans-create-org"
      href="https://accounts.finsynth.ai/create-organization"
      target="_blank"
      rel="noopener noreferrer"
    >
      Create Organization
    </a>
  )
}

export default function PlansSection() {
  const zoomRef = useSectionZoom()

  return (
    <section className="plans" id="plans">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Pricing</p>
        <h2 className="plans-title">Get your team on <span className="ttl-hl">FinSynth</span></h2>

        <div className="plans-table">
          <PlansBoundary>
            <div className="plans-duo">
              <div className="plans-group">
                <p className="plans-group-label">Individual</p>
                <PricingTable for="user" newSubscriptionRedirectUrl={APP_HREF} />
              </div>
              <div className="plans-group">
                <div className="plans-group-head">
                  <p className="plans-group-label">Organization</p>
                  <CreateOrgButton />
                </div>
                <PricingTable for="organization" newSubscriptionRedirectUrl={APP_HREF} />
              </div>
            </div>
          </PlansBoundary>
          <EnterpriseBanner />
        </div>
      </div>
    </section>
  )
}
