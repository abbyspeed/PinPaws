import { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Cat from './components/Cat.jsx'
import Gallery from './components/Gallery.jsx'
import InstructionsBox from './components/InstructionsBox.jsx'
import Copyright from './components/Copyright.jsx'
import BgAudio from './components/BgAudio.jsx'
import './styles/Summary.css'

export default function Summary({ rightSwipedCats = [] }) {
  const audioRef = useRef()
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  
  // Handle user interaction to enable audio
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true)
      console.log('User interaction detected, enabling audio')
      setShouldPlayMusic(true)
    }
  }
  
  // Start music when component mounts or user interacts
  useEffect(() => {
    const handleClick = () => handleUserInteraction()
    document.addEventListener('click', handleClick)
    
    const timer = setTimeout(() => {
      console.log('Summary mounted, attempting to start music...')
      setShouldPlayMusic(true)
    }, 500)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [])
  
  const instructionMessage = useMemo(() => {
    const count = rightSwipedCats.length
    if (count >= 8) {
      return "You are a true cat lover! 😻"
    } else if (count >= 4 && count <= 7) {
      return "You seem nice, but you can be better!"
    } else {
      return "Are you secretly a cat hater? 😡"
    }
  }, [rightSwipedCats.length])

  const handleReplay = () => {
    window.location.reload()
  }

  return (
    <div className="summary-container">
      <div className="summary-left">
        <Canvas
          shadows
          camera={{
            fov: 35,
            position: [-4, 1, 6]
          }}
        >
          <directionalLight position={[1, 2, 3]} intensity={1.5} />
          <ambientLight intensity={0.5} />
          <BgAudio ref={audioRef} startMusic={shouldPlayMusic} volume={0.8} />
          <Cat instructionMessage={instructionMessage} position={[0, -1, 0]} />
          
          <InstructionsBox 
            text={instructionMessage}
            btnText="Replay"
            onButtonClick={handleReplay}
            use3D={true}
            position={[0, 1.2, 0]}
          />
        </Canvas>
      </div>

      <div className="summary-right">
        <Gallery rightSwipedCats={rightSwipedCats} />
      </div>

      <Copyright />
    </div>
  )
}