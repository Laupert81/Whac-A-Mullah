import { useState, useEffect, useRef, useCallback } from 'react'

const INITIAL_TIME = 60 // 60 seconds

/**
 * Custom hook for game timer countdown
 * @param {boolean} isActive - Whether the timer should be running
 * @param {Function} onTimeUp - Callback when timer reaches 0
 * @returns {Object} - { timeRemaining, isWarning }
 */
export function useGameTimer(isActive, onTimeUp) {
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)
  const isActiveRef = useRef(isActive)

  // Keep the refs updated without causing effect re-runs
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isActive) {
      return
    }

    // Reset timer when activated
    setTimeRemaining(INITIAL_TIME)

    // Update every 100ms for smooth display
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          onTimeUpRef.current()
          return 0
        }
        return prev - 0.1
      })
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive])

  // Reset function - restarts the timer if active
  const reset = useCallback(() => {
    setTimeRemaining(INITIAL_TIME)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    // Restart the interval if the game is active
    if (isActiveRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0.1) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            onTimeUpRef.current()
            return 0
          }
          return prev - 0.1
        })
      }, 100)
    }
  }, []) // No dependencies needed - uses refs which are stable

  const isWarning = timeRemaining <= 10

  return {
    timeRemaining: Math.max(0, Math.ceil(timeRemaining)),
    isWarning,
    reset,
  }
}

