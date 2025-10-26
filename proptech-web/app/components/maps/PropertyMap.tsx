'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Componente de mapa que se carga dinámicamente
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});

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

interface PropertyMapProps {
  properties: MapProperty[];
  onPropertyClick?: (property: MapProperty) => void;
  onPropertySelect?: (property: MapProperty) => void;
}

export default function PropertyMap({ properties, onPropertyClick, onPropertySelect }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [mapCenter] = useState<[number, number]>([40.4168, -3.7038]);
  
  // Cargar propiedades reales del backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://woodrow-intersonant-roughly.ngrok-free.dev/api/properties/?include_coordinates=true');
        if (response.ok) {
          const data = await response.json();
        }
      } catch (error) {
        console.error('Error fetching properties for map:', error);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property: MapProperty) => {
    setSelectedProperty(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  // Datos de ejemplo con coordenadas reales de Madrid
  const sampleProperties: MapProperty[] = [
    {
      id: 1,
      title: "Apartamento en Salamanca",
      price: 450000,
      location: "Salamanca, Madrid",
      latitude: 40.4268,
      longitude: -3.6838,
      bedrooms: 3,
      bathrooms: 2,
      square_meters: 120
    },
    {
      id: 2,
      title: "Piso en Chamberí",
      price: 320000,
      location: "Chamberí, Madrid", 
      latitude: 40.4368,
      longitude: -3.6938,
      bedrooms: 2,
      bathrooms: 1,
      square_meters: 85
    },
    {
      id: 3,
      title: "Ático en Retiro",
      price: 550000,
      location: "Retiro, Madrid",
      latitude: 40.4168,
      longitude: -3.6738,
      bedrooms: 4,
      bathrooms: 3,
      square_meters: 150
    }
  ];

  const displayProperties = properties.length > 0 ? properties : sampleProperties;

  return (
    <div className="h-96 w-full rounded-2xl overflow-hidden shadow-lg">
      <MapComponent 
        properties={displayProperties}
        onPropertyClick={handlePropertyClick}
        mapCenter={mapCenter}
      />
    </div>
  );
}