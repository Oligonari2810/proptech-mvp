'use client';

import { useEffect, useState } from 'react';
import Card from '../../components/redesign/Card';
import Button from '../../components/redesign/Button';
import '../../styles/redesign/globals.css';
import '../../styles/redesign/theme.css';

interface InvestmentProperty {
  id: number;
  title: string;
  price: number;
  roi: number;
  location: string;
  rentalYield: number;
}

export default function RedesignInvertirPage() {
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de propiedades de inversión
    setTimeout(() => {
      setProperties([
        { id: 1, title: 'Apartamento Premium Santo Domingo', price: 250000, roi: 8.5, location: 'Santo Domingo', rentalYield: 6.2 },
        { id: 2, title: 'Casa con Renta Alta', price: 350000, roi: 9.2, location: 'Punta Cana', rentalYield: 7.1 },
        { id: 3, title: 'Local Comercial Estratégico', price: 180000, roi: 10.5, location: 'Santiago', rentalYield: 8.3 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-bg p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-headline text-dark-green mb-4">Oportunidades de Inversión</h1>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Construye tu legado inmobiliario con propiedades de alto rendimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} hover>
              <div className="mb-4">
                <h3 className="text-title text-dark-green mb-2">{property.title}</h3>
                <p className="text-gray-medium mb-4">{property.location}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-medium">Precio:</span>
                  <span className="font-semibold text-dark-green">${property.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-medium">ROI Anual:</span>
                  <span className="font-bold text-primary-teal">{property.roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-medium">Rental Yield:</span>
                  <span className="font-semibold text-primary-teal">{property.rentalYield}%</span>
                </div>
              </div>

              <Button variant="primary" className="w-full">
                Analizar Inversión →
              </Button>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16">
          <Card>
            <div className="text-center">
              <h2 className="text-headline text-dark-green mb-4">¿Por qué invertir con HabitatPro?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="font-semibold mb-2">Análisis de ROI</h4>
                  <p className="text-gray-medium text-sm">Cálculos precisos de retorno de inversión</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🔐</div>
                  <h4 className="font-semibold mb-2">Seguridad</h4>
                  <p className="text-gray-medium text-sm">Propiedades verificadas y documentadas</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">💼</div>
                  <h4 className="font-semibold mb-2">Asesoría Experta</h4>
                  <p className="text-gray-medium text-sm">Consultoría especializada en inversión</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

