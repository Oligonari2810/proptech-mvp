import { MapCluster } from '../components/MapCluster';
import { PropertyCard } from '../components/PropertyCard';

async function getProperties() {
  try {
    const backendUrl = 'https://habitatpro-backend.onrender.com';
    const response = await fetch(`${backendUrl}/api/properties`, { cache: 'no-store' });
    
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `fallback-${i}`,
      title: `Propiedad ${i+1} en Santo Domingo`,
      price: Math.floor(Math.random() * 500000) + 50000,
      location: `Santo Domingo ${i+1}`,
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 200) + 80,
      images: [`https://picsum.photos/800/600?random=${i}`],
      features: ['Piscina', 'Estacionamiento', 'Seguridad 24/7']
    }));
  }
}

export default async function ComprarPage() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Encuentra tu Propiedad Ideal</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máximo</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Hasta $100,000</option>
                    <option>Hasta $250,000</option>
                    <option>Hasta $500,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Cualquiera</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <MapCluster properties={properties} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
