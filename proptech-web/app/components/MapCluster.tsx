'use client';
import { useEffect, useRef, useState } from 'react';

// Fallback si Mapbox no carga
const MapFallback = ({ listingsCount }: { listingsCount: number }) => (
  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-500">Mapa cargando...</div>
      <div className="text-sm text-gray-400 mt-2">
        Mostrando {listingsCount} propiedades en República Dominicana
      </div>
    </div>
  </div>
);

interface Listing {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}

interface MapClusterProps {
  listings?: Listing[];
}

export const MapCluster = ({ listings = [] }: MapClusterProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapError) return;

    const initializeMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        
        if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
          throw new Error('Mapbox token not configured');
        }
        
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [-69.9, 18.5],
          zoom: 9
        });

        map.on('load', () => {
          // Simple markers instead of complex clustering
          listings.forEach(listing => {
            new mapboxgl.Marker()
              .setLngLat([listing.longitude, listing.latitude])
              .setPopup(
                new mapboxgl.Popup()
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-semibold">${listing.title}</h3>
                      <p class="text-blue-600 font-bold">$${listing.price.toLocaleString()}</p>
                    </div>
                  `)
              )
              .addTo(map);
          });
        });

        map.on('error', () => setMapError(true));

      } catch (error) {
        console.error('Map initialization failed:', error);
        setMapError(true);
      }
    };

    initializeMap();
  }, [listings, mapError]);

  if (mapError || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return <MapFallback listingsCount={listings.length} />;
  }

  return <div ref={mapContainer} className="w-full h-96 rounded-lg border" />;
};
