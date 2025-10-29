"use client";
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
}

export default function MapComponent({ properties, onPropertyClick, mapCenter }: MapComponentProps) {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [lat, lng] = mapCenter;
  return (
    <div className="h-full w-full">
      <Map
        initialViewState={{ latitude: lat, longitude: lng, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-left" />
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
        {/* Popup sencillo: mostrar al hacer click externo si se requiere */}
      </Map>
    </div>
  );
}
