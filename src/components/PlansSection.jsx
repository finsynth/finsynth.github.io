import { Component } from 'react'
import { ClerkProvider, PricingTable, useUser, useOrganizationList } from '@clerk/react'
import useZoom from '../hooks/useZoom'
import { LINKS } from '@/config/site'
import { ENV } from '@/config/env'
import { CLERK_APPEARANCE } from '@/config/clerk'

// Where a finished checkout's "Continue" lands.
const APP_HREF = LINKS.app

const SHOW_ORG_PLANS = false

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
            href={LINKS.bookCall}
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
      href={LINKS.createOrg}
      target="_blank"
      rel="noopener noreferrer"
    >
      Create Organization
    </a>
  )
}

export default function PlansSection() {
  const zoomRef = useZoom()

  return (
    <section className="plans" id="pricing">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Pricing</p>
        <h2 className="plans-title">Get started on <span className="ttl-hl">FinSynth</span></h2>

        <div className="plans-table">
          <ClerkProvider publishableKey={ENV.clerkPublishableKey} appearance={CLERK_APPEARANCE}>
            <PlansBoundary>
              <div className="plans-duo">
                <div className="plans-group">
                  {SHOW_ORG_PLANS && <p className="plans-group-label">Individual</p>}
                  <PricingTable for="user" newSubscriptionRedirectUrl={APP_HREF} />
                </div>
                {SHOW_ORG_PLANS && (
                  <div className="plans-group">
                    <div className="plans-group-head">
                      <p className="plans-group-label">Organization</p>
                      <CreateOrgButton />
                    </div>
                    <PricingTable for="organization" newSubscriptionRedirectUrl={APP_HREF} />
                  </div>
                )}
              </div>
            </PlansBoundary>
          </ClerkProvider>
        </div>
      </div>
    </section>
  )
}
