import './styles/style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import Core from './Core.jsx'
import Match from './Match.jsx'
import Copyright from './components/Copyright.jsx'

function App() {
    const [showMatch, setShowMatch] = useState(false)

    const handleLearnMore = () => {
        setShowMatch(true)
    }

    if (showMatch) {
        return <Match />
    }

    return (
        <>
            <Canvas
                shadows
                camera={ {
                    fov: 30,
                    near: 0.1,
                    far: 200,
                    position: [ - 4, 1, 6 ]
                } }
            >
                <Core onLearnMore={handleLearnMore} />
            </Canvas>
            <Copyright />
        </>
    )
}

const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<App />)