'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface MapComponentProps {
  properties: MapProperty[];
  onPropertyClick?: (property: MapProperty) => void;
  mapCenter: [number, number];
}

export default function MapComponent({ properties, onPropertyClick, mapCenter }: MapComponentProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          eventHandlers={{
            click: () => onPropertyClick?.(property),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{property.title}</h3>
              <p className="text-green-600 font-semibold">€{property.price.toLocaleString()}</p>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-sm text-gray-500">
                {property.bedrooms} hab • {property.bathrooms} baños • {property.square_meters}m²
              </p>
              <button 
                className="mt-2 w-full bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                onClick={() => onPropertyClick?.(property)}
              >
                Ver Detalles
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
