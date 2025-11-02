from typing import List, Dict, Any, Optional, Union
from flask import Blueprint, request, jsonify
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import json
from ai.services.emotional_nlp_service import EmotionalNLPService
from ai.services.emotional_matching_service import EmotionalMatchingService
from models import Property, db

logger = logging.getLogger(__name__)

emotional_bp = Blueprint('emotional_search', __name__)

# Inicializar servicios
nlp_service = EmotionalNLPService()
matching_service = EmotionalMatchingService()

@emotional_bp.route('/api/ai/emotional-search', methods=['POST'])
def emotional_search():
    """
    Endpoint para búsqueda emocional basada en lenguaje natural
    
    Request:
    {
        "query": "hogar tranquilo para mi familia y mi perro",
        "user_id": "optional",
        "filters": {
            "max_price": 400000,
            "min_bedrooms": 2,
            "operation": "compra"
        },
        "limit": 10
    }
    
    Response:
    {
        "success": true,
        "original_query": "...",
        "emotional_analysis": {...},
        "emotional_summary": "...",
        "matches_found": 5,
        "properties": [...],
        "suggested_queries": [...]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'success': False,
                'error': 'Query es requerida'
            }), 400
        
        user_query = data['query'].strip()
        
        if not user_query:
            return jsonify({
                'success': False,
                'error': 'Query no puede estar vacía'
            }), 400
        
        # Parámetros opcionales
        limit = data.get('limit', 10)
        filters = data.get('filters', {})
        user_id = data.get('user_id')
        
        # 1. Analizar consulta con NLP emocional
        nlp_analysis = nlp_service.analyze_query(user_query)
        
        # 2. Obtener propiedades activas con filtros
        query = Property.query.filter_by(is_active=True)
        
        # Aplicar filtros opcionales
        if filters.get('operation'):
            query = query.filter_by(operation=filters['operation'])
        if filters.get('max_price'):
            query = query.filter(Property.price <= filters['max_price'])
        if filters.get('min_price'):
            query = query.filter(Property.price >= filters['min_price'])
        if filters.get('min_bedrooms'):
            query = query.filter(Property.bedrooms >= filters['min_bedrooms'])
        if filters.get('property_type'):
            query = query.filter_by(property_type=filters['property_type'])
        
        properties = query.all()
        
        if not properties:
            logger.warning(f"No se encontraron propiedades con los filtros aplicados")
            return jsonify({
                'success': True,
                'original_query': user_query,
                'emotional_analysis': nlp_analysis,
                'emotional_summary': nlp_service.generate_emotional_summary(nlp_analysis),
                'matches_found': 0,
                'properties': [],
                'suggested_queries': _generate_suggested_queries(nlp_analysis),
                'message': 'No se encontraron propiedades que coincidan con tu búsqueda emocional'
            })
        
        # 3. Encontrar matches emocionales
        emotional_matches = matching_service.find_emotional_matches(
            user_query, nlp_analysis, properties, limit
        )
        
        # 4. Preparar respuesta
        results = []
        for match in emotional_matches:
            prop = match['property']
            
            # Serializar propiedad
            property_data = {
                'id': prop.id,
                'title': prop.title or 'Propiedad sin título',
                'price': float(prop.price) if prop.price else 0,
                'operation': prop.operation,
                'property_type': prop.property_type,
                'bedrooms': prop.bedrooms,
                'bathrooms': prop.bathrooms,
                'area': float(prop.area) if prop.area else None,
                'location': prop.location or '',
                'address': getattr(prop, 'address', None) or prop.location or '',
                'city': getattr(prop, 'city', None) or '',
                'latitude': float(prop.latitude) if prop.latitude else None,
                'longitude': float(prop.longitude) if prop.longitude else None,
                'images': prop.images if isinstance(prop.images, list) else [prop.image_url] if hasattr(prop, 'image_url') and prop.image_url else [],
                'image_url': prop.image_url if hasattr(prop, 'image_url') else (prop.images[0] if prop.images and isinstance(prop.images, list) else None),
                'features': prop.features if isinstance(prop.features, list) else [],
                'description': getattr(prop, 'description', None) or '',
                'compatibility_score': round(match['compatibility_score'], 3),
                'emotional_insights': match['emotional_insights']
            }
            results.append(property_data)
        
        # 5. Generar resumen emocional
        emotional_summary = nlp_service.generate_emotional_summary(nlp_analysis)
        
        response = {
            'success': True,
            'original_query': user_query,
            'emotional_analysis': nlp_analysis,
            'emotional_summary': emotional_summary,
            'matches_found': len(results),
            'properties': results,
            'suggested_queries': _generate_suggested_queries(nlp_analysis),
            'confidence': nlp_analysis.get('confidence', 0.0)
        }
        
        logger.info(f"Búsqueda emocional completada: {len(results)} propiedades encontradas para query '{user_query}'")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error en búsqueda emocional: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Error procesando búsqueda emocional',
            'message': str(e) if logger.level == logging.DEBUG else 'Error interno del servidor'
        }), 500

def _generate_suggested_queries(nlp_analysis: dict) -> list:
    """
    Genera consultas sugeridas basadas en el análisis emocional
    
    Args:
        nlp_analysis: Resultado del análisis NLP
    
    Returns:
        List[str]: Lista de consultas sugeridas (máximo 3)
    """
    profile = nlp_analysis.get('emotional_profile', {})
    suggestions = []
    
    # Sugerencias basadas en vibes detectados
    if profile.get('vibes'):
        vibe = profile['vibes'][0]
        if profile.get('community'):
            suggestions.append(f"Propiedades {vibe} en comunidad {profile['community'][0]}")
        else:
            suggestions.append(f"Propiedades con ambiente {vibe}")
    
    # Sugerencias basadas en lifestyle
    if profile.get('lifestyle'):
        lifestyle = profile['lifestyle'][0]
        suggestions.append(f"Casas perfectas para {lifestyle.replace('_', ' ')}")
    
    # Sugerencias basadas en intención
    intent = nlp_analysis.get('intent', 'general')
    if intent == 'family_living':
        suggestions.append("Propiedades familiares con jardín")
    elif intent == 'investment':
        suggestions.append("Inversiones con buen ROI")
    elif intent == 'retirement':
        suggestions.append("Propiedades tranquilas para retiro")
    elif intent == 'work_living':
        suggestions.append("Propiedades con espacios para trabajar")
    
    # Si no hay sugerencias, generar genéricas
    if not suggestions:
        suggestions.append("Explorar todas las propiedades disponibles")
    
    return suggestions[:3]  # Máximo 3 sugerencias

