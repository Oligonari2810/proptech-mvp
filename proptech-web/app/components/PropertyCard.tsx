'use client'

import React, { memo, useState } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { FeaturedBadge } from './featured/FeaturedBadge'
import { ListingTier } from '../lib/featured/types'
import FavoriteButton from './FavoriteButton'
import { useToast } from './ToastNotification'

interface Property {
  id: number | string
  title: string
  price: number
  location: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  square_meters?: number
  images?: string[]
  image?: string
  features?: string[]
  description?: string
  type?: string
  operation?: string
  emotional_tags?: string[]
  featuredTier?: ListingTier
}

interface PropertyCardProps {
  property: Property
}

// Skeleton loading component
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export const PropertyCard = memo(function PropertyCard({ property }: PropertyCardProps) {
  const { addToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleWhatsAppClick = () => {
    const message = `Hola, me interesa la propiedad: ${property.title} - ${property.price.toLocaleString('es-ES')}`;
    const url = `https://wa.me/+18091234567?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    addToast({
      type: 'info',
      title: 'WhatsApp abierto',
      message: 'Serás redirigido a WhatsApp para contactar al broker',
      duration: 2000,
    });
  };

  // Get the image URL
  const imageUrl = property.images?.[0] || property.image || '';
  const area = property.area || property.square_meters || 0;
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
      {/* Featured Badge */}
      {property.featuredTier && property.featuredTier !== 'basic' && (
        <div className="absolute top-3 right-3 z-10">
          <FeaturedBadge tier={property.featuredTier} />
        </div>
      )}

      {/* Imagen de la propiedad */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg relative">
        {imageUrl && !imageError ? (
          <>
            {!imageLoaded && <PropertyCardSkeleton />}
            <Image 
              src={imageUrl} 
              alt={property.title}
              width={400}
              height={192}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">🏠</div>
            <div>{property.type || 'Propiedad'}</div>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <FavoriteButton propertyId={Number(property.id)} />
        </div>
        <div className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          {property.operation === 'compra' ? 'Venta' : 'Alquiler'}
        </div>
      </div>
      
      {/* Detalles de la propiedad */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{property.title}</h3>
          <span className="text-2xl font-bold text-blue-600 whitespace-nowrap ml-2">
            ${property.price.toLocaleString('es-ES')}
          </span>
        </div>
        
        {property.description && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{property.description}</p>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-4 flex items-center">
            📍 {property.location}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex space-x-4">
            <span className="flex items-center">
              🛏️ {bedrooms} hab.
            </span>
            <span className="flex items-center">
              🚿 {bathrooms} baños
            </span>
            {area > 0 && (
              <span className="flex items-center">
                📐 {area} m²
              </span>
            )}
          </div>
        </div>

        {/* Tags emocionales */}
        {property.emotional_tags && property.emotional_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.emotional_tags.map((tag: string, index: number) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Características */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.features.slice(0, 3).map((feature: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{property.features.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Ver Detalles
          </button>
          <button 
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
            title="Contactar por WhatsApp"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';
