import { useEffect, useState } from 'react'

// The webapp authenticates through Clerk (frontend API on clerk.finsynth.ai).
// Clerk keeps a JS-readable `__client_uat*` cookie on the root finsynth.ai
// domain: 0 means signed out, any newer timestamp means a session exists.
function cookieSaysSignedIn() {
  try {
    return document.cookie.split('; ').some((pair) => {
      const eq = pair.indexOf('=')
      const name = pair.slice(0, eq)
      const value = pair.slice(eq + 1)
      return name.startsWith('__client_uat') && Number(value) > 0
    })
  } catch {
    return false
  }
}

export default function useSignedIn() {
  // Cookie gives the right answer synchronously so the label doesn't flash.
  const [signedIn, setSignedIn] = useState(cookieSaysSignedIn)

  useEffect(() => {
    // Confirm against Clerk itself — the cookie can lag a session that
    // expired or was revoked since the user last opened the webapp.
    const controller = new AbortController()
    fetch('https://clerk.finsynth.ai/v1/client?_clerk_js_version=5.105.0', {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const sessions = data?.response?.sessions
        if (Array.isArray(sessions)) {
          setSignedIn(sessions.some((s) => !s.status || s.status === 'active'))
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return signedIn
}
