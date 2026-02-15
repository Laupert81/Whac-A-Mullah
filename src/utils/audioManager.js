/**
 * Audio Manager for handling game sounds
 * Uses Web Audio API for placeholder sounds if files are not provided
 */

// Import hit sound files
import hitSound1 from '../assets/sounds/hit-1.mp3'
import hitSound2 from '../assets/sounds/hit-2.mp3'
import hitSound3 from '../assets/sounds/hit-3.mp3'

// Import cat and combo sounds
import catAppearSound from '../assets/sounds/cat-appear.mp3'
import catHitSound from '../assets/sounds/cat-hit.mp3'
import comboMilestoneSound from '../assets/sounds/combo-milestone.mp3'

// Victory music loaded from external storage (not bundled for copyright reasons)
const victoryMusic = 'https://jhwcs60v8wnkkpkh.public.blob.vercel-storage.com/music/victory-music.mp3'

class AudioManager {
  constructor() {
    this.enabled = true
    this.audioContext = null
    this.sounds = new Map()
    this.music = new Map() // For background music tracks
    this.currentMusic = null // Currently playing music
    this.currentMusicName = null // Name of currently playing track
    this.fadeInterval = null // Track ongoing fade to cancel if needed
    this.hitSounds = [] // Array to store multiple hit sound variations
    this.audioPool = new Map() // Pool of cloned audio elements for concurrent playback
    this.lastPlayTime = new Map() // Track last play time for debouncing
    this.initAudioContext()
    this.setupIOSUnlock()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  // iOS requires user interaction to unlock audio
  setupIOSUnlock() {
    const unlockAudio = () => {
      // Resume audio context
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // Touch all preloaded audio to unlock them on iOS
      this.sounds.forEach((audio) => {
        audio.load()
      })
      this.hitSounds.forEach((audio) => {
        audio.load()
      })
      
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('touchend', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }

    document.addEventListener('touchstart', unlockAudio, { passive: true })
    document.addEventListener('touchend', unlockAudio, { passive: true })
    document.addEventListener('click', unlockAudio, { passive: true })
  }

  setEnabled(enabled) {
    this.enabled = enabled
    // Resume audio context when enabling
    if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * Creates a simple beep tone as placeholder
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in ms
   */
  createTone(frequency, duration) {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }

  /**
   * Play a cloned audio element (for concurrent playback on iOS)
   */
  playCloned(audio, soundName) {
    // Clone the audio element for concurrent playback
    const clone = audio.cloneNode()
    clone.volume = audio.volume
    
    // Clean up after playback
    clone.addEventListener('ended', () => {
      clone.remove()
    }, { once: true })
    
    clone.play().catch((error) => {
      console.warn(`Could not play sound ${soundName}:`, error)
    })
  }

  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound (hit, pop, miss, game-start, game-over, tick, highscore)
   */
  play(soundName) {
    if (!this.enabled) return

    // Resume audio context if suspended (required for autoplay policies)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    // Debounce rapid plays of the same sound (50ms minimum between plays)
    const now = Date.now()
    const lastPlay = this.lastPlayTime.get(soundName) || 0
    if (now - lastPlay < 50) {
      return
    }
    this.lastPlayTime.set(soundName, now)

    // Special handling for hit sounds - randomly select from array
    if (soundName === 'hit' && this.hitSounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.hitSounds.length)
      const audio = this.hitSounds[randomIndex]
      this.playCloned(audio, soundName)
      return
    }

    // Try to play actual audio file if loaded
    const audio = this.sounds.get(soundName)
    if (audio) {
      this.playCloned(audio, soundName)
      return
    }

    // Fallback to placeholder tones
    switch (soundName) {
      case 'hit':
        this.createTone(800, 100)
        break
      case 'pop':
        this.createTone(400, 150)
        break
      case 'miss':
        this.createTone(200, 100)
        break
      case 'game-start':
        this.createTone(600, 300)
        setTimeout(() => this.createTone(800, 200), 200)
        break
      case 'game-over':
        this.createTone(300, 500)
        setTimeout(() => this.createTone(200, 400), 300)
        break
      case 'tick':
        this.createTone(1000, 50)
        break
      case 'highscore':
        this.createTone(880, 150)
        setTimeout(() => this.createTone(1100, 150), 150)
        setTimeout(() => this.createTone(1320, 300), 300)
        break
      case 'cat-hit':
        // Sad descending tone for hitting the cat
        this.createTone(400, 150)
        setTimeout(() => this.createTone(300, 150), 100)
        setTimeout(() => this.createTone(200, 200), 200)
        break
      case 'cat-appear':
        // Quick high meow-like sound
        this.createTone(800, 80)
        setTimeout(() => this.createTone(1000, 100), 60)
        break
      case 'combo-milestone':
        // Triumphant ascending arpeggio
        this.createTone(523, 100) // C5
        setTimeout(() => this.createTone(659, 100), 80) // E5
        setTimeout(() => this.createTone(784, 100), 160) // G5
        setTimeout(() => this.createTone(1047, 200), 240) // C6
        break
      default:
        console.warn(`Unknown sound: ${soundName}`)
    }
  }

  /**
   * Preload audio files (if provided)
   * @param {Object} soundMap - Map of sound names to file paths
   */
  preload(soundMap) {
    Object.entries(soundMap).forEach(([name, path]) => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      this.sounds.set(name, audio)
    })
  }

  /**
   * Preload hit sound variations
   * @param {Array<string>} hitSoundPaths - Array of file paths for hit sounds
   */
  preloadHitSounds(hitSoundPaths) {
    this.hitSounds = hitSoundPaths.map((path) => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      return audio
    })
  }

  /**
   * Preload music tracks
   * @param {Object} musicMap - Map of music names to file paths
   */
  preloadMusic(musicMap) {
    Object.entries(musicMap).forEach(([name, path]) => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      audio.loop = false // Can be set to true for looping music
      this.music.set(name, audio)
    })
  }

  /**
   * Play a music track
   * @param {string} musicName - Name of the music track
   * @param {Object} options - Options like loop, volume
   */
  playMusic(musicName, options = {}) {
    if (!this.enabled) return

    // Cancel any ongoing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    const audio = this.music.get(musicName)
    if (!audio) {
      console.warn(`Music not found: ${musicName}`)
      return
    }

    // If the same track is already playing, just ensure volume and don't restart
    if (this.currentMusic === audio && !audio.paused && this.currentMusicName === musicName) {
      audio.volume = options.volume !== undefined ? options.volume : 0.5
      return
    }

    // Stop any currently playing music (different track)
    this.stopMusic()

    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    audio.loop = options.loop || false
    audio.volume = options.volume !== undefined ? options.volume : 0.5
    audio.currentTime = 0
    this.currentMusic = audio
    this.currentMusicName = musicName
    audio.play().catch((error) => {
      console.warn(`Could not play music ${musicName}:`, error)
    })
  }

  /**
   * Stop currently playing music
   */
  stopMusic() {
    // Cancel any ongoing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
      this.currentMusicName = null
    }
  }

  /**
   * Fade out current music
   * @param {number} duration - Fade duration in ms
   */
  fadeOutMusic(duration = 1000) {
    if (!this.currentMusic) return

    // Cancel any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
    }

    const audio = this.currentMusic
    const startVolume = audio.volume
    const steps = 20
    const stepDuration = duration / steps
    const volumeStep = startVolume / steps

    let currentStep = 0
    this.fadeInterval = setInterval(() => {
      currentStep++
      audio.volume = Math.max(0, startVolume - (volumeStep * currentStep))
      
      if (currentStep >= steps) {
        clearInterval(this.fadeInterval)
        this.fadeInterval = null
        this.stopMusic()
      }
    }, stepDuration)
  }
}

// Singleton instance
export const audioManager = new AudioManager()

// Initialize hit sounds - preload all three variations
audioManager.preloadHitSounds([hitSound1, hitSound2, hitSound3])

// Initialize cat and combo sounds
audioManager.preload({
  'cat-appear': catAppearSound,
  'cat-hit': catHitSound,
  'combo-milestone': comboMilestoneSound,
})

// Initialize music tracks
const introMusic = 'https://jhwcs60v8wnkkpkh.public.blob.vercel-storage.com/music/intro-music.mp3'

audioManager.preloadMusic({
  'victory': victoryMusic,
  'intro': introMusic,
})