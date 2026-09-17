import { Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import Home from './pages/Home'
import Support from './pages/Support'
import Careers from './pages/Careers'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk'


const APPEARANCE = {
  variables: {
    colorPrimary: '#3550C8',
    colorForeground: '#14242E',
    fontFamily: "'Geist', -apple-system, system-ui, sans-serif",
    borderRadius: '12px',
  },
  // Buttons on this site sit at 8px (nav sign-in, nav CTA, .plan-card-cta);
  // only the cards keep the 12px variable above. Keyed by Clerk's element
  // name, not its class, so it survives their internal renames.
  elements: {
    pricingTableCardFooterButton: { borderRadius: '8px' },
  },
}

function App() {
  const navigate = useNavigate()

  // Clerk routes ALL its navigations through the router props below —
  // including the post-checkout newSubscriptionRedirectUrl to the webapp.
  // react-router silently swallows absolute external URLs (treats them as
  // paths), so anything with a scheme leaves via the browser; only same-app
  // paths stay SPA. Removing this breaks the checkout "Continue" redirect.
  const go = (to, opts) => {
    if (/^https?:\/\//i.test(to)) {
      window.location.assign(to)
      return
    }
    navigate(to, opts)
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => go(to)}
      routerReplace={(to) => go(to, { replace: true })}
      appearance={APPEARANCE}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/careers" element={<Careers />} />
      </Routes>
    </ClerkProvider>
  )
}

export default App
