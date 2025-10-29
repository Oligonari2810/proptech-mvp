'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  propertyId: number
  userId?: number
  className?: string
}

export default function FavoriteButton({ propertyId, userId, className }: FavoriteButtonProps) {
  const { isFavorites, toggleFavorite, loading } = useFavorites(userId)
  const isFavorite = isFavorites(propertyId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(propertyId)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`transition-all duration-200 ${className || ''}`}
      aria-label={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        size={24}
        className={`${
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        } transition-all duration-200`}
      />
    </button>
  )
}

