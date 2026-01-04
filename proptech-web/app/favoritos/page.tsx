'use client';
import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import Link from 'next/link';
import { getFavorites, removeFavorite } from '../lib/favoritesAPI';

interface FavoriteProperty {
  id: number;
  property_id: number;
  property?: {
    id: number;
    title: string;
    price: number;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    images?: string[];
    operation?: string;
  };
  created_at?: string;
}

export default function FavoritosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/favoritos');
      return;
    }
    loadFavorites();
  }, [session]);

  const loadFavorites = async () => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const userId = parseInt((session.user as any).id || '0');
      
      if (!userId) {
        console.error('No user ID available');
        return;
      }

      const favs = await getFavorites(userId);
      
      // Cargar detalles de propiedades
      const propertiesWithDetails = await Promise.all(
        favs.map(async (fav: any) => {
          try {
            const res = await fetch(`/api/backend/api/properties/${fav.property_id}`, { cache: 'no-store' });
            if (res.ok) {
              const propData = await res.json();
              return { ...fav, property: propData.property || propData };
            }
            return fav;
          } catch (error) {
            console.error(`Error loading property ${fav.property_id}:`, error);
            return fav;
          }
        })
      );
      
      setFavorites(propertiesWithDetails);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number, propertyId: number) => {
    if (!session?.user) return;
    
    try {
      setRemoving(favoriteId);
      const userId = parseInt((session.user as any).id || '0');
      
      const success = await removeFavorite(propertyId, userId);
      
      if (success) {
        setFavorites(favorites.filter(f => f.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus favoritos</p>
          <Link 
            href="/auth/signin"
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingOptimized type="spinner" size="md" />
          <p className="text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
          <p className="text-gray-600">
            {favorites.length === 0 
              ? 'No tienes propiedades guardadas todavía'
              : `${favorites.length} ${favorites.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
            }
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes favoritos todavía
            </h2>
            <p className="text-gray-600 mb-6">
              Explora propiedades y guarda tus favoritas haciendo clic en el icono ❤️
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/comprar"
                className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Ver propiedades en venta
              </Link>
              <Link
                href="/alquilar"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Ver propiedades en alquiler
              </Link>
            </div>
          </div>
        )}

        {/* Lista de Favoritos */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const property = favorite.property;
              if (!property) return null;

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Imagen */}
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Square size={48} />
                      </div>
                    )}
                    
                    {/* Botón eliminar favorito */}
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id, property.id)}
                      disabled={removing === favorite.id}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      aria-label="Eliminar de favoritos"
                    >
                      <Heart 
                        size={20} 
                        className="text-red-500 fill-red-500"
                      />
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed size={16} className="mr-1" />
                          <span>{property.bedrooms} hab.</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath size={16} className="mr-1" />
                          <span>{property.bathrooms} baños</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square size={16} className="mr-1" />
                          <span>{property.area} m²</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-brand-600">
                        {property.operation === 'alquiler' 
                          ? `$${property.price.toLocaleString()}/mes`
                          : `$${property.price.toLocaleString()}`
                        }
                      </div>
                      
                      <Link
                        href={`/properties/${property.id}`}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                      >
                        Ver detalles
                      </Link>
                    </div>
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

