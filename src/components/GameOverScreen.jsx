import { useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import { audioManager } from '../utils/audioManager'
import './GameOverScreen.css'

function GameOverScreen({ onPlayAgain, onMainMenu }) {
  const { score, highScore, previousHighScore, audioEnabled } = useGame()
  const isNewHighScore = score > previousHighScore

  useEffect(() => {
    if (isNewHighScore) {
      audioManager.setEnabled(audioEnabled)
      audioManager.play('highscore')
    }
  }, [isNewHighScore, audioEnabled])

  return (
    <div className="game-over-screen">
      <div className="game-over-screen__content">
        <h1 className="game-over-screen__title">Time's Up!</h1>
        
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
            onClick={onPlayAgain}
            aria-label="Play again"
          >
            Play Again
          </button>
          <button
            className="game-over-screen__button"
            onClick={onMainMenu}
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

