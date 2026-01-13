/**
 * Audio Manager for handling game sounds
 * Uses Web Audio API for placeholder sounds if files are not provided
 */

// Import hit sound files - update these paths after moving your audio files
// Move Audio 1.mp3, Audio 2.mp3, Audio 3.mp3 from root to src/assets/sounds/
import hitSound1 from '../assets/sounds/hit-1.mp3'
import hitSound2 from '../assets/sounds/hit-2.mp3'
import hitSound3 from '../assets/sounds/hit-3.mp3'

class AudioManager {
  constructor() {
    this.enabled = true
    this.audioContext = null
    this.sounds = new Map()
    this.hitSounds = [] // Array to store multiple hit sound variations
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled
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
   * Play a sound effect
   * @param {string} soundName - Name of the sound (hit, pop, miss, game-start, game-over, tick, highscore)
   */
  play(soundName) {
    if (!this.enabled) return

    // Resume audio context if suspended (required for autoplay policies)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    // Special handling for hit sounds - randomly select from array
    if (soundName === 'hit' && this.hitSounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.hitSounds.length)
      const audio = this.hitSounds[randomIndex]
      audio.currentTime = 0
      audio.play().catch((error) => {
        console.warn(`Could not play hit sound:`, error)
      })
      return
    }

    // Try to play actual audio file if loaded
    const audio = this.sounds.get(soundName)
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((error) => {
        console.warn(`Could not play sound ${soundName}:`, error)
      })
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
}

// Singleton instance
export const audioManager = new AudioManager()

// Initialize hit sounds - preload all three variations
audioManager.preloadHitSounds([hitSound1, hitSound2, hitSound3])