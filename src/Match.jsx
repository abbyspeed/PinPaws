import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  
  // Track used names and bios globally
  const usedNames = useRef([])
  const usedBios = useRef([])

  // Update cards when API data loads
  useEffect(() => {
    if (apiCats.length > 0) {
      // Reset tracking arrays when new data loads
      usedNames.current = []
      usedBios.current = []
      
      // Generate unique cards
      const uniqueCards = apiCats.map((cat, index) => 
        generateUniqueCard(cat, index, usedNames.current, usedBios.current)
      )
      
      setCards(uniqueCards)
      setInitialCards(uniqueCards)
    }
  }, [apiCats])

  // Memoized audio play function to prevent recreation
  const playMeowSound = useCallback(() => {
    try {
      const audio = new Audio('/audio/meow.mp3')
      audio.volume = 1
      audio.play().catch(() => {
        // Silently handle audio play failures
      })
    } catch (err) {
      // Silently handle audio creation failures
    }
  }, [])

  const handleSwipe = useCallback((cardId, direction) => {
    const swipedCard = cards.find(card => card.id === cardId)
    
    // Track right-swiped cats for the gallery
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

  // Show Summary if requested
  if (showSummary) {
    return <Summary rightSwipedCats={rightSwipedCats} />
  }

  // Show loading state
  if (loading) {
    return (
      <div className="match-container" style={{ backgroundColor: bgColor }}>
        <div className="loading-message">Loading cats...</div>
      </div>
    )
  }

  // Show error state but still render if we have fallback data
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
      {/* Show cards only if there are cards remaining */}
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

      {/* Summary Button - show after all initial cards are swiped */}
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