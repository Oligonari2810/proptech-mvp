"use client";
import { useState, useEffect, useRef } from "react";
import { getMapboxToken, isValidMapboxToken } from "../lib/mapboxConfig";
import type MapboxGL from "mapbox-gl";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  area?: number;
  square_meters?: number;
  latitude?: number;
  longitude?: number;
  // Soporte legacy/variantes
  lat?: number;
  lng?: number;
}

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  type MapboxMap = InstanceType<MapboxGL["Map"]>;
  type MapboxMarker = InstanceType<MapboxGL["Marker"]>;
  type MapboxModule = Pick<MapboxGL, "Map" | "Marker" | "Popup" | "accessToken">;

  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const mapboxRef = useRef<MapboxModule | null>(null);

  const getCoords = (property: Property): { lat: number; lng: number } | null => {
    const lat = property.latitude ?? property.lat;
    const lng = property.longitude ?? property.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  };

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
        setProperties([{
          id: "demo-1",
          title: "Propiedad Demo",
          price: 250000,
          location: "Santo Domingo",
          latitude: 18.4861,
          longitude: -69.9312,
          bedrooms: 2,
        }]);
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
    // Inicializar Mapbox una sola vez
    const init = async () => {
      try {
        const token = getMapboxToken();
        if (!isValidMapboxToken(token)) {
          setMapError("Token de Mapbox no configurado o inválido. Define NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.");
          return;
        }

        const mapboxgl = (await import("mapbox-gl")).default as unknown as MapboxModule;
        mapboxRef.current = mapboxgl;
        mapboxgl.accessToken = token;

        const container = document.getElementById("map-container");
        if (!container) {
          setMapError("No se encontró el contenedor del mapa.");
          return;
        }

        const map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-69.9312, 18.4861],
          zoom: 10,
        });

        mapRef.current = map;

        map.on("error", (e: unknown) => {
          console.error("❌ Error Mapbox en /map:", e);
          const maybeAny = e as { error?: { message?: string }; message?: string } | null;
          setMapError(maybeAny?.error?.message || maybeAny?.message || "Error cargando el mapa");
        });

        map.on("load", () => {
          setMapLoaded(true);
        });
      } catch (e: unknown) {
        console.error("❌ Error inicializando Mapbox:", e);
        setMapError(e instanceof Error ? e.message : "Error inicializando Mapbox");
      }
    };

    init();

    return () => {
      // Cleanup
      try {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        mapRef.current?.remove();
        mapRef.current = null;
      } catch {
        // noop
      }
    };
  }, []);

  useEffect(() => {
    // Actualizar marcadores al cambiar propiedades o al cargar el mapa
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;

    // Limpiar marcadores previos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((property) => {
      const coords = getCoords(property);
      if (!coords) return;

      const marker = new mapboxgl.Marker()
        .setLngLat([coords.lng, coords.lat])
        .addTo(map);

      const popup = new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${property.title}</h3>
          <p class="text-sm text-gray-600">${property.location}</p>
          <p class="text-lg font-bold text-blue-600">€${property.price?.toLocaleString() || "N/A"}</p>
          <button onclick="selectProperty('${property.id}')" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
            Ver detalles
          </button>
        </div>
      `);

      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
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
            {!!mapError && (
              <div className="h-full flex items-center justify-center bg-red-50">
                <div className="text-center max-w-md px-6">
                  <p className="text-red-700 font-semibold mb-2">No se pudo cargar el mapa</p>
                  <p className="text-red-700 text-sm">{mapError}</p>
                </div>
              </div>
            )}
            {!mapError && !mapLoaded && (
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