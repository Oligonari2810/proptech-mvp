from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class EmotionalMatchingService:
    """
    Servicio para calcular compatibilidad emocional entre
    el perfil del usuario y las propiedades
    """
    
    def __init__(self):
        # Pesos para diferentes categorías emocionales
        self.vibe_weights = {
            'vibes': 0.4,
            'lifestyle': 0.35,
            'community': 0.25
        }
    
    def calculate_emotional_compatibility(self, 
                                       user_profile: Dict[str, List[str]], 
                                       property_profile: Dict[str, Any]) -> float:
        """
        Calcula compatibilidad emocional entre usuario y propiedad (0-1)
        
        Args:
            user_profile: Perfil emocional del usuario (resultado de NLP)
                {
                    'vibes': ['tranquilo', 'acogedor'],
                    'lifestyle': ['family-friendly', 'pet-friendly'],
                    'community': ['familiar']
                }
            property_profile: Perfil emocional de la propiedad
                {
                    'vibes': ['tranquilo', 'moderno'],
                    'lifestyle': ['family-friendly'],
                    'community': ['familiar'],
                    'energy': 7,  # 1-10
                    'privacy': 8  # 1-10
                }
        
        Returns:
            float: Score de compatibilidad (0.0 - 1.0)
        """
        if not property_profile or not user_profile:
            return 0.0
        
        total_score = 0.0
        total_weight = 0.0
        
        # Calcular score por categoría emocional
        for category, weight in self.vibe_weights.items():
            user_emotions = user_profile.get(category, [])
            property_emotions = property_profile.get(category, [])
            
            if user_emotions and property_emotions:
                # Calcular overlap de emociones
                user_set = set([e.replace('-', '_') for e in user_emotions])
                property_set = set([str(e).replace('-', '_') for e in property_emotions])
                
                matches = user_set & property_set
                max_possible = len(user_set)
                
                if max_possible > 0:
                    category_score = len(matches) / max_possible
                    total_score += category_score * weight
                    total_weight += weight
            elif user_emotions:
                # Usuario tiene preferencias pero propiedad no tiene datos
                # Penalizar ligeramente
                total_weight += weight * 0.5
        
        # Normalizar score si hay weight total
        if total_weight > 0:
            base_score = total_score / total_weight if total_weight > 0 else 0.0
        else:
            base_score = 0.0
        
        # Ajustar por energía y privacidad si existen
        energy_match = self._calculate_energy_match(user_profile, property_profile)
        privacy_match = self._calculate_privacy_match(user_profile, property_profile)
        
        final_score = base_score
        
        # Aplicar ajustes de energía y privacidad (20% cada uno si existen)
        if energy_match is not None:
            final_score = (final_score * 0.8) + (energy_match * 0.2)
        if privacy_match is not None:
            final_score = (final_score * 0.8) + (privacy_match * 0.2)
        
        return min(final_score, 1.0)
    
    def _calculate_energy_match(self, user_profile: Dict, property_profile: Dict) -> float:
        """
        Calcula compatibilidad de energía (vibrante vs tranquilo)
        
        Returns:
            float: Score de compatibilidad de energía (0-1) o None si no aplica
        """
        user_vibes = user_profile.get('vibes', [])
        property_energy = property_profile.get('energy')
        
        if not user_vibes or property_energy is None:
            return None
        
        # Determinar preferencia de energía del usuario
        user_energy_pref = 5  # Neutral por defecto
        
        if any(vibe in ['vibrante', 'animado', 'social', 'energético'] for vibe in user_vibes):
            user_energy_pref = 8
        elif any(vibe in ['tranquilo', 'pacífico', 'relajante', 'silencioso'] for vibe in user_vibes):
            user_energy_pref = 3
        
        # Calcular compatibilidad (1 - diferencia normalizada)
        # Diferencia máxima posible: 9 (entre 1 y 10)
        energy_diff = abs(user_energy_pref - property_energy) / 9.0
        return 1.0 - energy_diff
    
    def _calculate_privacy_match(self, user_profile: Dict, property_profile: Dict) -> float:
        """
        Calcula compatibilidad de privacidad
        
        Returns:
            float: Score de compatibilidad de privacidad (0-1) o None si no aplica
        """
        user_lifestyle = user_profile.get('lifestyle', [])
        property_privacy = property_profile.get('privacy')
        
        if not user_lifestyle or property_privacy is None:
            return None
        
        # Determinar preferencia de privacidad del usuario
        user_privacy_pref = 5  # Neutral por defecto
        
        if any(lifestyle in ['retiro', 'work_from_home', 'work-from-home'] for lifestyle in user_lifestyle):
            user_privacy_pref = 8
        elif any(lifestyle in ['social', 'family_friendly', 'family-friendly'] for lifestyle in user_lifestyle):
            user_privacy_pref = 4
        
        # Calcular compatibilidad
        privacy_diff = abs(user_privacy_pref - property_privacy) / 9.0
        return 1.0 - privacy_diff
    
    def find_emotional_matches(self, 
                             user_query: str, 
                             nlp_analysis: Dict,
                             properties: List,
                             limit: int = 10) -> List[Dict]:
        """
        Encuentra propiedades que coincidan con el perfil emocional del usuario
        
        Args:
            user_query: Consulta original del usuario
            nlp_analysis: Resultado del análisis NLP emocional
            properties: Lista de propiedades a analizar
            limit: Número máximo de resultados
        
        Returns:
            List[Dict]: Lista de propiedades con scores de compatibilidad
        """
        user_profile = nlp_analysis.get('emotional_profile', {})
        
        if not user_profile or not any(user_profile.values()):
            logger.warning("Perfil emocional del usuario vacío, no se puede hacer matching")
            return []
        
        scored_properties = []
        
        for property in properties:
            # Obtener perfil emocional de la propiedad
            if hasattr(property, 'emotional_profile') and property.emotional_profile:
                property_profile = property.emotional_profile
            elif hasattr(property, 'emotional_tags') and property.emotional_tags:
                # Convertir tags legacy a perfil emocional
                property_profile = self._convert_tags_to_profile(property.emotional_tags)
            else:
                property_profile = {}
            
            compatibility = self.calculate_emotional_compatibility(
                user_profile, 
                property_profile
            )
            
            # Solo incluir propiedades con compatibilidad significativa
            if compatibility > 0.1:  # Threshold mínimo
                scored_properties.append({
                    'property': property,
                    'compatibility_score': compatibility,
                    'emotional_insights': self._generate_emotional_insights(
                        user_profile, property_profile
                    )
                })
        
        # Ordenar por compatibilidad descendente
        scored_properties.sort(key=lambda x: x['compatibility_score'], reverse=True)
        
        logger.info(f"Encontradas {len(scored_properties)} propiedades emocionalmente compatibles (de {len(properties)} totales)")
        return scored_properties[:limit]
    
    def _convert_tags_to_profile(self, tags: List[str]) -> Dict[str, Any]:
        """
        Convierte tags emocionales legacy a perfil emocional rico
        """
        if not tags:
            return {}
        
        tags_lower = [tag.lower() for tag in tags]
        
        profile = {
            'vibes': [],
            'lifestyle': [],
            'community': []
        }
        
        # Mapear tags a categorías emocionales
        vibe_tags = ['lujo', 'lujoso', 'exclusivo', 'moderno', 'contemporáneo', 'tranquilo', 'acogedor', 'vibrante']
        lifestyle_tags = ['familiar', 'family-friendly', 'pet-friendly', 'work-from-home', 'retiro', 'social']
        community_tags = ['familiar', 'joven', 'profesional', 'artístico', 'tranquilo']
        
        for tag in tags_lower:
            if any(vt in tag for vt in vibe_tags):
                profile['vibes'].append(tag)
            elif any(lt in tag for lt in lifestyle_tags):
                profile['lifestyle'].append(tag)
            elif any(ct in tag for ct in community_tags):
                profile['community'].append(tag)
        
        return profile
    
    def _generate_emotional_insights(self, user_profile: Dict, property_profile: Dict) -> List[str]:
        """
        Genera insights emocionales para explicar el matching
        
        Returns:
            List[str]: Lista de insights que explican por qué la propiedad es compatible
        """
        insights = []
        
        for category in ['vibes', 'lifestyle', 'community']:
            user_emotions = user_profile.get(category, [])
            property_emotions = property_profile.get(category, [])
            
            if user_emotions and property_emotions:
                user_set = set([e.replace('-', '_') for e in user_emotions])
                property_set = set([str(e).replace('-', '_') for e in property_emotions])
                
                matches = user_set & property_set
                if matches:
                    category_name = {
                        'vibes': 'ambiente',
                        'lifestyle': 'estilo de vida',
                        'community': 'comunidad'
                    }.get(category, category)
                    insights.append(f"Coincide en {category_name}: {', '.join(list(matches)[:2])}")
        
        # Añadir insight sobre energía si aplica
        property_energy = property_profile.get('energy')
        if property_energy:
            if property_energy >= 7:
                insights.append("Ambiente vibrante y activo")
            elif property_energy <= 4:
                insights.append("Ambiente tranquilo y relajante")
        
        return insights[:3]  # Máximo 3 insights

