'use client'
import { useState, useEffect } from 'react'

export interface SavedSearch {
  id: string
  name: string
  // Fuente de verdad: link con query params (compartible)
  href: string
  // Legacy (compatibilidad): algunos componentes antiguos guardaban filtros estructurados
  filters?: {
    priceRange?: [number, number]
    bedrooms?: number
    location?: string
    propertyType?: string
  }
  createdAt: string
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('habitatpro-saved-searches')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedSearch[]
        // Normalizar createdAt (string) y filtrar entradas inválidas
        const normalized = (Array.isArray(parsed) ? parsed : []).filter((x) => x && typeof x.href === 'string' && x.href.length > 0)
        setSavedSearches(normalized)
      } catch {
        setSavedSearches([])
      }
    }
  }, [])

  const saveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    const updatedSearches = [...savedSearches, newSearch]
    setSavedSearches(updatedSearches)
    localStorage.setItem('habitatpro-saved-searches', JSON.stringify(updatedSearches))
  }

  const deleteSearch = (id: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id)
    setSavedSearches(updatedSearches)
    localStorage.setItem('habitatpro-saved-searches', JSON.stringify(updatedSearches))
  }

  return {
    savedSearches,
    saveSearch,
    deleteSearch
  }
}
