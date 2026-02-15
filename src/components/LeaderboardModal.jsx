import { useEffect, useState } from 'react'
import { getLeaderboard } from '../utils/analytics'
import './LeaderboardModal.css'

function LeaderboardModal({ isOpen, onClose }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setLoading(true)
    setError(false)

    getLeaderboard(10)
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--leaderboard" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close leaderboard">
          ×
        </button>
        <h2 className="modal-title">Leaderboard</h2>

        {loading && (
          <p className="leaderboard__status">Loading...</p>
        )}

        {error && (
          <p className="leaderboard__status">Leaderboard unavailable</p>
        )}

        {!loading && !error && entries.length === 0 && (
          <p className="leaderboard__status">No scores yet. Be the first!</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <table className="leaderboard__table">
            <thead>
              <tr>
                <th className="leaderboard__th">#</th>
                <th className="leaderboard__th leaderboard__th--name">Name</th>
                <th className="leaderboard__th">Score</th>
                <th className="leaderboard__th">Level</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="leaderboard__row">
                  <td className="leaderboard__td leaderboard__rank">{index + 1}</td>
                  <td className="leaderboard__td leaderboard__name">{entry.name}</td>
                  <td className="leaderboard__td leaderboard__score">{entry.score.toLocaleString()}</td>
                  <td className="leaderboard__td leaderboard__level">{entry.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default LeaderboardModal
