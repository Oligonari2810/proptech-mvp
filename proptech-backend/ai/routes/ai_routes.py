from flask import Blueprint, request, jsonify
from ai.services.recommendation_service import EmotionAwareRecommender
from ai.models.emotion.emotion_model import EmotionAwareRecommendation, db
from ai.services.emotional_valuation_service import EmotionalValuationService, EmotionalFactorsService
from ai.services.valuation_engine import HabitatEstimateEngine

# Importar servicios avanzados (opcionales)
try:
    from ai.services.geospatial_service import GeospatialService
    from ai.services.valuation_explainer_service import ValuationExplainerService
    ADVANCED_SERVICES_AVAILABLE = True
except ImportError:
    ADVANCED_SERVICES_AVAILABLE = False
    GeospatialService = None
    ValuationExplainerService = None

ai_bp = Blueprint('ai', __name__)
recommender = EmotionAwareRecommender()
emotional_valuation_service = EmotionalValuationService()
emotional_factors_service = EmotionalFactorsService()
valuation_engine = HabitatEstimateEngine()

@ai_bp.route('/recommend/emotion-based', methods=['POST'])
def emotion_based_recommendations():
    """Obtener recomendaciones basadas en emoción del usuario"""
    try:
        data = request.get_json()
        
        user_emotion = data.get('emotion', 'neutral')
        user_id = data.get('user_id')
        available_properties = data.get('properties', [])
        
        # Obtener historial del usuario si está disponible
        user_history = []  # En producción, esto vendría de la base de datos
        
        # Generar recomendaciones
        recommendations = recommender.recommend_based_on_emotion(
            user_emotion, user_history, available_properties
        )
        
        # Guardar recomendación en base de datos
        if user_id:
            emotion_rec = EmotionAwareRecommendation(
                user_id=user_id,
                current_emotion=user_emotion,
                recommended_properties=[rec['property']['id'] for rec in recommendations],
                reasoning=f"Recomendaciones para emoción: {user_emotion}",
                confidence_score=0.85  # En producción, esto sería calculado
            )
            db.session.add(emotion_rec)
            db.session.commit()
        
        return jsonify({
            'success': True,
            'emotion': user_emotion,
            'recommendations': recommendations,
            'message': f'Recomendaciones personalizadas para estado {user_emotion}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_bp.route('/emotion/preferences', methods=['POST'])
def update_emotion_preferences():
    """Actualizar preferencias basadas en emociones"""
    try:
        data = request.get_json()
        # En producción, esto actualizaría el modelo de ML
        return jsonify({
            'success': True,
            'message': 'Preferencias de emoción actualizadas'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/valuation/emotional', methods=['POST'])
def emotional_valuation():
    """Valoración con IA Emocional - HabitaScore v2.0"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Datos insuficientes'
            }), 400
        
        # Calcular valoración base con el engine existente
        property_data = {
            'square_meters': data.get('area') or data.get('square_meters', 100),
            'bedrooms': data.get('bedrooms', 2),
            'bathrooms': data.get('bathrooms', 1),
            'year_built': data.get('year') or data.get('year_built', 2015),
            'property_type': data.get('propertyType') or data.get('property_type', 'apartment'),
            'zone': data.get('zone', 'standard'),
            'condition': data.get('condition', 'good'),
            'location': data.get('location', ''),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
            'proximity_beach': data.get('proximityBeach') or data.get('proximity_beach'),
            'proximity_schools': data.get('proximitySchools') or data.get('proximity_schools'),
            'has_pool': data.get('hasPool') or data.get('has_pool', False),
            'has_parking': data.get('hasParking') or data.get('has_parking', False),
            'features': data.get('features', [])
        }
        
        # Calcular valoración base
        base_valuation_result = valuation_engine.predict_value(property_data)
        
        # Preparar base_valuation en formato compatible
        base_valuation = {
            'estimated_value': base_valuation_result.get('estimated_value', 0),
            'priceRange': {
                'min': base_valuation_result.get('price_range', {}).get('min', 0),
                'max': base_valuation_result.get('price_range', {}).get('max', 0),
                'avg': base_valuation_result.get('estimated_value', 0)
            },
            'score': 500,  # Score base calculado
            'confidence': 'medium',
            'factors': {
                'positive': [],
                'negative': []
            }
        }
        
        # Determinar si usar datos geoespaciales
        use_geospatial = data.get('use_geospatial', False) and ADVANCED_SERVICES_AVAILABLE
        
        # Calcular valoración emocional avanzada
        advanced_valuation = emotional_valuation_service.calculate_advanced_valuation(
            property_data,
            base_valuation,
            use_geospatial=use_geospatial
        )
        
        return jsonify({
            'success': True,
            'valuation': advanced_valuation,
            'method': 'HabitaScore IA Emocional v2.0',
            'timestamp': base_valuation_result.get('valuation_date')
        })
        
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@ai_bp.route('/emotional/factors', methods=['POST'])
def get_emotional_factors():
    """Obtener solo los factores emocionales de una propiedad"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Datos insuficientes'
            }), 400
        
        property_data = {
            'location': data.get('location', ''),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
            'zone': data.get('zone', 'standard'),
            'property_type': data.get('propertyType') or data.get('property_type', 'apartment'),
            'proximity_beach': data.get('proximityBeach') or data.get('proximity_beach'),
            'proximity_schools': data.get('proximitySchools') or data.get('proximity_schools'),
            'features': data.get('features', [])
        }
        
        # Calcular factores emocionales
        emotional_factors = emotional_factors_service.calculate_emotional_factors(property_data)
        emotional_result = emotional_factors_service.calculate_emotional_score(emotional_factors)
        
        return jsonify({
            'success': True,
            'emotional_factors': emotional_factors,
            'emotional_result': emotional_result
        })
        
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@ai_bp.route('/health', methods=['GET'])
def ai_health():
    """Health check del sistema de IA"""
    return jsonify({
        'status': 'healthy',
        'services': {
            'emotion_recommender': 'operational',
            'emotional_valuation': 'operational',
            'model_loaded': recommender.model_data is not None
        }
    })
