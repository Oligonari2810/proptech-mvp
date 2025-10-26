'use client';
import { useState } from 'react';
import { calculateHabitaScore, getScoreDescription, PropertyInput, ValuationResult } from '../lib/avm/habitascore';
import { LeadSticky } from '../components/LeadSticky';

export default async function ValorarPage() {
  const [formData, setFormData] = useState<PropertyInput>({
    area: 100,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Santo Domingo',
    propertyType: 'apartment',
    condition: 'good',
    year: 2015,
    zone: 'standard',
    hasPool: false,
    hasParking: true,
    proximityBeach: 5,
    proximitySchools: 1
  });

  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const valuation = calculateHabitaScore(formData);
    setResult(valuation);
    setLoading(false);
  };

  const handleInputChange = (field: keyof PropertyInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Valora tu Propiedad con IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Obtén una valoración instantánea y precisa con nuestro algoritmo HabitaScore, 
            especializado en el mercado inmobiliario dominicano.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de la Propiedad
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de Construcción
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'habitación' : 'habitaciones'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <select
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'baño' : 'baños'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type & Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Propiedad
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">Excelente</option>
                    <option value="good">Bueno</option>
                    <option value="needs_work">Requiere Trabajo</option>
                  </select>
                </div>
              </div>

              {/* Location & Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => handleInputChange('zone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="premium">Premium</option>
                    <option value="standard">Estándar</option>
                    <option value="developing">En Desarrollo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distancia a Playa (km)
                  </label>
                  <input
                    type="number"
                    value={formData.proximityBeach}
                    onChange={(e) => handleInputChange('proximityBeach', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Características
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPool}
                      onChange={(e) => handleInputChange('hasPool', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Piscina</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasParking}
                      onChange={(e) => handleInputChange('hasParking', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Estacionamiento</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Calculando valoración...
                  </div>
                ) : (
                  'Calcular Valoración'
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultado de Valoración
            </h2>
            
            {!result ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  Completa el formulario para obtener tu valoración instantánea
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* HabitaScore */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <span className="text-3xl font-bold text-white">
                      {result.score}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    HabitaScore
                  </h3>
                  <p className="text-gray-600">
                    {getScoreDescription(result.score)}
                  </p>
                </div>

                {/* Price Range */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                    Rango de Valor Estimado
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${result.priceRange.avg.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      Entre ${result.priceRange.min.toLocaleString()} y ${result.priceRange.max.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <span className="text-gray-700">Confianza de la valoración:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.confidence === 'high' ? 'bg-green-100 text-green-800' :
                    result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.confidence === 'high' ? 'Alta' : 
                     result.confidence === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>

                {/* Factors */}
                <div className="space-y-4">
                  {result.factors.positive.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">✓ Factores Positivos</h5>
                      <ul className="space-y-1">
                        {result.factors.positive.map((factor, index) => (
                          <li key={index} className="text-green-600 text-sm">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.factors.negative.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-red-700 mb-2">⚠ Factores a Considerar</h5>
                      <ul className="space-y-1">
                        {result.factors.negative.map((factor, index) => (
                          <li key={index} className="text-red-600 text-sm">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota importante:</strong> Esta valoración es una estimación automatizada 
                    basada en algoritmos de machine learning y no sustituye una tasación profesional. 
                    Los precios pueden variar según condiciones específicas del mercado.
                  </p>
                </div>

                {/* CTA */}
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  💬 Contactar con un Especialista
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Sticky */}
      <LeadSticky listingId="valorar" />
    </div>
  );
}
