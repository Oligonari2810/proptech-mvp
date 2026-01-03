export interface PropertyInput {
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'penthouse';
  condition: 'excellent' | 'good' | 'needs_work';
  year: number;
  zone: 'premium' | 'standard' | 'developing';
  hasPool: boolean;
  hasParking: boolean;
  proximityBeach: number; // km to beach
  proximitySchools: number; // km to schools
}

export interface ValuationResult {
  score: number;
  priceRange: {
    min: number;
    max: number;
    avg: number;
  };
  confidence: 'high' | 'medium' | 'low';
  factors: {
    positive: string[];
    negative: string[];
  };
}

export const calculateHabitaScore = (property: PropertyInput): ValuationResult => {
  // Base price per m² in Dominican Republic (USD)
  const basePricePerM2 = {
    'apartment': 1200,
    'house': 1500, 
    'villa': 2000,
    'penthouse': 1800
  };

  // Zone multipliers
  const zoneMultipliers = {
    'premium': 1.8,
    'standard': 1.0,
    'developing': 0.7
  };

  // Condition multipliers
  const conditionMultipliers = {
    'excellent': 1.3,
    'good': 1.0,
    'needs_work': 0.6
  };

  // Calculate base value
  let baseValue = property.area * basePricePerM2[property.propertyType];
  
  // Apply multipliers
  baseValue *= zoneMultipliers[property.zone];
  baseValue *= conditionMultipliers[property.condition];
  
  // Additional features
  if (property.hasPool) baseValue *= 1.15;
  if (property.hasParking) baseValue *= 1.08;
  
  // Proximity adjustments (closer = higher value)
  if (property.proximityBeach <= 2) baseValue *= 1.25;
  else if (property.proximityBeach <= 5) baseValue *= 1.1;
  
  if (property.proximitySchools <= 1) baseValue *= 1.15;

  // Age depreciation (2% per year after first 5 years)
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - property.year - 5);
  baseValue *= Math.max(0.5, 1 - (age * 0.02));

  // Calculate HabitaScore (400-800 range)
  const baseScore = 400;
  const areaScore = Math.min(property.area * 0.1, 100);
  const bedroomsScore = property.bedrooms * 20;
  const conditionScore = {
    'excellent': 80,
    'good': 40,
    'needs_work': 0
  }[property.condition];
  
  const zoneScore = {
    'premium': 80,
    'standard': 40,
    'developing': 0
  }[property.zone];

  const totalScore = Math.min(800, baseScore + areaScore + bedroomsScore + conditionScore + zoneScore);

  // Price range (±15%)
  const priceRange = {
    min: Math.round(baseValue * 0.85),
    max: Math.round(baseValue * 1.15),
    avg: Math.round(baseValue)
  };

  // Confidence calculation
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (property.area > 80 && property.year > 2010) confidence = 'high';
  if (property.area < 50 || property.year < 1990) confidence = 'low';

  // Factors analysis
  const factors = {
    positive: [] as string[],
    negative: [] as string[]
  };

  if (property.condition === 'excellent') factors.positive.push('Excelente estado de conservación');
  if (property.zone === 'premium') factors.positive.push('Ubicación en zona premium');
  if (property.hasPool) factors.positive.push('Incluye piscina');
  if (property.proximityBeach <= 2) factors.positive.push('Cerca de la playa');

  if (property.condition === 'needs_work') factors.negative.push('Requiere renovaciones');
  if (property.zone === 'developing') factors.negative.push('Zona en desarrollo');
  if (property.proximityBeach > 10) factors.negative.push('Lejos de la playa');

  return {
    score: Math.round(totalScore),
    priceRange,
    confidence,
    factors
  };
};

export const getScoreDescription = (score: number): string => {
  if (score >= 700) return 'Excelente Oportunidad - Propiedad Premium';
  if (score >= 600) return 'Muy Buen Valor - Propiedad Destacada';
  if (score >= 500) return 'Buen Mercado - Propiedad Sólida';
  if (score >= 400) return 'Oportunidad Básica - Propiedad Estándar';
  return 'Requiere Evaluación - Propiedad con Desafíos';
};

// Legacy function names for backward compatibility
export const calculateHabitascore = calculateHabitaScore;
export const getHabitascoreDescription = getScoreDescription;

export const getPriceEstimate = (score: number, area: number): { min: number; max: number; avg: number } => {
  // Simple price estimation based on score
  const pricePerM2 = score / 10;
  const avg = Math.round(pricePerM2 * area);
  const min = Math.round(avg * 0.85);
  const max = Math.round(avg * 1.15);
  
  return { min, max, avg };
};

// Exportar funciones avanzadas de IA Emocional
export {
  calculateAdvancedHabitaScore,
  calculateHabitaScoreWithEmotion,
} from './emotionalValuation';

export type {
  AdvancedValuationInput,
  AdvancedValuationResult,
} from './emotionalValuation';

export type {
  EmotionalProfile,
  EmotionalFactorsResult,
} from './emotionalFactors';
