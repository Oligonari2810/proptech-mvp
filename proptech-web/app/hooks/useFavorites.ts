// hooks/useFavorites.ts
// Hook personalizado para manejo de favoritos usando NextAuth

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { addFavorite as addFavoriteAPI, removeFavorite as removeFavoriteAPI, getFavorites as getFavoritesAPI } from '../lib/favoritesAPI'

export function useFavorites() {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const rawId = (session?.user as any)?.id
  const userId = rawId ? parseInt(String(rawId)) : undefined

  useEffect(() => {
    if (userId) {
      loadFavorites()
    }
  }, [userId])

  const loadFavorites = async () => {
    if (!userId) return
    
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
    // Verificar autenticación con NextAuth
    if (!session) {
      const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/'
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`)
      return
    }

    if (!userId) {
      console.error('No user ID available')
      return
    }

    const isFav = favorites.includes(propertyId)
    
    try {
      if (isFav) {
        await removeFavoriteAPI(propertyId, userId)
        setFavorites(favorites.filter(id => id !== propertyId))
      } else {
        await addFavoriteAPI(propertyId, userId)
        setFavorites([...favorites, propertyId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const isFavorite = (propertyId: number) => favorites.includes(propertyId)

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite
  }
}

