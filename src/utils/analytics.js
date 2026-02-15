import { Redis } from '@upstash/redis'

// Initialize Redis client using Vercel KV environment variables
// You need to add VITE_ prefixed versions in Vercel project settings
let redis = null

try {
  const url = import.meta.env.VITE_KV_REST_API_URL
  const token = import.meta.env.VITE_KV_REST_API_TOKEN

  if (url && token) {
    redis = new Redis({ url, token })
  }
} catch (error) {
  console.warn('Redis initialization failed:', error)
}

/**
 * Increment the global play counter
 * This function is fire-and-forget - it won't block game start
 */
export async function incrementPlayCount() {
  if (!redis) {
    if (import.meta.env.DEV) {
      console.info('Redis not configured. Counter skipped.')
    }
    return
  }

  try {
    await redis.incr('stats:gamesPlayed')
  } catch (error) {
    console.warn('Failed to increment play count:', error)
  }
}

/**
 * Get the current play count (for future use, e.g., displaying stats)
 */
export async function getPlayCount() {
  if (!redis) return null

  try {
    const count = await redis.get('stats:gamesPlayed')
    return count || 0
  } catch (error) {
    console.warn('Failed to get play count:', error)
    return null
  }
}

/**
 * Add a score to the leaderboard
 * Uses Redis sorted sets for efficient ranking
 * @param {string} playerName
 * @param {number} score
 * @param {number} level - Level reached
 */
export async function addToLeaderboard(playerName, score, level) {
  if (!redis) return

  try {
    const member = `${playerName}:${Date.now()}:${level}`
    await redis.zadd('leaderboard', { score, member })
  } catch (error) {
    console.warn('Failed to add to leaderboard:', error)
  }
}

/**
 * Get top scores from leaderboard
 * @param {number} limit
 * @returns {Array<{name: string, score: number, level: number, timestamp: number}>}
 */
export async function getLeaderboard(limit = 10) {
  if (!redis) return []

  try {
    const entries = await redis.zrange('leaderboard', 0, limit - 1, { rev: true, withScores: true })
    // entries is an array of alternating [member, score, member, score, ...]
    const results = []
    for (let i = 0; i < entries.length; i += 2) {
      const member = entries[i]
      const score = entries[i + 1]
      const parts = member.split(':')
      const name = parts[0]
      const timestamp = parseInt(parts[1], 10) || 0
      const level = parseInt(parts[2], 10) || 1
      results.push({ name, score, level, timestamp })
    }
    return results
  } catch (error) {
    console.warn('Failed to get leaderboard:', error)
    return []
  }
}

/**
 * Check if a score qualifies for the top 10
 * @param {number} score
 * @returns {boolean}
 */
export async function checkIsTop10(score) {
  if (!redis) return false

  try {
    const entries = await redis.zrange('leaderboard', 0, 9, { rev: true, withScores: true })
    // If fewer than 10 entries, any score qualifies
    if (entries.length < 20) return true // 20 because alternating member/score
    // The 10th entry's score is at index 19
    const lowestTop10Score = entries[entries.length - 1]
    return score > lowestTop10Score
  } catch (error) {
    console.warn('Failed to check leaderboard:', error)
    return false
  }
}
