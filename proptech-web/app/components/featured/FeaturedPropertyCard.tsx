'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FeaturedBadge } from './FeaturedBadge';
import { ListingTier } from '@/app/lib/featured/types';

interface Property {
  id: number | string;
  title: string;
  price: number;
  location: string;
  image_url?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  square_meters?: number;
  featuredTier?: ListingTier;
}

interface Props {
  property: Property;
  featured?: boolean;
  tier?: ListingTier;
}

export function FeaturedPropertyCard({ property, featured = false, tier = 'basic' }: Props) {
  const imageUrl = property.images?.[0] || property.image_url || '';
  const area = property.area || property.square_meters || 0;

  return (
    <Link href={`/properties/${property.id}`}>
      <div
        className={`
          relative bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300
          ${featured && tier !== 'basic'
            ? tier === 'platinum'
              ? 'border-purple-500 shadow-xl hover:shadow-2xl'
              : tier === 'premium'
              ? 'border-yellow-500 shadow-xl hover:shadow-2xl'
              : 'border-blue-500 shadow-lg hover:shadow-xl'
            : 'border-gray-200 hover:shadow-xl'
          }
          group cursor-pointer
        `}
      >
        {/* Featured Badge */}
        {featured && tier !== 'basic' && (
          <div className="absolute top-3 right-3 z-10">
            <FeaturedBadge tier={tier} />
          </div>
        )}

        {/* Gradient Overlay para Featured */}
        {featured && tier !== 'basic' && (
          <div
            className={`
              absolute top-0 left-0 right-0 h-1 z-10
              ${tier === 'platinum' ? 'bg-gradient-to-r from-purple-500 to-purple-700' : ''}
              ${tier === 'premium' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
              ${tier === 'featured' ? 'bg-gradient-to-r from-blue-500 to-blue-700' : ''}
            `}
          />
        )}

        {/* Imagen */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {property.title.charAt(0)}
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {property.location}
          </p>

          {/* Precio destacado */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-blue-600">
              RD$ {property.price.toLocaleString('es-DO')}
            </span>
          </div>

          {/* Características */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <span>🛏️ {property.bedrooms}</span>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <span>🚿 {property.bathrooms}</span>
            )}
            {area > 0 && (
              <span>📐 {area} m²</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

