/**
 * Emotional Valuation Service - Valoración con IA Emocional
 * Extiende HabitaScore con factores emocionales únicos
 */

import {
  PropertyInput,
  ValuationResult,
  calculateHabitaScore,
} from './habitascore';
import {
  calculateEmotionalFactors,
  calculateEmotionalScore,
  EmotionalProfile,
  EmotionalFactorsResult,
} from './emotionalFactors';

export interface AdvancedValuationInput extends PropertyInput {
  // Factores emocionales nuevos (opcionales para compatibilidad)
  emotional_profile?: EmotionalProfile;
  proximity_quality?: {
    parks: number;       // metros a parque más cercano
    schools: number;     // metros a escuela
    transport: number;    // metros a transporte público
    commerce: number;    // metros a comercios
  };
  market_data?: {
    comparable_sales?: Array<{
      price: number;
      similarity: number;
      address: string;
    }>;
    market_trend?: 'rising' | 'stable' | 'declining';
    days_on_market_avg?: number;
  };
}

export interface AdvancedValuationResult extends ValuationResult {
  emotional_score: number;           // Score emocional (0-100)
  emotional_breakdown: {
    lifestyle_score: number;
    wellness_score: number;
    community_score: number;
    factors: string[];
    insights: string[];
    recommendations: string[];
  };
  market_insights?: {
    trend: string;
    comparable_count?: number;
    market_health: 'excellent' | 'good' | 'fair' | 'challenging';
  };
  confidence_interval?: {
    lower: number;
    upper: number;
    confidence_level: number; // 0-100%
  };
}

/**
 * Calcula HabitaScore avanzado con factores emocionales
 * MANTIENE COMPATIBILIDAD con calculateHabitaScore original
 */
export function calculateAdvancedHabitaScore(
  input: AdvancedValuationInput
): AdvancedValuationResult {
  // 1. Calcular valor base (método actual - mantener compatibilidad)
  const baseValuation = calculateHabitaScore(input);

  // 2. Calcular factores emocionales (si no están proporcionados, calcularlos)
  let emotionalProfile: EmotionalProfile;
  if (input.emotional_profile) {
    emotionalProfile = input.emotional_profile;
  } else {
    emotionalProfile = calculateEmotionalFactors({
      location: input.location,
      proximityBeach: input.proximityBeach,
      proximitySchools: input.proximitySchools,
      hasPool: input.hasPool,
      hasParking: input.hasParking,
      propertyType: input.propertyType,
      zone: input.zone,
    });
  }

  // 3. Calcular score emocional
  const emotionalResult = calculateEmotionalScore(emotionalProfile);

  // 4. Aplicar multiplicador emocional al precio base
  const emotionalMultiplier = calculateEmotionalMultiplier(emotionalResult);
  const adjustedPrice = {
    min: Math.round(baseValuation.priceRange.min * emotionalMultiplier),
    max: Math.round(baseValuation.priceRange.max * emotionalMultiplier),
    avg: Math.round(baseValuation.priceRange.avg * emotionalMultiplier),
  };

  // 5. Ajustar por datos de mercado (si están disponibles)
  let marketAdjustment = 1.0;
  let marketInsights = undefined;
  if (input.market_data) {
    marketAdjustment = calculateMarketAdjustment(input.market_data);
    marketInsights = generateMarketInsights(input.market_data);
  }

  const finalPrice = {
    min: Math.round(adjustedPrice.min * marketAdjustment),
    max: Math.round(adjustedPrice.max * marketAdjustment),
    avg: Math.round(adjustedPrice.avg * marketAdjustment),
  };

  // 6. Calcular intervalo de confianza dinámico
  const confidenceInterval = calculateDynamicConfidence(input, emotionalResult);

  // 7. Ajustar confidence general basado en factores emocionales
  let finalConfidence: 'high' | 'medium' | 'low' = baseValuation.confidence;
  if (emotionalResult.emotional_score > 80 && baseValuation.confidence !== 'low') {
    finalConfidence = 'high';
  } else if (emotionalResult.emotional_score < 40) {
    finalConfidence = 'medium';
  }

  // 8. Combinar factores positivos/negativos con insights emocionales
  const combinedFactors = {
    positive: [
      ...baseValuation.factors.positive,
      ...emotionalResult.breakdown.factors.filter(f => 
        !baseValuation.factors.positive.some(p => p.includes(f))
      ),
    ],
    negative: baseValuation.factors.negative,
  };

  return {
    ...baseValuation,
    score: Math.min(800, baseValuation.score + Math.round(emotionalResult.emotional_score / 10)),
    priceRange: finalPrice,
    confidence: finalConfidence,
    emotional_score: emotionalResult.emotional_score,
    emotional_breakdown: {
      lifestyle_score: emotionalResult.lifestyle_score,
      wellness_score: emotionalResult.wellness_score,
      community_score: emotionalResult.community_score,
      factors: emotionalResult.breakdown.factors,
      insights: emotionalResult.breakdown.insights,
      recommendations: emotionalResult.breakdown.recommendations,
    },
    market_insights,
    confidence_interval: confidenceInterval,
    factors: combinedFactors,
  };
}

/**
 * Calcula multiplicador emocional basado en el score emocional
 */
function calculateEmotionalMultiplier(emotionalResult: EmotionalFactorsResult): number {
  // Score emocional alto (80+) agrega valor
  // Score emocional bajo (<40) reduce valor
  const baseMultiplier = 1.0;
  const emotionalImpact = (emotionalResult.emotional_score - 50) / 100; // -0.5 a +0.5
  return baseMultiplier + (emotionalImpact * 0.15); // ±7.5% máximo
}

/**
 * Calcula ajuste basado en datos de mercado
 */
function calculateMarketAdjustment(marketData: NonNullable<AdvancedValuationInput['market_data']>): number {
  let adjustment = 1.0;

  // Ajuste por tendencia de mercado
  if (marketData.market_trend === 'rising') {
    adjustment *= 1.05; // +5%
  } else if (marketData.market_trend === 'declining') {
    adjustment *= 0.95; // -5%
  }

  // Ajuste por días en el mercado
  if (marketData.days_on_market_avg) {
    if (marketData.days_on_market_avg < 30) {
      adjustment *= 1.03; // Mercado rápido
    } else if (marketData.days_on_market_avg > 90) {
      adjustment *= 0.97; // Mercado lento
    }
  }

  return adjustment;
}

/**
 * Genera insights de mercado
 */
function generateMarketInsights(
  marketData: NonNullable<AdvancedValuationInput['market_data']>
): AdvancedValuationResult['market_insights'] {
  const insights: AdvancedValuationResult['market_insights'] = {
    trend: marketData.market_trend || 'stable',
    comparable_count: marketData.comparable_sales?.length || 0,
    market_health: 'good',
  };

  // Determinar salud del mercado
  if (marketData.market_trend === 'rising' && (marketData.days_on_market_avg || 60) < 45) {
    insights.market_health = 'excellent';
  } else if (marketData.market_trend === 'declining' && (marketData.days_on_market_avg || 60) > 90) {
    insights.market_health = 'challenging';
  } else if (marketData.market_trend === 'stable') {
    insights.market_health = 'good';
  }

  return insights;
}

/**
 * Calcula intervalo de confianza dinámico basado en datos disponibles
 */
function calculateDynamicConfidence(
  input: AdvancedValuationInput,
  emotionalResult: EmotionalFactorsResult
): AdvancedValuationResult['confidence_interval'] {
  // Confianza base: 85%
  let confidenceLevel = 85;

  // Aumentar confianza si tenemos datos emocionales completos
  if (emotionalResult.emotional_score > 70) {
    confidenceLevel += 5;
  }

  // Aumentar confianza si tenemos datos de mercado
  if (input.market_data?.comparable_sales && input.market_data.comparable_sales.length > 0) {
    confidenceLevel += 5;
  }

  // Reducir confianza si faltan datos críticos
  if (!input.proximityBeach && !input.proximitySchools) {
    confidenceLevel -= 10;
  }

  confidenceLevel = Math.max(60, Math.min(95, confidenceLevel));

  // Calcular intervalo (±% basado en confianza)
  const intervalPercent = 100 - confidenceLevel;
  const basePrice = calculateHabitaScore(input).priceRange.avg;

  return {
    lower: Math.round(basePrice * (1 - intervalPercent / 100)),
    upper: Math.round(basePrice * (1 + intervalPercent / 100)),
    confidence_level: confidenceLevel,
  };
}

/**
 * Función wrapper para compatibilidad - usa valoración avanzada si hay datos emocionales
 */
export function calculateHabitaScoreWithEmotion(
  input: AdvancedValuationInput
): AdvancedValuationResult | ValuationResult {
  // Si hay factores emocionales o datos de mercado, usar versión avanzada
  if (
    input.emotional_profile ||
    input.market_data ||
    input.proximity_quality
  ) {
    return calculateAdvancedHabitaScore(input);
  }

  // Si no, usar versión básica (compatibilidad)
  return calculateHabitaScore(input);
}

