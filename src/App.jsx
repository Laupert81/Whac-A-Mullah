import { useState } from 'react'
import { GameProvider, useGame } from './contexts/GameContext'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import GameOverScreen from './components/GameOverScreen'

function AppContent() {
  const { startGame, resetGame, endGame } = useGame()
  const [gameState, setGameState] = useState('menu') // 'menu' | 'playing' | 'gameOver'

  const handleStart = () => {
    startGame()
    setGameState('playing')
  }

  const handleGameOver = () => {
    endGame()
    setGameState('gameOver')
  }

  const handlePlayAgain = () => {
    resetGame()
    setGameState('playing')
  }

  const handleMainMenu = () => {
    resetGame()
    setGameState('menu')
  }

  return (
    <div className="app">
      {gameState === 'menu' && <StartScreen onStart={handleStart} />}
      {gameState === 'playing' && <GameScreen onGameOver={handleGameOver} />}
      {gameState === 'gameOver' && (
        <GameOverScreen
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App

