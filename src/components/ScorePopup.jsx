import { memo, useEffect, useState } from 'react'
import { MOLE_CONFIG } from '../utils/moleTypes'
import './ScorePopup.css'

const ScorePopup = memo(({ points, moleType, holeIndex }) => {
  const [visible, setVisible] = useState(false)
  const config = MOLE_CONFIG[moleType] || MOLE_CONFIG.common

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

  return (
    <div
      className={`score-popup ${visible ? 'score-popup--visible' : ''}`}
      style={{ left, top }}
      aria-live="off"
      aria-atomic="true"
    >
      <span className="score-popup__points">+{points}</span>
      <span className="score-popup__emoji" aria-hidden="true">
        {config.emoji}
      </span>
    </div>
  )
})

ScorePopup.displayName = 'ScorePopup'

export default ScorePopup

