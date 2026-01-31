'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('room-favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('[v0] Failed to parse favorites:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('room-favorites', JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    )
  }

  const isFavorite = (roomId: string) => favorites.includes(roomId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  }
}
