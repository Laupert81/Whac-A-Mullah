import { createContext, useContext, useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const GameContext = createContext()

const STORAGE_KEYS = {
  HIGH_SCORE: 'whacAMole_highScore',
  AUDIO_ENABLED: 'whacAMole_audioEnabled',
}

export function GameProvider({ children }) {
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('menu') // 'menu' | 'playing' | 'paused' | 'gameOver'
  const [highScore, setHighScore] = useLocalStorage(STORAGE_KEYS.HIGH_SCORE, 0)
  const [audioEnabled, setAudioEnabled] = useLocalStorage(STORAGE_KEYS.AUDIO_ENABLED, true)
  const [previousHighScore, setPreviousHighScore] = useState(0) // Track high score at game start

  const addScore = useCallback((points) => {
    setScore((prev) => {
      const newScore = prev + points
      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore)
      }
      return newScore
    })
  }, [highScore, setHighScore])

  const resetGame = useCallback(() => {
    setScore(0)
    setGameState('playing')
    setPreviousHighScore(highScore)
  }, [highScore])

  const startGame = useCallback(() => {
    setScore(0)
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
    
    // Actions
    addScore,
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

