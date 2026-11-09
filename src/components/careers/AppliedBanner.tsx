import { useEffect, useState } from 'react'

export default function AppliedBanner() {
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('applied')) return
    setApplied(true)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  if (!applied) return null

  return (
    <div className="careers-applied" role="status">
      <b>Application received.</b> Thank you for applying — we read every application and will be in
      touch.
    </div>
  )
}
