/**
 * Hit detection utilities
 */

/**
 * Check if a point (click/touch) is within the bounds of an element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {DOMRect} bounds - Element bounding rectangle
 * @returns {boolean} - True if point is within bounds
 */
export function isPointInBounds(x, y, bounds) {
  return (
    x >= bounds.left &&
    x <= bounds.right &&
    y >= bounds.top &&
    y <= bounds.bottom
  )
}

/**
 * Get click/touch coordinates from event
 * @param {Event} event - Mouse or touch event
 * @returns {Object} - { x, y } coordinates
 */
export function getEventCoordinates(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  }
  return {
    x: event.clientX,
    y: event.clientY,
  }
}

