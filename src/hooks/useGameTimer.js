import { useState, useEffect, useRef } from 'react'

const INITIAL_TIME = 60 // 60 seconds

/**
 * Custom hook for game timer countdown
 * @param {boolean} isActive - Whether the timer should be running
 * @param {Function} onTimeUp - Callback when timer reaches 0
 * @returns {Object} - { timeRemaining, isWarning }
 */
export function useGameTimer(isActive, onTimeUp) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGameTimer.js:11',message:'useGameTimer hook entry',data:{isActive,onTimeUpType:typeof onTimeUp,onTimeUpExists:onTimeUp!==undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
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
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGameTimer.js:33',message:'Calling onTimeUp callback',data:{onTimeUpType:typeof onTimeUp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
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

