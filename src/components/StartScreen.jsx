import { useState, useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { MOLE_CONFIG, MOLE_TYPES } from '../utils/moleTypes'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { audioManager } from '../utils/audioManager'
import AudioControls from './AudioControls'
import LeaderboardModal from './LeaderboardModal'
import changelog from '../data/changelog.json'
import './StartScreen.css'

// Import mole sprites for instructions
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'

// Cat sprite - imported dynamically, fallback to common if not found
const catSprites = import.meta.glob('../assets/sprites/moles/cat/*.png', { eager: true, import: 'default' })
const moleCat = catSprites['../assets/sprites/moles/cat/mole-cat.png'] || moleCommon

// Import logos (replace .svg with .png when actual logos are provided)
import gameLogo from '../assets/logos/game-logo.png'
import studioLogo from '../assets/logos/tabarnak-studios.png'

function HamburgerMenu({ onShowInstructions, onShowAbout, onShowChangelog, onShowLeaderboard }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (action) => {
    setIsOpen(false)
    action()
  }

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button
        className="hamburger-menu__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={`hamburger-menu__bar ${isOpen ? 'hamburger-menu__bar--open' : ''}`}></span>
        <span className={`hamburger-menu__bar ${isOpen ? 'hamburger-menu__bar--open' : ''}`}></span>
        <span className={`hamburger-menu__bar ${isOpen ? 'hamburger-menu__bar--open' : ''}`}></span>
      </button>
      
      {isOpen && (
        <div className="hamburger-menu__dropdown">
          <button
            className="hamburger-menu__item"
            onClick={() => handleItemClick(onShowInstructions)}
          >
            Instructions
          </button>
          <button
            className="hamburger-menu__item"
            onClick={() => handleItemClick(onShowLeaderboard)}
          >
            Leaderboard
          </button>
          <button
            className="hamburger-menu__item"
            onClick={() => handleItemClick(onShowChangelog)}
          >
            Changelog
          </button>
          <button
            className="hamburger-menu__item"
            onClick={() => handleItemClick(onShowAbout)}
          >
            About the game
          </button>
        </div>
      )}
    </div>
  )
}

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--about" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close about">
          ×
        </button>
        <h2 className="modal-title">About the game</h2>
        <div className="about-text">
          <p>Please lower your expectations. Lower... okay, there.</p>
          <p>To be clear: I am not a game developer. By day, I write unglamorous backend code for enterprise software. If this game feels like it was designed by a database administrator... well, you have a keen eye.</p>
          <p>I built this to learn new tech, but more importantly, show my support for the brave people protesting in Iran.</p>
          <p>The code is messy, and the art is... what it is. I happily welcome feedback, bug fixes, or contributions (code improvements or assets that don't look like I drew them in MS Paint.)</p>
        </div>
        <div className="about-contact">
          <h3 className="about-contact__title">Get in touch</h3>
          <a 
            href="mailto:whac-a-mullah@outlook.com" 
            className="about-contact__link"
          >
            <span className="about-contact__icon">✉</span>
            whac-a-mullah@outlook.com
          </a>
          <a 
            href="https://github.com/Laupert81/Whac-A-Mullah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="about-contact__link"
          >
            <span className="about-contact__icon">⌨</span>
            GitHub Project
          </a>
        </div>
      </div>
    </div>
  )
}

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
          <li className="modal-mole-info modal-mole-info--penalty">
            <img src={moleCat} alt={MOLE_CONFIG[MOLE_TYPES.CAT].name} className="modal-mole-sprite" />
            <span>{MOLE_CONFIG[MOLE_TYPES.CAT].name} = {MOLE_CONFIG[MOLE_TYPES.CAT].points} points (Don't hit!)</span>
          </li>
          <li>Build combos by hitting mullahs consecutively for bonus multipliers!</li>
          <li>Each level lasts 45 seconds — meet the score threshold to advance!</li>
          <li>Difficulty ramps each level: faster moles, more cats, higher thresholds!</li>
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

function ChangelogModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--changelog" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close changelog">
          ×
        </button>
        <h2 className="modal-title">Changelog</h2>
        <div className="changelog">
          {changelog.map(entry => (
            <div className="changelog__version" key={entry.version}>
              <h3 className="changelog__version-title">Version {entry.version}</h3>
              <ul className="changelog__list">
                {entry.changes.map((change, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: change }} />
                ))}
              </ul>
            </div>
          ))}
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
  const [showAbout, setShowAbout] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const replayTimeoutRef = useRef(null)

  // Play intro music, replay after 10s gap when it ends
  useEffect(() => {
    const musicAudio = audioManager.music.get('intro')

    const scheduleReplay = () => {
      replayTimeoutRef.current = setTimeout(() => {
        if (audioEnabled) {
          audioManager.playMusic('intro', { loop: false, volume: 0.4 })
        }
      }, 10000)
    }

    const handleEnded = () => {
      scheduleReplay()
    }

    if (audioEnabled) {
      audioManager.setEnabled(true)
      audioManager.playMusic('intro', { loop: false, volume: 0.4 })
    }

    if (musicAudio) {
      musicAudio.addEventListener('ended', handleEnded)
    }

    return () => {
      if (replayTimeoutRef.current) {
        clearTimeout(replayTimeoutRef.current)
      }
      if (musicAudio) {
        musicAudio.removeEventListener('ended', handleEnded)
      }
      audioManager.stopMusic()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Respond to audio toggle while on start screen
  useEffect(() => {
    audioManager.setEnabled(audioEnabled)
    if (!audioEnabled) {
      audioManager.stopMusic()
      if (replayTimeoutRef.current) {
        clearTimeout(replayTimeoutRef.current)
        replayTimeoutRef.current = null
      }
    } else {
      // Resume music if toggled back on
      audioManager.playMusic('intro', { loop: false, volume: 0.4 })
    }
  }, [audioEnabled])

  const handleStart = () => {
    audioManager.fadeOutMusic(300)
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
      {/* Hamburger Menu */}
      <HamburgerMenu
        onShowInstructions={() => setShowInstructions(true)}
        onShowAbout={() => setShowAbout(true)}
        onShowChangelog={() => setShowChangelog(true)}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      
      <div className="start-screen__content">
        {/* Game Logo */}
        <div className="start-screen__logo-container">
          <img 
            src={gameLogo} 
            alt="Whac-A-Mullah" 
            className="start-screen__logo"
          />
        </div>

        {/* Version text */}
        <div className="start-screen__version">Version {changelog[0].version}</div>

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
            Code by a Grumpy Norwegian &nbsp;|&nbsp; Graphics by a Grumpy Norwegian &nbsp;|&nbsp; Sound effects by some guy on the internet (sorry) &nbsp;|&nbsp; Music by Amirhossein Eftekhari, K. Kasyanov &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="start-screen__credits-text" aria-hidden="true">
            Code by a Grumpy Norwegian &nbsp;|&nbsp; Graphics by a Grumpy Norwegian &nbsp;|&nbsp; Sound effects by some guy on the internet (sorry) &nbsp;|&nbsp; Music by Amirhossein Eftekhari, K. Kasyanov &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
      <AboutModal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)} 
      />
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  )
}

export default StartScreen
