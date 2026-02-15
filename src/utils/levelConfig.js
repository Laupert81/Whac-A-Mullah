export const LEVEL_DURATION = 30

/**
 * Get difficulty configuration for a given level
 * @param {number} level - Current level (1-based)
 * @returns {Object} Configuration for that level
 */
export function getLevelConfig(level) {
  const lvl = Math.max(1, level)

  return {
    duration: LEVEL_DURATION,
    scoreThreshold: Math.round(500 * Math.pow(1.3, lvl - 1)),
    spawnIntervalMin: Math.max(250, 600 - (lvl - 1) * 30),
    spawnIntervalMax: Math.max(450, 1200 - (lvl - 1) * 50),
    activeDurationMin: Math.max(400, 800 - (lvl - 1) * 30),
    activeDurationMax: Math.max(600, 1500 - (lvl - 1) * 50),
    maxSimultaneousMoles: Math.min(7, 3 + Math.floor((lvl - 1) / 3)),
    catProbability: 12,
  }
}
