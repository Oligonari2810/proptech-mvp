'use client';

import React, { useState, useEffect } from 'react';
import { FeaturedPropertyCard } from './FeaturedPropertyCard';
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
  title?: string;
  maxItems?: number;
  tier?: ListingTier; // Filtrar por tier específico
}

export function FeaturedSection({ title = 'Propiedades Destacadas', maxItems = 6, tier }: Props) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, [tier, maxItems]);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      const url = tier
        ? `${backendUrl}/api/properties/featured?tier=${tier}&limit=${maxItems}`
        : `${backendUrl}/api/properties/featured?limit=${maxItems}`;

      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setFeaturedProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error loading featured properties:', error);
      // Fallback: cargar propiedades normales
      loadFallbackProperties();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackProperties = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      const response = await fetch(`${backendUrl}/api/properties?limit=${maxItems}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const properties = (data.properties || data || []).map((prop: any) => ({
          ...prop,
          featuredTier: 'featured' as ListingTier // Mock para desarrollo
        }));
        setFeaturedProperties(properties.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Error loading fallback properties:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: maxItems }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg h-80 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">
              Propiedades seleccionadas por nuestros mejores brokers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <FeaturedPropertyCard
              key={property.id}
              property={property}
              featured={true}
              tier={property.featuredTier || 'featured'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

