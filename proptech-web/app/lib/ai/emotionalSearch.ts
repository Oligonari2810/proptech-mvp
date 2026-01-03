/**
 * API Client para búsqueda emocional
 */

export interface EmotionalSearchRequest {
  query: string;
  user_id?: string;
  filters?: {
    max_price?: number;
    min_price?: number;
    min_bedrooms?: number;
    property_type?: string;
    operation?: 'compra' | 'alquiler' | 'venta';
  };
  limit?: number;
}

export interface EmotionalAnalysis {
  original_query: string;
  emotional_profile: {
    vibes: string[];
    lifestyle: string[];
    community: string[];
  };
  intent: 'investment' | 'rental' | 'family_living' | 'work_living' | 'retirement' | 'general_living' | 'selling';
  confidence: number;
  matched_patterns: Array<{
    category: string;
    emotion: string;
    pattern: string;
  }>;
}

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
  latitude?: number;
  longitude?: number;
  images?: string[];
  image_url?: string;
  features?: string[];
  description?: string;
  compatibility_score: number;
  emotional_insights: string[];
}

export interface EmotionalSearchResponse {
  success: boolean;
  original_query: string;
  emotional_analysis: EmotionalAnalysis;
  emotional_summary: string;
  matches_found: number;
  properties: EmotionalProperty[];
  suggested_queries: string[];
  confidence?: number;
  error?: string;
  message?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';

export async function searchEmotional(query: string, options?: Partial<EmotionalSearchRequest>): Promise<EmotionalSearchResponse> {
  try {
    const request: EmotionalSearchRequest = {
      query,
      ...options,
    };

    console.log('📡 Llamando a:', `${BACKEND_URL}/api/ai/emotional-search`);
    console.log('📤 Request:', request);

    const response = await fetch(`${BACKEND_URL}/api/ai/emotional-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`;
      console.error('❌ Error response:', errorData);
      throw new Error(errorMessage);
    }

    const data: EmotionalSearchResponse = await response.json();
    console.log('✅ Response data:', data);
    
    // Si la respuesta no tiene success=true, tratar como error
    if (data.success === false) {
      throw new Error(data.error || data.message || 'Error en la respuesta del servidor');
    }
    
    return data;
  } catch (error: any) {
    console.error('❌ Error en búsqueda emocional:', error);
    
    // Si es un error de red, lanzar error más descriptivo
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
    
    throw error;
  }
}

