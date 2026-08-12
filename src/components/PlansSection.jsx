import { useState } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import useSectionZoom from '../hooks/useSectionZoom'
import PlanCards from './PlanCards'

// Where a finished checkout's "Continue" lands 
export const APP_HREF = 'https://webapp.finsynth.ai/agent'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk'

// This section is built on Clerk's experimental billing surface (usePlans,
// CheckoutButton — steps 2-3), which is exempt from semver. Both layers are
// pinned: the SDK exactly in package.json, and clerk-js here — it otherwise
// hot-loads whatever 5.x the CDN serves. 5.105.0 is the version the webapp
// already runs against this instance. Bump both together, deliberately.
const CLERK_JS_VERSION = '5.105.0'

const AUDIENCES = [
  { key: 'user', label: 'Individual' },
  { key: 'organization', label: 'Organization' },
]

export default function PlansSection() {
  const zoomRef = useSectionZoom()
  const [audience, setAudience] = useState('user')

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
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} clerkJSVersion={CLERK_JS_VERSION}>
            <PlanCards audience={audience} />
          </ClerkProvider>
        </div>
      </div>
      <div id="plans-checkout-portal" />
    </section>
  )
}
