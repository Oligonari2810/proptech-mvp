from flask import Blueprint, jsonify
from models import Property, db  # ✅ Importamos db desde models.py

properties_bp = Blueprint('properties', __name__)

# ✅ Ruta para obtener todas las propiedades
@properties_bp.route('/', methods=['GET'])
def get_all_properties():
    properties = Property.query.all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "price": p.price,
        "location": p.location,
        "image_url": p.image_url
    } for p in properties])

# ✅ Nueva ruta para obtener una propiedad por ID
@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    property = Property.query.get(property_id)
    if not property:
        return jsonify({"error": "Propiedad no encontrada"}), 404
    return jsonify({
        "id": property.id,
        "title": property.title,
        "description": property.description,
        "price": property.price,
        "location": property.location,
        "image_url": property.image_url
    })
