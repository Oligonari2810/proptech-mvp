'use client'
import { useState } from 'react'
import { useSavedSearches } from '../hooks/useSavedSearches'

interface SaveSearchButtonProps {
  href: string
  defaultName?: string
}

export const SaveSearchButton = ({ href, defaultName }: SaveSearchButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchName, setSearchName] = useState(defaultName || '')
  const { saveSearch } = useSavedSearches()

  const handleSave = () => {
    if (!searchName.trim()) return
    
    saveSearch({
      name: searchName,
      href
    })
    
    setSearchName('')
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        💾 Guardar Búsqueda
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Guardar Búsqueda</h3>
            <input
              type="text"
              placeholder="Nombre de la búsqueda..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!searchName.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
