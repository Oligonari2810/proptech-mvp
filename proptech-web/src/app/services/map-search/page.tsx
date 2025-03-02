"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";  // 🔥 Importar desde `react-map-gl/maplibre`
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapSearchPage() {
  interface Property {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    location: string;
    price: number;
  }

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 18.4861, 
    longitude: -69.9312,
    zoom: 12,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  return (
    <div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "600px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {properties.map((prop) => (
          <Marker key={prop.id} latitude={prop.latitude} longitude={prop.longitude}>
            <div className="cursor-pointer text-red-500 text-xl" onClick={() => setSelectedProperty(prop)}>
              📍
            </div>
          </Marker>
        ))}

        {selectedProperty && (
          <Popup
            latitude={selectedProperty.latitude}
            longitude={selectedProperty.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedProperty(null)}
            anchor="top"
          >
            <div className="p-2">
              <h2 className="font-bold">{selectedProperty.title}</h2>
              <p>{selectedProperty.location}</p>
              <p>💰 ${selectedProperty.price}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
