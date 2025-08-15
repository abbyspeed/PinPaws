import { Html } from '@react-three/drei'
import '../styles/PlayIcon.css'

export default function PlayIcon({ position, onPlayClick }) {
  return (
    <Html
      position={position}
      center
      distanceFactor={5}
      style={{
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      <div className="play-icon" onClick={onPlayClick}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill="rgba(255, 255, 255, 0.9)" />
          <polygon 
            points="32,24 32,56 56,40" 
            fill="#333"
          />
        </svg>
      </div>
    </Html>
  )
}
