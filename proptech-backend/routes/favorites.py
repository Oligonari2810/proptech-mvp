from flask import Blueprint, request, jsonify
from models import Favorite, db

favorites_bp = Blueprint('favorites', __name__, url_prefix='/api/favorites')

# ✅ Obtener favoritos del usuario
@favorites_bp.route('', methods=['GET'])
def get_favorites():
    """Obtener todas las propiedades favoritas de un usuario"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400
        
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            "favorites": [{
                "id": fav.id,
                "user_id": fav.user_id,
                "property_id": fav.property_id,
                "notes": fav.notes,
                "created_at": fav.created_at.isoformat() if fav.created_at else None
            } for fav in favorites]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Agregar a favoritos
@favorites_bp.route('', methods=['POST'])
def add_favorite():
    """Agregar una propiedad a favoritos"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Datos insuficientes"}), 400
        
        user_id = data.get('user_id')
        property_id = data.get('property_id')
        
        if not user_id or not property_id:
            return jsonify({"error": "user_id y property_id son requeridos"}), 400
        
        # Verificar si ya existe
        existing = Favorite.query.filter_by(
            user_id=user_id,
            property_id=property_id
        ).first()
        
        if existing:
            return jsonify({
                "message": "Ya está en favoritos",
                "favorite": {
                    "id": existing.id,
                    "user_id": existing.user_id,
                    "property_id": existing.property_id
                }
            }), 200
        
        # Crear nuevo favorito
        new_favorite = Favorite(
            user_id=user_id,
            property_id=property_id,
            notes=data.get('notes')
        )
        
        db.session.add(new_favorite)
        db.session.commit()
        
        return jsonify({
            "message": "Agregado a favoritos",
            "favorite": {
                "id": new_favorite.id,
                "user_id": new_favorite.user_id,
                "property_id": new_favorite.property_id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ✅ Eliminar de favoritos
@favorites_bp.route('/<int:property_id>', methods=['DELETE'])
def remove_favorite(property_id):
    """Eliminar una propiedad de favoritos"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400
        
        favorite = Favorite.query.filter_by(
            user_id=user_id,
            property_id=property_id
        ).first()
        
        if not favorite:
            return jsonify({"error": "No encontrado en favoritos"}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({"message": "Eliminado de favoritos"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

