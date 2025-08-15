import { useState, useEffect, useRef, useCallback } from 'react'
import Card from './components/Card.jsx'
import Summary from './Summary.jsx'
import Copyright from './components/Copyright.jsx'
import { useCatsData } from './services/CatService.jsx'
import { generateUniqueCard } from './utils/catUtility.js'
import './styles/Match.css'

export default function Match() {
  const { cats: apiCats, loading, error } = useCatsData()
  const [cards, setCards] = useState([])
  const [swipedCards, setSwipedCards] = useState([])
  const [rightSwipedCats, setRightSwipedCats] = useState([])
  const [initialCards, setInitialCards] = useState([])
  const [bgColor, setBgColor] = useState('#ffffff')
  const [showSummary, setShowSummary] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  
  const usedNames = useRef([])
  const usedBios = useRef([])
  const audioRef = useRef(null)

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      try {
        audioRef.current = new Audio('./audio/meow.mp3')
        audioRef.current.volume = 0.7
        audioRef.current.preload = 'auto'
        // Preload the audio for mobile
        audioRef.current.load()
        setAudioEnabled(true)
      } catch (err) {
        console.warn('Audio initialization failed:', err)
      }
    }

    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('click', handleFirstInteraction)
    }

    document.addEventListener('touchstart', handleFirstInteraction, { once: true })
    document.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    if (apiCats.length > 0) {
      usedNames.current = []
      usedBios.current = []
      
      const uniqueCards = apiCats.map((cat, index) => 
        generateUniqueCard(cat, index, usedNames.current, usedBios.current)
      )
      
      setCards(uniqueCards)
      setInitialCards(uniqueCards)
    }
  }, [apiCats])

  const playMeowSound = useCallback(() => {
    if (!audioEnabled || !audioRef.current) return
    
    try {
      // Reset audio to beginning for rapid succession
      audioRef.current.currentTime = 0
      
      // For mobile compatibility
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Audio play failed:', err)
          // Try creating a new audio instance as fallback
          try {
            const fallbackAudio = new Audio('./audio/meow.mp3')
            fallbackAudio.volume = 0.7
            fallbackAudio.play().catch(() => {
              // Silent fail for better UX
            })
          } catch (fallbackErr) {
            // Silent fail
          }
        })
      }
    } catch (err) {
      console.warn('Error playing meow sound:', err)
    }
  }, [audioEnabled])

  const handleSwipe = useCallback((cardId, direction) => {
    const swipedCard = cards.find(card => card.id === cardId)
    
    if (direction > 0 && swipedCard) {
      setRightSwipedCats(prev => [...prev, swipedCard])
      playMeowSound()
    }
    
    setCards(prev => prev.filter(card => card.id !== cardId))
    setSwipedCards(prev => [...prev, { id: cardId, direction }])
  }, [cards, playMeowSound])

  const handleBackgroundChange = useCallback((color) => {
    setBgColor(color)
  }, [])

  const handleShowSummary = useCallback(() => {
    setShowSummary(true)
  }, [])

  if (showSummary) {
    return <Summary rightSwipedCats={rightSwipedCats} />
  }

  if (loading) {
    return (
      <div className="match-container" style={{ backgroundColor: bgColor }}>
        <div className="loading-message">Loading cats...</div>
      </div>
    )
  }

  if (error && cards.length === 0) {
    return (
      <div className="match-container" style={{ backgroundColor: bgColor }}>
        <div className="error-message">
          <p>Oops! Having trouble loading cats 🙀</p>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  const isComplete = swipedCards.length >= initialCards.length && initialCards.length > 0

  return (
    <div className="match-container" style={{ backgroundColor: bgColor }}>
      {/* Swipe Instructions */}
      {cards.length > 0 && (
        <div className="swipe-instructions" style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#333',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✖️</span>
          <span style={{ margin: '0 5px' }}>Swipe your kitty</span>
          <span>❤️</span>
        </div>
      )}

      {cards.length > 0 && (
        <div className="cards-stack">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              index={index}
              isTop={index === 0}
              onSwipe={handleSwipe}
              onBackgroundChange={handleBackgroundChange}
            />
          )).reverse()}
        </div>
      )}

      {isComplete && (
        <div className="match-complete">
          <h2>All cats have been reviewed! 🐾</h2>
          <button 
            className="summary-button"
            onClick={handleShowSummary}
          >
            View Matches
          </button>
        </div>
      )}

      <Copyright bgColor={bgColor} />
    </div>
  )
}