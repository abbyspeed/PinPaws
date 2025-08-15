import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, memo, useMemo } from 'react'

const HeartInstance = memo(({ index, heartScene }) => {
    const heartRef = useRef()

    const animationParams = useMemo(() => ({
        initialPos: [
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        ],
        animSpeed: 0.1 + Math.random() * 0.5,
        offsetX: Math.random() * Math.PI * 2,
        offsetY: Math.random() * Math.PI * 2,
        offsetZ: Math.random() * Math.PI * 2,
        rotation: [
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0
        ]
    }), []) // Empty dependency array - these values should never change
    
    useFrame(({ clock }) => {
        if (heartRef.current) {
            const time = clock.elapsedTime * animationParams.animSpeed
            
            heartRef.current.position.x = animationParams.initialPos[0] + Math.sin(time + animationParams.offsetX) * 0.5
            heartRef.current.position.y = animationParams.initialPos[1] + Math.cos(time + animationParams.offsetY) * 0.3
            heartRef.current.position.z = animationParams.initialPos[2] + Math.sin(time + animationParams.offsetZ) * 0.4
            
            heartRef.current.rotation.y = time * 0.2
        }
    })
    
    return (
        <primitive 
            ref={heartRef}
            object={heartScene.clone()} 
            scale={0.2}
            position={animationParams.initialPos}
            rotation={animationParams.rotation}
        />
    )
})

export default memo(function Heart(){
    const heart = useGLTF('/Heart/heart.gltf')
    
    const heartInstances = useMemo(() => 
        [...Array(20)].map((_, index) => (
            <HeartInstance 
                key={index} 
                index={index} 
                heartScene={heart.scene}
            />
        )), [heart.scene]
    )
    
    return <>{heartInstances}</>
})