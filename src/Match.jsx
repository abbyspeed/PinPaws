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
  
  const usedNames = useRef([])
  const usedBios = useRef([])

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
    try {
      const audio = new Audio('./audio/meow.mp3')
      audio.volume = 1
      audio.play().catch(() => {
        // console.log('Failed to play meow sound')
      })
    } catch (err) {
      // console.error('Error playing meow sound:', err)
    }
  }, [])

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