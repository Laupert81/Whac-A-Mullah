import { useEffect, useState } from 'react'
import './LevelTransition.css'

function LevelTransition({ completedLevel, levelScore, scoreThreshold, onComplete }) {
  const [visible, setVisible] = useState(false)
  const nextLevel = completedLevel + 1

  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setVisible(true))

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const getDifficultyHint = (level) => {
    if (level <= 3) return 'Faster moles!'
    if (level <= 6) return 'More moles, less time!'
    return 'Maximum chaos!'
  }

  return (
    <div className={`level-transition ${visible ? 'level-transition--visible' : ''}`}>
      <div className="level-transition__overlay" />
      <div className="level-transition__content">
        <h2 className="level-transition__complete">Level {completedLevel} Complete!</h2>
        <div className="level-transition__stats">
          <span className="level-transition__stat">
            Score: {levelScore.toLocaleString()} / {scoreThreshold.toLocaleString()}
          </span>
        </div>
        <div className="level-transition__next">
          <span className="level-transition__next-label">Next up</span>
          <span className="level-transition__next-level">Level {nextLevel}</span>
          <span className="level-transition__hint">{getDifficultyHint(nextLevel)}</span>
        </div>
      </div>
    </div>
  )
}

export default LevelTransition
