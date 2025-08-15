import { CAT_NAMES, CAT_BIOS, CAT_COLORS } from '../data/catData.js'

// Random selection utilities
export const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)]
export const getRandomAge = () => Math.floor(Math.random() * 8) + 1
export const getColorByIndex = (index) => CAT_COLORS[index % CAT_COLORS.length]

// Utility function to get a random item without repeating
export const getUniqueRandomItem = (array, usedItems) => {
  const availableItems = array.filter(item => !usedItems.includes(item))
  if (availableItems.length === 0) {
    // If all items have been used, reset and start over
    usedItems.length = 0
    return array[Math.floor(Math.random() * array.length)]
  }
  return availableItems[Math.floor(Math.random() * availableItems.length)]
}

// Function to generate unique cat data
export const generateUniqueCard = (cat, index, usedNames, usedBios) => {
  const name = getUniqueRandomItem(CAT_NAMES, usedNames)
  const bio = getUniqueRandomItem(CAT_BIOS, usedBios)
  
  usedNames.push(name)
  usedBios.push(bio)
  
  return {
    ...cat,
    name: name,
    bio: bio,
    age: getRandomAge(),
    color: getColorByIndex(index)
  }
}

// Image ID utility for consistent image URLs
export const getImageId = (catId) => {
  return typeof catId === 'string' 
    ? catId.slice(-10)
    : catId.toString()
}

// Generate cat image URL with default dimensions optimized for performance
export const getCatImageUrl = (catId, width = 400, height = 320) => {
  const imageId = getImageId(catId)
  return `https://cataas.com/cat?width=${width}&height=${height}&id=${imageId}`
}

// Optimized image loading utilities
export const createImageLoadHandlers = (setLoadingState, catId) => {
  return {
    onLoadStart: () => setLoadingState(prev => ({ ...prev, [catId]: true })),
    onLoad: () => setLoadingState(prev => ({ ...prev, [catId]: false })),
    onError: (e) => {
      setLoadingState(prev => ({ ...prev, [catId]: false }))
      // Hide broken image and show fallback
      const target = e.target
      const fallback = target.nextSibling?.nextSibling
      if (target) target.style.display = 'none'
      if (fallback) fallback.style.display = 'flex'
    }
  }
}

// Single image loading handlers (for Card component)
export const createSingleImageLoadHandlers = (setImageLoading) => {
  return {
    onLoad: () => setImageLoading(false),
    onError: (e) => {
      setImageLoading(false)
      // Hide broken image and show fallback
      const target = e.target
      const fallback = target.nextSibling
      if (target) target.style.display = 'none'
      if (fallback) fallback.style.display = 'flex'
    }
  }
}
