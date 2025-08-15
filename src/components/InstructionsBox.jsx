import { Html } from '@react-three/drei'
import '../styles/InstructionsBox.css'

const InstructionsBox = ({ 
    text, 
    text2, 
    link, 
    btnText,
    position,
    use3D = false,
    onButtonClick
}) => {
    const handleButtonClick = (e) => {
        e.preventDefault()
        if (onButtonClick) {
            onButtonClick()
        } else if (link) {
            window.open(link, '_blank', 'noopener,noreferrer')
        }
    }

    const content = (
        <div className="instructions-box">
            <p>{text}</p>
            {text2 && <p>{text2}</p>}
            <button 
                onClick={handleButtonClick}
                className="btn btn-primary"
            >
                {btnText}
            </button>
        </div>
    )

    if (use3D) {
        return (
            <Html
                position={[
                    position[0],
                    position[1], 
                    position[2]
                ]}
                center
                distanceFactor={5}
                occlude
                style={{
                    pointerEvents: 'auto',
                    userSelect: 'none'
                }}
            >
                {content}
            </Html>
        )
    }

    return content
}

export default InstructionsBox