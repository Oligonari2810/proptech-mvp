"use client";
import { useState, useEffect } from "react";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  area?: number;
  square_meters?: number;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const load = async () => {
      try {
        const res = await fetch(`/api/properties-proxy`, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.properties || []);
        setProperties(list);
      } catch (err) {
        console.error('Error loading properties:', err);
        // Fallback de demostración para no bloquear la vista
        setProperties([
          { id: 'demo-1', title: 'Propiedad Demo', price: 250000, location: 'Santo Domingo', latitude: 18.4861, longitude: -69.9312 },
        ] as any);
      } finally {
        clearTimeout(timeout);
      }
    };
    load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Cargar MapBox con credenciales reales
    const loadMapbox = () => {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        // Inicializar mapa después de cargar
        setTimeout(() => {
          initMap();
        }, 100);
      };
      document.head.appendChild(script);
    };

    const initMap = async () => {
      if (typeof window !== 'undefined' && (window as any).mapboxgl) {
        // Usar token directamente (este componente carga Mapbox manualmente)
        const token = (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string) || 
                      'pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzOTgwZDAwY241MmtwbHJ6aWFsazIxIn0.-k_hECMvvQyjKCgqHbQHAA';
        
        console.log('🔍 Mapbox Token Debug:', {
          token_present: !!token,
          token_valid: token?.startsWith('pk.') && token.length > 20,
          token_prefix: token?.substring(0, 10),
          mapboxgl_available: !!(window as any).mapboxgl
        });
        
        if (!token || !token.startsWith('pk.') || token.length < 20) {
          console.error('❌ Token Mapbox inválido');
          return;
        }
        
        (window as any).mapboxgl.accessToken = token;
        
        try {
          const map = new (window as any).mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-69.9312, 18.4861], // República Dominicana (corregido)
            zoom: 10
          });
          
          map.on('error', (e: any) => {
            console.error('❌ Error Mapbox en /map:', e);
            console.error('Error details:', {
              message: e.error?.message || e.message,
              code: e.error?.statusCode || 'N/A'
            });
          });
          
          map.on('load', () => {
            console.log('✅ Mapbox cargado en /map');
          });

        map.on('load', () => {
          setMapLoaded(true);
          
          // Agregar marcadores para cada propiedad
          properties.forEach((property: Property) => {
            if (property.lat && property.lng) {
              const marker = new window.mapboxgl.Marker()
                .setLngLat([property.lng, property.lat])
                .addTo(map);
              
              // Popup con información de la propiedad
              const popup = new window.mapboxgl.Popup()
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${property.title}</h3>
                    <p class="text-sm text-gray-600">${property.location}</p>
                    <p class="text-lg font-bold text-blue-600">€${property.price?.toLocaleString() || 'N/A'}</p>
                    <button onclick="selectProperty('${property.id}')" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
                      Ver detalles
                    </button>
                  </div>
                `);
              
              marker.setPopup(popup);
            }
          });
        });
        } catch (error) {
          console.error('❌ Error creando mapa:', error);
        }
      } else {
        console.error('❌ mapboxgl no disponible en window');
      }
    };

    loadMapbox();
  }, [properties]);

  // Función global para seleccionar propiedad
  useEffect(() => {
    (window as unknown as Record<string, unknown>).selectProperty = (propertyId: string) => {
      const property = properties.find((p: Property) => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    };
  }, [properties]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-ink-900">Mapa de Propiedades</h1>
        <p className="text-ink-600">Explora propiedades en el mapa interactivo con MapBox</p>
        <div className="mt-2 text-sm text-gray-500">
          {properties.length} propiedades cargadas • {mapLoaded ? 'Mapa cargado' : 'Cargando mapa...'}
        </div>
      </div>

      {/* Mapa y Panel */}
      <div className="flex-1 flex">
        {/* Mapa */}
        <div className="flex-1">
          <div 
            id="map-container" 
            className="h-full w-full"
            style={{ minHeight: '400px' }}
          >
            {!mapLoaded && (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando mapa interactivo...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral de propiedades */}
        {selectedProperty && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-bold text-lg mb-2">{selectedProperty.title}</h3>
            <p className="text-gray-600 mb-2">{selectedProperty.location}</p>
            <p className="text-brand-500 font-bold text-xl">€{selectedProperty.price?.toLocaleString() || 'N/A'}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Dormitorios:</span>
                <span className="font-semibold">{selectedProperty.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Área:</span>
                <span className="font-semibold">{selectedProperty.area || selectedProperty.square_meters || 'N/A'} m²</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedProperty(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cerrar detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}