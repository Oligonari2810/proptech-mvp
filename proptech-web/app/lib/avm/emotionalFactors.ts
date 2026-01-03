/**
 * Emotional Factors Service - Factores emocionales para HabitaScore IA
 * Este servicio calcula factores emocionales únicos que van más allá del precio
 */

export interface EmotionalLifestyleQuality {
  green_spaces: number;      // Proximidad a parques (0-10, 10 = excelente)
  noise_level: number;        // Nivel de ruido (0-10, 10 = silencioso)
  air_quality: number;       // Calidad del aire (0-10)
  community_vibe: number;    // Vibración comunitaria (0-10)
  safety_score: number;      // Seguridad percibida (0-10)
}

export interface EmotionalAmenities {
  wellness_focus: boolean;    // Gimnasio, spa, áreas wellness
  social_spaces: boolean;     // Áreas sociales, terraza comunal
  creative_spaces: boolean;   // Estudio, taller, áreas creativas
  family_friendly: boolean;   // Parques infantiles, seguridad
}

export interface ProximityQuality {
  parks: number;              // metros a parque más cercano
  schools: number;            // metros a escuela
  transport: number;          // metros a transporte público
  commerce: number;           // metros a comercios
  beach: number;              // metros a playa (si aplica)
}

export interface EmotionalProfile {
  lifestyle_quality: EmotionalLifestyleQuality;
  emotional_amenities: EmotionalAmenities;
  proximity_quality: ProximityQuality;
}

export interface EmotionalFactorsResult {
  emotional_score: number;          // Score emocional total (0-100)
  lifestyle_score: number;           // Score calidad de vida (0-100)
  wellness_score: number;            // Score bienestar (0-100)
  community_score: number;          // Score comunidad (0-100)
  breakdown: {
    factors: string[];
    insights: string[];
    recommendations: string[];
  };
}

/**
 * Calcula factores emocionales basados en datos de la propiedad
 */
export function calculateEmotionalFactors(
  property: {
    location?: string;
    latitude?: number;
    longitude?: number;
    proximityBeach?: number;
    proximitySchools?: number;
    hasPool?: boolean;
    hasParking?: boolean;
    propertyType?: string;
    zone?: string;
    features?: string[];
  }
): EmotionalProfile {
  // Calcular lifestyle quality (simulado - en producción usaría datos geoespaciales)
  const lifestyle_quality: EmotionalLifestyleQuality = {
    green_spaces: calculateGreenSpaceScore(property),
    noise_level: calculateNoiseLevel(property),
    air_quality: calculateAirQuality(property),
    community_vibe: calculateCommunityVibe(property),
    safety_score: calculateSafetyScore(property),
  };

  // Calcular emotional amenities
  const emotional_amenities: EmotionalAmenities = {
    wellness_focus: hasWellnessFeatures(property),
    social_spaces: hasSocialSpaces(property),
    creative_spaces: hasCreativeSpaces(property),
    family_friendly: isFamilyFriendly(property),
  };

  // Calcular proximity quality
  const proximity_quality: ProximityQuality = {
    parks: estimateParkProximity(property),
    schools: property.proximitySchools ? property.proximitySchools * 1000 : 2000,
    transport: estimateTransportProximity(property),
    commerce: estimateCommerceProximity(property),
    beach: property.proximityBeach ? property.proximityBeach * 1000 : 10000,
  };

  return {
    lifestyle_quality,
    emotional_amenities,
    proximity_quality,
  };
}

/**
 * Calcula el score emocional total
 */
export function calculateEmotionalScore(
  emotionalProfile: EmotionalProfile
): EmotionalFactorsResult {
  // Lifestyle Quality Score (0-100)
  const lifestyleAvg = (
    emotionalProfile.lifestyle_quality.green_spaces +
    emotionalProfile.lifestyle_quality.noise_level +
    emotionalProfile.lifestyle_quality.air_quality +
    emotionalProfile.lifestyle_quality.community_vibe +
    emotionalProfile.lifestyle_quality.safety_score
  ) / 5;

  // Wellness Score (basado en amenities emocionales)
  let wellness_score = 50; // Base
  if (emotionalProfile.emotional_amenities.wellness_focus) wellness_score += 15;
  if (emotionalProfile.emotional_amenities.social_spaces) wellness_score += 10;
  if (emotionalProfile.emotional_amenities.creative_spaces) wellness_score += 10;
  if (emotionalProfile.emotional_amenities.family_friendly) wellness_score += 15;
  wellness_score = Math.min(100, wellness_score);

  // Community Score (basado en proximity)
  let community_score = 50; // Base
  if (emotionalProfile.proximity_quality.parks < 500) community_score += 15;
  if (emotionalProfile.proximity_quality.schools < 1000) community_score += 10;
  if (emotionalProfile.proximity_quality.transport < 500) community_score += 10;
  if (emotionalProfile.proximity_quality.commerce < 300) community_score += 15;
  community_score = Math.min(100, community_score);

  // Emotional Score Total (promedio ponderado)
  const emotional_score = Math.round(
    (lifestyleAvg * 0.5) + (wellness_score * 0.3) + (community_score * 0.2)
  );

  // Generar insights
  const factors: string[] = [];
  const insights: string[] = [];
  const recommendations: string[] = [];

  if (emotionalProfile.lifestyle_quality.green_spaces > 8) {
    factors.push('Áreas verdes excelentes');
    insights.push('📍 Excelente conexión con naturaleza - parques cercanos elevan calidad de vida');
  }

  if (emotionalProfile.lifestyle_quality.community_vibe > 7) {
    factors.push('Comunidad vibrante');
    insights.push('🤝 Ambiente social positivo - comunidad activa detectada');
  }

  if (emotionalProfile.emotional_amenities.wellness_focus) {
    factors.push('Espacios wellness');
    insights.push('🧘 Ambiente enfocado en bienestar - espacios para relajación y ejercicio');
  }

  if (emotionalProfile.proximity_quality.parks < 500) {
    recommendations.push('Caminatas matutinas en parques cercanos');
  }

  if (emotionalProfile.emotional_amenities.family_friendly) {
    factors.push('Ideal para familias');
    insights.push('👨‍👩‍👧‍👦 Entorno seguro y diseñado para familias');
    recommendations.push('Zona perfecta para crecimiento familiar');
  }

  return {
    emotional_score,
    lifestyle_score: Math.round(lifestyleAvg * 10),
    wellness_score,
    community_score,
    breakdown: {
      factors,
      insights,
      recommendations,
    },
  };
}

// ===== FUNCIONES AUXILIARES =====

function calculateGreenSpaceScore(property: any): number {
  // Simulación: zonas premium y residenciales tienen mejor acceso a áreas verdes
  if (property.zone === 'premium') return 9;
  if (property.zone === 'standard') return 6;
  return 4;
}

function calculateNoiseLevel(property: any): number {
  // Simulación: zonas premium son más silenciosas
  if (property.zone === 'premium') return 8;
  if (property.propertyType === 'villa' || property.propertyType === 'penthouse') return 9;
  return 6;
}

function calculateAirQuality(property: any): number {
  // Simulación: zonas con más espacios verdes tienen mejor calidad de aire
  if (property.zone === 'premium') return 8;
  if (property.proximityBeach && property.proximityBeach <= 2) return 9;
  return 7;
}

function calculateCommunityVibe(property: any): number {
  // Simulación: zonas premium y apartamentos tienen mejor comunidad
  if (property.zone === 'premium') return 8;
  if (property.propertyType === 'apartment') return 7;
  return 6;
}

function calculateSafetyScore(property: any): number {
  // Simulación: zonas premium son más seguras
  if (property.zone === 'premium') return 9;
  if (property.zone === 'standard') return 7;
  return 5;
}

function hasWellnessFeatures(property: any): boolean {
  // Verificar si tiene características wellness
  const wellnessKeywords = ['gym', 'spa', 'wellness', 'piscina', 'yoga', 'fitness'];
  const features = property.features || [];
  return features.some((f: string) =>
    wellnessKeywords.some(keyword => f.toLowerCase().includes(keyword))
  ) || property.hasPool;
}

function hasSocialSpaces(property: any): boolean {
  // Verificar si tiene espacios sociales
  const socialKeywords = ['terraza', 'área social', 'salón', 'comunal', 'recreación'];
  const features = property.features || [];
  return features.some((f: string) =>
    socialKeywords.some(keyword => f.toLowerCase().includes(keyword))
  );
}

function hasCreativeSpaces(property: any): boolean {
  // Verificar si tiene espacios creativos
  const creativeKeywords = ['estudio', 'taller', 'oficina', 'workspace'];
  const features = property.features || [];
  return features.some((f: string) =>
    creativeKeywords.some(keyword => f.toLowerCase().includes(keyword))
  );
}

function isFamilyFriendly(property: any): boolean {
  // Verificar si es amigable para familias
  const familyKeywords = ['parque', 'infantil', 'seguridad', 'guardería', 'escuela'];
  const features = property.features || [];
  return (
    features.some((f: string) =>
      familyKeywords.some(keyword => f.toLowerCase().includes(keyword))
    ) ||
    (property.proximitySchools && property.proximitySchools <= 1)
  );
}

function estimateParkProximity(property: any): number {
  // Simulación basada en zona
  if (property.zone === 'premium') return 300; // 300m promedio
  if (property.zone === 'standard') return 800; // 800m promedio
  return 1500; // 1.5km promedio
}

function estimateTransportProximity(property: any): number {
  // Simulación: apartamentos están más cerca de transporte
  if (property.propertyType === 'apartment') return 200;
  if (property.zone === 'premium') return 400;
  return 800;
}

function estimateCommerceProximity(property: any): number {
  // Simulación: zonas premium tienen comercios cercanos
  if (property.zone === 'premium') return 150;
  if (property.zone === 'standard') return 400;
  return 800;
}

