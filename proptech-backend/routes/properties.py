from flask import Blueprint, request, jsonify
from models import Property, db

# 🔹 Creamos el Blueprint para las rutas de propiedades
properties_bp = Blueprint('properties', __name__, url_prefix='/api/properties')

# ✅ Ruta para obtener todas las propiedades
@properties_bp.route('/', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return jsonify([
        {
            "id": prop.id,
            "title": prop.title,
            "description": prop.description,
            "price": prop.price,
            "location": prop.location,
            "image_url": prop.image_url,
            "property_type": prop.property_type,
            "user_id": prop.user_id,
            "status": prop.status
        } 
        for prop in properties
    ]), 200

# ✅ Ruta para obtener una propiedad por ID
@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Propiedad no encontrada"}), 404

    return jsonify({
        "id": prop.id,
        "title": prop.title,
        "description": prop.description,
        "price": prop.price,
        "location": prop.location,
        "image_url": prop.image_url,
        "property_type": prop.property_type,
        "user_id": prop.user_id,
        "status": prop.status
    }), 200

# ✅ Ruta para subir una nueva propiedad (POST)
@properties_bp.route('/', methods=['POST'])
def create_property():
    data = request.json

    # 🔹 Verificamos que los campos requeridos están presentes
    required_fields = ["title", "description", "price", "location", "image_url", "property_type", "user_id"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    try:
        # Convertimos user_id a int para evitar errores
        user_id = int(data["user_id"]) if "user_id" in data else None

        # 🔹 Creamos la propiedad
        new_property = Property(
            title=data["title"],
            description=data["description"],
            price=data["price"],
            location=data["location"],
            image_url=data["image_url"],
            property_type=data["property_type"],
            user_id=user_id,
            status="available"
        )

        db.session.add(new_property)
        db.session.commit()

        return jsonify({
            "message": "Propiedad agregada exitosamente",
            "property": {
                "id": new_property.id,
                "title": new_property.title,
                "description": new_property.description,
                "price": new_property.price,
                "location": new_property.location,
                "image_url": new_property.image_url,
                "property_type": new_property.property_type,
                "user_id": new_property.user_id,
                "status": new_property.status
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Ruta para eliminar una propiedad por ID (DELETE)
@properties_bp.route('/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Propiedad no encontrada"}), 404

    db.session.delete(prop)
    db.session.commit()

    return jsonify({"message": "Propiedad eliminada exitosamente"}), 200

# ✅ Ruta para actualizar una propiedad por ID (PUT)
@properties_bp.route('/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Propiedad no encontrada"}), 404

    data = request.json

    # 🔹 Actualizamos solo los campos enviados en la solicitud
    if "title" in data: prop.title = data["title"]
    if "description" in data: prop.description = data["description"]
    if "price" in data: prop.price = data["price"]
    if "location" in data: prop.location = data["location"]
    if "image_url" in data: prop.image_url = data["image_url"]
    if "property_type" in data: prop.property_type = data["property_type"]
    if "status" in data: prop.status = data["status"]

    db.session.commit()

    return jsonify({"message": "Propiedad actualizada exitosamente"}), 200
