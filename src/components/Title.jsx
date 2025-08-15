import { Text3D, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'

export default function Title() {
  return (
    <Suspense>
      <TitleContent />
    </Suspense>
  )
}

function TitleContent() {
  const matcapTexture = useTexture('/textures/5.png')
  
  // Memoize shared material to prevent recreation
  const sharedMaterial = useMemo(() => ({
    matcap: matcapTexture
  }), [matcapTexture])
  
  return (
    <>
      <Text3D 
        font='./assets/fonts/bubbleFont.json'
        size={0.5}
        height={0.1}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.02}
        bevelOffset={0}
        bevelSegments={3}
        position={[-0.2, 0.5, 0.15]}
        rotation={[0, -0.55, 0]}
        anchorX="center"
        anchorY="middle"
      >
        PinPaws
        <meshMatcapMaterial {...sharedMaterial}/>
      </Text3D>
      
      <Text3D 
        font='./assets/fonts/bubbleFont.json'
        size={0.2}
        height={0.05}
        curveSegments={6}
        bevelEnabled
        bevelThickness={0.01}
        bevelOffset={0}
        bevelSegments={2}
        position={[-0.5, 0.2, 0]}
        rotation={[0, -0.55, 0]}
        anchorX="center"
        anchorY="middle"
      >
        Find your favourite kitty
        <meshMatcapMaterial {...sharedMaterial}/>
      </Text3D>
    </>
  )
}