import re
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class EmotionalNLPService:
    """
    Servicio de NLP para analizar consultas en lenguaje natural
    y extraer el perfil emocional del usuario
    """
    
    def __init__(self):
        self.emotional_patterns = {
            'vibes': {
                'tranquilo': [r'tranquilo', r'pacífico', r'silencioso', r'relajante', r'descansar', r'reposo'],
                'vibrante': [r'vibrante', r'animado', r'energético', r'activo', r'social', r'vida.*noche'],
                'acogedor': [r'acogedor', r'cálido', r'íntimo', r'familiar', r'confortable', r'cómodo'],
                'moderno': [r'moderno', r'contemporáneo', r'minimalista', r'diseño', r'innovador', r'actual'],
                'lujoso': [r'lujoso', r'exclusivo', r'premium', r'elegante', r'sofisticado', r'élite'],
                'bohemio': [r'bohemio', r'artístico', r'creativo', r'único', r'ecológico', r'alternativo']
            },
            'lifestyle': {
                'family-friendly': [r'familia', r'niños', r'seguro', r'jardín', r'escuela', r'colegio', r'hijos'],
                'pet-friendly': [r'mascota', r'perro', r'gato', r'animales', r'patio', r'peludo'],
                'work-from-home': [r'trabajar', r'oficina', r'remoto', r'estudio', r'concentración', r'home.*office'],
                'retiro': [r'jubilación', r'retiro', r'tranquilo', r'descanso', r'jardín', r'retirado'],
                'social': [r'social', r'amigos', r'reuniones', r'terraza', r'entretenimiento', r'fiestas']
            },
            'community': {
                'familiar': [r'familia', r'niños', r'parque', r'seguro', r'comunitario', r'residencial.*familiar'],
                'joven': [r'joven', r'estudiante', r'universidad', r'noche', r'diversión', r'universitario'],
                'profesional': [r'profesional', r'trabajo', r'corporativo', r'ejecutivo', r'centro.*negocios', r'oficina'],
                'artístico': [r'artístico', r'creativo', r'cultural', r'galería', r'música', r'teatro'],
                'tranquilo': [r'tranquilo', r'silencioso', r'residencial', r'privado', r'exclusivo', r'calmado']
            }
        }
    
    def analyze_query(self, user_query: str) -> Dict[str, Any]:
        """
        Analiza una consulta en lenguaje natural y extrae el perfil emocional
        
        Args:
            user_query: Consulta del usuario en lenguaje natural
                Ejemplo: "hogar tranquilo para mi familia y mi perro"
        
        Returns:
            Dict con análisis emocional completo:
            {
                'original_query': str,
                'emotional_profile': {
                    'vibes': [...],
                    'lifestyle': [...],
                    'community': [...]
                },
                'intent': str,
                'confidence': float (0-1),
                'matched_patterns': [...]
            }
        """
        if not user_query or not user_query.strip():
            return {
                'original_query': '',
                'emotional_profile': {'vibes': [], 'lifestyle': [], 'community': []},
                'intent': 'general',
                'confidence': 0.0,
                'matched_patterns': []
            }
        
        query = user_query.lower().strip()
        
        analysis = {
            'original_query': user_query,
            'emotional_profile': {
                'vibes': [],
                'lifestyle': [],
                'community': []
            },
            'intent': self._detect_intent(query),
            'confidence': 0.0,
            'matched_patterns': []
        }
        
        # Analizar patrones emocionales
        total_matches = 0
        for category, patterns in self.emotional_patterns.items():
            for emotion, regex_patterns in patterns.items():
                for pattern in regex_patterns:
                    if re.search(pattern, query, re.IGNORECASE):
                        emotion_key = emotion.replace('-', '_') if '-' in emotion else emotion
                        if emotion_key not in analysis['emotional_profile'][category]:
                            analysis['emotional_profile'][category].append(emotion_key)
                            analysis['matched_patterns'].append({
                                'category': category,
                                'emotion': emotion_key,
                                'pattern': pattern
                            })
                            total_matches += 1
                        break  # Una vez encontrado el match, pasar a la siguiente emoción
        
        # Calcular confianza basada en matches
        # Mínimo 1 match = 0.2, máximo 5+ matches = 1.0
        analysis['confidence'] = min(0.2 + (total_matches * 0.15), 1.0)
        
        logger.info(f"Análisis emocional para '{user_query}': {analysis['emotional_profile']}")
        return analysis
    
    def _detect_intent(self, query: str) -> str:
        """
        Detecta la intención principal del usuario
        
        Args:
            query: Consulta en minúsculas
        
        Returns:
            str: Intención detectada ('investment', 'rental', 'family_living', etc.)
        """
        query = query.lower()
        
        if any(word in query for word in ['comprar', 'invertir', 'inversión', 'rentabilidad', 'roi', 'retorno']):
            return 'investment'
        elif any(word in query for word in ['alquilar', 'rentar', 'arrendar', 'alquiler']):
            return 'rental'
        elif any(word in query for word in ['familia', 'niños', 'escuela', 'seguro', 'hijos', 'padres']):
            return 'family_living'
        elif any(word in query for word in ['trabajar', 'oficina', 'remoto', 'estudio', 'trabajo', 'profesional']):
            return 'work_living'
        elif any(word in query for word in ['retiro', 'jubilación', 'descanso', 'retirado']):
            return 'retirement'
        elif any(word in query for word in ['vender', 'venta', 'vendo', 'publicar']):
            return 'selling'
        else:
            return 'general_living'
    
    def generate_emotional_summary(self, analysis: Dict) -> str:
        """
        Genera un resumen emocional amigable para el usuario
        
        Args:
            analysis: Resultado de analyze_query()
        
        Returns:
            str: Resumen emocional en lenguaje natural
        """
        profile = analysis.get('emotional_profile', {})
        
        if not any(profile.values()):
            intent = analysis.get('intent', 'general')
            if intent == 'investment':
                return "Estoy buscando propiedades con buen potencial de inversión para ti."
            elif intent == 'rental':
                return "Voy a encontrar las mejores opciones de alquiler según tus necesidades."
            elif intent == 'family_living':
                return "Buscaré propiedades ideales para familias en zonas seguras."
            else:
                return "Estoy buscando propiedades que se adapten a tus necesidades específicas."
        
        parts = []
        
        if profile.get('vibes'):
            vibes_str = ', '.join(profile['vibes'][:2])  # Máximo 2 vibes
            parts.append(f"buscas un ambiente {vibes_str}")
        
        if profile.get('lifestyle'):
            lifestyle_str = ', '.join(profile['lifestyle'][:2])  # Máximo 2 lifestyles
            parts.append(f"que se adapte a un estilo de vida {lifestyle_str}")
        
        if profile.get('community'):
            community_str = ', '.join(profile['community'][:1])  # Máximo 1 community
            parts.append(f"en una comunidad {community_str}")
        
        summary = "Entiendo que " + ", ".join(parts) + "."
        
        # Añadir según intención
        intent = analysis.get('intent', 'general')
        if intent == 'family_living':
            summary += " Voy a buscar propiedades ideales para familias."
        elif intent == 'investment':
            summary += " Me enfocaré en propiedades con buen potencial de inversión."
        elif intent == 'retirement':
            summary += " Buscaré propiedades tranquilas perfectas para el retiro."
        elif intent == 'work_living':
            summary += " Te mostraré propiedades con espacios ideales para trabajar desde casa."
        
        return summary

