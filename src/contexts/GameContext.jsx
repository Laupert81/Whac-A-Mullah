import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { incrementPlayCount } from '../utils/analytics'

const GameContext = createContext()

const STORAGE_KEYS = {
  HIGH_SCORE: 'whacAMole_highScore',
  AUDIO_ENABLED: 'whacAMole_audioEnabled',
  PERSONAL_BESTS: 'whacAMole_personalBests',
  NICKNAME: 'whacAMole_nickname',
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

const INITIAL_GAME_STATS = {
  totalHits: 0,
  totalMisses: 0,
  hitsByType: { common: 0, rare: 0, golden: 0, cat: 0 },
  maxCombo: 0,
}

const INITIAL_PERSONAL_BESTS = {
  bestScore: 0,
  bestAccuracy: 0,
  bestCombo: 0,
  highestLevel: 0,
}

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

  // Level system
  const [currentLevel, setCurrentLevel] = useState(1)
  const [levelScore, setLevelScore] = useState(0)

  // Game stats (per-session)
  const [gameStats, setGameStats] = useState(INITIAL_GAME_STATS)

  // Personal bests (persisted)
  const [personalBests, setPersonalBests] = useLocalStorage(STORAGE_KEYS.PERSONAL_BESTS, INITIAL_PERSONAL_BESTS)

  // Nickname (persisted)
  const [nickname, setNickname] = useLocalStorage(STORAGE_KEYS.NICKNAME, '')

  // Combo system state
  const [combo, setCombo] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1.0)
  const [lastMilestone, setLastMilestone] = useState(0) // Track last celebrated milestone
  const [currentMilestone, setCurrentMilestone] = useState(null) // Currently triggered milestone
  const comboRef = useRef(0) // For synchronous access in callbacks

  // Increment combo and return whether a milestone was reached (sync calculation)
  const incrementCombo = useCallback(() => {
    // Calculate synchronously using the ref
    const newCombo = comboRef.current + 1
    comboRef.current = newCombo

    // Check for milestone synchronously
    const milestone = COMBO_MILESTONES.find(m => m === newCombo)

    // Update state (async but we don't depend on it for the return value)
    setCombo(newCombo)
    setComboMultiplier(getComboMultiplier(newCombo))

    if (milestone) {
      setLastMilestone(milestone)
      setCurrentMilestone(milestone)
    }

    return milestone || null
  }, [])

  // Reset combo (on miss or penalty hit)
  const resetCombo = useCallback(() => {
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    setCurrentMilestone(null)
    comboRef.current = 0
  }, [])

  // Clear current milestone (after showing celebration)
  const clearMilestone = useCallback(() => {
    setCurrentMilestone(null)
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
    const multipliedPoints = points > 0
      ? Math.round(points * multiplier)
      : points
    setScore((prev) => {
      const newScore = Math.max(0, prev + multipliedPoints)
      if (newScore > highScore) {
        setHighScore(newScore)
      }
      return newScore
    })
    // Also increment level score
    if (multipliedPoints > 0) {
      setLevelScore((prev) => prev + multipliedPoints)
    }
  }, [highScore, setHighScore])

  // Level system actions
  const advanceLevel = useCallback(() => {
    setCurrentLevel((prev) => prev + 1)
    setLevelScore(0)
  }, [])

  // Stats tracking
  const recordHit = useCallback((moleType) => {
    setGameStats((prev) => ({
      ...prev,
      totalHits: prev.totalHits + 1,
      hitsByType: {
        ...prev.hitsByType,
        [moleType]: (prev.hitsByType[moleType] || 0) + 1,
      },
    }))
  }, [])

  const recordMiss = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      totalMisses: prev.totalMisses + 1,
    }))
  }, [])

  const updateMaxCombo = useCallback((comboVal) => {
    setGameStats((prev) => ({
      ...prev,
      maxCombo: Math.max(prev.maxCombo, comboVal),
    }))
  }, [])

  const updatePersonalBests = useCallback((stats) => {
    setPersonalBests((prev) => {
      const updated = { ...prev }
      let changed = false
      if (stats.score > updated.bestScore) { updated.bestScore = stats.score; changed = true }
      if (stats.accuracy > updated.bestAccuracy) { updated.bestAccuracy = stats.accuracy; changed = true }
      if (stats.maxCombo > updated.bestCombo) { updated.bestCombo = stats.maxCombo; changed = true }
      if (stats.level > updated.highestLevel) { updated.highestLevel = stats.level; changed = true }
      return changed ? updated : prev
    })
  }, [setPersonalBests])

  const resetGame = useCallback(() => {
    setScore(0)
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    setCurrentMilestone(null)
    comboRef.current = 0
    setCurrentLevel(1)
    setLevelScore(0)
    setGameStats(INITIAL_GAME_STATS)
    setGameState('playing')
    setPreviousHighScore(highScore)
  }, [highScore])

  const startGame = useCallback(() => {
    setScore(0)
    setCombo(0)
    setComboMultiplier(1.0)
    setLastMilestone(0)
    setCurrentMilestone(null)
    comboRef.current = 0
    setCurrentLevel(1)
    setLevelScore(0)
    setGameStats(INITIAL_GAME_STATS)
    setGameState('playing')
    setPreviousHighScore(highScore)

    // Increment global play counter (fire-and-forget)
    incrementPlayCount()
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
    currentMilestone,
    currentLevel,
    levelScore,
    gameStats,
    personalBests,
    nickname,

    // Actions
    addScore,
    addScoreWithMultiplier,
    incrementCombo,
    resetCombo,
    clearMilestone,
    resetGame,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    toggleAudio,
    setHighScore,
    advanceLevel,
    recordHit,
    recordMiss,
    updateMaxCombo,
    updatePersonalBests,
    setNickname,
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
