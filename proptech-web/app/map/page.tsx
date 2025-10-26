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
    // Cargar propiedades desde el backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    fetch(`${backendUrl}/api/properties`)
      .then(res => res.json())
      .then(data => setProperties(data.properties || []))
      .catch(err => console.error('Error loading properties:', err));
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

    const initMap = () => {
      if (typeof window !== 'undefined' && window.mapboxgl) {
        window.mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ';
        
        const map = new window.mapboxgl.Map({
          container: 'map-container',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-3.7038, 40.4168], // Madrid
          zoom: 12
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