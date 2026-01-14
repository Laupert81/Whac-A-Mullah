import { useEffect, useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { audioManager } from '../utils/audioManager'
import './GameOverScreen.css'

// Import victory assets
import victoryBackground from '../assets/victory/victory-background.jpg'
import iranFlag from '../assets/victory/iran-flag.png'

function GameOverScreen({ onPlayAgain, onMainMenu }) {
  const { score, highScore, previousHighScore, audioEnabled } = useGame()
  const isNewHighScore = score > previousHighScore
  const [showContent, setShowContent] = useState(false)

  // Start music and show content after delay
  useEffect(() => {
    // Set audio state and start victory music
    audioManager.setEnabled(audioEnabled)
    audioManager.playMusic('victory', { loop: false, volume: 0.6 })

    // Show content after 2 seconds
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)

    // Cleanup: fade out music when component unmounts
    return () => {
      clearTimeout(timer)
      // The audioManager will cancel this fade if playMusic is called again (e.g., StrictMode remount)
      audioManager.fadeOutMusic(500)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep audio manager in sync with audioEnabled setting
  useEffect(() => {
    audioManager.setEnabled(audioEnabled)
  }, [audioEnabled])

  // Play additional highscore sound when content appears
  useEffect(() => {
    if (showContent && isNewHighScore) {
      audioManager.play('highscore')
    }
  }, [showContent, isNewHighScore])

  const handlePlayAgain = () => {
    audioManager.stopMusic()
    onPlayAgain()
  }

  const handleMainMenu = () => {
    audioManager.stopMusic()
    onMainMenu()
  }

  return (
    <div 
      className="game-over-screen"
      style={{ backgroundImage: `url(${victoryBackground})` }}
    >
      {/* Dark overlay for readability */}
      <div className="game-over-screen__overlay" />

      {/* Content container with fade-in */}
      <div className={`game-over-screen__content ${showContent ? 'game-over-screen__content--visible' : ''}`}>
        {/* Iranian Flag */}
        <div className="game-over-screen__flag-container">
          <img 
            src={iranFlag} 
            alt="Flag of Iran" 
            className="game-over-screen__flag"
          />
        </div>

        <div className="game-over-screen__header">
          <h1 className="game-over-screen__title">You are victorious!</h1>
          <p className="game-over-screen__subtitle">You have defeated the evil islamic republic!</p>
        </div>
        
        <div className="game-over-screen__score-section">
          <div className="game-over-screen__final-score">
            <span className="game-over-screen__label">Your Score</span>
            <span className="game-over-screen__value" aria-live="polite">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="game-over-screen__high-score">
            <span className="game-over-screen__label">High Score</span>
            <span className="game-over-screen__value" aria-live="polite">
              {highScore.toLocaleString()}
            </span>
            {isNewHighScore && (
              <span className="game-over-screen__new-record" aria-live="assertive">
                🎉 New High Score! 🎉
              </span>
            )}
          </div>
        </div>

        <div className="game-over-screen__actions">
          <button
            className="game-over-screen__button game-over-screen__button--primary"
            onClick={handlePlayAgain}
            aria-label="Play again"
          >
            Play Again
          </button>
          <button
            className="game-over-screen__button game-over-screen__button--secondary"
            onClick={handleMainMenu}
            aria-label="Return to main menu"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
