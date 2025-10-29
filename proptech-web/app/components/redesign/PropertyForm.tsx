'use client';

import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';

interface PropertyData {
  // Paso 1: Información Básica
  title: string;
  type: string;
  operation: string;
  price: string;
  location: string;
  
  // Paso 2: Detalles
  bedrooms: string;
  bathrooms: string;
  area: string;
  description: string;
  
  // Paso 3: Características
  features: string[];
  images: string[];
}

export default function PropertyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    type: 'apartamento',
    operation: 'venta',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: [],
    images: []
  });

  const featuresOptions = ['Piscina', 'Garaje', 'Jardín', 'Terraza', 'Ascensor', 'Seguridad 24/7', 'Gimnasio', 'Sala de juegos'];

  const handleChange = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async () => {
    // Aquí iría la lógica de envío al backend
    console.log('Datos a enviar:', formData);
    alert('¡Propiedad publicada exitosamente!');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-title text-dark-green mb-6">Información Básica</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Título de la propiedad</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
          placeholder="Ej: Apartamento luminoso en zona céntrica"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
          >
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="local">Local</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Operación</label>
          <select
            value={formData.operation}
            onChange={(e) => handleChange('operation', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            placeholder="150000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            placeholder="Santo Domingo, Distrito Nacional"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-title text-dark-green mb-6">Detalles de la Propiedad</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dormitorios</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            placeholder="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => handleChange('bathrooms', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
          <input
            type="number"
            value={formData.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            placeholder="120"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
          placeholder="Describe tu propiedad en detalle..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-title text-dark-green mb-6">Características y Extras</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Características</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featuresOptions.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleFeatureToggle(feature)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                formData.features.includes(feature)
                  ? 'bg-primary-teal text-white border-primary-teal'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-teal'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URLs de Imágenes (una por línea)</label>
        <textarea
          value={formData.images.join('\n')}
          onChange={(e) => handleChange('images', e.target.value.split('\n').filter(url => url.trim()))}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
          placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-headline text-dark-green mb-4">Publica tu Propiedad</h1>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? 'bg-primary-teal text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-20 ${s < step ? 'bg-primary-teal' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            ← Anterior
          </Button>
          
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              Siguiente →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Publicar Propiedad
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

