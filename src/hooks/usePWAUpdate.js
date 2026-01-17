import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Check for updates every hour
      if (registration) {
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })

  const applyUpdate = () => {
    updateServiceWorker(true) // true = reload immediately
  }

  const dismissUpdate = () => setNeedRefresh(false)

  return { needRefresh, applyUpdate, dismissUpdate }
}
