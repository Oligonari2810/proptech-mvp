from flask import Blueprint, jsonify
from models import Property  # Asegúrate de que Property está correctamente importado
from database import db  # Asegúrate de que db está correctamente importado

properties_bp = Blueprint('properties', __name__)

# ✅ Ruta para obtener todas las propiedades
@properties_bp.route('/', methods=['GET'])
def get_all_properties():
    properties = Property.query.all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "price": p.price
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
        "price": property.price
    })
