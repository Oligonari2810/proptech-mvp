// hooks/useFavorites.ts
// Hook personalizado para manejo de favoritos

import { useState, useEffect } from 'react'
import { addFavorite as addFavoriteAPI, removeFavorite as removeFavoriteAPI, getFavorites as getFavoritesAPI } from '../lib/favoritesAPI'

export function useFavorites(userId?: number) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFavorites()
  }, [userId])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const favs = await getFavoritesAPI(userId)
      setFavorites(favs.map((f: any) => f.property_id))
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (propertyId: number) => {
    const isFav = favorites.includes(propertyId)
    
    if (isFav) {
      await removeFavoriteAPI(propertyId, userId)
      setFavorites(favorites.filter(id => id !== propertyId))
    } else {
      await addFavoriteAPI(propertyId, userId)
      setFavorites([...favorites, propertyId])
    }
  }

  const isFavorites = (propertyId: number) => favorites.includes(propertyId)

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorites
  }
}

