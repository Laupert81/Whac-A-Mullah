import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import { useGameTimer } from '../hooks/useGameTimer'
import { useMoleSpawner } from '../hooks/useMoleSpawner'
import { getMolePoints, isPenaltyMole } from '../utils/moleTypes'
import { getLevelConfig } from '../utils/levelConfig'
import { audioManager } from '../utils/audioManager'
import GameGrid from './GameGrid'
import HUD from './HUD'
import ScorePopup from './ScorePopup'
import Hammer from './Hammer'
import LevelTransition from './LevelTransition'
import './GameScreen.css'

function GameScreen({ onGameOver }) {
  const {
    score,
    addScoreWithMultiplier,
    audioEnabled,
    combo,
    comboMultiplier,
    incrementCombo,
    resetCombo,
    currentMilestone,
    clearMilestone,
    currentLevel,
    levelScore,
    advanceLevel,
    recordHit,
    recordMiss,
    updateMaxCombo,
  } = useGame()
  const [isActive, setIsActive] = useState(true)
  const [scorePopups, setScorePopups] = useState([])
  const [hammers, setHammers] = useState([])
  const [showMilestonePopup, setShowMilestonePopup] = useState(false)
  const [milestoneValue, setMilestoneValue] = useState(null)
  const [showLevelTransition, setShowLevelTransition] = useState(false)
  const scorePopupIdRef = useRef(0)
  const hammerIdRef = useRef(0)
  const milestoneTimeoutRef = useRef(null)

  // Compute level config from current level
  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel])

  const handleTimeUp = useCallback(() => {
    // Check if player met the score threshold for this level
    if (levelScore >= levelConfig.scoreThreshold) {
      // Level passed — show transition
      setIsActive(false)
      setShowLevelTransition(true)
    } else {
      // Level failed — game over
      setIsActive(false)
      audioManager.setEnabled(audioEnabled)
      audioManager.play('game-over')
      setTimeout(() => {
        onGameOver()
      }, 500)
    }
  }, [onGameOver, audioEnabled, levelScore, levelConfig.scoreThreshold])

  const { timeRemaining, isWarning, reset: resetTimer } = useGameTimer(
    isActive,
    handleTimeUp,
    levelConfig.duration
  )

  const handleLevelTransitionComplete = useCallback(() => {
    setShowLevelTransition(false)
    advanceLevel()
    // Re-activate game — the timer will reset via the isActive effect
    setIsActive(true)
    resetTimer()
  }, [advanceLevel, resetTimer])

  const handleMoleSpawn = useCallback((moleData) => {
    audioManager.setEnabled(audioEnabled)
    // Play different sound for cat vs regular moles
    if (moleData && moleData.type === 'cat') {
      audioManager.play('cat-appear')
    } else {
      audioManager.play('pop')
    }
  }, [audioEnabled])

  const { activeMoles, hitMole } = useMoleSpawner(isActive, handleMoleSpawn, levelConfig)

  const handleFieldClick = useCallback((x, y, didHitMole = false) => {
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

    // If clicked on empty space (not a mole), reset combo and record miss
    if (!didHitMole && combo > 0) {
      resetCombo()
      audioManager.setEnabled(audioEnabled)
      audioManager.play('miss')
    }
    if (!didHitMole) {
      recordMiss()
    }
  }, [combo, resetCombo, audioEnabled, recordMiss])

  const handleMoleHit = useCallback(
    (holeIndex, mole) => {
      if (!isActive) return

      const hitResult = hitMole(holeIndex)
      if (!hitResult) return

      // Record the hit
      recordHit(hitResult.type)

      // Check if this is a penalty mole (cat)
      const isPenalty = isPenaltyMole(hitResult.type)
      const basePoints = getMolePoints(hitResult.type)

      let finalPoints = basePoints
      let currentMultiplier = comboMultiplier

      if (isPenalty) {
        // Penalty mole: reset combo, apply negative points (no multiplier)
        resetCombo()
        finalPoints = basePoints // Negative points, no multiplier
        currentMultiplier = 1

        // Play cat hit sound
        audioManager.setEnabled(audioEnabled)
        audioManager.play('cat-hit')
      } else {
        // Regular villain: increment combo, apply multiplier
        const milestone = incrementCombo()

        // Get the new multiplier after incrementing
        // Since state updates are async, we calculate what it will be
        const newCombo = combo + 1
        if (newCombo >= 8) currentMultiplier = 3.0
        else if (newCombo >= 5) currentMultiplier = 2.0
        else if (newCombo >= 3) currentMultiplier = 1.5
        else currentMultiplier = 1.0

        finalPoints = Math.round(basePoints * currentMultiplier)

        // Play appropriate sound
        audioManager.setEnabled(audioEnabled)
        if (milestone) {
          // Play combo milestone sound
          audioManager.play('combo-milestone')

          // Show milestone popup
          setMilestoneValue(milestone)
          setShowMilestonePopup(true)

          // Clear any existing timeout
          if (milestoneTimeoutRef.current) {
            clearTimeout(milestoneTimeoutRef.current)
          }

          // Hide popup after animation
          milestoneTimeoutRef.current = setTimeout(() => {
            setShowMilestonePopup(false)
            clearMilestone()
          }, 1500)
        } else {
          audioManager.play('hit')
        }
      }

      // Add score with calculated points
      addScoreWithMultiplier(basePoints, isPenalty ? 1 : currentMultiplier)

      // Show score popup
      const popupId = scorePopupIdRef.current++
      const newPopup = {
        id: popupId,
        points: finalPoints,
        moleType: hitResult.type,
        holeIndex,
        multiplier: isPenalty ? null : (currentMultiplier > 1 ? currentMultiplier : null),
      }
      setScorePopups((prev) => [...prev, newPopup])

      // Remove popup after animation
      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== popupId))
      }, 400)
    },
    [hitMole, addScoreWithMultiplier, audioEnabled, isActive, comboMultiplier, combo, incrementCombo, resetCombo, clearMilestone, recordHit]
  )

  // Track max combo
  useEffect(() => {
    if (combo > 0) {
      updateMaxCombo(combo)
    }
  }, [combo, updateMaxCombo])

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

  // Calculate level progress for HUD
  const levelProgress = levelConfig.scoreThreshold > 0
    ? (levelScore / levelConfig.scoreThreshold) * 100
    : 0

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
            multiplier={popup.multiplier}
          />
        ))}

        {/* Combo milestone celebration */}
        {showMilestonePopup && milestoneValue && (
          <div className="game-screen__combo-popup">
            <span className="game-screen__combo-milestone">
              {milestoneValue}x COMBO!
            </span>
          </div>
        )}
      </div>
      <HUD
        score={score}
        timeRemaining={timeRemaining}
        isWarning={isWarning}
        combo={combo}
        comboMultiplier={comboMultiplier}
        level={currentLevel}
        levelProgress={levelProgress}
      />

      {/* Level transition overlay */}
      {showLevelTransition && (
        <LevelTransition
          completedLevel={currentLevel}
          levelScore={levelScore}
          scoreThreshold={levelConfig.scoreThreshold}
          onComplete={handleLevelTransitionComplete}
        />
      )}
    </div>
  )
}

export default GameScreen
