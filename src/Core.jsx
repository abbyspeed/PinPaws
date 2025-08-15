import { Suspense, useState, useRef, useMemo, useCallback } from 'react'
import { Center, OrbitControls } from '@react-three/drei'
import Title from './components/Title.jsx'
import Cat from './components/Cat.jsx';
import Heart from './components/Heart.jsx';
import BgAudio from './components/BgAudio.jsx';
import InstructionsBox from './components/InstructionsBox.jsx';
import PlayIcon from './components/PlayIcon.jsx';
import Loader from './components/Loader.jsx';

export default function Core({ onLearnMore }) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const audioRef = useRef()
  
  const handlePlayClick = useCallback(() => {
    setShowInstructions(true)
    setMusicStarted(true)
    if (audioRef.current && audioRef.current.context) {
      audioRef.current.context.resume()
    }
  }, [])
  
  const handleLearnMore = useCallback(() => {
    if (audioRef.current && audioRef.current.stop) {
      audioRef.current.stop()
    }
    onLearnMore()
  }, [onLearnMore])

  const memoizedHeart = useMemo(() => <Heart />, [])
  const memoizedCat = useMemo(() => <Cat />, [])
  const memoizedTitle = useMemo(() => (
    <Center>
      <Title />
    </Center>
  ), [])

  const memoizedLights = useMemo(() => (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
    </>
  ), [])

  const memoizedControls = useMemo(() => (
    <OrbitControls 
      makeDefault
      target={[0, -1.2, 0]}
      enableZoom={false}
    />
  ), [])

  return <>
    {memoizedLights}
    {memoizedControls}
    
    <BgAudio ref={audioRef} startMusic={musicStarted} />
    
    <Suspense fallback={<Loader />}>
      {memoizedTitle}
      {memoizedCat}
      
      {!showInstructions && (
        <PlayIcon 
          position={[0, -1.1, 0]}
          onPlayClick={handlePlayClick}
        />
      )}
      
      {showInstructions && (
        <InstructionsBox 
          use3D={true}
          position={[0, -1.1, 0]}
          text="Hello, I am Abby 👋🏻"
          text2="Are you a cat lover? Let's find out!"
          btnText="Click to start"
          onButtonClick={handleLearnMore}
        />
      )}
      
      {memoizedHeart}
    </Suspense>
  </>
}