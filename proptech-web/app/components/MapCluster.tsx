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
          // Add source with clustering
          map.addSource('properties', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: listings.map(listing => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [listing.longitude, listing.latitude]
                },
                properties: {
                  id: listing.id,
                  title: listing.title,
                  price: listing.price
                }
              }))
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
          });

          // Add cluster circles
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'properties',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                10,
                '#f1f075',
                30,
                '#f28cb1'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                30,
                30,
                40
              ]
            }
          });

          // Add cluster count labels
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'properties',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
            }
          });

          // Add unclustered points
          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'properties',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          });

          // Click on cluster to zoom in
          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('properties').getClusterExpansionZoom(
              clusterId,
              (err, zoom) => {
                if (err) return;
                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
          });

          // Click on individual point to show popup
          map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { title, price } = e.features[0].properties;

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(`
                <div class="p-3 max-w-xs">
                  <h3 class="font-semibold text-lg">${title}</h3>
                  <p class="text-blue-600 font-bold text-xl">$${Number(price).toLocaleString()}</p>
                </div>
              `)
              .addTo(map);
          });

          // Change cursor on hover
          map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
          });
          map.on('mouseenter', 'unclustered-point', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = '';
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
