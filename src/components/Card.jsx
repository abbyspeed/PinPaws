import { useRef, useState, useMemo } from 'react'
import { useDrag } from '@use-gesture/react'
import { getCatImageUrl, createSingleImageLoadHandlers } from '../utils/catUtility.js'
import '../styles/Card.css'

function Card({ data, index, isTop, onSwipe, onBackgroundChange }) {
  const cardRef = useRef()
  const [imageLoading, setImageLoading] = useState(true)
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    rotation: 0
  })
  
  const imageHandlers = useMemo(() => 
    createSingleImageLoadHandlers(setImageLoading), 
    []
  )

  const imageUrl = useMemo(() => getCatImageUrl(data.id), [data.id])

  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx] }) => {
      if (!isTop) return

      const trigger = vx > 0.2 || Math.abs(mx) > 200
      const dir = mx < 0 ? -1 : 1 
      
      if (!active && trigger) {
        if (onBackgroundChange) {
          onBackgroundChange(dir > 0 ? '#ffb6c1' : '#2c2c2c')
          setTimeout(() => onBackgroundChange('#ffffff'), 1000)
        }
        
        setTransform({
          x: dir * 1000,
          y: my,
          rotation: dir * 15
        })
        
        setTimeout(() => onSwipe(data.id, dir), 300)
      } else if (active) {
        setTransform({
          x: mx,
          y: my,
          rotation: mx / 10
        })
      }
    },
    { axis: 'x' }
  )

  return (
    <div 
      ref={cardRef}
      {...bind()}
      className={`card-container ${isTop ? 'grabbable' : 'not-grabbable'}`}
      style={{
        transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) rotate(${transform.rotation}deg)`,
        zIndex: 1000 - index,
        transition: !isTop ? 'none' : undefined
      }}
    >
      <div className="card-image-container">
        {imageLoading && (
          <div className="card-image-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img 
          src={imageUrl}
          alt={data.name}
          className="card-image"
          draggable={false}
          {...imageHandlers}
        />
        <div className="card-image-fallback">
          🐱
        </div>
      </div>
      
      <div className="card-info">
        <h2 className="card-name" style={{ color: data.color }}>
          {data.name}, {data.age}
        </h2>
        
        <p className="card-bio">
          {data.bio}
        </p>
        
        {data.tags && data.tags.length > 0 && (
          <div className="card-tags">
            {data.tags.slice(0, 2).map((tag, tagIndex) => (
              <span 
                key={tagIndex} 
                className="card-tag"
                style={{ background: data.color }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Card