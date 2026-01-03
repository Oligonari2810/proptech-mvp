# Favoritos API Routes
from flask import Blueprint, request, jsonify
from models import db, User, Property, Favorite
from sqlalchemy import text
import logging

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/api/favorites', methods=['GET'])
def get_favorites():
    """Obtener favoritos del usuario"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'success': False, 'error': 'user_id requerido'}), 400
        
        favorites = db.session.execute(text("""
            SELECT f.id, f.user_id, f.property_id, f.created_at, f.notes,
                   p.title, p.price, p.type, p.operation, p.location, p.images
            FROM favorites f
            JOIN properties p ON f.property_id = p.id
            WHERE f.user_id = :user_id AND f.is_active = true
            ORDER BY f.created_at DESC
        """), {'user_id': user_id}).fetchall()
        
        favorites_data = []
        for fav in favorites:
            favorites_data.append({
                'id': fav.id,
                'property_id': fav.property_id,
                'title': fav.title,
                'price': fav.price,
                'type': fav.type,
                'operation': fav.operation,
                'location': fav.location,
                'images': fav.images or [],
                'notes': fav.notes,
                'created_at': fav.created_at.isoformat()
            })
        
        return jsonify({'success': True, 'favorites': favorites_data}), 200
        
    except Exception as e:
        logging.error(f"Error getting favorites: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@favorites_bp.route('/api/favorites', methods=['POST'])
def add_favorite():
    """Agregar propiedad a favoritos"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        property_id = data.get('property_id')
        notes = data.get('notes', '')
        
        if not user_id or not property_id:
            return jsonify({'success': False, 'error': 'user_id y property_id requeridos'}), 400
        
        # Verificar si ya existe
        existing = db.session.execute(text("""
            SELECT id FROM favorites 
            WHERE user_id = :user_id AND property_id = :property_id AND is_active = true
        """), {'user_id': user_id, 'property_id': property_id}).fetchone()
        
        if existing:
            return jsonify({'success': False, 'error': 'Ya está en favoritos'}), 400
        
        # Crear nuevo favorito
        db.session.execute(text("""
            INSERT INTO favorites (user_id, property_id, notes, is_active, created_at)
            VALUES (:user_id, :property_id, :notes, true, NOW())
        """), {
            'user_id': user_id,
            'property_id': property_id,
            'notes': notes
        })
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Agregado a favoritos'}), 201
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error adding favorite: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@favorites_bp.route('/api/favorites/<int:favorite_id>', methods=['DELETE'])
def remove_favorite(favorite_id):
    """Eliminar favorito"""
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'success': False, 'error': 'user_id requerido'}), 400
        
        # Soft delete
        result = db.session.execute(text("""
            UPDATE favorites 
            SET is_active = false, updated_at = NOW()
            WHERE id = :favorite_id AND user_id = :user_id
        """), {'favorite_id': favorite_id, 'user_id': user_id})
        
        if result.rowcount == 0:
            return jsonify({'success': False, 'error': 'Favorito no encontrado'}), 404
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Eliminado de favoritos'}), 200
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error removing favorite: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@favorites_bp.route('/api/favorites/<int:favorite_id>/notes', methods=['PUT'])
def update_favorite_notes(favorite_id):
    """Actualizar notas del favorito"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        notes = data.get('notes', '')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'user_id requerido'}), 400
        
        result = db.session.execute(text("""
            UPDATE favorites 
            SET notes = :notes, updated_at = NOW()
            WHERE id = :favorite_id AND user_id = :user_id AND is_active = true
        """), {'favorite_id': favorite_id, 'user_id': user_id, 'notes': notes})
        
        if result.rowcount == 0:
            return jsonify({'success': False, 'error': 'Favorito no encontrado'}), 404
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Notas actualizadas'}), 200
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating favorite notes: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
