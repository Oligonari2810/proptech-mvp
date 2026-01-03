"use client";
import React from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProperty {
  id: number;
  title: string;
  price: number;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
}

interface MapComponentProps {
  properties: MapProperty[];
  onPropertyClick?: (property: MapProperty) => void;
  mapCenter: [number, number];
  // Nuevas props para marcador arrastrable
  draggableMarker?: boolean;
  onMarkerDragEnd?: (coords: { lat: number; lng: number }) => void;
  showMarker?: boolean;
  markerPosition?: [number, number];
}

export default function MapComponent({ 
  properties, 
  onPropertyClick, 
  mapCenter,
  draggableMarker = false,
  onMarkerDragEnd,
  showMarker = false,
  markerPosition
}: MapComponentProps) {
  // Token usando configuración centralizada
  const { getMapboxToken } = require('../../lib/mapboxConfig');
  const MAPBOX_TOKEN = getMapboxToken();
  const [lat, lng] = mapCenter;
  
  // Estado para marcador arrastrable
  const [markerCoords, setMarkerCoords] = React.useState<[number, number] | null>(
    markerPosition || (showMarker ? [lat, lng] : null)
  );

  const handleMarkerDrag = (event: any) => {
    const newCoords: [number, number] = [event.lngLat.lat, event.lngLat.lng];
    setMarkerCoords(newCoords);
    if (onMarkerDragEnd) {
      onMarkerDragEnd({ lat: newCoords[0], lng: newCoords[1] });
    }
  };
  
  return (
    <div className="h-full w-full">
      <Map
        initialViewState={{ latitude: lat, longitude: lng, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-left" />
        
        {/* Marcador arrastrable (para selección de ubicación) */}
        {showMarker && markerCoords && (
          <Marker
            latitude={markerCoords[0]}
            longitude={markerCoords[1]}
            draggable={draggableMarker}
            onDragEnd={handleMarkerDrag}
            anchor="center"
          >
            <div
              className="cursor-move"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              title={draggableMarker ? "Arrastra para seleccionar ubicación" : "Ubicación"}
            />
          </Marker>
        )}
        
        {/* Marcadores de propiedades */}
        {properties.map((p) => (
          <Marker key={p.id} latitude={p.latitude} longitude={p.longitude} anchor="bottom">
            <div
              onClick={() => onPropertyClick?.(p)}
              style={{ cursor: "pointer", fontSize: 22 }}
              title={p.title}
            >
              📍
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
