import { memo } from 'react'
import { MOLE_CONFIG } from '../utils/moleTypes'
import './Mole.css'

const Mole = memo(({ type, isHit, onAnimationEnd }) => {
  const config = MOLE_CONFIG[type] || MOLE_CONFIG.common

  return (
    <div
      className={`mole mole--${type} ${isHit ? 'mole--hit' : 'mole--active'}`}
      role="img"
      aria-label={`${config.name} mole`}
      onAnimationEnd={onAnimationEnd}
    >
      <span className="mole__emoji" aria-hidden="true">
        {config.emoji}
      </span>
    </div>
  )
})

Mole.displayName = 'Mole'

export default Mole

