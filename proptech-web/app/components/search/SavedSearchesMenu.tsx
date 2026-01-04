/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSavedSearches } from '../../hooks/useSavedSearches'

export default function SavedSearchesMenu() {
  const { savedSearches, deleteSearch, saveSearch } = useSavedSearches()
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

  const PRESETS: Array<{ name: string; href: string }> = [
    {
      name: 'Comprar: Santo Domingo < 300k (2+ hab)',
      href: '/comprar?operation=compra&location=Santo%20Domingo&max_price=300000&bedrooms=2',
    },
    {
      name: 'Alquilar: Punta Cana (2+ hab, < 1500)',
      href: '/alquilar?operation=alquiler&location=Punta%20Cana&max_price=1500&bedrooms=2',
    },
    {
      name: 'Inversión: Punta Cana < 350k',
      href: '/invertir?operation=inversion&location=Punta%20Cana&max_price=350000',
    },
    {
      name: 'Lujo: 3+ baños, > 500k',
      href: '/comprar?operation=compra&min_price=500000&bathrooms=3',
    },
  ]

  const savePreset = (preset: { name: string; href: string }) => {
    try {
      saveSearch({ name: preset.name, href: preset.href })
    } catch {
      // noop
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

          {/* Presets aprobados (one-click) */}
          <div className="p-3 border-b bg-gray-50">
            <div className="text-xs font-semibold text-gray-700 mb-2">Presets</div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <div key={p.href} className="bg-white border rounded-lg p-2">
                  <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={p.href}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      onClick={() => setOpen(false)}
                    >
                      Abrir →
                    </Link>
                    <Link
                      href={toMapHref(p.href)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                      onClick={() => setOpen(false)}
                    >
                      Mapa →
                    </Link>
                    <button
                      onClick={() => savePreset(p)}
                      className="ml-auto text-xs font-semibold text-gray-700 hover:text-gray-900"
                      title="Guardar preset"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

