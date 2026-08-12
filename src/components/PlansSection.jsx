import { Component, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClerkProvider, useClerk } from '@clerk/clerk-react'
import useSectionZoom from '../hooks/useSectionZoom'
import PlanCards from './PlanCards'

const PLANS_URL = '/#plans'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk'

// This section is built on Clerk's experimental billing surface (usePlans,
// CheckoutButton), which is exempt from semver. Both layers are pinned: the
// SDK exactly in package.json, and clerk-js here
const CLERK_JS_VERSION = '5.127.1'

const AUDIENCES = [
  { key: 'user', label: 'Individual' },
  { key: 'organization', label: 'Organization' },
]

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


function PlanFlow({ audience }) {
  const clerk = useClerk()

  const onNeedAuth = () => clerk.openSignUp({
    forceRedirectUrl: PLANS_URL,
    fallbackRedirectUrl: PLANS_URL,
    signInForceRedirectUrl: PLANS_URL,
  })
  
  const onNeedOrg = () => clerk.openCreateOrganization({
    afterCreateOrganizationUrl: PLANS_URL,
  })

  return <PlanCards audience={audience} onNeedAuth={onNeedAuth} onNeedOrg={onNeedOrg} />
}

export default function PlansSection() {
  const zoomRef = useSectionZoom()
  const [audience, setAudience] = useState('user')
  const navigate = useNavigate()

  return (
    <section className="plans" id="plans">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Pricing</p>
        <h2 className="plans-title">Pick a plan, start <span className="ttl-hl">today</span></h2>
        <p className="plans-sub">Start free and upgrade when the work demands it — or bring the whole desk on an organization plan.</p>

        <div className="plans-tabs" role="tablist" aria-label="Plan audience">
          {AUDIENCES.map((a) => (
            <button
              key={a.key}
              type="button"
              role="tab"
              aria-selected={audience === a.key}
              className={`plans-tab${audience === a.key ? ' is-active' : ''}`}
              onClick={() => setAudience(a.key)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="plans-table">
          <PlansBoundary>
            <ClerkProvider
              publishableKey={PUBLISHABLE_KEY}
              clerkJSVersion={CLERK_JS_VERSION}
              routerPush={(to) => navigate(to)}
              routerReplace={(to) => navigate(to, { replace: true })}
            >
              <PlanFlow audience={audience} />
            </ClerkProvider>
          </PlansBoundary>
        </div>
      </div>
      <div id="plans-checkout-portal" />
    </section>
  )
}
