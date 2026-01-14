import { useState, useEffect } from 'react'

// Detect if the browser supports PWA at all
function detectPWASupport() {
  // Check for service worker support (basic PWA requirement)
  const hasServiceWorker = 'serviceWorker' in navigator
  
  // Check if running in a context that can install PWAs
  const isSecureContext = window.isSecureContext
  
  // iOS Safari supports PWA but not beforeinstallprompt
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                      !window.MSStream && 
                      /Safari/.test(navigator.userAgent)
  
  // Samsung Internet, Chrome, Edge, Opera support beforeinstallprompt
  const supportsInstallPrompt = 'BeforeInstallPromptEvent' in window || 
                                 /Chrome|Chromium|Edge|Opera|Samsung/i.test(navigator.userAgent)
  
  // Firefox on Android supports PWA but differently
  const isFirefoxAndroid = /Firefox/i.test(navigator.userAgent) && /Android/i.test(navigator.userAgent)
  
  return {
    hasServiceWorker,
    isSecureContext,
    isIOSSafari,
    supportsInstallPrompt,
    isFirefoxAndroid,
    // PWA is supported but needs manual installation instructions
    needsManualInstall: hasServiceWorker && isSecureContext && (isIOSSafari || isFirefoxAndroid),
    // PWA is not supported at all
    noPWASupport: !hasServiceWorker || !isSecureContext
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [pwaSupport, setPwaSupport] = useState({
    needsManualInstall: false,
    noPWASupport: false
  })

  useEffect(() => {
    const support = detectPWASupport()
    setPwaSupport(support)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if running as standalone (iOS)
    if (window.navigator.standalone === true) {
      setIsInstalled(true)
      return
    }

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) {
      return false
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }

    return outcome === 'accepted'
  }

  return {
    isInstallable,
    isInstalled,
    install,
    // PWA supported but requires manual installation (iOS Safari, Firefox Android)
    needsManualInstall: pwaSupport.needsManualInstall && !isInstallable && !isInstalled,
    // PWA not supported at all - hide install button entirely
    noPWASupport: pwaSupport.noPWASupport
  }
}
