import { memo } from 'react'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import './HUD.css'

const HUD = memo(({ score, timeRemaining, isWarning }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="hud" role="region" aria-label="Game information">
      <div className="hud__score">
        <span className="hud__label">Score</span>
        <span className="hud__value" aria-live="polite" aria-atomic="true">
          {score.toLocaleString()}
        </span>
      </div>

      <div className={`hud__timer ${isWarning ? 'hud__timer--warning' : ''}`}>
        <span className="hud__label">Time</span>
        <span className="hud__value" aria-live="polite" aria-atomic="true">
          {formatTime(timeRemaining)}
        </span>
      </div>

      <div className="hud__legend" aria-label="Mole types and points">
        <div className="hud__legend-item">
          <span className="hud__legend-emoji" aria-hidden="true">
            {MOLE_CONFIG[MOLE_TYPES.COMMON].emoji}
          </span>
          <span className="hud__legend-points">
            {MOLE_CONFIG[MOLE_TYPES.COMMON].points}
          </span>
        </div>
        <div className="hud__legend-item">
          <span className="hud__legend-emoji" aria-hidden="true">
            {MOLE_CONFIG[MOLE_TYPES.RARE].emoji}
          </span>
          <span className="hud__legend-points">
            {MOLE_CONFIG[MOLE_TYPES.RARE].points}
          </span>
        </div>
        <div className="hud__legend-item">
          <span className="hud__legend-emoji" aria-hidden="true">
            {MOLE_CONFIG[MOLE_TYPES.GOLDEN].emoji}
          </span>
          <span className="hud__legend-points">
            {MOLE_CONFIG[MOLE_TYPES.GOLDEN].points}
          </span>
        </div>
      </div>
    </div>
  )
})

HUD.displayName = 'HUD'

export default HUD

