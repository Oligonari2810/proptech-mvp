// lib/favoritesAPI.ts
// Servicio para manejo de propiedades favoritas

export interface FavoriteData {
  property_id: number
  user_id: number
  notes?: string
  created_at?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com'

/**
 * Agregar propiedad a favoritos
 */
export async function addFavorite(propertyId: number, userId?: number): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const response = await fetch(`${BACKEND_URL}/api/favorites`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        property_id: propertyId,
        user_id: userId
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Error adding favorite:', error)
    return false
  }
}

/**
 * Remover propiedad de favoritos
 */
export async function removeFavorite(propertyId: number, userId?: number): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/favorites/${propertyId}`, {
      method: 'DELETE',
    })

    return response.ok
  } catch (error) {
    console.error('Error removing favorite:', error)
    return false
  }
}

/**
 * Obtener propiedades favoritas del usuario
 */
export async function getFavorites(userId?: number): Promise<any[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/favorites?user_id=${userId || ''}`)
    
    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.favorites || []
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
}

/**
 * Verificar si una propiedad está en favoritos
 */
export async function isFavorite(propertyId: number, userId?: number): Promise<boolean> {
  try {
    const favorites = await getFavorites(userId)
    return favorites.some((f: any) => f.property_id === propertyId)
  } catch (error) {
    return false
  }
}

