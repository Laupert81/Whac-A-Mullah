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
  const activeMolesRef = useRef(activeMoles) // Keep a ref for synchronous access
  const spawnTimeoutRef = useRef(null)
  const retreatTimeoutsRef = useRef(new Map()) // Map<holeIndex, timeout>
  const spawnMoleFnRef = useRef(null) // Ref to hold spawnMole for self-scheduling
  const onMoleSpawnRef = useRef(onMoleSpawn) // Ref for callback to avoid recreating spawnMole
  const isActiveRef = useRef(isActive) // Ref for isActive to avoid recreating spawnMole
  
  // Keep refs in sync
  useEffect(() => {
    activeMolesRef.current = activeMoles
  }, [activeMoles])
  
  useEffect(() => {
    onMoleSpawnRef.current = onMoleSpawn
  }, [onMoleSpawn])
  
  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

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

  const scheduleNextSpawn = useCallback(() => {
    if (spawnTimeoutRef.current) {
      clearTimeout(spawnTimeoutRef.current)
    }
    const spawnInterval = 
      Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) + SPAWN_INTERVAL_MIN
    spawnTimeoutRef.current = setTimeout(() => {
      // Use ref to get latest spawnMole function
      if (spawnMoleFnRef.current) {
        spawnMoleFnRef.current()
      }
    }, spawnInterval)
  }, [])

  const spawnMole = useCallback(() => {
    if (!isActiveRef.current) return

    // Check current state synchronously
    const currentMoles = activeMolesRef.current
    
    // Don't spawn if max moles reached
    if (currentMoles.size >= MAX_SIMULTANEOUS_MOLES) {
      scheduleNextSpawn()
      return
    }

    const holeIndex = getRandomEmptyHole(currentMoles)
    if (holeIndex === null) {
      scheduleNextSpawn()
      return
    }

    // Calculate values OUTSIDE the state updater to avoid StrictMode issues
    const moleType = selectRandomMoleType()
    const activeDuration = 
      Math.random() * (ACTIVE_DURATION_MAX - ACTIVE_DURATION_MIN) + ACTIVE_DURATION_MIN
    const moleId = `${Date.now()}-${Math.random()}`
    const spawnTime = Date.now()

    const moleData = {
      id: moleId,
      holeIndex,
      type: moleType,
      spawnTime,
      activeDuration,
      isHit: false,
    }

    // Update state (pure function, no side effects)
    setActiveMoles((prev) => {
      // Double-check the hole is still empty
      if (prev.has(holeIndex)) {
        return prev // Hole was taken, don't spawn here
      }
      const next = new Map(prev)
      next.set(holeIndex, moleData)
      return next
    })

    // Notify parent component (outside state updater)
    if (onMoleSpawnRef.current) {
      onMoleSpawnRef.current(moleData)
    }

    // Schedule mole retreat (outside state updater)
    const retreatTimeout = setTimeout(() => {
      setActiveMoles((current) => {
        const updated = new Map(current)
        const mole = updated.get(holeIndex)
        // Only retreat if not already hit and is the same mole
        if (mole && !mole.isHit && mole.id === moleId) {
          updated.delete(holeIndex)
          retreatTimeoutsRef.current.delete(holeIndex)
          return updated
        }
        return current
      })
    }, activeDuration)

    retreatTimeoutsRef.current.set(holeIndex, retreatTimeout)

    // Schedule next spawn (outside state updater)
    scheduleNextSpawn()
  }, [getRandomEmptyHole, scheduleNextSpawn])
  
  // Keep the ref in sync with the latest spawnMole
  useEffect(() => {
    spawnMoleFnRef.current = spawnMole
  }, [spawnMole])

  const hitMole = useCallback((holeIndex) => {
    // Check current state synchronously using ref
    const mole = activeMolesRef.current.get(holeIndex)
    if (!mole || mole.isHit) {
      return null // No mole or already hit
    }

    // Create a copy of the mole data to return
    const hitMoleData = { ...mole }
    const moleId = mole.id

    // Clear retreat timeout (outside state updater)
    const retreatTimeout = retreatTimeoutsRef.current.get(holeIndex)
    if (retreatTimeout) {
      clearTimeout(retreatTimeout)
      retreatTimeoutsRef.current.delete(holeIndex)
    }

    // Mark as hit in state (pure function, no side effects)
    setActiveMoles((prev) => {
      const currentMole = prev.get(holeIndex)
      if (!currentMole || currentMole.isHit || currentMole.id !== moleId) {
        return prev // Double-check (mole might have been hit or changed)
      }

      const updatedMole = { ...currentMole, isHit: true }
      const next = new Map(prev)
      next.set(holeIndex, updatedMole)
      return next
    })

    // Remove mole after hit animation (outside state updater)
    setTimeout(() => {
      setActiveMoles((current) => {
        const updated = new Map(current)
        const currentMole = updated.get(holeIndex)
        // Only remove if it's the same mole we hit
        if (currentMole && currentMole.id === moleId) {
          updated.delete(holeIndex)
          return updated
        }
        return current
      })
    }, 400) // Match animation duration

    return hitMoleData
  }, [])

  // Start spawning when active
  useEffect(() => {
    if (!isActive) return

    // Initial spawn - use ref to avoid effect re-running when spawnMole changes
    const initialDelay = Math.random() * 500 + 300 // 300-800ms
    spawnTimeoutRef.current = setTimeout(() => {
      if (spawnMoleFnRef.current) {
        spawnMoleFnRef.current()
      }
    }, initialDelay)

    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current)
        spawnTimeoutRef.current = null
      }
    }
  }, [isActive]) // Only depend on isActive, use ref for spawnMole

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

