import { useEffect, useState, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { audioManager } from '../utils/audioManager'
import { checkIsTop10, addToLeaderboard } from '../utils/analytics'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import NicknamePrompt from './NicknamePrompt'
import LeaderboardModal from './LeaderboardModal'
import './GameOverScreen.css'

// Import victory assets
import victoryBackground from '../assets/victory/victory-background.jpg'
import iranFlag from '../assets/victory/iran-flag.png'

// Import mole sprites for stats breakdown
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'

const catSprites = import.meta.glob('../assets/sprites/moles/cat/*.png', { eager: true, import: 'default' })
const moleCat = catSprites['../assets/sprites/moles/cat/mole-cat.png'] || moleCommon

const MOLE_SPRITES = {
  [MOLE_TYPES.COMMON]: moleCommon,
  [MOLE_TYPES.RARE]: moleRare,
  [MOLE_TYPES.GOLDEN]: moleGolden,
  [MOLE_TYPES.CAT]: moleCat,
}

function GameOverScreen({ onPlayAgain, onMainMenu }) {
  const {
    score, highScore, previousHighScore, audioEnabled,
    currentLevel, gameStats, personalBests, updatePersonalBests,
    nickname, setNickname,
  } = useGame()
  const isNewHighScore = score > previousHighScore
  const [showContent, setShowContent] = useState(false)
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardChecked, setLeaderboardChecked] = useState(false)
  const leaderboardSubmittedRef = useRef(false)

  // Calculate stats
  const accuracy = gameStats.totalHits + gameStats.totalMisses > 0
    ? Math.round((gameStats.totalHits / (gameStats.totalHits + gameStats.totalMisses)) * 100)
    : 0

  // Check what personal bests were broken
  const newBests = {
    bestScore: score > personalBests.bestScore,
    bestAccuracy: accuracy > personalBests.bestAccuracy,
    bestCombo: gameStats.maxCombo > personalBests.bestCombo,
    highestLevel: currentLevel > personalBests.highestLevel,
  }

  // Update personal bests on mount
  useEffect(() => {
    updatePersonalBests({
      score,
      accuracy,
      maxCombo: gameStats.maxCombo,
      level: currentLevel,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Check leaderboard eligibility
  useEffect(() => {
    if (leaderboardChecked) return
    setLeaderboardChecked(true)

    checkIsTop10(score).then((isTop10) => {
      if (!isTop10) return

      if (nickname) {
        // Auto-submit with saved nickname
        if (!leaderboardSubmittedRef.current) {
          leaderboardSubmittedRef.current = true
          addToLeaderboard(nickname, score, currentLevel)
        }
      } else {
        setShowNicknamePrompt(true)
      }
    })
  }, [score, currentLevel, nickname, leaderboardChecked])

  // Start music and show content after delay
  useEffect(() => {
    audioManager.setEnabled(audioEnabled)
    audioManager.playMusic('victory', { loop: false, volume: 0.6 })

    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      audioManager.fadeOutMusic(500)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    audioManager.setEnabled(audioEnabled)
  }, [audioEnabled])

  useEffect(() => {
    if (showContent && isNewHighScore) {
      audioManager.play('highscore')
    }
  }, [showContent, isNewHighScore])

  const handlePlayAgain = () => {
    audioManager.stopMusic()
    onPlayAgain()
  }

  const handleMainMenu = () => {
    audioManager.stopMusic()
    onMainMenu()
  }

  const handleNicknameSubmit = (name) => {
    setNickname(name)
    setShowNicknamePrompt(false)
    if (!leaderboardSubmittedRef.current) {
      leaderboardSubmittedRef.current = true
      addToLeaderboard(name, score, currentLevel)
    }
  }

  return (
    <div
      className="game-over-screen"
      style={{ backgroundImage: `url(${victoryBackground})` }}
    >
      {/* Dark overlay for readability */}
      <div className="game-over-screen__overlay" />

      {/* Content container with fade-in */}
      <div className={`game-over-screen__content ${showContent ? 'game-over-screen__content--visible' : ''}`}>
        {/* Iranian Flag */}
        <div className="game-over-screen__flag-container">
          <img
            src={iranFlag}
            alt="Flag of Iran"
            className="game-over-screen__flag"
          />
        </div>

        <div className="game-over-screen__header">
          <h1 className="game-over-screen__title">You are victorious!</h1>
          <p className="game-over-screen__subtitle">You have defeated the evil islamic republic!</p>
        </div>

        <div className="game-over-screen__score-section">
          <div className="game-over-screen__final-score">
            <span className="game-over-screen__label">Your Score</span>
            <span className="game-over-screen__value" aria-live="polite">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="game-over-screen__high-score">
            <span className="game-over-screen__label">High Score</span>
            <span className="game-over-screen__value" aria-live="polite">
              {highScore.toLocaleString()}
            </span>
            {isNewHighScore && (
              <span className="game-over-screen__new-record" aria-live="assertive">
                New High Score!
              </span>
            )}
          </div>
        </div>

        {/* Game Stats */}
        <div className="game-over-screen__stats-section">
          <h3 className="game-over-screen__section-title">Game Stats</h3>
          <div className="game-over-screen__stats-grid">
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Level Reached</span>
              <span className="game-over-screen__stat-value">{currentLevel}</span>
            </div>
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Accuracy</span>
              <span className="game-over-screen__stat-value">{accuracy}%</span>
            </div>
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Max Combo</span>
              <span className="game-over-screen__stat-value">{gameStats.maxCombo}</span>
            </div>
          </div>

          {/* Mole breakdown */}
          <div className="game-over-screen__mole-breakdown">
            {Object.entries(gameStats.hitsByType).map(([type, count]) => (
              <div className="game-over-screen__mole-stat" key={type}>
                <img
                  src={MOLE_SPRITES[type]}
                  alt={MOLE_CONFIG[type]?.name || type}
                  className="game-over-screen__mole-sprite"
                />
                <span className="game-over-screen__mole-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Bests */}
        <div className="game-over-screen__bests-section">
          <h3 className="game-over-screen__section-title">Personal Bests</h3>
          <div className="game-over-screen__stats-grid">
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Best Score</span>
              <span className="game-over-screen__stat-value">
                {personalBests.bestScore.toLocaleString()}
                {newBests.bestScore && <span className="game-over-screen__new-badge">New!</span>}
              </span>
            </div>
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Best Accuracy</span>
              <span className="game-over-screen__stat-value">
                {personalBests.bestAccuracy}%
                {newBests.bestAccuracy && <span className="game-over-screen__new-badge">New!</span>}
              </span>
            </div>
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Best Combo</span>
              <span className="game-over-screen__stat-value">
                {personalBests.bestCombo}
                {newBests.bestCombo && <span className="game-over-screen__new-badge">New!</span>}
              </span>
            </div>
            <div className="game-over-screen__stat-item">
              <span className="game-over-screen__stat-label">Highest Level</span>
              <span className="game-over-screen__stat-value">
                {personalBests.highestLevel}
                {newBests.highestLevel && <span className="game-over-screen__new-badge">New!</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="game-over-screen__actions">
          <button
            className="game-over-screen__button game-over-screen__button--primary"
            onClick={handlePlayAgain}
            aria-label="Play again"
          >
            Play Again
          </button>
          <button
            className="game-over-screen__button game-over-screen__button--secondary"
            onClick={() => setShowLeaderboard(true)}
            aria-label="View leaderboard"
          >
            Leaderboard
          </button>
          <button
            className="game-over-screen__button game-over-screen__button--secondary"
            onClick={handleMainMenu}
            aria-label="Return to main menu"
          >
            Main Menu
          </button>
        </div>
      </div>

      {/* Nickname prompt for leaderboard */}
      {showNicknamePrompt && (
        <NicknamePrompt
          defaultNickname={nickname}
          onSubmit={handleNicknameSubmit}
          onCancel={() => setShowNicknamePrompt(false)}
        />
      )}

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  )
}

export default GameOverScreen
