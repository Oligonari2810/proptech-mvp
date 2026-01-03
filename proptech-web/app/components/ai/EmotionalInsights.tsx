/**
 * Emotional Insights Component - Muestra insights emocionales del HabitaScore
 */

import { AdvancedValuationResult } from '@/app/lib/avm/habitascore';

interface EmotionalInsightsProps {
  valuation: AdvancedValuationResult;
}

export default function EmotionalInsights({ valuation }: EmotionalInsightsProps) {
  if (!valuation.emotional_score && !valuation.emotional_breakdown) {
    return null; // Si no hay datos emocionales, no mostrar nada
  }

  const { emotional_breakdown } = valuation;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🧠❤️</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            HabitaScore Emocional
          </h3>
          <p className="text-sm text-gray-600">
            Más allá del precio: cómo esta propiedad te hará sentir
          </p>
        </div>
      </div>

      {/* Emotional Score */}
      {valuation.emotional_score && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Score Emocional</span>
            <span className="text-2xl font-bold text-purple-600">
              {valuation.emotional_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${valuation.emotional_score}%` }}
            />
          </div>
        </div>
      )}

      {/* Breakdown de Scores */}
      {emotional_breakdown && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">Calidad de Vida</div>
            <div className="text-xl font-bold text-green-600">
              {emotional_breakdown.lifestyle_score}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">Bienestar</div>
            <div className="text-xl font-bold text-blue-600">
              {emotional_breakdown.wellness_score}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">Comunidad</div>
            <div className="text-xl font-bold text-orange-600">
              {emotional_breakdown.community_score}
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {emotional_breakdown?.insights && emotional_breakdown.insights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            💡 Insights Emocionales
          </h4>
          <ul className="space-y-2">
            {emotional_breakdown.insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700 bg-white rounded-lg p-2 border border-purple-100">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {emotional_breakdown?.recommendations && emotional_breakdown.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            🌟 Recomendaciones de Estilo de Vida
          </h4>
          <ul className="space-y-2">
            {emotional_breakdown.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-700 bg-white rounded-lg p-2 border border-purple-100">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

