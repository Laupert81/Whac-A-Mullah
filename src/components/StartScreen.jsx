import { useGame } from '../contexts/GameContext'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import AudioControls from './AudioControls'
import './StartScreen.css'

// Import mole sprites for instructions
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'

function StartScreen({ onStart }) {
  const { highScore, audioEnabled, toggleAudio } = useGame()

  const handleStart = () => {
    onStart()
  }

  return (
    <div className="start-screen">
      <div className="start-screen__content">
        <h1 className="start-screen__title">Whac-A-Mullah</h1>
        
        <div className="start-screen__high-score">
          <span className="start-screen__high-score-label">High Score</span>
          <span className="start-screen__high-score-value" aria-live="polite">
            {highScore.toLocaleString()}
          </span>
        </div>

        <div className="start-screen__instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click or tap mullahs as they appear</li>
            <li className="start-screen__mole-info">
              <img src={moleCommon} alt={MOLE_CONFIG[MOLE_TYPES.COMMON].name} className="start-screen__mole-sprite" />
              <span>{MOLE_CONFIG[MOLE_TYPES.COMMON].name} = {MOLE_CONFIG[MOLE_TYPES.COMMON].points} points</span>
            </li>
            <li className="start-screen__mole-info">
              <img src={moleRare} alt={MOLE_CONFIG[MOLE_TYPES.RARE].name} className="start-screen__mole-sprite" />
              <span>{MOLE_CONFIG[MOLE_TYPES.RARE].name} = {MOLE_CONFIG[MOLE_TYPES.RARE].points} points</span>
            </li>
            <li className="start-screen__mole-info">
              <img src={moleGolden} alt={MOLE_CONFIG[MOLE_TYPES.GOLDEN].name} className="start-screen__mole-sprite" />
              <span>{MOLE_CONFIG[MOLE_TYPES.GOLDEN].name} = {MOLE_CONFIG[MOLE_TYPES.GOLDEN].points} points</span>
            </li>
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

