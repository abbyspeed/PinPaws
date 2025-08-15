import { Html } from '@react-three/drei'
import '../styles/HiddenTextBox.css'

export default function HiddenTextBox({ 
  isVisible, 
  text = "Click me for surprise!",
  position = [0, 0, 0]
}) {

  const hasHover = window.matchMedia('(hover: hover)').matches
  
  if (!hasHover || isVisible) {
    return (
      <Html
        position={position}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <div className="hidden-text-box">
          {text}
        </div>
      </Html>
    )
  }
  
  return null
}
