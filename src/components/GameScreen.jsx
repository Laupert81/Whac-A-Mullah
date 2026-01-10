import { useEffect, useState, useCallback, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { useGameTimer } from '../hooks/useGameTimer'
import { useMoleSpawner } from '../hooks/useMoleSpawner'
import { getMolePoints } from '../utils/moleTypes'
import { audioManager } from '../utils/audioManager'
import GameGrid from './GameGrid'
import HUD from './HUD'
import ScorePopup from './ScorePopup'
import './GameScreen.css'

function GameScreen({ onGameOver }) {
  const { score, addScore, audioEnabled } = useGame()
  const [isActive, setIsActive] = useState(true)
  const [scorePopups, setScorePopups] = useState([])
  const scorePopupIdRef = useRef(0)

  const { timeRemaining, isWarning, reset: resetTimer } = useGameTimer(
    isActive,
    handleTimeUp
  )

  const handleTimeUp = useCallback(() => {
    setIsActive(false)
    audioManager.setEnabled(audioEnabled)
    audioManager.play('game-over')
    setTimeout(() => {
      onGameOver()
    }, 500)
  }, [onGameOver, audioEnabled])

  const handleMoleSpawn = useCallback(() => {
    audioManager.setEnabled(audioEnabled)
    audioManager.play('pop')
  }, [audioEnabled])

  const { activeMoles, hitMole } = useMoleSpawner(isActive, handleMoleSpawn)

  const handleMoleHit = useCallback(
    (holeIndex, mole) => {
      const hitResult = hitMole(holeIndex)
      if (!hitResult) return

      const points = getMolePoints(mole.type)
      addScore(points)

      // Play hit sound
      audioManager.setEnabled(audioEnabled)
      audioManager.play('hit')

      // Show score popup
      const popupId = scorePopupIdRef.current++
      const newPopup = {
        id: popupId,
        points,
        moleType: mole.type,
        holeIndex,
      }
      setScorePopups((prev) => [...prev, newPopup])

      // Remove popup after animation
      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== popupId))
      }, 400)
    },
    [hitMole, addScore, audioEnabled]
  )

  // Initialize game
  useEffect(() => {
    setIsActive(true)
    resetTimer()
    audioManager.setEnabled(audioEnabled)
    audioManager.play('game-start')
  }, [resetTimer, audioEnabled])

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
      <HUD score={score} timeRemaining={timeRemaining} isWarning={isWarning} />
      
      <div className="game-screen__field">
        <GameGrid activeMoles={activeMoles} onMoleHit={handleMoleHit} />
        
        {scorePopups.map((popup) => (
          <ScorePopup
            key={popup.id}
            points={popup.points}
            moleType={popup.moleType}
            holeIndex={popup.holeIndex}
          />
        ))}
      </div>
    </div>
  )
}

export default GameScreen

