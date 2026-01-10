import { useGame } from '../contexts/GameContext'
import AudioControls from './AudioControls'
import './StartScreen.css'

function StartScreen({ onStart }) {
  const { highScore, audioEnabled, toggleAudio } = useGame()

  const handleStart = () => {
    onStart()
  }

  return (
    <div className="start-screen">
      <div className="start-screen__content">
        <h1 className="start-screen__title">Whac-A-Mole</h1>
        
        <div className="start-screen__high-score">
          <span className="start-screen__high-score-label">High Score</span>
          <span className="start-screen__high-score-value" aria-live="polite">
            {highScore.toLocaleString()}
          </span>
        </div>

        <div className="start-screen__instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click or tap moles as they appear</li>
            <li>Common Mole 🐹 = 100 points</li>
            <li>Rare Mole 🐭 = 200 points</li>
            <li>Golden Mole ✨🐹 = 500 points</li>
            <li>Score as many points as possible in 60 seconds!</li>
          </ul>
        </div>

        <button
          className="start-screen__button"
          onClick={handleStart}
          aria-label="Start game"
        >
          Start Game
        </button>

        <div className="start-screen__controls">
          <AudioControls audioEnabled={audioEnabled} onToggle={toggleAudio} />
        </div>
      </div>
    </div>
  )
}

export default StartScreen

