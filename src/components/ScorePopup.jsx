import { memo, useEffect, useState } from 'react'
import { MOLE_CONFIG, isPenaltyMole } from '../utils/moleTypes'
import './ScorePopup.css'

const ScorePopup = memo(({ points, moleType, holeIndex, multiplier }) => {
  const [visible, setVisible] = useState(false)
  const config = MOLE_CONFIG[moleType] || MOLE_CONFIG.common
  const isPenalty = isPenaltyMole(moleType)
  const isNegative = points < 0

  useEffect(() => {
    // Trigger animation on mount
    requestAnimationFrame(() => {
      setVisible(true)
    })
  }, [])

  // Calculate position based on hole index (3x3 grid)
  const row = Math.floor(holeIndex / 3)
  const col = holeIndex % 3
  const left = `${(col + 0.5) * (100 / 3)}%`
  const top = `${(row + 0.5) * (100 / 3)}%`

  // Format points display
  const pointsDisplay = isNegative ? points : `+${points}`

  return (
    <div
      className={`score-popup ${visible ? 'score-popup--visible' : ''} ${isPenalty ? 'score-popup--penalty' : ''} ${multiplier ? 'score-popup--multiplied' : ''}`}
      style={{ left, top }}
      aria-live="off"
      aria-atomic="true"
    >
      <span className={`score-popup__points ${isNegative ? 'score-popup__points--negative' : ''}`}>
        {pointsDisplay}
      </span>
      {multiplier && multiplier > 1 && (
        <span className="score-popup__multiplier">
          {multiplier}x
        </span>
      )}
      {isPenalty && (
        <span className="score-popup__penalty-text">
          COMBO LOST!
        </span>
      )}
      <span className="score-popup__emoji" aria-hidden="true">
        {config.emoji}
      </span>
    </div>
  )
})

ScorePopup.displayName = 'ScorePopup'

export default ScorePopup

