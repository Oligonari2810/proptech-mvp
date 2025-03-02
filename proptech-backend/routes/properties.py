from flask import Blueprint, request, jsonify
from models import Property, db

# 🔹 Creamos el Blueprint para las rutas de propiedades
properties_bp = Blueprint('properties', __name__, url_prefix='/api/properties')

# ✅ Ruta mejorada para obtener propiedades con filtros avanzados
@properties_bp.route('/', methods=['GET'])
def get_properties():
    # 📌 Obtener parámetros de la URL
    location = request.args.get('location')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    property_type = request.args.get('property_type')
    min_surface = request.args.get('min_surface', type=float)
    max_surface = request.args.get('max_surface', type=float)
    bedrooms = request.args.get('bedrooms', type=int)
    bathrooms = request.args.get('bathrooms', type=int)
    min_lot_size = request.args.get('min_lot_size', type=float)
    max_lot_size = request.args.get('max_lot_size', type=float)
    min_year_built = request.args.get('min_year_built', type=int)
    max_year_built = request.args.get('max_year_built', type=int)
    
    has_basement = request.args.get('has_basement', type=lambda x: x.lower() == 'true')
    has_garage = request.args.get('has_garage', type=lambda x: x.lower() == 'true')
    has_pool = request.args.get('has_pool', type=lambda x: x.lower() == 'true')
    has_elevator = request.args.get('has_elevator', type=lambda x: x.lower() == 'true')
    is_accessible = request.args.get('is_accessible', type=lambda x: x.lower() == 'true')
    is_luxury = request.args.get('is_luxury', type=lambda x: x.lower() == 'true')
    is_bank_owned = request.args.get('is_bank_owned', type=lambda x: x.lower() == 'true')
    has_virtual_tour = request.args.get('has_virtual_tour', type=lambda x: x.lower() == 'true')

    # 📌 Construcción dinámica de la consulta
    query = Property.query

    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_surface is not None:
        query = query.filter(Property.surface >= min_surface)
    if max_surface is not None:
        query = query.filter(Property.surface <= max_surface)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
    if bathrooms is not None:
        query = query.filter(Property.bathrooms >= bathrooms)
    if min_lot_size is not None:
        query = query.filter(Property.lot_size >= min_lot_size)
    if max_lot_size is not None:
        query = query.filter(Property.lot_size <= max_lot_size)
    if min_year_built is not None:
        query = query.filter(Property.year_built >= min_year_built)
    if max_year_built is not None:
        query = query.filter(Property.year_built <= max_year_built)
    if has_basement is not None:
        query = query.filter(Property.has_basement == has_basement)
    if has_garage is not None:
        query = query.filter(Property.has_garage == has_garage)
    if has_pool is not None:
        query = query.filter(Property.has_pool == has_pool)
    if has_elevator is not None:
        query = query.filter(Property.has_elevator == has_elevator)
    if is_accessible is not None:
        query = query.filter(Property.is_accessible == is_accessible)
    if is_luxury is not None:
        query = query.filter(Property.is_luxury == is_luxury)
    if is_bank_owned is not None:
        query = query.filter(Property.is_bank_owned == is_bank_owned)
    if has_virtual_tour is not None:
        query = query.filter(Property.has_virtual_tour == has_virtual_tour)

    properties = query.all()

    return jsonify([{
        "id": prop.id,
        "title": prop.title,
        "description": prop.description,
        "price": prop.price,
        "location": prop.location,
        "image_url": prop.image_url,
        "property_type": prop.property_type,
        "year_built": prop.year_built,
        "lot_size": prop.lot_size,
        "bedrooms": prop.bedrooms,
        "bathrooms": prop.bathrooms,
        "status": prop.status,
        "has_basement": prop.has_basement,
        "has_garage": prop.has_garage,
        "has_pool": prop.has_pool,
        "has_elevator": prop.has_elevator,
        "is_accessible": prop.is_accessible,
        "is_luxury": prop.is_luxury,
        "is_bank_owned": prop.is_bank_owned,
        "has_virtual_tour": prop.has_virtual_tour
    } for prop in properties]), 200

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
        "year_built": prop.year_built,
        "lot_size": prop.lot_size,
        "bedrooms": prop.bedrooms,
        "bathrooms": prop.bathrooms,
        "status": prop.status
    }), 200

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
    if "year_built" in data: prop.year_built = data["year_built"]
    if "lot_size" in data: prop.lot_size = data["lot_size"]
    if "bedrooms" in data: prop.bedrooms = data["bedrooms"]
    if "bathrooms" in data: prop.bathrooms = data["bathrooms"]

    db.session.commit()

    return jsonify({"message": "Propiedad actualizada exitosamente"}), 200
