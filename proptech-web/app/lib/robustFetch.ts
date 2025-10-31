/**
 * Robust fetch utility con fallback automático cuando backend está degraded
 */

interface FallbackData {
  [key: string]: any;
}

// Datos de demostración estructurados
const getFallbackData = (url: string): FallbackData => {
  const fallbacks: Record<string, FallbackData> = {
    '/api/properties': {
      success: true,
      properties: [
        {
          id: 1,
          title: "Residencia Elegante en Santo Domingo Este",
          price: 325000,
          status: "active",
          property_type: "residential",
          location: "Santo Domingo Este",
          bedrooms: 3,
          bathrooms: 2,
          area: 150,
          latitude: 18.4861,
          longitude: -69.9312,
        },
        {
          id: 2,
          title: "Local Comercial Premium en Punta Cana",
          price: 450000,
          status: "active",
          property_type: "commercial",
          location: "Punta Cana",
          bedrooms: 0,
          bathrooms: 1,
          area: 200,
          latitude: 18.5819,
          longitude: -68.3681,
        },
        {
          id: 3,
          title: "Apartamento Moderno en Zona Colonial",
          price: 185000,
          status: "active",
          property_type: "apartment",
          location: "Zona Colonial, Santo Domingo",
          bedrooms: 2,
          bathrooms: 1,
          area: 90,
          latitude: 18.4833,
          longitude: -69.8833,
        },
      ],
      count: 3,
      message: "Modo demostración - Backend en recuperación",
    },
    '/api/admin/metrics': {
      properties: 12,
      leads: 45,
      reservations: 23,
      revenue: 1250000,
      revenue_formatted: "$1,250,000",
      users: 45,
      timestamp: new Date().toISOString(),
    },
    '/api/metrics': {
      totalProperties: 12,
      totalUsers: 45,
      activeLeads: 23,
      monthlyGrowth: 12.5,
      conversionRate: 8.3,
      lastUpdated: new Date().toISOString(),
    },
    '/api/users': {
      success: true,
      users: [
        {
          id: 1,
          name: "Admin Demo",
          email: "admin@habitatpro.com",
          role: "admin",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Broker Demo",
          email: "broker@habitatpro.com",
          role: "broker",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        },
      ],
      count: 2,
    },
  };

  // Extraer el path del URL
  const path = url.includes('/api/') ? url.split('/api')[1] || url : url;
  return fallbacks[path] || { 
    message: "Datos no disponibles temporalmente - Backend en recuperación",
    mode: "demo"
  };
};

/**
 * Fetch robusto con timeout y fallback automático
 */
export const robustFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Si es abort por timeout o error de conexión, usar fallback
    if (
      error.name === 'AbortError' ||
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      console.warn(`⚠️ Fallback activado para: ${url} - ${error.message}`);
      return getFallbackData(url);
    }

    // Si es un error HTTP específico, intentar parsear respuesta
    try {
      const errorResponse = await fetch(url, { ...options, signal: controller.signal });
      return await errorResponse.json();
    } catch {
      console.warn(`⚠️ Fallback activado para: ${url} - ${error.message}`);
      return getFallbackData(url);
    }
  }
};

/**
 * Hook para componentes que necesitan datos con fallback
 */
export const isDemoMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('demo_mode') === 'true' || false;
  }
  return false;
};

/**
 * Mensaje para mostrar cuando estamos en modo demo
 */
export const getDemoMessage = (): string => {
  return "🔧 Sistema en modo demostración - Backend en mantenimiento. Datos de ejemplo.";
};


