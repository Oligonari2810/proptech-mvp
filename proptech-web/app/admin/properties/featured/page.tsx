'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ListingTier, FeaturedListing } from '@/app/lib/featured/types';
import { listingTiers, calculatePrice } from '@/app/lib/featured/config';
import { Plus, X, TrendingUp } from 'lucide-react';

export default function FeaturedListingsPage() {
  const { data: session } = useSession();
  const [myFeaturedListings, setMyFeaturedListings] = useState<Array<{
    id: number;
    propertyId: number;
    propertyTitle: string;
    tier: ListingTier;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    isActive: boolean;
  }>>([]);
  const [myProperties, setMyProperties] = useState<Array<{
    id: number;
    title: string;
    price: number;
    location: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<ListingTier>('featured');
  const [selectedWeeks, setSelectedWeeks] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      
      // Cargar mis propiedades
      const propsResponse = await fetch(`${backendUrl}/api/properties?user_id=${(session?.user as any)?.id}`, {
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken || ''}`
        }
      });
      if (propsResponse.ok) {
        const propsData = await propsResponse.json();
        setMyProperties(propsData.properties || propsData || []);
      }

      // Cargar mis featured listings
      const featuredResponse = await fetch(`${backendUrl}/api/featured-listings/my-properties`, {
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken || ''}`
        }
      });
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        setMyFeaturedListings(featuredData.featuredListings || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeatured = async () => {
    if (!selectedProperty) {
      alert('Por favor selecciona una propiedad');
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      const response = await fetch(`${backendUrl}/api/featured-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken || ''}`
        },
        body: JSON.stringify({
          propertyId: selectedProperty,
          tier: selectedTier,
          weeks: selectedWeeks
        })
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setSelectedProperty(null);
        alert('¡Propiedad destacada exitosamente!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear featured listing');
      }
    } catch (error) {
      console.error('Error creating featured listing:', error);
      alert('Error al crear featured listing');
    }
  };

  const handleDelete = async (listingId: number) => {
    if (!confirm('¿Estás seguro de eliminar este featured listing?')) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      const response = await fetch(`${backendUrl}/api/featured-listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken || ''}`
        }
      });

      if (response.ok) {
        await loadData();
        alert('Featured listing eliminado');
      } else {
        alert('Error al eliminar featured listing');
      }
    } catch (error) {
      console.error('Error deleting featured listing:', error);
      alert('Error al eliminar featured listing');
    }
  };

  const selectedTierConfig = listingTiers.find(t => t.tier === selectedTier);
  const totalPrice = selectedTierConfig ? calculatePrice(selectedTier, selectedWeeks) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h1>
          <p className="text-gray-600">
            Destaca tus propiedades para mayor visibilidad
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Destacar Propiedad
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Nuevo Featured Listing</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Selección de propiedad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Propiedad
              </label>
              <select
                value={selectedProperty || ''}
                onChange={(e) => setSelectedProperty(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una propiedad</option>
                {myProperties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title} - RD$ {prop.price.toLocaleString('es-DO')}
                  </option>
                ))}
              </select>
            </div>

            {/* Selección de tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Destacado
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {listingTiers.filter(t => t.tier !== 'basic').map((tier) => (
                  <button
                    key={tier.tier}
                    onClick={() => setSelectedTier(tier.tier as ListingTier)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${selectedTier === tier.tier
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{tier.badges.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                    <div className="text-lg font-bold text-blue-600">
                      RD$ {tier.pricePerWeek.toLocaleString('es-DO')}/semana
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración ({selectedWeeks} {selectedWeeks === 1 ? 'semana' : 'semanas'})
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={selectedWeeks}
                onChange={(e) => setSelectedWeeks(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 semana</span>
                <span>12 semanas</span>
              </div>
            </div>

            {/* Precio total */}
            {selectedTierConfig && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Precio Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    RD$ {totalPrice.toLocaleString('es-DO')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedWeeks} {selectedWeeks === 1 ? 'semana' : 'semanas'} × RD$ {selectedTierConfig.pricePerWeek.toLocaleString('es-DO')}/semana
                </p>
              </div>
            )}

            {/* Botón crear */}
            <button
              onClick={handleCreateFeatured}
              disabled={!selectedProperty || !selectedTierConfig}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Featured Listing
            </button>
          </div>
        </div>
      )}

      {/* Lista de featured listings */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Mis Featured Listings Activos</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : myFeaturedListings.length === 0 ? (
          <div className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No tienes featured listings activos</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Destaca tu primera propiedad →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {myFeaturedListings.map((listing) => {
              const tierConfig = listingTiers.find(t => t.tier === listing.tier);
              return (
                <div key={listing.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{listing.propertyTitle}</h3>
                        {tierConfig && (
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            listing.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                            listing.tier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {tierConfig.badges.icon} {tierConfig.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Inicio: {new Date(listing.startDate).toLocaleDateString('es-DO')}</span>
                        <span>Fin: {new Date(listing.endDate).toLocaleDateString('es-DO')}</span>
                        <span className={`font-semibold ${
                          listing.daysRemaining <= 7 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {listing.daysRemaining} días restantes
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

