/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSavedSearches } from '../../hooks/useSavedSearches'

export default function SavedSearchesMenu() {
  const { savedSearches, deleteSearch, saveSearch } = useSavedSearches()
  const [open, setOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const getPathname = () => (typeof window !== 'undefined' ? window.location.pathname : '/')
  const getSearch = () => (typeof window !== 'undefined' ? window.location.search || '' : '')
  const getOrigin = () => (typeof window !== 'undefined' ? window.location.origin : '')

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

  const copyToClipboard = async (text: string, key: string) => {
    try {
      const full = text.startsWith('http') ? text : `${getOrigin()}${text}`
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(full)
      } else if (typeof document !== 'undefined') {
        const ta = document.createElement('textarea')
        ta.value = full
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1200)
    } catch {
      // noop
    }
  }

  const defaultOperationForPath = (pathname: string) => {
    if (pathname.startsWith('/alquilar')) return 'alquiler'
    if (pathname.startsWith('/invertir')) return 'inversion'
    return 'compra'
  }

  const clearFiltersHref = () => {
    const pathname = getPathname()
    const params = new URLSearchParams()
    // Mantener operation por página para consistencia
    const op = defaultOperationForPath(pathname)
    if (pathname.startsWith('/comprar')) params.set('operation', 'compra')
    else if (pathname.startsWith('/alquilar')) params.set('operation', 'alquiler')
    else if (pathname.startsWith('/invertir')) params.set('operation', 'inversion')
    else if (pathname.startsWith('/map')) params.set('operation', op)
    return `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
  }

  const openNearMe = () => {
    if (typeof window === 'undefined') return
    if (!('geolocation' in navigator)) return

    const current = new URLSearchParams(getSearch())
    // No mandamos center/zoom al backend, pero sí para posicionar el mapa
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        current.set('center', `${longitude.toFixed(6)},${latitude.toFixed(6)}`)
        current.set('zoom', '12')
        current.delete('selected')
        // Si ya estamos en /map, evitar recarga: emitir evento para centrar el mapa
        if (getPathname().startsWith('/map')) {
          window.dispatchEvent(
            new CustomEvent('habitatpro:map-center', {
              detail: { lng: longitude, lat: latitude, zoom: 12 },
            })
          )
          // Actualizar URL (shareable)
          try {
            const url = new URL(window.location.href)
            url.searchParams.set('center', `${longitude.toFixed(6)},${latitude.toFixed(6)}`)
            url.searchParams.set('zoom', '12')
            url.searchParams.delete('selected')
            window.history.replaceState({}, '', url.toString())
          } catch {
            // noop
          }
          return
        }

        window.location.href = `/map?${current.toString()}`
      },
      () => {
        // Si falla permisos/timeout, no hacemos nada
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    )
  }

  const saveCurrentArea = () => {
    if (typeof window === 'undefined') return
    try {
      // Guardar exactamente la vista actual del mapa (incluye center/zoom/bbox/filtros)
      const href = `/map${window.location.search || ''}`
      const qs = new URLSearchParams(window.location.search || '')
      const op = qs.get('operation') || defaultOperationForPath(getPathname())
      const parts: string[] = []
      if (qs.get('location')) parts.push(String(qs.get('location')))
      if (qs.get('max_price')) parts.push(`<=${qs.get('max_price')}`)
      if (qs.get('min_price')) parts.push(`>=${qs.get('min_price')}`)
      if (qs.get('bedrooms')) parts.push(`${qs.get('bedrooms')}+ hab`)
      if (qs.get('bathrooms')) parts.push(`${qs.get('bathrooms')}+ baños`)
      const suffix = parts.length ? ` • ${parts.join(' ')}` : ''
      saveSearch({
        name: `Área actual (${op})${suffix}`,
        href,
      })
    } catch {
      // noop
    }
  }

  const buildPresets = (pathname: string): Array<{ name: string; href: string }> => {
    // Presets contextuales para que “encajen” con la pantalla actual
    if (pathname.startsWith('/alquilar')) {
      return [
        {
          name: 'Alquilar: Punta Cana (2+ hab, < 1500)',
          href: '/alquilar?operation=alquiler&location=Punta%20Cana&max_price=1500&bedrooms=2',
        },
        {
          name: 'Alquilar: Santo Domingo (1+ hab, < 900)',
          href: '/alquilar?operation=alquiler&location=Santo%20Domingo&max_price=900&bedrooms=1',
        },
      ]
    }
    if (pathname.startsWith('/invertir')) {
      return [
        {
          name: 'Inversión: Punta Cana < 350k',
          href: '/invertir?operation=inversion&location=Punta%20Cana&max_price=350000',
        },
        {
          name: 'Inversión: Santo Domingo < 250k',
          href: '/invertir?operation=inversion&location=Santo%20Domingo&max_price=250000',
        },
      ]
    }
    if (pathname.startsWith('/map')) {
      // En mapa, usar presets que abren mapa directamente
      return [
        {
          name: 'Mapa: Comprar (vista actual / bbox)',
          href: `/map${getSearch() || '?operation=compra'}`,
        },
        {
          name: 'Mapa: Lujo (>=500k)',
          href: '/map?operation=compra&min_price=500000&zoom=11',
        },
      ]
    }
    // Default: comprar
    return [
      {
        name: 'Comprar: Santo Domingo < 300k (2+ hab)',
        href: '/comprar?operation=compra&location=Santo%20Domingo&max_price=300000&bedrooms=2',
      },
      {
        name: 'Comprar: Punta Cana >= 500k',
        href: '/comprar?operation=compra&location=Punta%20Cana&min_price=500000',
      },
      {
        name: 'Lujo: 3+ baños, > 500k',
        href: '/comprar?operation=compra&min_price=500000&bathrooms=3',
      },
    ]
  }

  const PRESETS = buildPresets(getPathname())

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

          {/* Acciones rápidas contextuales */}
          <div className="p-3 border-b bg-white">
            <div className="flex items-center gap-2">
              <Link
                href={clearFiltersHref()}
                className="text-xs font-semibold text-gray-700 hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Limpiar filtros
              </Link>
              {getPathname().startsWith('/map') ? (
                <button
                  onClick={() => {
                    saveCurrentArea()
                    setOpen(false)
                  }}
                  className="text-xs font-semibold text-gray-700 hover:text-gray-900"
                  title="Guarda la vista actual (bbox/center/zoom)"
                >
                  Guardar área
                </button>
              ) : null}
              <button
                onClick={() => {
                  setOpen(false)
                  openNearMe()
                }}
                className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-800"
                title="Centra el mapa en tu ubicación"
              >
                Cerca de mí
              </button>
            </div>
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
                      onClick={() => copyToClipboard(p.href, `preset:${p.href}`)}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900"
                      title="Copiar link"
                    >
                      {copiedKey === `preset:${p.href}` ? 'Copiado' : 'Copiar'}
                    </button>
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
                        <button
                          onClick={() => copyToClipboard(s.href, `saved:${s.id}`)}
                          className="ml-3 inline-flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
                          title="Copiar link"
                        >
                          {copiedKey === `saved:${s.id}` ? 'Copiado' : 'Copiar'}
                        </button>
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

