'use client'
import { useState, useEffect } from 'react'

export interface SavedSearch {
  id: string
  name: string
  filters: {
    priceRange?: [number, number]
    bedrooms?: number
    location?: string
    propertyType?: string
  }
  createdAt: Date
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('habitatpro-saved-searches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
  }, [])

  const saveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date()
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
