import { useState, useEffect, useRef } from 'react'

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

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
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
          onTimeUp()
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
  }, [isActive, onTimeUp])

  // Reset function
  const reset = () => {
    setTimeRemaining(INITIAL_TIME)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const isWarning = timeRemaining <= 10

  return {
    timeRemaining: Math.ceil(timeRemaining),
    isWarning,
    reset,
  }
}

