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
 * Future: Add a score to the leaderboard
 * Uses Redis sorted sets for efficient ranking
 */
export async function addToLeaderboard(playerName, score) {
  if (!redis) return

  try {
    await redis.zadd('leaderboard', { score, member: `${playerName}:${Date.now()}` })
  } catch (error) {
    console.warn('Failed to add to leaderboard:', error)
  }
}

/**
 * Future: Get top scores from leaderboard
 */
export async function getLeaderboard(limit = 10) {
  if (!redis) return []

  try {
    const entries = await redis.zrange('leaderboard', 0, limit - 1, { rev: true, withScores: true })
    return entries
  } catch (error) {
    console.warn('Failed to get leaderboard:', error)
    return []
  }
}
