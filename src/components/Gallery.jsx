import React, { useState, useMemo } from 'react'
import { getCatImageUrl, createImageLoadHandlers } from '../utils/catUtility.js'
import '../styles/gallery.css'

export default function Gallery({ rightSwipedCats = [] }) {
  const [loadingImages, setLoadingImages] = useState({})

  const galleryItems = useMemo(() => {
    return rightSwipedCats.map((cat) => {
      const imageHandlers = createImageLoadHandlers(setLoadingImages, cat.id)
      
      return (
        <div key={cat.id} className="gallery-item">
          <div className="gallery-image-container">
            {loadingImages[cat.id] && (
              <div className="gallery-image-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
            <img 
              src={getCatImageUrl(cat.id)}
              alt={cat.name}
              className="gallery-image"
              {...imageHandlers}
            />
            <div className="gallery-image-fallback">
              🐱
            </div>
          </div>
          
          <div className="gallery-info">
            <h3 style={{ color: cat.color }}>{cat.name}</h3>
            <p>{cat.age} years old</p>
            <p className="gallery-bio">{cat.bio}</p>
            
            {cat.tags && cat.tags.length > 0 && (
              <div className="gallery-tags">
                {cat.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index} 
                    className="gallery-tag"
                    style={{ background: cat.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    })
  }, [rightSwipedCats, loadingImages])

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Your Matches</h2>
        <p>You liked {rightSwipedCats.length} cats, how do you feel?</p>
      </div>
      
      <div className="gallery-grid">
        {rightSwipedCats.length === 0 ? (
          <div className="no-matches">
            <p>No matches yet!</p>
            <p>Swipe better on the cats you like next time</p>
          </div>
        ) : (
          galleryItems
        )}
      </div>
    </div>
  )
}
