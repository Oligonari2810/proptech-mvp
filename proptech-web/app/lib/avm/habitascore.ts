export interface PropertyInput {
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  condition: 'excellent' | 'good' | 'needs_work';
  year: number;
  zone: 'premium' | 'standard' | 'developing';
}

export const calculateHabitascore = (property: PropertyInput): number => {
  let baseScore = 400;
  
  // Area factor (max +50 points)
  baseScore += Math.min(property.area * 0.5, 50);
  
  // Bedrooms factor
  baseScore += property.bedrooms * 15;
  
  // Bathrooms factor
  baseScore += property.bathrooms * 10;
  
  // Condition multiplier
  const conditionMultipliers = {
    excellent: 1.2,
    good: 1.0,
    needs_work: 0.8
  };
  baseScore *= conditionMultipliers[property.condition];
  
  // Zone multiplier
  const zoneMultipliers = {
    premium: 1.3,
    standard: 1.0,
    developing: 0.9
  };
  baseScore *= zoneMultipliers[property.zone];
  
  // Age depreciation (max -40 points)
  const currentYear = new Date().getFullYear();
  const age = currentYear - property.year;
  baseScore -= Math.min(age * 2, 40);
  
  return Math.min(Math.max(Math.round(baseScore), 400), 500);
};

export const getHabitascoreDescription = (score: number): string => {
  if (score >= 480) return 'Excelente Oportunidad';
  if (score >= 450) return 'Muy Buen Valor';
  if (score >= 420) return 'Buen Mercado';
  return 'Oportunidad Básica';
};

export const getPriceEstimate = (score: number, area: number): { min: number; max: number; avg: number } => {
  // Base price per m² according to score
  const basePricePerM2 = {
    480: 3500, // Premium
    450: 2500, // High
    420: 1800, // Medium
    400: 1200  // Basic
  };
  
  let pricePerM2 = 1200;
  if (score >= 480) pricePerM2 = basePricePerM2[480];
  else if (score >= 450) pricePerM2 = basePricePerM2[450];
  else if (score >= 420) pricePerM2 = basePricePerM2[420];
  else pricePerM2 = basePricePerM2[400];
  
  const avg = Math.round(pricePerM2 * area);
  const min = Math.round(avg * 0.85);
  const max = Math.round(avg * 1.15);
  
  return { min, max, avg };
};
