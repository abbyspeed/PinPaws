import { useState, useEffect } from 'react'
import { generateUniqueCard } from '../utils/catUtility.js'

export const useCatsData = () => {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://cataas.com/api/cats?limit=10')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const catsData = await response.json()
        
        // Track used names and bios to prevent repeats
        const usedNames = []
        const usedBios = []
        
        const transformedCats = catsData.map((cat, index) => {
          return generateUniqueCard(cat, index, usedNames, usedBios)
        })
        
        setCats(transformedCats)
        setError(null)
      } catch (err) {
        console.error('Error fetching cats:', err)
        setError(err.message)
        setCats([])
      } finally {
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  return { cats, loading, error, refetch: () => window.location.reload() }
}