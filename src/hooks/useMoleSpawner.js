import { useState, useEffect, useRef, useCallback } from 'react'
import { selectRandomMoleType } from '../utils/moleTypes'

const MAX_SIMULTANEOUS_MOLES = 3
const SPAWN_INTERVAL_MIN = 600
const SPAWN_INTERVAL_MAX = 1200
const ACTIVE_DURATION_MIN = 800
const ACTIVE_DURATION_MAX = 1500
const TOTAL_HOLES = 9

/**
 * Custom hook for managing mole spawning
 * @param {boolean} isActive - Whether spawning should be active
 * @param {Function} onMoleSpawn - Callback when mole spawns (moleData)
 * @returns {Object} - { activeMoles, hitMole, spawnMole }
 */
export function useMoleSpawner(isActive, onMoleSpawn) {
  const [activeMoles, setActiveMoles] = useState(new Map()) // Map<holeIndex, moleData>
  const spawnTimeoutRef = useRef(null)
  const retreatTimeoutsRef = useRef(new Map()) // Map<holeIndex, timeout>

  const getRandomEmptyHole = useCallback((currentMoles) => {
    const occupiedHoles = Array.from(currentMoles.keys())
    const availableHoles = []
    
    for (let i = 0; i < TOTAL_HOLES; i++) {
      if (!occupiedHoles.includes(i)) {
        availableHoles.push(i)
      }
    }
    
    if (availableHoles.length === 0) {
      return null
    }
    
    return availableHoles[Math.floor(Math.random() * availableHoles.length)]
  }, [])

  const spawnMole = useCallback(() => {
    if (!isActive) return

    setActiveMoles((prev) => {
      // Don't spawn if max moles reached
      if (prev.size >= MAX_SIMULTANEOUS_MOLES) {
        // Schedule next spawn
        if (spawnTimeoutRef.current) {
          clearTimeout(spawnTimeoutRef.current)
        }
        const spawnInterval = 
          Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) + SPAWN_INTERVAL_MIN
        spawnTimeoutRef.current = setTimeout(() => {
          spawnMole()
        }, spawnInterval)
        return prev
      }

      const holeIndex = getRandomEmptyHole(prev)
      if (holeIndex === null) {
        // Schedule next spawn
        if (spawnTimeoutRef.current) {
          clearTimeout(spawnTimeoutRef.current)
        }
        const spawnInterval = 
          Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) + SPAWN_INTERVAL_MIN
        spawnTimeoutRef.current = setTimeout(() => {
          spawnMole()
        }, spawnInterval)
        return prev
      }

      const moleType = selectRandomMoleType()
      const activeDuration = 
        Math.random() * (ACTIVE_DURATION_MAX - ACTIVE_DURATION_MIN) + ACTIVE_DURATION_MIN

      const moleData = {
        id: `${Date.now()}-${Math.random()}`,
        holeIndex,
        type: moleType,
        spawnTime: Date.now(),
        activeDuration,
        isHit: false,
      }

      const next = new Map(prev)
      next.set(holeIndex, moleData)

      // Notify parent component
      onMoleSpawn(moleData)

      // Schedule mole retreat
      const retreatTimeout = setTimeout(() => {
        setActiveMoles((current) => {
          const updated = new Map(current)
          const mole = updated.get(holeIndex)
          // Only retreat if not already hit
          if (mole && !mole.isHit) {
            updated.delete(holeIndex)
            retreatTimeoutsRef.current.delete(holeIndex)
            return updated
          }
          return current
        })
      }, activeDuration)

      retreatTimeoutsRef.current.set(holeIndex, retreatTimeout)

      // Schedule next spawn
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current)
      }
      const spawnInterval = 
        Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) + SPAWN_INTERVAL_MIN
      spawnTimeoutRef.current = setTimeout(() => {
        spawnMole()
      }, spawnInterval)

      return next
    })
  }, [isActive, getRandomEmptyHole, onMoleSpawn])

  const hitMole = useCallback((holeIndex) => {
    let hitMoleData = null

    // Mark as hit and get mole data
    setActiveMoles((prev) => {
      const mole = prev.get(holeIndex)
      if (!mole || mole.isHit) {
        return prev // No mole or already hit
      }

      hitMoleData = { ...mole }
      const next = new Map(prev)
      next.get(holeIndex).isHit = true

      // Clear retreat timeout
      const retreatTimeout = retreatTimeoutsRef.current.get(holeIndex)
      if (retreatTimeout) {
        clearTimeout(retreatTimeout)
        retreatTimeoutsRef.current.delete(holeIndex)
      }

      // Remove mole after hit animation
      setTimeout(() => {
        setActiveMoles((current) => {
          const updated = new Map(current)
          updated.delete(holeIndex)
          return updated
        })
      }, 300) // Match hit animation duration

      return next
    })

    return hitMoleData
  }, [])

  // Start spawning when active
  useEffect(() => {
    if (!isActive) return

    // Initial spawn
    const initialDelay = Math.random() * 500 + 300 // 300-800ms
    spawnTimeoutRef.current = setTimeout(() => {
      spawnMole()
    }, initialDelay)

    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current)
        spawnTimeoutRef.current = null
      }
    }
  }, [isActive, spawnMole])

  // Cleanup on unmount or deactivation
  useEffect(() => {
    if (!isActive) {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current)
        spawnTimeoutRef.current = null
      }
      
      // Clear all retreat timeouts
      retreatTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      retreatTimeoutsRef.current.clear()
      
      setActiveMoles(new Map())
    }
  }, [isActive])

  return {
    activeMoles: Array.from(activeMoles.values()),
    hitMole,
    spawnMole,
  }
}

