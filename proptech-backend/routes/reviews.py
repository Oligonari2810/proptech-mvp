"""
Reviews and Ratings API Routes
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
import logging
import sys
from pathlib import Path

# Agregar el directorio raíz al path para imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from middleware.auth_middleware import token_required
except ImportError:
    # Fallback decorador básico
    def token_required(f):
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function

try:
    from models import db, Review, User, Property
except ImportError:
    logger = logging.getLogger(__name__)
    logger.warning("⚠️ No se pudo importar modelos de reviews")

logger = logging.getLogger(__name__)

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/api/reviews', methods=['POST'])
@token_required
def create_review(current_user):
    """Crear una nueva reseña"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('rating') or not data.get('comment'):
            return jsonify({'error': 'Rating y comentario son requeridos'}), 400
        
        rating = int(data.get('rating'))
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating debe estar entre 1 y 5'}), 400
        
        # Crear review
        review = Review(
            property_id=data.get('propertyId'),
            broker_id=data.get('brokerId'),
            user_id=current_user.id,
            rating=rating,
            title=data.get('title'),
            comment=data.get('comment'),
            category=data.get('category', 'property'),
            verified=data.get('verified', False),
            tags=data.get('tags', []),
            created_at=datetime.utcnow()
        )
        
        db.session.add(review)
        db.session.commit()
        
        logger.info(f"Review creada: ID {review.id} por usuario {current_user.id}")
        
        return jsonify({
            'success': True,
            'review': {
                'id': str(review.id),
                'rating': review.rating,
                'comment': review.comment,
                'createdAt': review.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error creando review: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error al crear la reseña'}), 500

@reviews_bp.route('/api/reviews/property/<int:property_id>', methods=['GET'])
def get_property_reviews(property_id):
    """Obtener todas las reseñas de una propiedad"""
    try:
        reviews = Review.query.filter_by(property_id=property_id).order_by(Review.created_at.desc()).all()
        
        # Obtener usuarios para nombres
        user_ids = [review.user_id for review in reviews]
        users = {user.id: user for user in User.query.filter(User.id.in_(user_ids)).all()}
        
        reviews_data = []
        ratings = []
        
        for review in reviews:
            user = users.get(review.user_id)
            reviews_data.append({
                'id': str(review.id),
                'userId': review.user_id,
                'userName': user.name if user else 'Usuario',
                'userAvatar': user.avatar_url if user else None,
                'rating': review.rating,
                'title': review.title,
                'comment': review.comment,
                'category': review.category or 'property',
                'verified': review.verified or False,
                'tags': review.tags or [],
                'createdAt': review.created_at.isoformat() if review.created_at else datetime.utcnow().isoformat(),
                'helpfulCount': 0, # TODO: Implementar sistema de "útil"
                'responses': [] # TODO: Implementar respuestas
            })
            ratings.append(review.rating)
        
        # Calcular resumen
        from collections import Counter
        rating_dist = Counter(ratings)
        
        summary = {
            'totalReviews': len(reviews),
            'averageRating': sum(ratings) / len(ratings) if ratings else 0,
            'ratingDistribution': {
                '5': rating_dist.get(5, 0),
                '4': rating_dist.get(4, 0),
                '3': rating_dist.get(3, 0),
                '2': rating_dist.get(2, 0),
                '1': rating_dist.get(1, 0)
            }
        }
        
        return jsonify({
            'reviews': reviews_data,
            'summary': summary
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo reviews: {e}")
        return jsonify({'error': 'Error al obtener las reseñas'}), 500

@reviews_bp.route('/api/reviews/broker/<int:broker_id>', methods=['GET'])
def get_broker_reviews(broker_id):
    """Obtener todas las reseñas de un broker"""
    try:
        reviews = Review.query.filter_by(broker_id=broker_id).order_by(Review.created_at.desc()).all()
        
        # Similar a get_property_reviews pero para broker
        user_ids = [review.user_id for review in reviews]
        users = {user.id: user for user in User.query.filter(User.id.in_(user_ids)).all()}
        
        reviews_data = []
        ratings = []
        
        for review in reviews:
            user = users.get(review.user_id)
            reviews_data.append({
                'id': str(review.id),
                'userId': review.user_id,
                'userName': user.name if user else 'Usuario',
                'userAvatar': user.avatar_url if user else None,
                'rating': review.rating,
                'title': review.title,
                'comment': review.comment,
                'category': review.category or 'broker',
                'verified': review.verified or False,
                'tags': review.tags or [],
                'createdAt': review.created_at.isoformat() if review.created_at else datetime.utcnow().isoformat(),
                'helpfulCount': 0,
                'responses': []
            })
            ratings.append(review.rating)
        
        from collections import Counter
        rating_dist = Counter(ratings)
        
        summary = {
            'totalReviews': len(reviews),
            'averageRating': sum(ratings) / len(ratings) if ratings else 0,
            'ratingDistribution': {
                '5': rating_dist.get(5, 0),
                '4': rating_dist.get(4, 0),
                '3': rating_dist.get(3, 0),
                '2': rating_dist.get(2, 0),
                '1': rating_dist.get(1, 0)
            }
        }
        
        return jsonify({
            'reviews': reviews_data,
            'summary': summary
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo reviews de broker: {e}")
        return jsonify({'error': 'Error al obtener las reseñas'}), 500

@reviews_bp.route('/api/reviews/<string:review_id>/helpful', methods=['POST'])
@token_required
def mark_helpful(current_user):
    """Marcar una reseña como útil"""
    try:
        # TODO: Implementar sistema de "útil"
        # Por ahora solo retornamos éxito
        return jsonify({'success': True, 'helpful': True}), 200
    except Exception as e:
        logger.error(f"Error marcando útil: {e}")
        return jsonify({'error': 'Error al marcar como útil'}), 500

