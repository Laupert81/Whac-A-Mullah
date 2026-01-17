import { memo, useRef } from 'react'
import Mole from './Mole'
import './Hole.css'

const Hole = memo(({ holeIndex, mole, onClick }) => {
  const holeRef = useRef(null)
  const touchHandledRef = useRef(false)

  const handleClick = (e) => {
    // Skip if this click was already handled by touch
    if (touchHandledRef.current) {
      touchHandledRef.current = false
      return
    }
    
    if (onClick) {
      onClick(holeIndex, e)
    }
  }

  const handleTouch = (e) => {
    e.preventDefault() // Prevent scrolling
    
    // Mark that we handled this as a touch event
    touchHandledRef.current = true
    
    // Reset the flag after a short delay (in case click doesn't fire)
    setTimeout(() => {
      touchHandledRef.current = false
    }, 300)
    
    if (onClick) {
      onClick(holeIndex, e)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onClick) {
        onClick(holeIndex, e)
      }
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

