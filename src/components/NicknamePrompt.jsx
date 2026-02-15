import { useState } from 'react'
import './NicknamePrompt.css'

function NicknamePrompt({ defaultNickname, onSubmit, onCancel }) {
  const [name, setName] = useState(defaultNickname || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) {
      onSubmit(trimmed)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content nickname-prompt" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">You made the top 10!</h2>
        <p className="nickname-prompt__subtitle">Enter your name for the leaderboard</p>
        <form className="nickname-prompt__form" onSubmit={handleSubmit}>
          <input
            className="nickname-prompt__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            maxLength={20}
            placeholder="Your name"
            autoFocus
          />
          <button
            className="nickname-prompt__submit"
            type="submit"
            disabled={!name.trim()}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default NicknamePrompt
