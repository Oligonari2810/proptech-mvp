'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  operation: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  is_active?: boolean;
  status?: string;
  created_at?: string;
  description?: string;
  features?: string[];
  emotional_tags?: string[];
  images?: string[];
}

export default function AdminPropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Obtener token JWT para autenticación
  const getAuthToken = (): string | null => {
    // Intentar obtener token de localStorage (si se usa AuthContext)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('habitatpro_token');
      if (token) return token;
    }
    // Si usamos NextAuth, el token se maneja automáticamente en las requests
    return null;
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${backendUrl}/api/properties`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al cargar propiedades');
      }

      const data = await response.json();
      if (data.success && data.properties) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (propertyId: number) => {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${backendUrl}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al eliminar propiedad');
      }

      // Recargar lista
      await fetchProperties();
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      console.error('Error deleting property:', err);
    }
  };

  const handleToggleActive = async (property: Property) => {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${backendUrl}/api/properties/${property.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          is_active: !property.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar propiedad');
      }

      await fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
      console.error('Error updating property:', err);
    }
  };

  // Filtrar propiedades
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = !searchTerm || 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || prop.type === filterType;
    const matchesOperation = !filterOperation || prop.operation === filterOperation;
    
    return matchesSearch && matchesType && matchesOperation;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
          <p className="text-gray-600 mt-2">
            Administra todas las propiedades de la plataforma
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredProperties.length} propiedades
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Título o ubicación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>

          {/* Filtro Operación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operación
            </label>
            <select
              value={filterOperation}
              onChange={(e) => setFilterOperation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="compra">Compra</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
        </div>

        {/* Botón Recargar */}
        <div className="flex justify-end">
          <button
            onClick={fetchProperties}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            🔄 Recargar
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de Propiedades */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo/Op
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {properties.length === 0 
                      ? 'No hay propiedades registradas' 
                      : 'No se encontraron propiedades con los filtros aplicados'}
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.title}
                      </div>
                      {property.bedrooms && property.bathrooms && (
                        <div className="text-xs text-gray-500">
                          {property.bedrooms} hab · {property.bathrooms} baños
                          {property.area && ` · ${property.area}m²`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${property.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="capitalize">{property.type || 'N/A'}</span>
                        <br />
                        <span className="text-xs text-gray-500 capitalize">
                          {property.operation || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(property)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          property.is_active !== false
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {property.is_active !== false ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.created_at
                        ? new Date(property.created_at).toLocaleDateString('es-ES')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleToggleActive(property)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {property.is_active !== false ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(property.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmación Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}