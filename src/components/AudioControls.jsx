import { memo } from 'react'
import './AudioControls.css'

const AudioControls = memo(({ audioEnabled, onToggle }) => {
  return (
    <button
      className={`audio-controls ${audioEnabled ? 'audio-controls--enabled' : 'audio-controls--disabled'}`}
      onClick={onToggle}
      aria-label={audioEnabled ? 'Disable sound effects' : 'Enable sound effects'}
      title={audioEnabled ? 'Mute' : 'Unmute'}
    >
      <span className="audio-controls__icon" aria-hidden="true">
        {audioEnabled ? '🔊' : '🔇'}
      </span>
      <span className="audio-controls__label">
        {audioEnabled ? 'Sound On' : 'Sound Off'}
      </span>
    </button>
  )
})

AudioControls.displayName = 'AudioControls'

export default AudioControls

