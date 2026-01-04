/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSavedSearches } from '../../hooks/useSavedSearches'

export default function SavedSearchesMenu() {
  const { savedSearches, deleteSearch } = useSavedSearches()
  const [open, setOpen] = useState(false)

  const toMapHref = (href: string) => {
    try {
      const u = new URL(href, 'http://local')
      u.pathname = '/map'
      return `${u.pathname}${u.search}`
    } catch {
      // Si viene malformado, al menos intenta abrir el mapa
      return '/map'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
      >
        ⭐ Búsquedas ({savedSearches.length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold text-sm">Búsquedas guardadas</div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-800">
              Cerrar
            </button>
          </div>

          {savedSearches.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">Aún no tienes búsquedas guardadas.</div>
          ) : (
            <div className="max-h-80 overflow-auto">
              {savedSearches
                .slice()
                .reverse()
                .map((s) => (
                  <div key={s.id} className="p-3 border-b last:border-b-0 flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.name}</div>
                      <div className="text-xs text-gray-500 truncate">{s.href}</div>
                      <div className="mt-2">
                        <Link
                          href={s.href}
                          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
                          onClick={() => setOpen(false)}
                        >
                          Abrir →
                        </Link>
                        <Link
                          href={toMapHref(s.href)}
                          className="ml-3 inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                          onClick={() => setOpen(false)}
                        >
                          Mapa →
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSearch(s.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

