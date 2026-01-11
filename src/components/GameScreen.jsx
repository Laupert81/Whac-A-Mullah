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
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GameScreen.jsx:12',message:'GameScreen render start',data:{onGameOver:typeof onGameOver},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const { score, addScore, audioEnabled } = useGame()
  const [isActive, setIsActive] = useState(true)
  const [scorePopups, setScorePopups] = useState([])
  const [hammers, setHammers] = useState([])
  const scorePopupIdRef = useRef(0)
  const hammerIdRef = useRef(0)

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GameScreen.jsx:19',message:'Before handleTimeUp declaration - line number',data:{executionPoint:'before handleTimeUp'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const handleTimeUp = useCallback(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GameScreen.jsx:21',message:'handleTimeUp callback executing',data:{audioEnabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setIsActive(false)
    audioManager.setEnabled(audioEnabled)
    audioManager.play('game-over')
    setTimeout(() => {
      onGameOver()
    }, 500)
  }, [onGameOver, audioEnabled])
  
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GameScreen.jsx:31',message:'After handleTimeUp declaration - before useGameTimer',data:{handleTimeUpType:typeof handleTimeUp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const { timeRemaining, isWarning, reset: resetTimer } = useGameTimer(
    isActive,
    handleTimeUp
  )
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e71b2981-833e-45f9-acdf-aacaff2d259e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GameScreen.jsx:35',message:'After useGameTimer call',data:{timeRemaining,isWarning},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

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
      <HUD score={score} timeRemaining={timeRemaining} isWarning={isWarning} />
      
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
    </div>
  )
}

export default GameScreen

