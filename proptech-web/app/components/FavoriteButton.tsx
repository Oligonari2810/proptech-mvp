'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  propertyId: number
  userId?: number  // Mantener para compatibilidad, pero ya no se usa
  className?: string
}

export default function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loading } = useFavorites()
  const isCurrentlyFavorite = isFavorite(propertyId)

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
      aria-label={isCurrentlyFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        size={24}
        className={`${
          isCurrentlyFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        } transition-all duration-200`}
      />
    </button>
  )
}

