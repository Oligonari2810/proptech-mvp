"""
Emotional Valuation Service - Backend service para HabitaScore IA Emocional
Calcula factores emocionales que van más allá del precio tradicional
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
import math

# Importar servicios avanzados (opcionales)
try:
    from ai.services.geospatial_service import GeospatialService
    from ai.services.valuation_explainer_service import ValuationExplainerService
    GEOSPATIAL_AVAILABLE = True
except ImportError:
    GEOSPATIAL_AVAILABLE = False
    GeospatialService = None
    ValuationExplainerService = None


class EmotionalFactorsService:
    """Servicio para calcular factores emocionales de propiedades"""
    
    def calculate_emotional_factors(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calcula factores emocionales basados en datos de la propiedad
        
        Args:
            property_data: Diccionario con datos de la propiedad
        
        Returns:
            Diccionario con factores emocionales calculados
        """
        location = property_data.get('location', '')
        latitude = property_data.get('latitude')
        longitude = property_data.get('longitude')
        zone = property_data.get('zone', 'standard')
        property_type = property_data.get('property_type', 'apartment')
        features = property_data.get('features', [])
        proximity_beach = property_data.get('proximity_beach') or property_data.get('proximityBeach')
        proximity_schools = property_data.get('proximity_schools') or property_data.get('proximitySchools')
        
        # Lifestyle Quality
        lifestyle_quality = {
            'green_spaces': self._calculate_green_space_score(zone, latitude, longitude),
            'noise_level': self._calculate_noise_level(zone, property_type),
            'air_quality': self._calculate_air_quality(zone, proximity_beach),
            'community_vibe': self._calculate_community_vibe(zone, property_type),
            'safety_score': self._calculate_safety_score(zone)
        }
        
        # Emotional Amenities
        emotional_amenities = {
            'wellness_focus': self._has_wellness_features(features),
            'social_spaces': self._has_social_spaces(features),
            'creative_spaces': self._has_creative_spaces(features),
            'family_friendly': self._is_family_friendly(features, proximity_schools)
        }
        
        # Proximity Quality
        proximity_quality = {
            'parks': self._estimate_park_proximity(zone),
            'schools': (proximity_schools * 1000) if proximity_schools else 2000,
            'transport': self._estimate_transport_proximity(property_type, zone),
            'commerce': self._estimate_commerce_proximity(zone),
            'beach': (proximity_beach * 1000) if proximity_beach else 10000
        }
        
        return {
            'lifestyle_quality': lifestyle_quality,
            'emotional_amenities': emotional_amenities,
            'proximity_quality': proximity_quality
        }
    
    def calculate_emotional_score(self, emotional_factors: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calcula el score emocional total basado en factores emocionales
        
        Args:
            emotional_factors: Factores emocionales calculados
        
        Returns:
            Diccionario con scores emocionales y breakdown
        """
        lifestyle_quality = emotional_factors['lifestyle_quality']
        emotional_amenities = emotional_factors['emotional_amenities']
        proximity_quality = emotional_factors['proximity_quality']
        
        # Lifestyle Score (promedio de lifestyle_quality)
        lifestyle_scores = [
            lifestyle_quality['green_spaces'],
            lifestyle_quality['noise_level'],
            lifestyle_quality['air_quality'],
            lifestyle_quality['community_vibe'],
            lifestyle_quality['safety_score']
        ]
        lifestyle_score = sum(lifestyle_scores) / len(lifestyle_scores) * 10  # 0-100
        
        # Wellness Score
        wellness_score = 50  # Base
        if emotional_amenities['wellness_focus']:
            wellness_score += 15
        if emotional_amenities['social_spaces']:
            wellness_score += 10
        if emotional_amenities['creative_spaces']:
            wellness_score += 10
        if emotional_amenities['family_friendly']:
            wellness_score += 15
        wellness_score = min(100, wellness_score)
        
        # Community Score
        community_score = 50  # Base
        if proximity_quality['parks'] < 500:
            community_score += 15
        if proximity_quality['schools'] < 1000:
            community_score += 10
        if proximity_quality['transport'] < 500:
            community_score += 10
        if proximity_quality['commerce'] < 300:
            community_score += 15
        community_score = min(100, community_score)
        
        # Emotional Score Total (promedio ponderado)
        emotional_score = round(
            (lifestyle_score * 0.5) + (wellness_score * 0.3) + (community_score * 0.2)
        )
        
        # Generar insights
        factors = []
        insights = []
        recommendations = []
        
        if lifestyle_quality['green_spaces'] > 8:
            factors.append('Áreas verdes excelentes')
            insights.append('📍 Excelente conexión con naturaleza - parques cercanos elevan calidad de vida')
        
        if lifestyle_quality['community_vibe'] > 7:
            factors.append('Comunidad vibrante')
            insights.append('🤝 Ambiente social positivo - comunidad activa detectada')
        
        if emotional_amenities['wellness_focus']:
            factors.append('Espacios wellness')
            insights.append('🧘 Ambiente enfocado en bienestar - espacios para relajación y ejercicio')
        
        if proximity_quality['parks'] < 500:
            recommendations.append('Caminatas matutinas en parques cercanos')
        
        if emotional_amenities['family_friendly']:
            factors.append('Ideal para familias')
            insights.append('👨‍👩‍👧‍👦 Entorno seguro y diseñado para familias')
            recommendations.append('Zona perfecta para crecimiento familiar')
        
        return {
            'emotional_score': emotional_score,
            'lifestyle_score': round(lifestyle_score),
            'wellness_score': wellness_score,
            'community_score': community_score,
            'breakdown': {
                'factors': factors,
                'insights': insights,
                'recommendations': recommendations
            }
        }
    
    # ===== FUNCIONES AUXILIARES =====
    
    def _calculate_green_space_score(self, zone: str, latitude: Optional[float], longitude: Optional[float]) -> int:
        """Calcula score de espacios verdes (0-10)"""
        if zone == 'premium':
            return 9
        elif zone == 'standard':
            return 6
        else:
            return 4
    
    def _calculate_noise_level(self, zone: str, property_type: str) -> int:
        """Calcula nivel de ruido (0-10, 10 = silencioso)"""
        if zone == 'premium':
            return 8
        elif property_type in ['villa', 'penthouse']:
            return 9
        else:
            return 6
    
    def _calculate_air_quality(self, zone: str, proximity_beach: Optional[float]) -> int:
        """Calcula calidad del aire (0-10)"""
        if zone == 'premium':
            return 8
        elif proximity_beach and proximity_beach <= 2:
            return 9
        else:
            return 7
    
    def _calculate_community_vibe(self, zone: str, property_type: str) -> int:
        """Calcula vibración comunitaria (0-10)"""
        if zone == 'premium':
            return 8
        elif property_type == 'apartment':
            return 7
        else:
            return 6
    
    def _calculate_safety_score(self, zone: str) -> int:
        """Calcula score de seguridad (0-10)"""
        if zone == 'premium':
            return 9
        elif zone == 'standard':
            return 7
        else:
            return 5
    
    def _has_wellness_features(self, features: List[str]) -> bool:
        """Verifica si tiene características wellness"""
        wellness_keywords = ['gym', 'spa', 'wellness', 'piscina', 'yoga', 'fitness', 'pool']
        return any(keyword in str(f).lower() for f in features for keyword in wellness_keywords)
    
    def _has_social_spaces(self, features: List[str]) -> bool:
        """Verifica si tiene espacios sociales"""
        social_keywords = ['terraza', 'área social', 'salón', 'comunal', 'recreación']
        return any(keyword in str(f).lower() for f in features for keyword in social_keywords)
    
    def _has_creative_spaces(self, features: List[str]) -> bool:
        """Verifica si tiene espacios creativos"""
        creative_keywords = ['estudio', 'taller', 'oficina', 'workspace']
        return any(keyword in str(f).lower() for f in features for keyword in creative_keywords)
    
    def _is_family_friendly(self, features: List[str], proximity_schools: Optional[float]) -> bool:
        """Verifica si es amigable para familias"""
        family_keywords = ['parque', 'infantil', 'seguridad', 'guardería', 'escuela']
        has_family_features = any(keyword in str(f).lower() for f in features for keyword in family_keywords)
        is_near_schools = proximity_schools and proximity_schools <= 1
        return has_family_features or is_near_schools
    
    def _estimate_park_proximity(self, zone: str) -> int:
        """Estima proximidad a parques en metros"""
        if zone == 'premium':
            return 300
        elif zone == 'standard':
            return 800
        else:
            return 1500
    
    def _estimate_transport_proximity(self, property_type: str, zone: str) -> int:
        """Estima proximidad a transporte en metros"""
        if property_type == 'apartment':
            return 200
        elif zone == 'premium':
            return 400
        else:
            return 800
    
    def _estimate_commerce_proximity(self, zone: str) -> int:
        """Estima proximidad a comercios en metros"""
        if zone == 'premium':
            return 150
        elif zone == 'standard':
            return 400
        else:
            return 800


class EmotionalValuationService:
    """Servicio completo para valoración emocional avanzada"""
    
    def __init__(self):
        self.emotional_factors_service = EmotionalFactorsService()
        self.geospatial_service = GeospatialService() if GEOSPATIAL_AVAILABLE and GeospatialService else None
        self.explainer_service = ValuationExplainerService() if GEOSPATIAL_AVAILABLE and ValuationExplainerService else None
    
    def calculate_advanced_valuation(
        self,
        property_data: Dict[str, Any],
        base_valuation: Dict[str, Any],
        use_geospatial: bool = False
    ) -> Dict[str, Any]:
        """
        Calcula valoración avanzada con factores emocionales
        
        Args:
            property_data: Datos de la propiedad
            base_valuation: Valoración base calculada previamente
            use_geospatial: Si True, usa datos geoespaciales en tiempo real
        
        Returns:
            Valoración avanzada con factores emocionales
        """
        # Usar datos geoespaciales si están disponibles y solicitados
        if use_geospatial and self.geospatial_service:
            latitude = property_data.get('latitude')
            longitude = property_data.get('longitude')
            
            if latitude and longitude:
                # Obtener factores emocionales desde datos geoespaciales
                geospatial_factors = self.geospatial_service.get_emotional_factors_from_location(
                    latitude, longitude, property_data.get('location')
                )
                
                # Combinar factores geoespaciales con factores calculados
                emotional_factors = self.emotional_factors_service.calculate_emotional_factors(property_data)
                
                # Enriquecer con datos geoespaciales
                if 'green_spaces' in geospatial_factors:
                    emotional_factors['lifestyle_quality']['green_spaces'] = geospatial_factors['green_spaces'].get('score', 6)
                if 'noise_level' in geospatial_factors:
                    emotional_factors['lifestyle_quality']['noise_level'] = geospatial_factors['noise_level'].get('score', 6)
                if 'air_quality' in geospatial_factors:
                    emotional_factors['lifestyle_quality']['air_quality'] = geospatial_factors['air_quality'].get('score', 7)
                if 'proximity_data' in geospatial_factors:
                    # Actualizar proximity_quality con datos reales
                    proximity_data = geospatial_factors['proximity_data']
                    if proximity_data.get('parks'):
                        nearest_park = proximity_data['parks'][0]
                        emotional_factors['proximity_quality']['parks'] = nearest_park.get('distance', 800)
                    if proximity_data.get('schools'):
                        nearest_school = proximity_data['schools'][0]
                        emotional_factors['proximity_quality']['schools'] = nearest_school.get('distance', 2000)
            else:
                # Sin coordenadas, usar cálculo estándar
                emotional_factors = self.emotional_factors_service.calculate_emotional_factors(property_data)
        else:
            # Calcular factores emocionales estándar
            emotional_factors = self.emotional_factors_service.calculate_emotional_factors(property_data)
        
        # Calcular score emocional
        emotional_result = self.emotional_factors_service.calculate_emotional_score(emotional_factors)
        
        # Aplicar multiplicador emocional al precio base
        emotional_multiplier = self._calculate_emotional_multiplier(emotional_result['emotional_score'])
        
        base_price = base_valuation.get('priceRange', {}).get('avg', 0) or base_valuation.get('estimated_value', 0)
        
        adjusted_price = {
            'min': round(base_valuation.get('priceRange', {}).get('min', base_price * 0.85) * emotional_multiplier),
            'max': round(base_valuation.get('priceRange', {}).get('max', base_price * 1.15) * emotional_multiplier),
            'avg': round(base_price * emotional_multiplier)
        }
        
        # Calcular intervalo de confianza dinámico
        confidence_level = self._calculate_dynamic_confidence(property_data, emotional_result)
        confidence_interval = {
            'lower': round(adjusted_price['avg'] * (1 - (100 - confidence_level) / 100)),
            'upper': round(adjusted_price['avg'] * (1 + (100 - confidence_level) / 100)),
            'confidence_level': confidence_level
        }
        
        # Actualizar confidence
        final_confidence = base_valuation.get('confidence', 'medium')
        if emotional_result['emotional_score'] > 80 and final_confidence != 'low':
            final_confidence = 'high'
        elif emotional_result['emotional_score'] < 40:
            final_confidence = 'medium'
        
        # Generar explicación avanzada si el servicio está disponible
        advanced_insights = None
        if self.explainer_service:
            try:
                advanced_insights = self.explainer_service.generate_emotional_insights(
                    {
                        'emotional_score': emotional_result['emotional_score'],
                        'emotional_breakdown': emotional_result,
                        'priceRange': adjusted_price,
                        'score': min(800, base_valuation.get('score', 400) + (emotional_result['emotional_score'] // 10))
                    },
                    property_data
                )
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"Error generando insights avanzados: {e}")
        
        result = {
            **base_valuation,
            'score': min(800, base_valuation.get('score', 400) + (emotional_result['emotional_score'] // 10)),
            'priceRange': adjusted_price,
            'confidence': final_confidence,
            'emotional_score': emotional_result['emotional_score'],
            'emotional_breakdown': {
                'lifestyle_score': emotional_result['lifestyle_score'],
                'wellness_score': emotional_result['wellness_score'],
                'community_score': emotional_result['community_score'],
                'factors': emotional_result['breakdown']['factors'],
                'insights': emotional_result['breakdown']['insights'],
                'recommendations': emotional_result['breakdown']['recommendations']
            },
            'confidence_interval': confidence_interval
        }
        
        # Agregar insights avanzados si están disponibles
        if advanced_insights:
            result['advanced_insights'] = advanced_insights
        
        return result
    
    def _calculate_emotional_multiplier(self, emotional_score: int) -> float:
        """Calcula multiplicador emocional basado en score (0-100)"""
        base_multiplier = 1.0
        emotional_impact = (emotional_score - 50) / 100  # -0.5 a +0.5
        return base_multiplier + (emotional_impact * 0.15)  # ±7.5% máximo
    
    def _calculate_dynamic_confidence(self, property_data: Dict[str, Any], emotional_result: Dict[str, Any]) -> int:
        """Calcula nivel de confianza dinámico (60-95%)"""
        confidence_level = 85  # Base
        
        # Aumentar si score emocional alto
        if emotional_result['emotional_score'] > 70:
            confidence_level += 5
        
        # Reducir si faltan datos críticos
        if not property_data.get('proximity_beach') and not property_data.get('proximity_schools'):
            confidence_level -= 10
        
        return max(60, min(95, confidence_level))

