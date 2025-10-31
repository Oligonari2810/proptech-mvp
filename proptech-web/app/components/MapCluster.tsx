'use client';

import { useEffect, useRef, useState } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
}

interface MapClusterProps {
  listings?: Property[];
  properties?: Property[];
}

export const MapCluster = ({ listings = [], properties = [] }: MapClusterProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);

  // Use properties if available, otherwise use listings
  const items = properties.length > 0 ? properties : listings;

  useEffect(() => {
    if (!mapContainer.current || mapError) return;

    const initializeMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
          throw new Error('Mapbox token not configured');
        }

        mapboxgl.accessToken = token as string;

        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v10',
          center: items.length > 0 ? [items[0].longitude, items[0].latitude] : [-69.9312, 18.4861],
          zoom: items.length > 0 ? 11 : 10
        });

        mapRef.current = map;

        map.on('load', () => {
          // Add source with clustering
          map.addSource('properties', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: items.map(item => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [item.longitude, item.latitude]
                },
                properties: {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  bedrooms: item.bedrooms,
                  bathrooms: item.bathrooms
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
                100,
                '#f1f075',
                750,
                '#f28cb1'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
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
              'circle-stroke-color': '#fff'
            }
          });

          // Add click handlers
          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            if (features.length > 0) {
              const clusterId = features[0].properties?.cluster_id;
              const source = map.getSource('properties') as any;
              if (source && source.getClusterExpansionZoom) {
                source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                  if (err) return;
                  map.easeTo({
                    center: (e.lngLat as any),
                    zoom: zoom
                  });
                });
              }
            }
          });

          map.on('click', 'unclustered-point', (e) => {
            const coordinates = (e.features?.[0].geometry as any).coordinates.slice();
            const properties = e.features?.[0].properties;
            
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(`
                <div class="p-3">
                  <h3 class="font-semibold text-lg">${properties?.title}</h3>
                  <p class="text-blue-600 font-bold text-xl">$${properties?.price?.toLocaleString()}</p>
                  ${properties?.bedrooms ? `<p class="text-sm text-gray-600">${properties.bedrooms} hab, ${properties.bathrooms || 0} baños</p>` : ''}
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [items, mapError]);

  const hasToken = !!(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  if (mapError || !hasToken) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">{!hasToken ? 'Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN para ver el mapa.' : 'Mapa cargando...'}</div>
          <div className="text-sm text-gray-400 mt-2">
            Mostrando {items.length} propiedades en República Dominicana
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg border" />;
};