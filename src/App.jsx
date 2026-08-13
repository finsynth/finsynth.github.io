import { Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Home from './pages/Home'
import Support from './pages/Support'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  || 'pk_live_Y2xlcmsuZmluc3ludGguYWkk'

// The plans section runs on Clerk's experimental billing surface, which is
// exempt from semver. Both layers are pinned: the SDK exactly in package.json,
// clerk-js here — it otherwise hot-loads whatever 5.x the CDN serves. 5.127.1
// was released in the same minute as SDK 5.61.9 — they are a pair; an older
// clerk-js lacks internals this SDK calls. Bump both together, deliberately.
const CLERK_JS_VERSION = '5.127.1'

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
      clerkJSVersion={CLERK_JS_VERSION}
      routerPush={(to) => go(to)}
      routerReplace={(to) => go(to, { replace: true })}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </ClerkProvider>
  )
}

export default App
