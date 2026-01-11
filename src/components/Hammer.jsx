import { memo } from 'react'
import hammerHitting from '../assets/sprites/hammer/hammer-hitting.png'
import './Hammer.css'

const Hammer = memo(({ x, y }) => {
  return (
    <div
      className="hammer hammer--hitting"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      role="img"
      aria-label="Hammer"
    >
      <img
        src={hammerHitting}
        alt=""
        className="hammer__sprite"
        draggable="false"
      />
    </div>
  )
})

Hammer.displayName = 'Hammer'

export default Hammer

