import { memo, useRef, useEffect } from 'react'
import Mole from './Mole'
import './Hole.css'

const Hole = memo(({ holeIndex, mole, onClick }) => {
  const holeRef = useRef(null)

  const handleClick = (e) => {
    if (onClick) {
      onClick(holeIndex, e)
    }
  }

  const handleTouch = (e) => {
    e.preventDefault() // Prevent scrolling
    handleClick(e)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <div
      ref={holeRef}
      className="hole"
      onClick={handleClick}
      onTouchStart={handleTouch}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={mole ? `Hit the ${mole.type} mole` : 'Empty hole'}
      tabIndex={0}
    >
      <div className="hole__burrow"></div>
      {mole && (
        <Mole
          type={mole.type}
          isHit={mole.isHit}
          onAnimationEnd={() => {}}
        />
      )}
    </div>
  )
})

Hole.displayName = 'Hole'

export default Hole

