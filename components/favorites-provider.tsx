'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (roomId: string) => void
  isFavorite: (roomId: string) => boolean
  isLoaded: boolean
  count: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('room-favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('room-favorites', JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (roomId: string) => {
    // Check authentication
    const token = localStorage.getItem('auth_token')
    if (!token) {
      if (confirm('Bạn cần đăng nhập để thêm vào danh sách yêu thích. Đăng nhập ngay?')) {
        router.push('/auth/login')
      }
      return
    }

    setFavorites((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    )
  }

  const isFavorite = (roomId: string) => favorites.includes(roomId)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isLoaded,
        count: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
