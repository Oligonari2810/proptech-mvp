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
        // Importar mapbox-gl dinámicamente
        const mapboxgl = (await import('mapbox-gl')).default;
        
        // Usar configuración centralizada
        const { getMapboxToken, isValidMapboxToken } = await import('../lib/mapboxConfig');
        const token = getMapboxToken();
        
        console.log('🔍 Mapbox Debug:', {
          token_present: !!token,
          token_valid: isValidMapboxToken(token),
          token_length: token?.length || 0,
          token_prefix: token?.substring(0, 10) || 'N/A'
        });
        
        if (!isValidMapboxToken(token)) {
          console.error('❌ Mapbox token no válido', { token_length: token?.length, token_prefix: token?.substring(0, 10) });
          setMapError(true);
          return;
        }

        // Configurar token ANTES de crear el mapa
        mapboxgl.accessToken = token;
        console.log('✅ Token Mapbox configurado correctamente');

        // Verificar que el contenedor existe
        if (!mapContainer.current) {
          console.error('❌ Contenedor de mapa no encontrado');
          setMapError(true);
          return;
        }

        // Crear mapa con manejo de errores
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: items.length > 0 && items[0].longitude && items[0].latitude 
            ? [items[0].longitude, items[0].latitude] 
            : [-69.9312, 18.4861], // República Dominicana por defecto
          zoom: items.length > 0 ? 11 : 10,
          attributionControl: false // Desactivar si causa problemas
        });

        mapRef.current = map;

        // Manejar errores del mapa
        map.on('error', (e: any) => {
          const errorDetails = {
            error_message: e.error?.message || e.message || 'Error desconocido',
            error_type: e.type,
            error_code: e.error?.statusCode || e.statusCode || 'N/A',
            token_present: !!token,
            token_valid: token?.startsWith('pk.') || false,
            container_exists: !!mapContainer.current,
            style_loaded: map.isStyleLoaded()
          };
          console.error('❌ Error de Mapbox:', errorDetails);
          console.error('Error completo:', e);
          setMapError(true);
        });

        map.on('load', () => {
          console.log('✅ Mapbox cargado exitosamente');
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

  // Verificar token (siempre tiene fallback, pero mostrar loading si hay error)
  if (mapError) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Error al cargar el mapa. Verifica la configuración de Mapbox.</div>
          <div className="text-sm text-gray-400 mt-2">
            Mostrando {items.length} propiedades
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg border" />;
};