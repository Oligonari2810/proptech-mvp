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

    const response = await fetch(`${BACKEND_URL}/api/ai/emotional-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data: EmotionalSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error en búsqueda emocional:', error);
    throw error;
  }
}

