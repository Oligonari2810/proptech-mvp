"""
Geospatial Service - Datos geoespaciales en tiempo real para factores emocionales
Integra APIs externas para obtener datos precisos del entorno
"""

from typing import Dict, Optional, Tuple, Any
import os
import requests
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class GeospatialService:
    """Servicio para obtener datos geoespaciales del entorno de una propiedad"""
    
    def __init__(self):
        self.google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY', '')
        self.openweather_api_key = os.getenv('OPENWEATHER_API_KEY', '')
        self.mapbox_token = os.getenv('MAPBOX_ACCESS_TOKEN', '')
    
    def get_emotional_factors_from_location(
        self,
        latitude: float,
        longitude: float,
        location_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Obtiene factores emocionales del entorno basados en coordenadas GPS
        
        Args:
            latitude: Latitud de la propiedad
            longitude: Longitud de la propiedad
            location_name: Nombre de la ubicación (opcional)
        
        Returns:
            Diccionario con factores emocionales calculados
        """
        if not latitude or not longitude:
            return self._get_default_factors()
        
        try:
            # Calcular factores geoespaciales
            factors = {
                'green_spaces': self._calculate_green_space_proximity(latitude, longitude),
                'noise_level': self._get_noise_level_data(latitude, longitude),
                'air_quality': self._get_air_quality_index(latitude, longitude),
                'community_vibe': self._analyze_community_sentiment(latitude, longitude),
                'safety_score': self._get_crime_safety_data(latitude, longitude),
                'proximity_data': {
                    'parks': self._find_nearest_parks(latitude, longitude),
                    'schools': self._find_nearest_schools(latitude, longitude),
                    'transport': self._find_nearest_transport(latitude, longitude),
                    'commerce': self._find_nearest_commerce(latitude, longitude),
                    'healthcare': self._find_nearest_healthcare(latitude, longitude)
                }
            }
            
            return factors
        except Exception as e:
            logger.error(f"Error obteniendo factores geoespaciales: {e}")
            return self._get_default_factors()
    
    def _calculate_green_space_proximity(self, lat: float, lng: float) -> Dict[str, Any]:
        """Calcula proximidad a espacios verdes usando Google Places API"""
        if not self.google_maps_api_key:
            # Fallback: estimación basada en ubicación
            return {
                'score': 7,
                'nearest_park_distance': 500,
                'parks_count_1km': 2,
                'total_green_space_area': 0.5
            }
        
        try:
            # Buscar parques cercanos usando Google Places API
            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            params = {
                'location': f'{lat},{lng}',
                'radius': 1000,  # 1km
                'type': 'park',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                if results:
                    # Calcular distancia al parque más cercano
                    nearest_park = results[0]
                    nearest_distance = self._calculate_distance(
                        lat, lng,
                        nearest_park['geometry']['location']['lat'],
                        nearest_park['geometry']['location']['lng']
                    )
                    
                    # Score basado en proximidad (más cerca = score más alto)
                    if nearest_distance < 200:
                        score = 10
                    elif nearest_distance < 500:
                        score = 9
                    elif nearest_distance < 1000:
                        score = 7
                    else:
                        score = 5
                    
                    return {
                        'score': score,
                        'nearest_park_distance': round(nearest_distance),
                        'parks_count_1km': len(results),
                        'total_green_space_area': len(results) * 0.5,  # Estimación
                        'parks': [
                            {
                                'name': p.get('name', 'Parque'),
                                'distance': round(self._calculate_distance(
                                    lat, lng,
                                    p['geometry']['location']['lat'],
                                    p['geometry']['location']['lng']
                                ))
                            }
                            for p in results[:5]  # Top 5 más cercanos
                        ]
                    }
        except Exception as e:
            logger.warning(f"Error obteniendo datos de parques: {e}")
        
        # Fallback
        return {
            'score': 6,
            'nearest_park_distance': 800,
            'parks_count_1km': 1,
            'total_green_space_area': 0.3
        }
    
    def _get_noise_level_data(self, lat: float, lng: float) -> Dict[str, Any]:
        """Obtiene datos de nivel de ruido (estimado basado en ubicación)"""
        # Nota: No hay API pública gratuita para ruido en tiempo real
        # Usamos heurísticas basadas en proximidad a carreteras principales
        
        try:
            # Buscar carreteras principales cercanas
            if self.google_maps_api_key:
                url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
                params = {
                    'location': f'{lat},{lng}',
                    'radius': 500,
                    'type': 'route',
                    'key': self.google_maps_api_key
                }
                
                response = requests.get(url, params=params, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    routes_count = len(data.get('results', []))
                    
                    # Score inverso: más rutas = más ruido = score más bajo
                    if routes_count == 0:
                        score = 9  # Silencioso
                    elif routes_count <= 1:
                        score = 7  # Moderado
                    elif routes_count <= 3:
                        score = 5  # Ruidoso
                    else:
                        score = 3  # Muy ruidoso
                    
                    return {
                        'score': score,
                        'traffic_routes_nearby': routes_count,
                        'estimated_noise_level': 'low' if score >= 7 else 'medium' if score >= 5 else 'high'
                    }
        except Exception as e:
            logger.warning(f"Error obteniendo datos de ruido: {e}")
        
        # Fallback: score moderado
        return {
            'score': 6,
            'traffic_routes_nearby': 1,
            'estimated_noise_level': 'medium'
        }
    
    def _get_air_quality_index(self, lat: float, lng: float) -> Dict[str, Any]:
        """Obtiene índice de calidad del aire usando OpenWeather API"""
        if not self.openweather_api_key:
            # Fallback: estimación básica
            return {
                'score': 7,
                'aqi': 50,
                'pm25': 15,
                'status': 'good'
            }
        
        try:
            # OpenWeather Air Pollution API
            url = 'http://api.openweathermap.org/data/2.5/air_pollution'
            params = {
                'lat': lat,
                'lon': lng,
                'appid': self.openweather_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                air_data = data.get('list', [{}])[0]
                components = air_data.get('components', {})
                
                aqi = air_data.get('main', {}).get('aqi', 3)  # 1-5 scale
                pm25 = components.get('pm2_5', 25)
                
                # Convertir AQI a score 0-10 (inverso: mejor aire = score más alto)
                aqi_to_score = {
                    1: 10,  # Good
                    2: 8,   # Fair
                    3: 6,   # Moderate
                    4: 4,   # Poor
                    5: 2    # Very Poor
                }
                
                score = aqi_to_score.get(aqi, 6)
                
                aqi_status = {
                    1: 'excellent',
                    2: 'good',
                    3: 'moderate',
                    4: 'poor',
                    5: 'very_poor'
                }.get(aqi, 'moderate')
                
                return {
                    'score': score,
                    'aqi': aqi,
                    'pm25': round(pm25, 1),
                    'pm10': round(components.get('pm10', 30), 1),
                    'status': aqi_status,
                    'timestamp': datetime.utcnow().isoformat()
                }
        except Exception as e:
            logger.warning(f"Error obteniendo calidad del aire: {e}")
        
        # Fallback
        return {
            'score': 7,
            'aqi': 2,
            'pm25': 20,
            'status': 'good'
        }
    
    def _analyze_community_sentiment(self, lat: float, lng: float) -> Dict[str, Any]:
        """Analiza vibración comunitaria basada en amenities cercanos"""
        try:
            # Buscar amenities que indican comunidad activa
            community_amenities = []
            score = 5  # Base
            
            if self.google_maps_api_key:
                # Buscar centros comunitarios, gimnasios, restaurantes
                amenity_types = ['gym', 'restaurant', 'cafe', 'shopping_mall']
                
                for amenity_type in amenity_types:
                    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
                    params = {
                        'location': f'{lat},{lng}',
                        'radius': 1000,
                        'type': amenity_type,
                        'key': self.google_maps_api_key
                    }
                    
                    response = requests.get(url, params=params, timeout=5)
                    if response.status_code == 200:
                        data = response.json()
                        count = len(data.get('results', []))
                        community_amenities.append({
                            'type': amenity_type,
                            'count': count
                        })
                        
                        # Aumentar score basado en amenities cercanos
                        if count > 0:
                            score += 1
                
                score = min(10, score)  # Max 10
        except Exception as e:
            logger.warning(f"Error analizando comunidad: {e}")
        
        return {
            'score': score,
            'amenities_count': len(community_amenities),
            'amenities': community_amenities
        }
    
    def _get_crime_safety_data(self, lat: float, lng: float) -> Dict[str, Any]:
        """Obtiene datos de seguridad (estimado basado en zona)"""
        # Nota: APIs de seguridad/crimen son limitadas y costosas
        # Usamos heurísticas basadas en tipo de área
        
        # Por ahora, devolvemos datos estimados
        # En producción, esto se integraría con APIs de seguridad local
        return {
            'score': 8,  # Estimado
            'safety_level': 'high',
            'crime_rate_estimated': 'low',
            'note': 'Estimación basada en zona - Datos precisos requieren API especializada'
        }
    
    def _find_nearest_parks(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Encuentra parques más cercanos"""
        green_data = self._calculate_green_space_proximity(lat, lng)
        return green_data.get('parks', [])
    
    def _find_nearest_schools(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Encuentra escuelas más cercanas"""
        if not self.google_maps_api_key:
            return []
        
        try:
            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            params = {
                'location': f'{lat},{lng}',
                'radius': 2000,  # 2km
                'type': 'school',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                return [
                    {
                        'name': r.get('name', 'Escuela'),
                        'distance': round(self._calculate_distance(
                            lat, lng,
                            r['geometry']['location']['lat'],
                            r['geometry']['location']['lng']
                        ))
                    }
                    for r in results[:5]
                ]
        except Exception as e:
            logger.warning(f"Error encontrando escuelas: {e}")
        
        return []
    
    def _find_nearest_transport(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Encuentra transporte público más cercano"""
        if not self.google_maps_api_key:
            return []
        
        try:
            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            params = {
                'location': f'{lat},{lng}',
                'radius': 1000,
                'type': 'transit_station',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                return [
                    {
                        'name': r.get('name', 'Transporte'),
                        'distance': round(self._calculate_distance(
                            lat, lng,
                            r['geometry']['location']['lat'],
                            r['geometry']['location']['lng']
                        )),
                        'type': r.get('types', ['transit_station'])[0]
                    }
                    for r in results[:3]
                ]
        except Exception as e:
            logger.warning(f"Error encontrando transporte: {e}")
        
        return []
    
    def _find_nearest_commerce(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Encuentra comercios más cercanos"""
        if not self.google_maps_api_key:
            return []
        
        try:
            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            params = {
                'location': f'{lat},{lng}',
                'radius': 500,
                'type': 'supermarket',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                return [
                    {
                        'name': r.get('name', 'Comercio'),
                        'distance': round(self._calculate_distance(
                            lat, lng,
                            r['geometry']['location']['lat'],
                            r['geometry']['location']['lng']
                        ))
                    }
                    for r in results[:3]
                ]
        except Exception as e:
            logger.warning(f"Error encontrando comercios: {e}")
        
        return []
    
    def _find_nearest_healthcare(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Encuentra servicios de salud más cercanos"""
        if not self.google_maps_api_key:
            return []
        
        try:
            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            params = {
                'location': f'{lat},{lng}',
                'radius': 2000,
                'type': 'hospital',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                return [
                    {
                        'name': r.get('name', 'Centro de salud'),
                        'distance': round(self._calculate_distance(
                            lat, lng,
                            r['geometry']['location']['lat'],
                            r['geometry']['location']['lng']
                        ))
                    }
                    for r in results[:3]
                ]
        except Exception as e:
            logger.warning(f"Error encontrando servicios de salud: {e}")
        
        return []
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula distancia en metros entre dos puntos GPS usando fórmula de Haversine"""
        from math import radians, cos, sin, asin, sqrt
        
        # Convertir grados a radianes
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        
        # Fórmula de Haversine
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        
        # Radio de la Tierra en metros
        r = 6371000
        
        return c * r
    
    def _get_default_factors(self) -> Dict[str, Any]:
        """Retorna factores por defecto si no hay coordenadas"""
        return {
            'green_spaces': {'score': 6, 'nearest_park_distance': 800},
            'noise_level': {'score': 6, 'estimated_noise_level': 'medium'},
            'air_quality': {'score': 7, 'status': 'good'},
            'community_vibe': {'score': 6, 'amenities_count': 0},
            'safety_score': {'score': 7, 'safety_level': 'high'},
            'proximity_data': {
                'parks': [],
                'schools': [],
                'transport': [],
                'commerce': [],
                'healthcare': []
            }
        }


# Alias para compatibilidad
GeospatialDataService = GeospatialService

