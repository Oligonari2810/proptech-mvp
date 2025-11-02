// hooks/useFavorites.ts
// Hook personalizado para manejo de favoritos con fallback a localStorage

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { addFavorite as addFavoriteAPI, removeFavorite as removeFavoriteAPI, getFavorites as getFavoritesAPI } from '../lib/favoritesAPI'

const STORAGE_KEY = 'habitatpro_favorites_fallback';

interface FavoriteProperty {
  id: number;
  property_id: number;
  addedAt: string;
}

export function useFavorites() {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const rawId = (session?.user as any)?.id
  const userId = rawId ? parseInt(String(rawId)) : undefined

  // Cargar favoritos desde localStorage como fallback
  const loadLocalFavorites = (): number[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteProperty[];
        return parsed.map((f) => f.property_id || f.id);
      }
    } catch (error) {
      console.error('Error loading local favorites:', error);
    }
    return [];
  };

  // Guardar favoritos en localStorage como fallback
  const saveLocalFavorites = (favs: number[]) => {
    if (typeof window === 'undefined') return;
    try {
      const favoritesData: FavoriteProperty[] = favs.map((id) => ({
        id: Date.now() + id,
        property_id: id,
        addedAt: new Date().toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesData));
    } catch (error) {
      console.error('Error saving local favorites:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      // Si no hay usuario, cargar desde localStorage
      const localFavs = loadLocalFavorites();
      setFavorites(localFavs);
    }
  }, [userId]);

  const loadFavorites = async () => {
    if (!userId) {
      // Fallback a localStorage
      const localFavs = loadLocalFavorites();
      setFavorites(localFavs);
      return;
    }
    
    try {
      setLoading(true);
      const favs = await getFavoritesAPI(userId);
      const favIds = favs.map((f: any) => f.property_id);
      setFavorites(favIds);
      // Sincronizar con localStorage
      saveLocalFavorites(favIds);
    } catch (error) {
      console.error('Error loading favorites from API, using localStorage:', error);
      // Fallback a localStorage si API falla
      const localFavs = loadLocalFavorites();
      setFavorites(localFavs);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: number) => {
    // Verificar autenticación con NextAuth
    if (!session) {
      // Si no hay sesión, usar localStorage
      const isFav = favorites.includes(propertyId);
      const newFavs = isFav
        ? favorites.filter((id) => id !== propertyId)
        : [...favorites, propertyId];
      setFavorites(newFavs);
      saveLocalFavorites(newFavs);
      
      const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!userId) {
      console.error('No user ID available, using localStorage');
      const isFav = favorites.includes(propertyId);
      const newFavs = isFav
        ? favorites.filter((id) => id !== propertyId)
        : [...favorites, propertyId];
      setFavorites(newFavs);
      saveLocalFavorites(newFavs);
      return;
    }

    const isFav = favorites.includes(propertyId);
    
    try {
      if (isFav) {
        await removeFavoriteAPI(propertyId, userId);
        const newFavs = favorites.filter((id) => id !== propertyId);
        setFavorites(newFavs);
        saveLocalFavorites(newFavs);
      } else {
        await addFavoriteAPI(propertyId, userId);
        const newFavs = [...favorites, propertyId];
        setFavorites(newFavs);
        saveLocalFavorites(newFavs);
      }
    } catch (error) {
      console.error('Error toggling favorite via API, using localStorage:', error);
      // Fallback a localStorage si API falla
      const newFavs = isFav
        ? favorites.filter((id) => id !== propertyId)
        : [...favorites, propertyId];
      setFavorites(newFavs);
      saveLocalFavorites(newFavs);
    }
  };

  const isFavorite = (propertyId: number) => favorites.includes(propertyId);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };
}

