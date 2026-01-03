'use client';

import React from 'react';
import Image from 'next/image';

export interface PropertyCardProps {
  property: {
    id: string | number;
    title: string;
    price: number;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    square_meters?: number;
    images?: string[];
    image?: string;
    features?: string[];
    description?: string;
    type?: string;
    operation?: string;
    emotional_tags?: string[];
  };
  onClick?: () => void;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, className = '' }) => {
  const imageUrl = property.images?.[0] || property.image || '/images/placeholder-property.jpg';
  const area = property.area || property.square_meters || 0;

  return (
    <div className={`redesign-card bg-white overflow-hidden cursor-pointer ${className}`} onClick={onClick}>
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.features?.includes('new') && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">Nuevo</span>
          )}
          {property.operation && (
            <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-md">
              {property.operation === 'compra' ? 'Venta' : 'Alquiler'}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 mr-2">{property.title}</h3>
          <p className="primary-teal font-bold text-xl whitespace-nowrap">
            ${property.price.toLocaleString('es-ES')}
          </p>
        </div>

        <p className="text-gray-600 text-sm flex items-center gap-1">
          <span>📍</span>
          <span>{property.location}</span>
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {property.bedrooms && property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <span>🛏️</span>
              <span>{property.bedrooms} hab</span>
            </div>
          )}
          {property.bathrooms && property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <span>🚿</span>
              <span>{property.bathrooms} baños</span>
            </div>
          )}
          {area > 0 && (
            <div className="flex items-center gap-1">
              <span>📐</span>
              <span>{area} m²</span>
            </div>
          )}
        </div>

        {property.emotional_tags && property.emotional_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.emotional_tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          className="w-full bg-primary-teal text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;

