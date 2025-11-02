'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, TrendingUp, Heart } from 'lucide-react';

export interface EmotionalProperty {
  id: number;
  title: string;
  price: number;
  operation: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location: string;
  address?: string;
  city?: string;
  images?: string[];
  image_url?: string;
  features?: string[];
  compatibility_score: number;
  emotional_insights: string[];
}

interface EmotionalMatchCardProps {
  property: EmotionalProperty;
  showInsights?: boolean;
}

export function EmotionalMatchCard({ property, showInsights = true }: EmotionalMatchCardProps) {
  const compatibilityPercentage = Math.round(property.compatibility_score * 100);
  const compatibilityColor = 
    compatibilityPercentage >= 80 ? 'bg-green-500' :
    compatibilityPercentage >= 60 ? 'bg-blue-500' :
    compatibilityPercentage >= 40 ? 'bg-amber-500' :
    'bg-gray-500';

  const mainImage = property.images?.[0] || property.image_url || '/images/default-property.jpg';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Imagen con badge de compatibilidad */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/default-property.jpg';
          }}
        />
        
        {/* Badge de compatibilidad emocional */}
        {showInsights && (
          <div className="absolute top-3 right-3">
            <div className={`${compatibilityColor} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}>
              <Heart className="w-3 h-3" />
              <span>{compatibilityPercentage}% match</span>
            </div>
          </div>
        )}

        {/* Badge de operación */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            property.operation === 'compra' ? 'bg-blue-600 text-white' :
            property.operation === 'alquiler' ? 'bg-green-600 text-white' :
            'bg-purple-600 text-white'
          }`}>
            {property.operation === 'compra' ? 'Venta' : 
             property.operation === 'alquiler' ? 'Alquiler' : 
             property.operation}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Título y precio */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            RD$ {property.price.toLocaleString()}
          </p>
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.address || property.location}</span>
        </div>

        {/* Características */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>

        {/* Insights emocionales */}
        {showInsights && property.emotional_insights && property.emotional_insights.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-700">Por qué coincide:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {property.emotional_insights.slice(0, 2).map((insight, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                >
                  {insight.replace('Coincide en ', '').replace('ambiente: ', '').replace('estilo de vida: ', '').replace('comunidad: ', '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Barra de compatibilidad visual */}
        {showInsights && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Compatibilidad emocional</span>
              <span className="font-semibold">{compatibilityPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${compatibilityColor} transition-all duration-500 ease-out`}
                style={{ width: `${compatibilityPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

