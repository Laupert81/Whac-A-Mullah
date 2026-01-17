export const MOLE_TYPES = {
  COMMON: 'common',
  RARE: 'rare',
  GOLDEN: 'golden',
  CAT: 'cat',
}

export const MOLE_CONFIG = {
  [MOLE_TYPES.COMMON]: {
    probability: 44,
    points: 100,
    color: '#8B4513', // Brown
    name: 'Jannati',
    isPenalty: false,
  },
  [MOLE_TYPES.RARE]: {
    probability: 26,
    points: 200,
    color: '#4A90E2', // Blue
    name: 'Mohseni-Eje\'i',
    isPenalty: false,
  },
  [MOLE_TYPES.GOLDEN]: {
    probability: 18,
    points: 500,
    color: '#FFD700', // Gold
    name: 'Khamenei',
    isPenalty: false,
  },
  [MOLE_TYPES.CAT]: {
    probability: 12,
    points: -200,
    color: '#FF6B6B', // Soft red/coral
    name: 'Cat',
    isPenalty: true,
  },
}

/**
 * Check if a mole type is a penalty type
 * @param {string} moleType - The mole type key
 * @returns {boolean} Whether hitting this mole is a penalty
 */
export function isPenaltyMole(moleType) {
  return MOLE_CONFIG[moleType]?.isPenalty || false
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

