'use client';
import { useState } from 'react';
import { calculateHabitascore, getHabitascoreDescription, getPriceEstimate, PropertyInput } from '../lib/avm/habitascore';
import { LeadSticky } from '../components/LeadSticky';

export default function ValorarPage() {
  const [formData, setFormData] = useState<PropertyInput>({
    area: 100,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Santo Domingo',
    condition: 'good',
    year: 2015,
    zone: 'standard'
  });
  
  const [score, setScore] = useState<number | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<{ min: number; max: number; avg: number } | null>(null);

  const handleCalculate = () => {
    const calculatedScore = calculateHabitascore(formData);
    const estimate = getPriceEstimate(calculatedScore, formData.area);
    setScore(calculatedScore);
    setPriceEstimate(estimate);
  };

  const handleInputChange = (field: keyof PropertyInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Valora tu Propiedad con HabitaScore
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestra inteligencia artificial analiza múltiples factores para darte una valoración precisa de tu inmueble en República Dominicana
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Nota importante:</strong> El HabitaScore es una valoración estimada basada en datos del mercado. 
            No reemplaza una tasación profesional. Para una valoración oficial, contacta con un tasador certificado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Datos de tu Propiedad</h2>
            
            <div className="space-y-6">
              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área (m²)
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="20"
                  max="1000"
                />
              </div>

              {/* Habitaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Baños */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baños
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Santo Domingo">Santo Domingo</option>
                  <option value="Punta Cana">Punta Cana</option>
                  <option value="Bávaro">Bávaro</option>
                  <option value="La Romana">La Romana</option>
                  <option value="Santiago">Santiago</option>
                </select>
              </div>

              {/* Zona */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Zona
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => handleInputChange('zone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="premium">Premium</option>
                  <option value="standard">Estándar</option>
                  <option value="developing">En Desarrollo</option>
                </select>
              </div>

              {/* Condición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de la Propiedad
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excelente</option>
                  <option value="good">Bueno</option>
                  <option value="needs_work">Necesita Trabajo</option>
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de Construcción
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 2024)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1950"
                  max={new Date().getFullYear()}
                />
              </div>

              {/* Botón Calcular */}
              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Calcular HabitaScore
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Resultado de la Valoración</h2>
            
            {score && priceEstimate ? (
              <div className="space-y-6">
                {/* HabitaScore */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score}/500
                  </div>
                  <div className="text-xl font-semibold text-gray-800 mb-1">
                    {getHabitascoreDescription(score)}
                  </div>
                  <div className="text-sm text-gray-600">
                    HabitaScore
                  </div>
                </div>

                {/* Estimación de Precio */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Estimación de Valor
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Mínimo:</span>
                      <span className="text-lg font-semibold text-red-600">
                        ${priceEstimate.min.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                      <span className="text-gray-700 font-medium">Valor Promedio:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${priceEstimate.avg.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Máximo:</span>
                      <span className="text-lg font-semibold text-green-600">
                        ${priceEstimate.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Factores Considerados:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Área: {formData.area} m²</li>
                    <li>• Habitaciones: {formData.bedrooms}</li>
                    <li>• Baños: {formData.bathrooms}</li>
                    <li>• Zona: {formData.zone}</li>
                    <li>• Estado: {formData.condition}</li>
                    <li>• Edad: {new Date().getFullYear() - formData.year} años</li>
                  </ul>
                </div>

                {/* CTA */}
                <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  Contactar para Valoración Profesional
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-500">
                  Completa el formulario y haz clic en "Calcular HabitaScore" para obtener tu valoración
                </p>
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
