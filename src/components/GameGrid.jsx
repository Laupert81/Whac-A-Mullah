import { memo, useRef, useCallback, useMemo } from 'react'
import Hole from './Hole'
import { getEventCoordinates, isPointInBounds } from '../utils/hitDetection'
import './GameGrid.css'

const TOTAL_HOLES = 9

const GameGrid = memo(({ activeMoles, onMoleHit }) => {
  const gridRef = useRef(null)
  const holeRefs = useRef([])

  const handleClick = useCallback((holeIndex, event) => {
    if (!gridRef.current) return

    const mole = activeMoles.find((m) => m.holeIndex === holeIndex && !m.isHit)
    if (!mole) {
      // Miss - clicked empty hole
      return
    }

    // Get the hole element to check precise hit bounds
    const holeElement = holeRefs.current[holeIndex]
    if (!holeElement) return

    const bounds = holeElement.getBoundingClientRect()
    const coords = getEventCoordinates(event)

    // Check if click is within mole bounds (use a generous hit area)
    if (isPointInBounds(coords.x, coords.y, bounds)) {
      onMoleHit(holeIndex, mole)
    }
  }, [activeMoles, onMoleHit])

  const moleMap = useMemo(() => {
    const map = new Map()
    activeMoles.forEach((mole) => {
      if (!mole.isHit) {
        map.set(mole.holeIndex, mole)
      }
    })
    return map
  }, [activeMoles])

  return (
    <div
      ref={gridRef}
      className="game-grid"
      role="application"
      aria-label="Whac-A-Mole game field"
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

