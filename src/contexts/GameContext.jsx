import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const GameContext = createContext()

const STORAGE_KEYS = {
  HIGH_SCORE: 'whacAMole_highScore',
  AUDIO_ENABLED: 'whacAMole_audioEnabled',
}

// Combo multiplier thresholds
const COMBO_MULTIPLIERS = [
  { threshold: 8, multiplier: 3.0 },   // 8+ hits = 3x
  { threshold: 5, multiplier: 2.0 },   // 5-7 hits = 2x
  { threshold: 3, multiplier: 1.5 },   // 3-4 hits = 1.5x
  { threshold: 1, multiplier: 1.0 },   // 1-2 hits = 1x
]

// Combo milestones for celebrations
export const COMBO_MILESTONES = [5, 10, 15, 20, 25]

/**
 * Get the multiplier for a given combo count
 */
function getComboMultiplier(comboCount) {
  for (const { threshold, multiplier } of COMBO_MULTIPLIERS) {
    if (comboCount >= threshold) {
      return multiplier
    }
  }
  return 1.0
}

export function GameProvider({ children }) {
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('menu') // 'menu' | 'playing' | 'paused' | 'gameOver'
  const [highScore, setHighScore] = useLocalStorage(STORAGE_KEYS.HIGH_SCORE, 0)
  const [audioEnabled, setAudioEnabled] = useLocalStorage(STORAGE_KEYS.AUDIO_ENABLED, true)
  const [previousHighScore, setPreviousHighScore] = useState(0) // Track high score at game start
  
  // Combo system state
  const [combo, setCombo] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1.0)
  const [lastMilestone, setLastMilestone] = useState(0) // Track last celebrated milestone
  const comboRef = useRef(0) // For synchronous access in callbacks

  // Increment combo and return whether a milestone was reached
  const incrementCombo = useCallback(() => {
    let milestoneReached = null
    setCombo((prev) => {
      const newCombo = prev + 1
      comboRef.current = newCombo
      const newMultiplier = getComboMultiplier(newCombo)
      setComboMultiplier(newMultiplier)
      
      // Check for milestone
      const milestone = COMBO_MILESTONES.find(m => m === newCombo)
      if (milestone) {
        milestoneReached = milestone
        setLastMilestone(milestone)
      }
      
      return newCombo
    })
    return milestoneReached
  }, [])

  // Reset combo (on miss or penalty hit)
  const resetCombo = useCallback(() => {
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    comboRef.current = 0
  }, [])

  // Add score with combo multiplier applied
  const addScore = useCallback((points) => {
    setScore((prev) => {
      // Apply multiplier only to positive points (not penalties)
      const multipliedPoints = points > 0 
        ? Math.round(points * comboRef.current > 0 ? getComboMultiplier(comboRef.current) : 1)
        : points
      const newScore = Math.max(0, prev + multipliedPoints) // Don't go below 0
      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore)
      }
      return newScore
    })
  }, [highScore, setHighScore])

  // Add score with explicit multiplier (for when we know the multiplier at call time)
  const addScoreWithMultiplier = useCallback((points, multiplier) => {
    setScore((prev) => {
      const multipliedPoints = points > 0 
        ? Math.round(points * multiplier)
        : points
      const newScore = Math.max(0, prev + multipliedPoints)
      if (newScore > highScore) {
        setHighScore(newScore)
      }
      return newScore
    })
  }, [highScore, setHighScore])

  const resetGame = useCallback(() => {
    setScore(0)
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    comboRef.current = 0
    setGameState('playing')
    setPreviousHighScore(highScore)
  }, [highScore])

  const startGame = useCallback(() => {
    setScore(0)
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    comboRef.current = 0
    setGameState('playing')
    setPreviousHighScore(highScore)
  }, [highScore])

  const endGame = useCallback(() => {
    setGameState('gameOver')
  }, [])

  const pauseGame = useCallback(() => {
    setGameState('paused')
  }, [])

  const resumeGame = useCallback(() => {
    setGameState('playing')
  }, [])

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev)
  }, [setAudioEnabled])

  const value = {
    // State
    score,
    gameState,
    highScore,
    previousHighScore,
    audioEnabled,
    combo,
    comboMultiplier,
    lastMilestone,
    
    // Actions
    addScore,
    addScoreWithMultiplier,
    incrementCombo,
    resetCombo,
    resetGame,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    toggleAudio,
    setHighScore,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

