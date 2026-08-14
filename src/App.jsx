import { Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import Home from './pages/Home'
import Support from './pages/Support'
import Careers from './pages/Careers'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk'

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
