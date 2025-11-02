'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail } from 'lucide-react';
import PropertyGallery from '../../components/properties/PropertyGallery';
import { MortgageCalculatorCompact } from '../../components/mortgage/MortgageCalculatorCompact';
import { TaxCalculatorCompact } from '../../components/legal/TaxCalculatorCompact';
import { useFavorites } from '../../hooks/useFavorites';
import FavoriteButton from '../../components/FavoriteButton';
import { useSession } from 'next-auth/react';
import ValueEstimator from '../../components/ai/ValueEstimator';
import EmotionalValueEstimator from '../../components/ai/EmotionalValueEstimator';
import PropertyRecommendations from '../../components/ai/PropertyRecommendations';
import SaleProbability from '../../components/ai/SaleProbability';
import { PropertyReviews } from '../../components/reputation/PropertyReviews';

interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  surface?: number;
  images?: string[];
  image_url?: string;
  features?: string[];
  property_type?: string;
  status?: string;
  created_at?: string;
  brokerId?: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const propertyId = parseInt(params.id as string);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    setError('');
    try {
      // Intento 1: usar proxy interno (evita CORS y errores locales)
      let response = await fetch(`/api/properties-proxy?id=${propertyId}`, { cache: 'no-store' });
      let data = await response.json();
      if (!data || (!data.property && !data.id)) {
        // Intento 2: ir directo al backend
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        response = await fetch(`${backendUrl}/api/properties/${propertyId}`);
        data = await response.json();
      }
      if (!data || (!data.property && !data.id)) {
        // Intento 3: Mock de desarrollo
        const mock = generateMockProperty(String(propertyId));
        setProperty(mock as unknown as PropertyDetail);
        return;
      }
      setProperty((data as any).property || data);
    } catch (err) {
      // Fallback final: mock de desarrollo
      const mock = generateMockProperty(String(propertyId));
      setProperty(mock as unknown as PropertyDetail);
    } finally {
      setLoading(false);
    }
  };

  function generateMockProperty(id: string) {
    const presets: Record<string, any> = {
      '1': {
        id: 1,
        title: 'Moderno Ático con Vistas Panorámicas',
        price: 450000,
        location: 'Santo Domingo, DN',
        description: 'Ático reformado con acabados premium, amplia terraza y vistas a la ciudad.',
        images: [
          'https://images.unsplash.com/photo-1505693070192-6f0b1bcd7364?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8a?q=80&w=1600&auto=format&fit=crop'
        ],
        bedrooms: 3,
        bathrooms: 2,
        area: 145,
        features: ['Piscina', 'Terraza', 'Vistas', 'Seguridad 24/7'],
        property_type: 'Apartamento',
        status: 'Disponible'
      },
      '2': {
        id: 2,
        title: 'Casa Familiar en Zona Residencial',
        price: 320000,
        location: 'Punta Cana, La Altagracia',
        description: 'Casa luminosa con jardín, ideal para familias. Cerca de colegios y servicios.',
        images: [
          'https://images.unsplash.com/photo-1613977257750-59f4f9df57aa?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1616594039964-ae9021a6d10e?q=80&w=1600&auto=format&fit=crop'
        ],
        bedrooms: 4,
        bathrooms: 3,
        area: 210,
        features: ['Jardín', 'Parque infantil cercano', 'Garaje'],
        property_type: 'Casa',
        status: 'Disponible'
      }
    };

    if (presets[id]) return presets[id];

    // Generador simple si el id no está en presets
    const n = Number(id) || Math.floor(Math.random() * 1000);
    return {
      id: n,
      title: `Propiedad de Demostración #${n}`,
      price: 300000 + (n % 7) * 25000,
      location: 'Santo Domingo, DN',
      description: 'Propiedad de demostración generada localmente para desarrollo sin backend.',
      images: [
        `https://picsum.photos/seed/${n}/1200/800`,
        `https://picsum.photos/seed/${n + 1}/1200/800`
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 120 + (n % 5) * 10,
      features: ['Balcón', 'Cocina equipada', 'Seguridad'],
      property_type: 'Apartamento',
      status: 'Disponible'
    };
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 mb-4">{error || 'Propiedad no encontrada'}</p>
          <button
            onClick={() => router.push('/comprar')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : property.image_url
    ? [property.image_url]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <button onClick={() => router.push('/comprar')} className="text-indigo-600 hover:text-indigo-700">
            Propiedades
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería */}
            <PropertyGallery 
              images={images} 
              title={property.title}
              alt={`${property.title} - ${property.location}`}
            />

            {/* Información básica */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">
                    ${property.price.toLocaleString()}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <FavoriteButton 
                    propertyId={property.id} 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  />
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Compartir"
                  >
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Características */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {property.bedrooms && (
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Dormitorios</p>
                    <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Baños</p>
                    <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                  </div>
                )}
                {(property.area || property.surface) && (
                  <div className="text-center">
                    <Square className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Área</p>
                    <p className="font-semibold text-gray-900">
                      {property.area || property.surface} m²
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {property.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Características */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* IA: Recomendaciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <PropertyRecommendations propertyId={property.id} />
          </div>

          {/* Reseñas y Calificaciones */}
          <PropertyReviews propertyId={property.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calculadora de Impuestos */}
            <TaxCalculatorCompact 
              precioPropiedad={property.price}
              tipoPropiedad={property.property_type === 'Casa' ? 'residencial' : property.property_type === 'Terreno' ? 'terreno' : 'residencial'}
              showFull={false}
            />

            {/* Calculadora Hipotecaria */}
            <MortgageCalculatorCompact 
              precioPropiedad={property.price}
              propertyId={property.id}
              showFull={false}
            />

          {/* IA: Valor estimado */}
          <EmotionalValueEstimator property={property} useEmotional={true} />

          {/* IA: Probabilidad de venta */}
          <SaleProbability property={property} />

            {/* Contacto */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactar</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  <Phone className="w-5 h-5" />
                  Llamar
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Mail className="w-5 h-5" />
                  Enviar mensaje
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{property.property_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium">{property.status || 'Disponible'}</span>
                </div>
                {property.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publicado:</span>
                    <span className="font-medium">
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

