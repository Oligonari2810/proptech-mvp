from flask import Blueprint, request, jsonify
from ai.services.recommendation_service import EmotionAwareRecommender
from ai.models.emotion.emotion_model import EmotionAwareRecommendation, db

ai_bp = Blueprint('ai', __name__)
recommender = EmotionAwareRecommender()

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

@ai_bp.route('/health', methods=['GET'])
def ai_health():
    """Health check del sistema de IA"""
    return jsonify({
        'status': 'healthy',
        'services': {
            'emotion_recommender': 'operational',
            'model_loaded': recommender.model_data is not None
        }
    })
