export const MOLE_TYPES = {
  COMMON: 'common',
  RARE: 'rare',
  GOLDEN: 'golden',
}

export const MOLE_CONFIG = {
  [MOLE_TYPES.COMMON]: {
    probability: 50,
    points: 100,
    color: '#8B4513', // Brown
    emoji: '🐹',
    name: 'Common Mole',
  },
  [MOLE_TYPES.RARE]: {
    probability: 30,
    points: 200,
    color: '#4A90E2', // Blue
    emoji: '🐭',
    name: 'Rare Mole',
  },
  [MOLE_TYPES.GOLDEN]: {
    probability: 20,
    points: 500,
    color: '#FFD700', // Gold
    emoji: '✨🐹',
    name: 'Golden Mole',
  },
}

/**
 * Selects a random mole type based on probability distribution
 * @returns {string} Mole type key
 */
export function selectRandomMoleType() {
  // Create weighted array: 60 common, 30 rare, 10 golden (total 100)
  const pool = []
  
  Object.entries(MOLE_CONFIG).forEach(([type, config]) => {
    for (let i = 0; i < config.probability; i++) {
      pool.push(type)
    }
  })
  
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Gets the point value for a mole type
 * @param {string} moleType - The mole type key
 * @returns {number} Point value
 */
export function getMolePoints(moleType) {
  return MOLE_CONFIG[moleType]?.points || 0
}

