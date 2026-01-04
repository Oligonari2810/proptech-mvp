// lib/propertyAPI.ts
// Servicio para integración con API de propiedades

// Mapeo automático frontend-backend
export interface PropertyData {
  title: string
  description: string
  price: number
  type: string // Mapea a 'property_type' en backend
  operation: 'compra' | 'alquiler'
  location: string
  latitude?: number // Coordenada latitud
  longitude?: number // Coordenada longitud
  bedrooms?: number
  bathrooms?: number
  area?: number // Mapea a 'area_sq_m' en backend
  features?: string[] // Mapea a 'amenities' en backend
  emotional_tags?: string[] // Mapea a 'tags' en backend
  images?: string[]
}

// Mapeo automático de campos
const FIELD_MAPPING = {
  'type': 'property_type',
  'area': 'area_sq_m',
  'features': 'amenities',
  'emotional_tags': 'tags'
}

// Función helper para transformar datos frontend -> backend
function transformForBackend(data: PropertyData): any {
  return {
    ...data,
    property_type: data.type,
    area_sq_m: data.area,
    amenities: data.features,
    tags: data.emotional_tags,
    latitude: data.latitude, // Incluir coordenadas si están disponibles
    longitude: data.longitude,
  }
}

export interface CreatePropertyResponse {
  success: boolean
  property?: {
    id: number
    title: string
    price: number
    location: string
    [key: string]: any
  }
  error?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com'
const viaProxy = (path: string) => (typeof window !== 'undefined' ? `/api/backend${path}` : `${BACKEND_URL}${path}`)

/**
 * Crea una nueva propiedad en el backend
 */
export async function createProperty(
  propertyData: PropertyData,
  token?: string
): Promise<CreatePropertyResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Si hay token, agregarlo al header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Transformar datos para backend schema
    const backendData = transformForBackend(propertyData)
    
    const response = await fetch(viaProxy(`/api/properties`), {
      method: 'POST',
      headers,
      body: JSON.stringify(backendData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `Error ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      property: data.property,
    }
  } catch (error) {
    console.error('Error creating property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al crear propiedad',
    }
  }
}

/**
 * Obtiene una propiedad por ID
 */
export async function getProperty(id: number): Promise<any> {
  try {
    const response = await fetch(viaProxy(`/api/properties/${id}`))
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching property:', error)
    throw error
  }
}

/**
 * Actualiza una propiedad existente
 */
export async function updateProperty(
  id: number,
  propertyData: Partial<PropertyData>,
  token?: string
): Promise<CreatePropertyResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(viaProxy(`/api/properties/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(propertyData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `Error ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      property: data.property,
    }
  } catch (error) {
    console.error('Error updating property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

