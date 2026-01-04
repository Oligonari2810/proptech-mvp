'use client'

import { useState, useEffect } from 'react'

export interface Property {
  id: number
  title: string
  description: string
  price: number
  type: string
  operation: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  features: string[]
  emotional_tags: string[]
  images: string[]
  created_at: string
}

export interface UserPreferences {
  max_price?: number
  min_bedrooms?: number
  preferred_area?: number
  location?: string
}

export interface EmotionalProfile {
  family_friendly?: number
  luxury_preference?: number
  modern_style?: number
  investment_focus?: number
}

export interface AIRecommendation {
  user_profile: {
    preferences: UserPreferences
    emotional_profile: EmotionalProfile
  }
  filters: Record<string, string | number>
}

export function useProperties(operation: string = 'compra', filters: Record<string, string | number | string[]> = {}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const queryParams = new URLSearchParams({
          operation,
          ...filters
        }).toString()

        // Usar proxy interno (evita CORS en Vercel/preview)
        const response = await fetch(`/api/backend/api/properties?${queryParams}`, { cache: "no-store" })
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        
        if (data.success) {
          setProperties(data.properties)
        } else {
          throw new Error(data.error || 'Error al cargar propiedades')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión')
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [operation, filters])

  return { properties, loading, error }
}

export function useAIRecommendations(userProfile: AIRecommendation['user_profile'] | null, filters: Record<string, string | number> = {}) {
  const [recommendations, setRecommendations] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = async () => {
    if (!userProfile) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Usar proxy interno (evita CORS en Vercel/preview)
      const response = await fetch('/api/backend/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: userProfile,
          filters: filters
        })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.recommendations)
      } else {
        throw new Error(data.error || 'Error en recomendaciones de IA')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con IA')
      console.error('Error getting AI recommendations:', err)
    } finally {
      setLoading(false)
    }
  }

  return { recommendations, loading, error, getRecommendations }
}
