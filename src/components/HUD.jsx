import { memo, useEffect, useState, useRef } from 'react'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import './HUD.css'

// Import mole sprites for legend (only villains, not cat)
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'

const MOLE_SPRITES = {
  [MOLE_TYPES.COMMON]: moleCommon,
  [MOLE_TYPES.RARE]: moleRare,
  [MOLE_TYPES.GOLDEN]: moleGolden,
}

const HUD = memo(({ score, timeRemaining, isWarning, combo = 0, comboMultiplier = 1, level = 1, levelProgress = 0 }) => {
  const [comboAnimating, setComboAnimating] = useState(false)
  const prevComboRef = useRef(0)

  // Trigger animation when combo increases
  useEffect(() => {
    if (combo > prevComboRef.current && combo > 0) {
      setComboAnimating(true)
      const timer = setTimeout(() => setComboAnimating(false), 300)
      prevComboRef.current = combo
      return () => clearTimeout(timer)
    }
    prevComboRef.current = combo
  }, [combo])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Determine combo tier for styling
  const getComboTier = () => {
    if (comboMultiplier >= 3) return 'max'
    if (comboMultiplier >= 2) return 'high'
    if (comboMultiplier >= 1.5) return 'medium'
    return 'low'
  }

  const clampedProgress = Math.min(100, Math.max(0, levelProgress))

  return (
    <div className="hud" role="region" aria-label="Game information">
      <div className="hud__score">
        <span className="hud__label">Score</span>
        <span className="hud__value" aria-live="polite" aria-atomic="true">
          {score.toLocaleString()}
        </span>
      </div>

      <div className="hud__center">
        {/* Level badge */}
        <div className="hud__level">
          <span className="hud__level-badge">Level {level}</span>
          <div className="hud__level-progress-track">
            <div
              className="hud__level-progress-fill"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        <div className={`hud__timer ${isWarning ? 'hud__timer--warning' : ''}`}>
          <span className="hud__label">Time</span>
          <span className="hud__value" aria-live="polite" aria-atomic="true">
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Combo Counter */}
        {combo > 0 && (
          <div
            className={`hud__combo hud__combo--${getComboTier()} ${comboAnimating ? 'hud__combo--animating' : ''}`}
            aria-live="polite"
          >
            <span className="hud__combo-count">{combo}</span>
            <span className="hud__combo-label">COMBO</span>
            {comboMultiplier > 1 && (
              <span className="hud__combo-multiplier">{comboMultiplier}x</span>
            )}
          </div>
        )}
      </div>

      <div className="hud__legend" aria-label="Mullah types and points">
        <div className="hud__legend-item">
          <img
            src={MOLE_SPRITES[MOLE_TYPES.COMMON]}
            alt={MOLE_CONFIG[MOLE_TYPES.COMMON].name}
            className="hud__legend-sprite"
          />
          <span className="hud__legend-points">
            {MOLE_CONFIG[MOLE_TYPES.COMMON].points}
          </span>
        </div>
        <div className="hud__legend-item">
          <img
            src={MOLE_SPRITES[MOLE_TYPES.RARE]}
            alt={MOLE_CONFIG[MOLE_TYPES.RARE].name}
            className="hud__legend-sprite"
          />
          <span className="hud__legend-points">
            {MOLE_CONFIG[MOLE_TYPES.RARE].points}
          </span>
        </div>
        <div className="hud__legend-item">
          <img
            src={MOLE_SPRITES[MOLE_TYPES.GOLDEN]}
            alt={MOLE_CONFIG[MOLE_TYPES.GOLDEN].name}
            className="hud__legend-sprite"
          />
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
