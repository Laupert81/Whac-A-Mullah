import { memo } from 'react'
import { MOLE_CONFIG } from '../utils/moleTypes'
import './Mole.css'

// Import mole sprites
import moleCommon from '../assets/sprites/moles/common/mole-common.png'
import moleCommonHit from '../assets/sprites/moles/common/mole-common-hit.png'
import moleRare from '../assets/sprites/moles/rare/mole-rare.png'
import moleRareHit from '../assets/sprites/moles/rare/mole-rare-hit.png'
import moleGolden from '../assets/sprites/moles/golden/mole-golden.png'
import moleGoldenHit from '../assets/sprites/moles/golden/mole-golden-hit.png'

// Cat sprites - imported dynamically, fallback to common if not found
// Place your cat sprites at:
// - src/assets/sprites/moles/cat/mole-cat.png
// - src/assets/sprites/moles/cat/mole-cat-hit.png
const catSprites = import.meta.glob('../assets/sprites/moles/cat/*.png', { eager: true, import: 'default' })
const moleCat = catSprites['../assets/sprites/moles/cat/mole-cat.png'] || moleCommon
const moleCatHit = catSprites['../assets/sprites/moles/cat/mole-cat-hit.png'] || moleCommonHit

// Map mole types to their sprite images
const MOLE_SPRITES = {
  common: {
    normal: moleCommon,
    hit: moleCommonHit,
  },
  rare: {
    normal: moleRare,
    hit: moleRareHit,
  },
  golden: {
    normal: moleGolden,
    hit: moleGoldenHit,
  },
  cat: {
    normal: moleCat,
    hit: moleCatHit,
  },
}

const Mole = memo(({ type, isHit, onAnimationEnd }) => {
  const config = MOLE_CONFIG[type] || MOLE_CONFIG.common
  const sprites = MOLE_SPRITES[type] || MOLE_SPRITES.common
  const spriteSrc = isHit ? sprites.hit : sprites.normal
  const isCat = type === 'cat'

  return (
    <div
      className={`mole mole--${type} ${isHit ? 'mole--hit' : 'mole--active'} ${isCat ? 'mole--cat' : ''}`}
      role="img"
      aria-label={config.name}
      onAnimationEnd={onAnimationEnd}
    >
      <img
        key={`${type}-${isHit ? 'hit' : 'normal'}`}
        src={spriteSrc}
        alt={config.name}
        className="mole__sprite"
        draggable="false"
      />
    </div>
  )
})

Mole.displayName = 'Mole'

export default Mole

