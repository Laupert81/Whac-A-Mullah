import { useEffect, useState, useCallback, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { useGameTimer } from '../hooks/useGameTimer'
import { useMoleSpawner } from '../hooks/useMoleSpawner'
import { getMolePoints } from '../utils/moleTypes'
import { audioManager } from '../utils/audioManager'
import GameGrid from './GameGrid'
import HUD from './HUD'
import ScorePopup from './ScorePopup'
import Hammer from './Hammer'
import './GameScreen.css'

function GameScreen({ onGameOver }) {
  const { score, addScore, audioEnabled } = useGame()
  const [isActive, setIsActive] = useState(true)
  const [scorePopups, setScorePopups] = useState([])
  const [hammers, setHammers] = useState([])
  const scorePopupIdRef = useRef(0)
  const hammerIdRef = useRef(0)

  const handleTimeUp = useCallback(() => {
    setIsActive(false)
    audioManager.setEnabled(audioEnabled)
    audioManager.play('game-over')
    setTimeout(() => {
      onGameOver()
    }, 500)
  }, [onGameOver, audioEnabled])
  
  const { timeRemaining, isWarning, reset: resetTimer } = useGameTimer(
    isActive,
    handleTimeUp
  )

  const handleMoleSpawn = useCallback(() => {
    audioManager.setEnabled(audioEnabled)
    audioManager.play('pop')
  }, [audioEnabled])

  const { activeMoles, hitMole } = useMoleSpawner(isActive, handleMoleSpawn)

  const handleFieldClick = useCallback((x, y) => {
    // Create a new hammer instance at the click position
    const hammerId = hammerIdRef.current++
    const newHammer = {
      id: hammerId,
      x,
      y,
    }
    setHammers((prev) => [...prev, newHammer])

    // Remove hammer after animation completes (100ms swing + 50ms visible + 150ms fade = 300ms total)
    setTimeout(() => {
      setHammers((prev) => prev.filter((h) => h.id !== hammerId))
    }, 400)
  }, [])

  const handleMoleHit = useCallback(
    (holeIndex, mole) => {
      if (!isActive) return
      
      const hitResult = hitMole(holeIndex)
      if (!hitResult) return

      // Use the hitResult from hitMole, not the mole parameter
      const points = getMolePoints(hitResult.type)
      addScore(points)

      // Play hit sound
      audioManager.setEnabled(audioEnabled)
      audioManager.play('hit')

      // Show score popup
      const popupId = scorePopupIdRef.current++
      const newPopup = {
        id: popupId,
        points,
        moleType: hitResult.type,
        holeIndex,
      }
      setScorePopups((prev) => [...prev, newPopup])

      // Remove popup after animation
      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== popupId))
      }, 400)
    },
    [hitMole, addScore, audioEnabled, isActive]
  )

  // Initialize game - run once on mount
  useEffect(() => {
    setIsActive(true)
    resetTimer()
    audioManager.setEnabled(audioEnabled)
    audioManager.play('game-start')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Update audio settings when audioEnabled changes (but don't replay game-start)
  useEffect(() => {
    audioManager.setEnabled(audioEnabled)
  }, [audioEnabled])

  // Warning sound for last 10 seconds
  useEffect(() => {
    if (isWarning && timeRemaining <= 10 && timeRemaining > 0 && isActive) {
      if (timeRemaining === 10 || timeRemaining === 5 || timeRemaining <= 3) {
        audioManager.setEnabled(audioEnabled)
        audioManager.play('tick')
      }
    }
  }, [isWarning, timeRemaining, isActive, audioEnabled])

  return (
    <div className="game-screen">
      <div className="game-screen__field">
        <GameGrid 
          activeMoles={activeMoles} 
          onMoleHit={handleMoleHit}
          onFieldClick={handleFieldClick}
        />
        
        {hammers.map((hammer) => (
          <Hammer key={hammer.id} x={hammer.x} y={hammer.y} />
        ))}
        
        {scorePopups.map((popup) => (
          <ScorePopup
            key={popup.id}
            points={popup.points}
            moleType={popup.moleType}
            holeIndex={popup.holeIndex}
          />
        ))}
      </div>
      <HUD score={score} timeRemaining={timeRemaining} isWarning={isWarning} />
    </div>
  )
}

export default GameScreen

