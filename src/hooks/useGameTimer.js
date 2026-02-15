import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_DURATION = 60

/**
 * Custom hook for game timer countdown
 * @param {boolean} isActive - Whether the timer should be running
 * @param {Function} onTimeUp - Callback when timer reaches 0
 * @param {number} [duration] - Duration in seconds (default 60)
 * @returns {Object} - { timeRemaining, isWarning }
 */
export function useGameTimer(isActive, onTimeUp, duration = DEFAULT_DURATION) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)
  const isActiveRef = useRef(isActive)
  const durationRef = useRef(duration)

  // Keep the refs updated without causing effect re-runs
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

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
    setTimeRemaining(durationRef.current)

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
    setTimeRemaining(durationRef.current)
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
