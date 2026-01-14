import { useState } from 'react'
import { useGame } from '../contexts/GameContext'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import { usePWAInstall } from '../hooks/usePWAInstall'
import AudioControls from './AudioControls'
import './StartScreen.css'

// Import mole sprites for instructions
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'

// Import logos (replace .svg with .png when actual logos are provided)
import gameLogo from '../assets/logos/game-logo.png'
import studioLogo from '../assets/logos/tabarnak-studios.png'

function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close instructions">
          ×
        </button>
        <h2 className="modal-title">How to Play</h2>
        <ul className="modal-instructions">
          <li>Click or tap mullahs as they appear</li>
          <li className="modal-mole-info">
            <img src={moleCommon} alt={MOLE_CONFIG[MOLE_TYPES.COMMON].name} className="modal-mole-sprite" />
            <span>{MOLE_CONFIG[MOLE_TYPES.COMMON].name} = {MOLE_CONFIG[MOLE_TYPES.COMMON].points} points</span>
          </li>
          <li className="modal-mole-info">
            <img src={moleRare} alt={MOLE_CONFIG[MOLE_TYPES.RARE].name} className="modal-mole-sprite" />
            <span>{MOLE_CONFIG[MOLE_TYPES.RARE].name} = {MOLE_CONFIG[MOLE_TYPES.RARE].points} points</span>
          </li>
          <li className="modal-mole-info">
            <img src={moleGolden} alt={MOLE_CONFIG[MOLE_TYPES.GOLDEN].name} className="modal-mole-sprite" />
            <span>{MOLE_CONFIG[MOLE_TYPES.GOLDEN].name} = {MOLE_CONFIG[MOLE_TYPES.GOLDEN].points} points</span>
          </li>
          <li>Score as many points as possible in 60 seconds!</li>
        </ul>
      </div>
    </div>
  )
}

function InstallInstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close install instructions">
          ×
        </button>
        <h2 className="modal-title">How to Install</h2>
        <div className="modal-instructions">
          {isIOS ? (
            <ol className="install-steps">
              <li>Tap the <strong>Share</strong> button in Safari</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>"Add"</strong> in the top right</li>
            </ol>
          ) : isAndroid ? (
            <ol className="install-steps">
              <li>Tap the <strong>menu button</strong> (⋮) in your browser</li>
              <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
              <li>Confirm by tapping <strong>"Add"</strong></li>
            </ol>
          ) : (
            <ol className="install-steps">
              <li>Look for an <strong>install icon</strong> in your browser's address bar</li>
              <li>Or open the browser menu and look for <strong>"Install"</strong> option</li>
              <li>Follow the prompts to add the app to your device</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

function StartScreen({ onStart }) {
  const { highScore, audioEnabled, toggleAudio } = useGame()
  const { isInstallable, isInstalled, install, needsManualInstall, noPWASupport } = usePWAInstall()
  const [showInstructions, setShowInstructions] = useState(false)
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)

  const handleStart = () => {
    onStart()
  }

  const handleInstall = async () => {
    await install()
  }

  const handleHowToInstall = () => {
    setShowInstallInstructions(true)
  }

  // Determine which install button to show
  const showDirectInstall = isInstallable && !isInstalled
  const showHowToInstall = needsManualInstall && !isInstalled
  const hideInstallButton = noPWASupport || isInstalled

  return (
    <div className="start-screen">
      <div className="start-screen__content">
        {/* Game Logo */}
        <div className="start-screen__logo-container">
          <img 
            src={gameLogo} 
            alt="Whac-A-Mullah" 
            className="start-screen__logo"
          />
        </div>

        {/* FREE IRAN text */}
        <div className="start-screen__slogan">FREE IRAN</div>

        {/* High Score */}
        <div className="start-screen__high-score">
          <span className="start-screen__high-score-label">High Score</span>
          <span className="start-screen__high-score-value" aria-live="polite">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="start-screen__buttons">
          <button
            className="start-screen__button start-screen__button--primary"
            onClick={handleStart}
            aria-label="Start game"
          >
            Start Game
          </button>

          <button
            className="start-screen__button start-screen__button--secondary"
            onClick={() => setShowInstructions(true)}
            aria-label="View instructions"
          >
            Instructions
          </button>

          {showDirectInstall && (
            <button
              className="start-screen__button start-screen__button--install"
              onClick={handleInstall}
              aria-label="Install app"
            >
              Install
            </button>
          )}

          {showHowToInstall && !hideInstallButton && (
            <button
              className="start-screen__button start-screen__button--install"
              onClick={handleHowToInstall}
              aria-label="How to install app"
            >
              How to Install
            </button>
          )}
        </div>

        {/* Audio Controls */}
        <div className="start-screen__controls">
          <AudioControls audioEnabled={audioEnabled} onToggle={toggleAudio} />
        </div>
      </div>

      {/* Scrolling Credits */}
      <div className="start-screen__credits-container">
        <div className="start-screen__credits-marquee">
          <span className="start-screen__credits-text">
            Code by a Grumpy Norwegian &nbsp;|&nbsp; Graphics by a Grumpy Norwegian &nbsp;|&nbsp; Sound effects by some guy on the internet (sorry) &nbsp;|&nbsp; Music by K. Kasyanov &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="start-screen__credits-text" aria-hidden="true">
            Code by a Grumpy Norwegian &nbsp;|&nbsp; Graphics by a Grumpy Norwegian &nbsp;|&nbsp; Sound effects by some guy on the internet (sorry) &nbsp;|&nbsp; Music by K. Kasyanov &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* Studio Logo */}
      <div className="start-screen__studio">
        <img 
          src={studioLogo} 
          alt="Tabarnak Studios" 
          className="start-screen__studio-logo"
        />
      </div>

      {/* Modals */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
      <InstallInstructionsModal 
        isOpen={showInstallInstructions} 
        onClose={() => setShowInstallInstructions(false)} 
      />
    </div>
  )
}

export default StartScreen
