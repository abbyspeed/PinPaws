import { useThree } from '@react-three/fiber'
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import * as THREE from 'three'

export default forwardRef(function BgAudio({ startMusic = false, volume = 0.5 }, ref) {
    const { camera } = useThree()
    const soundRef = useRef(null)
    const listenerRef = useRef(null)
    const isInitialized = useRef(false)
    const [audioReady, setAudioReady] = useState(false)
    
    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        context: listenerRef.current?.context,
        stop: () => {
            if (soundRef.current && soundRef.current.isPlaying) {
                soundRef.current.stop()
            }
        }
    }), [])
    
    useEffect(() => {
        if (isInitialized.current) return
        
        isInitialized.current = true
        const listener = new THREE.AudioListener()
        listenerRef.current = listener
        
        camera.add(listener)
        console.log('AudioListener added to camera')
        
        const sound = new THREE.Audio(listener)
        soundRef.current = sound

        const audioLoader = new THREE.AudioLoader()
        audioLoader.load('/audio/lounge.mp3', 
            (buffer) => {
                console.log('Three.js audio loaded successfully')
                sound.setBuffer(buffer)
                sound.setLoop(true)
                sound.setVolume(volume)
                setAudioReady(true) // Mark audio as ready
                console.log('Audio buffer set and ready to play')
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Audio loading failed:', error)
            }
        )
        
        return () => {
            if (soundRef.current && soundRef.current.isPlaying) {
                soundRef.current.stop()
            }
            if (listenerRef.current && camera) {
                camera.remove(listenerRef.current)
            }
            console.log('Audio cleaned up')
            isInitialized.current = false
        };
    }, [camera, volume])
    
    // Start music when startMusic prop becomes true AND audio is ready
    useEffect(() => {
        if (startMusic && audioReady && soundRef.current && soundRef.current.buffer) {
            console.log('Starting music - audio is ready and buffer available')
            
            if (soundRef.current.isPlaying) {
                soundRef.current.stop()
                console.log('Stopped existing audio')
            }
            
            setTimeout(() => {
                if (listenerRef.current && listenerRef.current.context) {
                    console.log('Audio context state:', listenerRef.current.context.state)
                    
                    if (listenerRef.current.context.state === 'suspended') {
                        listenerRef.current.context.resume().then(() => {
                            console.log('Audio context resumed')
                            soundRef.current.play()
                            console.log('Three.js audio started after resume')
                        }).catch(err => {
                            console.error('Failed to resume audio context:', err)
                        })
                    } else {
                        soundRef.current.play()
                        console.log('Three.js audio started directly')
                    }
                } else {
                    console.error('No audio context available')
                }
            }, 100)
        } else if (startMusic && !audioReady) {
            console.log('Music requested but audio not ready yet')
        }
    }, [startMusic, audioReady])
    
    return null
})