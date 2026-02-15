import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (!registration) return

      // Check immediately on registration
      registration.update()

      // Also check periodically (for long-lived desktop sessions)
      setInterval(() => registration.update(), 60 * 60 * 1000)

      // Check for updates when the app becomes visible again (critical for iOS)
      // iOS kills the SW update interval when backgrounded, so this is the
      // only reliable way to detect updates on iPhone PWAs
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          registration.update()
        }
      }
      document.addEventListener('visibilitychange', onVisibilityChange)
    },
  })

  // Also check on page focus (covers iOS home screen app resumption)
  useEffect(() => {
    const onFocus = () => {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.ready.then((reg) => reg.update())
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const applyUpdate = () => {
    updateServiceWorker(true) // true = reload immediately
  }

  const dismissUpdate = () => setNeedRefresh(false)

  return { needRefresh, applyUpdate, dismissUpdate }
}
