import { Component, type ReactNode } from 'react'
import { ClerkFailed, ClerkProvider, PricingTable, useUser, useOrganizationList } from '@clerk/react'
import useZoom from '@/hooks/useZoom'
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
function PlansError() {
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

class PlansBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <PlansError /> : this.props.children
  }
}

const SKELETON_FEATURES = ['62%', '84%', '56%', '72%']

function SkeletonCard() {
  return (
    <div className="plans-skel-card">
      <div className="plans-skel-head">
        <span className="plans-skel-bar" style={{ '--w': '34%', '--h': '14px' }} />
        <span className="plans-skel-bar" style={{ '--w': '58%' }} />
        <span className="plans-skel-bar plans-skel-price" style={{ '--w': '26%', '--h': '22px' }} />
        <span className="plans-skel-bar" style={{ '--w': '36%' }} />
      </div>
      <div className="plans-skel-feats">
        {SKELETON_FEATURES.map((w) => (
          <span className="plans-skel-row" key={w}>
            <span className="plans-skel-bar" style={{ '--w': '10px' }} />
            <span className="plans-skel-bar" style={{ '--w': w }} />
          </span>
        ))}
      </div>
      <div className="plans-skel-foot">
        <span className="plans-skel-bar" style={{ '--h': '32px' }} />
      </div>
    </div>
  )
}

function PlansSkeleton() {
  return (
    <div className="plans-skeleton" role="status" aria-label="Loading plans">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
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
  const zoomRef = useZoom<HTMLDivElement>()

  return (
    <section className="plans" id="pricing">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Pricing</p>
        <h2 className="plans-title">
          Get started on <span className="ttl-hl">FinSynth</span>
        </h2>

        <div className="plans-table">
          <ClerkProvider publishableKey={ENV.clerkPublishableKey} appearance={CLERK_APPEARANCE}>
            <ClerkFailed>
              <PlansError />
            </ClerkFailed>
            <PlansBoundary>
              <div className="plans-duo">
                <div className="plans-group">
                  {SHOW_ORG_PLANS && <p className="plans-group-label">Individual</p>}
                  <PricingTable
                    for="user"
                    newSubscriptionRedirectUrl={APP_HREF}
                    fallback={<PlansSkeleton />}
                  />
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
