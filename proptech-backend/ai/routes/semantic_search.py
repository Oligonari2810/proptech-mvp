from flask import Blueprint, request, jsonify
import json
import re
from typing import List, Dict, Any

semantic_search_bp = Blueprint('semantic_search', __name__)

class SemanticSearchEngine:
    """Motor de búsqueda semántica con análisis de intención"""
    
    def __init__(self):
        # Patrones de intención
        self.intent_patterns = {
            'buy': [
                r'comprar', r'compro', r'busco.*casa', r'busco.*apartamento',
                r'quiero.*comprar', r'necesito.*casa', r'inversión'
            ],
            'rent': [
                r'alquilar', r'alquilo', r'rentar', r'busco.*alquiler',
                r'quiero.*alquilar', r'necesito.*alquiler'
            ],
            'sell': [
                r'vender', r'vendo', r'venta', r'quiero.*vender',
                r'necesito.*vender', r'poner.*venta'
            ],
            'invest': [
                r'invertir', r'inversión', r'inversionista', r'rentabilidad',
                r'roi', r'retorno.*inversión'
            ]
        }
        
        # Características semánticas
        self.feature_keywords = {
            'has_pool': [r'piscina', r'pool', r'natación'],
            'has_garden': [r'jardín', r'garden', r'verde', r'patio'],
            'has_parking': [r'estacionamiento', r'parking', r'garaje'],
            'has_elevator': [r'ascensor', r'elevador', r'elevator'],
            'near_metro': [r'metro', r'subway', r'transporte.*público'],
            'near_school': [r'escuela', r'colegio', r'universidad', r'educación'],
            'near_hospital': [r'hospital', r'clínica', r'salud', r'médico']
        }
        
        # Tipos de propiedad
        self.property_types = {
            'casa': [r'casa', r'vivienda', r'chalet', r'villa'],
            'apartamento': [r'apartamento', r'apartment', r'apto'],
            'piso': [r'piso', r'floor', r'planta'],
            'local': [r'local', r'comercial', r'negocio', r'tienda']
        }
    
    def analyze_intent(self, query: str) -> Dict[str, Any]:
        """Analizar intención del usuario"""
        query_lower = query.lower()
        
        # Detectar intención principal
        detected_intent = 'general'
        confidence = 0.0
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    detected_intent = intent
                    confidence = 0.8
                    break
            if confidence > 0:
                break
        
        return {
            'intent': detected_intent,
            'confidence': confidence
        }
    
    def extract_features(self, query: str) -> Dict[str, bool]:
        """Extraer características de la consulta"""
        query_lower = query.lower()
        features = {}
        
        for feature, patterns in self.feature_keywords.items():
            features[feature] = any(re.search(pattern, query_lower) for pattern in patterns)
        
        return features
    
    def extract_property_type(self, query: str) -> str:
        """Extraer tipo de propiedad"""
        query_lower = query.lower()
        
        for prop_type, patterns in self.property_types.items():
            if any(re.search(pattern, query_lower) for pattern in patterns):
                return prop_type
        
        return 'any'
    
    def generate_suggestions(self, query: str, intent: str) -> List[str]:
        """Generar sugerencias semánticas"""
        suggestions = []
        
        if intent == 'buy':
            suggestions.extend([
                f"Casas en venta {query}",
                f"Propiedades para comprar {query}",
                f"Inversión inmobiliaria {query}"
            ])
        elif intent == 'rent':
            suggestions.extend([
                f"Casas en alquiler {query}",
                f"Propiedades para rentar {query}",
                f"Alquiler {query}"
            ])
        elif intent == 'sell':
            suggestions.extend([
                f"Vender propiedad {query}",
                f"Tasación {query}",
                f"Valor de mercado {query}"
            ])
        
        # Añadir sugerencias basadas en características
        if 'piscina' in query.lower():
            suggestions.append(f"Propiedades con piscina {query}")
        if 'jardín' in query.lower():
            suggestions.append(f"Casas con jardín {query}")
        if 'metro' in query.lower():
            suggestions.append(f"Propiedades cerca del metro {query}")
        
        return suggestions[:5]  # Máximo 5 sugerencias
    
    def search_properties(self, query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Buscar propiedades con análisis semántico"""
        # En producción, esto haría una consulta real a la base de datos
        # Por ahora, simulamos resultados basados en la consulta
        
        intent = self.analyze_intent(query)
        features = self.extract_features(query)
        property_type = self.extract_property_type(query)
        
        # Simular resultados de búsqueda
        mock_properties = [
            {
                'id': 1,
                'title': f'Propiedad semántica 1 - {query}',
                'location': 'Santo Domingo',
                'price': 250000,
                'bedrooms': 3,
                'bathrooms': 2,
                'property_type': property_type if property_type != 'any' else 'casa',
                'has_pool': features.get('has_pool', False),
                'has_garden': features.get('has_garden', False),
                'has_parking': features.get('has_parking', False),
                'semantic_score': 0.95,
                'intent_match': intent['intent']
            },
            {
                'id': 2,
                'title': f'Propiedad semántica 2 - {query}',
                'location': 'Santiago',
                'price': 180000,
                'bedrooms': 2,
                'bathrooms': 1,
                'property_type': property_type if property_type != 'any' else 'apartamento',
                'has_pool': features.get('has_pool', False),
                'has_garden': features.get('has_garden', False),
                'has_parking': features.get('has_parking', False),
                'semantic_score': 0.87,
                'intent_match': intent['intent']
            }
        ]
        
        # Aplicar filtros adicionales
        if filters:
            for key, value in filters.items():
                if value and value != 'any':
                    mock_properties = [p for p in mock_properties if p.get(key) == value]
        
        return mock_properties

# Instancia global del motor
search_engine = SemanticSearchEngine()

@semantic_search_bp.route('/semantic-search', methods=['POST'])
def semantic_search():
    """Endpoint de búsqueda semántica"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        filters = data.get('filters', {})
        include_suggestions = data.get('include_suggestions', True)
        include_intent = data.get('include_intent', True)
        
        if not query.strip():
            return jsonify({
                'success': False,
                'error': 'Query vacía'
            }), 400
        
        # Analizar intención
        intent_analysis = search_engine.analyze_intent(query)
        
        # Buscar propiedades
        properties = search_engine.search_properties(query, filters)
        
        # Generar sugerencias
        suggestions = []
        if include_suggestions:
            suggestions = search_engine.generate_suggestions(query, intent_analysis['intent'])
        
        # Preparar respuesta
        response = {
            'success': True,
            'query': query,
            'results': properties,
            'total_results': len(properties),
            'suggestions': suggestions,
            'intent': intent_analysis['intent'] if include_intent else None,
            'confidence': intent_analysis['confidence'] if include_intent else None,
            'semantic_features': search_engine.extract_features(query) if include_intent else None
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@semantic_search_bp.route('/suggestions', methods=['POST'])
def get_suggestions():
    """Endpoint para obtener sugerencias semánticas"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query.strip():
            return jsonify({
                'success': False,
                'error': 'Query vacía'
            }), 400
        
        intent_analysis = search_engine.analyze_intent(query)
        suggestions = search_engine.generate_suggestions(query, intent_analysis['intent'])
        
        return jsonify({
            'success': True,
            'query': query,
            'suggestions': suggestions,
            'intent': intent_analysis['intent'],
            'confidence': intent_analysis['confidence']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@semantic_search_bp.route('/analyze-intent', methods=['POST'])
def analyze_intent():
    """Endpoint para analizar intención del usuario"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query.strip():
            return jsonify({
                'success': False,
                'error': 'Query vacía'
            }), 400
        
        intent_analysis = search_engine.analyze_intent(query)
        features = search_engine.extract_features(query)
        property_type = search_engine.extract_property_type(query)
        
        return jsonify({
            'success': True,
            'query': query,
            'intent': intent_analysis['intent'],
            'confidence': intent_analysis['confidence'],
            'features': features,
            'property_type': property_type
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
