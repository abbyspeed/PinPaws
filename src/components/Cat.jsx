import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import HiddenTextBox from './HiddenTextBox.jsx'

export default function Cat({ 
  surpriseLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  hoverText = "Click me for surprise! 🎉",
  instructionMessage = "",
  position = [0, -3, 0]
}) {
  const cat = useGLTF('/Cat/cat.gltf')
  const animations = useAnimations(cat.animations, cat.scene)
  const [isHovered, setIsHovered] = useState(false)
  const catRef = useRef()

  const jumpAction = animations.actions['05_Jump_LittleFriends']
  const greetingAction = animations.actions['06_Greeting_LittleFriends']
  const sleepAction = animations.actions['10_Sleep03_LittleFriends']
  const eatAction = animations.actions['07_Eat_LittleFriends']
  const runAction = animations.actions['04_Run_LittleFriends']

  // Animation mapping based on instruction message
  const getAnimationForMessage = () => {
    if (instructionMessage.includes("Are you secretly a cat hater?")) return sleepAction
    if (instructionMessage.includes("You seem nice, but you can be better!")) return eatAction
    if (instructionMessage.includes("You are a true cat lover!")) return runAction
    return greetingAction
  }

  const currentAnimation = getAnimationForMessage()
  const isSleeping = currentAnimation === sleepAction

  // Slow rotation for sleeping cat
  useFrame((state, delta) => {
    if (catRef.current && isSleeping && !isHovered) {
      catRef.current.rotation.y += delta * 0.3
    }
  })

  useEffect(() => {
    if (currentAnimation && currentAnimation !== greetingAction) {
      currentAnimation.reset().play()
      currentAnimation.setLoop(2201, Infinity)
    } else {
      greetingAction.reset().play()
    }
  }, [currentAnimation, greetingAction])

  const handlePointerEnter = () => {
    if (catRef.current && isSleeping) {
      catRef.current.rotation.y = -0.55
    }
    jumpAction.reset().play()
    jumpAction.crossFadeFrom(currentAnimation, 0.3)
    setIsHovered(true)
  }

  const handlePointerLeave = () => {
    currentAnimation.reset().play()
    currentAnimation.crossFadeFrom(jumpAction, 0.5)
    if (currentAnimation !== greetingAction) {
      currentAnimation.setLoop(2201, Infinity)
    }
    setIsHovered(false)
  }

  const handleClick = () => {
    window.open(surpriseLink, '_blank', 'noopener,noreferrer')
  }
  
  return (
    <>
      <primitive 
        ref={catRef}
        object={cat.scene} 
        scale={3}
        position={position}
        rotation={[-0.4, -0.55, -0.2]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      
      <HiddenTextBox 
        isVisible={isHovered}
        text={hoverText}
        position={[position[0], position[1] - 0.1, position[2]]}
      />
    </>
  )
}