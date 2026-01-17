import { memo, useRef, useCallback, useMemo } from 'react'
import Hole from './Hole'
import { getEventCoordinates, isPointInBounds } from '../utils/hitDetection'
import './GameGrid.css'

const TOTAL_HOLES = 9

const GameGrid = memo(({ activeMoles, onMoleHit, onFieldClick }) => {
  const gridRef = useRef(null)
  const holeRefs = useRef([])

  const handleClick = useCallback((holeIndex, event) => {
    if (!gridRef.current) return

    // Get click coordinates relative to the field container (where hammer is positioned)
    const fieldContainer = gridRef.current.parentElement
    if (!fieldContainer) return
    
    const fieldBounds = fieldContainer.getBoundingClientRect()
    const coords = getEventCoordinates(event)
    const relativeX = coords.x - fieldBounds.left
    const relativeY = coords.y - fieldBounds.top

    // Only allow hitting moles that aren't already hit
    const mole = activeMoles.find((m) => m.holeIndex === holeIndex && !m.isHit)
    
    // Get the hole element to check precise hit bounds
    const holeElement = holeRefs.current[holeIndex]
    let didHitMole = false
    
    if (mole && holeElement) {
      const bounds = holeElement.getBoundingClientRect()
      // Check if click is within mole bounds (use a generous hit area)
      if (isPointInBounds(coords.x, coords.y, bounds)) {
        didHitMole = true
        onMoleHit(holeIndex, mole)
      }
    }

    // Trigger hammer animation for any click, pass whether we hit a mole
    if (onFieldClick) {
      onFieldClick(relativeX, relativeY, didHitMole)
    }
  }, [activeMoles, onMoleHit, onFieldClick])

  const moleMap = useMemo(() => {
    const map = new Map()
    activeMoles.forEach((mole) => {
      // Include all moles (including hit ones) so hit sprites can be displayed
      map.set(mole.holeIndex, mole)
    })
    return map
  }, [activeMoles])

  return (
    <div
      ref={gridRef}
      className="game-grid"
      role="application"
      aria-label="Whac-A-Mullah game field"
    >
      {Array.from({ length: TOTAL_HOLES }, (_, index) => (
        <div
          key={index}
          ref={(el) => (holeRefs.current[index] = el)}
          className="game-grid__cell"
        >
          <Hole
            holeIndex={index}
            mole={moleMap.get(index)}
            onClick={handleClick}
          />
        </div>
      ))}
    </div>
  )
})

GameGrid.displayName = 'GameGrid'

export default GameGrid

