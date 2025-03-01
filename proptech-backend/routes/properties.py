from flask import Blueprint, request, jsonify
from models import Property, db  # ✅ Importamos db y Property desde models.py

properties_bp = Blueprint('properties', __name__, url_prefix='/api/properties')

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

# ✅ Ruta para obtener una propiedad por ID
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

# ✅ NUEVO: Ruta para subir una nueva propiedad (POST)
@properties_bp.route('/', methods=['POST'])
def create_property():
    data = request.json  # Recibimos datos en formato JSON

    # Verificamos que todos los campos requeridos están presentes
    required_fields = ["title", "description", "price", "location", "image_url"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    try:
        # Crear una nueva instancia de Property
        new_property = Property(
            title=data["title"],
            description=data["description"],
            price=data["price"],
            location=data["location"],
            image_url=data["image_url"]
        )
        db.session.add(new_property)
        db.session.commit()  # Guardamos en la base de datos

        return jsonify({"message": "Propiedad agregada exitosamente", "property": {
            "id": new_property.id,
            "title": new_property.title,
            "description": new_property.description,
            "price": new_property.price,
            "location": new_property.location,
            "image_url": new_property.image_url
        }}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Manejo de errores
