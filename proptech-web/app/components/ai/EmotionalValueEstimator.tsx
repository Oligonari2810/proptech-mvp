/**
 * Emotional Value Estimator - Componente mejorado con IA Emocional
 * Extiende ValueEstimator con insights emocionales
 */

'use client';

import { useEffect, useState } from 'react';
import EmotionalInsights from './EmotionalInsights';
import { AdvancedValuationResult } from '@/app/lib/avm/habitascore';

interface Valuation {
  estimatedValue: number;
  confidence: number; // 0..1
  priceRange?: { min?: number; max?: number };
  emotional_score?: number;
  emotional_breakdown?: AdvancedValuationResult['emotional_breakdown'];
}

interface EmotionalValueEstimatorProps {
  property: any;
  useEmotional?: boolean; // Activar IA Emocional
}

export default function EmotionalValueEstimator({ 
  property, 
  useEmotional = true 
}: EmotionalValueEstimatorProps) {
  const [valuation, setValuation] = useState<Valuation | AdvancedValuationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const estimateValue = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        
        // Construir datos de la propiedad
        const propertyData = {
          area: property.area || property.surface || property.square_meters,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          location: property.location,
          latitude: property.latitude,
          longitude: property.longitude,
          propertyType: property.property_type || property.propertyType,
          condition: property.condition || 'good',
          year: property.year_built || property.year || new Date().getFullYear() - 5,
          zone: property.zone || 'standard',
          hasPool: property.has_pool || property.hasPool || false,
          hasParking: property.has_parking || property.hasParking || false,
          proximityBeach: property.proximity_beach || property.proximityBeach,
          proximitySchools: property.proximity_schools || property.proximitySchools,
          features: property.features || []
        };

        // Usar endpoint de IA Emocional si está habilitada
        const endpoint = useEmotional 
          ? '/api/ai/valuation/emotional'
          : '/api/ai/valuation';

        const res = await fetch(`${base}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData)
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data?.error || 'Error IA valuation');
        
        // Extraer valuation del response
        const valuationData = data.valuation || data;
        
        // Adaptar formato para compatibilidad
        setValuation({
          estimatedValue: valuationData.estimated_value || valuationData.priceRange?.avg || valuationData.estimatedValue || 0,
          confidence: valuationData.confidence_score || (valuationData.confidence === 'high' ? 0.9 : valuationData.confidence === 'medium' ? 0.7 : 0.5),
          priceRange: {
            min: valuationData.priceRange?.min || valuationData.price_range?.min,
            max: valuationData.priceRange?.max || valuationData.price_range?.max
          },
          emotional_score: valuationData.emotional_score,
          emotional_breakdown: valuationData.emotional_breakdown,
          ...valuationData // Incluir todos los datos adicionales
        } as Valuation & AdvancedValuationResult);
        
        setError(null);
      } catch (e) {
        console.error('Error en valoración:', e);
        setError('No se pudo calcular el valor estimado');
        setValuation(null);
      } finally {
        setLoading(false);
      }
    };

    if (property) estimateValue();
  }, [property, useEmotional]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Calculando valor con IA...</span>
        </div>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="bg-white p-4 rounded-lg border text-red-600">
        {error || 'Error en valoración'}
      </div>
    );
  }

  // Convertir a AdvancedValuationResult si tiene emotional_score
  const isAdvanced = 'emotional_score' in valuation && valuation.emotional_score !== undefined;

  return (
    <div className="space-y-4">
      {/* Valor Estimado */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-bold mb-2">
          {useEmotional ? '💎 Valor Estimado por IA Emocional' : '💎 Valor Estimado por IA'}
        </h3>
        <div className="text-2xl font-bold text-green-600">
          ${(valuation as any).estimatedValue?.toLocaleString() || valuation.priceRange?.avg?.toLocaleString() || 'N/A'}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Confianza: {((valuation.confidence || 0) * 100).toFixed(0)}%
        </div>
        {valuation.priceRange && (
          <div className="text-xs text-gray-500 mt-2">
            Rango: ${valuation.priceRange?.min?.toLocaleString() || '-'} - ${valuation.priceRange?.max?.toLocaleString() || '-'}
          </div>
        )}
        
        {/* Mostrar score emocional si está disponible */}
        {isAdvanced && 'emotional_score' in valuation && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Score Emocional:</span>
              <span className="text-lg font-bold text-purple-600">
                {valuation.emotional_score}/100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Emotional Insights - Solo si es AdvancedValuationResult */}
      {isAdvanced && valuation.emotional_score && (
        <EmotionalInsights 
          valuation={valuation as AdvancedValuationResult}
        />
      )}
    </div>
  );
}

