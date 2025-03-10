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

    filters = {
        "has_basement": request.args.get('has_basement', type=lambda x: x.lower() == 'true'),
        "has_garage": request.args.get('has_garage', type=lambda x: x.lower() == 'true'),
        "has_pool": request.args.get('has_pool', type=lambda x: x.lower() == 'true'),
        "has_elevator": request.args.get('has_elevator', type=lambda x: x.lower() == 'true'),
        "is_accessible": request.args.get('is_accessible', type=lambda x: x.lower() == 'true'),
        "is_luxury": request.args.get('is_luxury', type=lambda x: x.lower() == 'true'),
        "is_bank_owned": request.args.get('is_bank_owned', type=lambda x: x.lower() == 'true'),
        "has_virtual_tour": request.args.get('has_virtual_tour', type=lambda x: x.lower() == 'true')
    }

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

    # 📌 Aplicar filtros booleanos
    for key, value in filters.items():
        if value is not None:
            query = query.filter(getattr(Property, key) == value)

    properties = query.all()

    return jsonify([{
        "id": prop.id,
        "title": prop.title or "Sin título",
        "description": prop.description or "Sin descripción",
        "price": prop.price if prop.price is not None else 0,
        "location": prop.location or "Ubicación desconocida",
        "image_url": prop.image_url or "https://ejemplo.com/default.jpg",
        "property_type": prop.property_type or "Sin especificar",
        "year_built": prop.year_built if prop.year_built is not None else "Desconocido",
        "lot_size": prop.lot_size if prop.lot_size is not None else 0,
        "bedrooms": prop.bedrooms if prop.bedrooms is not None else 0,
        "bathrooms": prop.bathrooms if prop.bathrooms is not None else 0,
        "status": prop.status or "available",
        "latitude": prop.latitude if prop.latitude is not None else 0,  # ✅ Evita `null`
        "longitude": prop.longitude if prop.longitude is not None else 0,  # ✅ Evita `null`
        "has_basement": prop.has_basement if prop.has_basement is not None else False,
        "has_garage": prop.has_garage if prop.has_garage is not None else False,
        "has_pool": prop.has_pool if prop.has_pool is not None else False,
        "has_elevator": prop.has_elevator if prop.has_elevator is not None else False,
        "is_accessible": prop.is_accessible if prop.is_accessible is not None else False,
        "is_luxury": prop.is_luxury if prop.is_luxury is not None else False,
        "is_bank_owned": prop.is_bank_owned if prop.is_bank_owned is not None else False,
        "has_virtual_tour": prop.has_virtual_tour if prop.has_virtual_tour is not None else False
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
        "latitude": prop.latitude if prop.latitude is not None else 0,
        "longitude": prop.longitude if prop.longitude is not None else 0,
        "status": prop.status
    }), 200

# ✅ Ruta para eliminar una propiedad por ID
@properties_bp.route('/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Propiedad no encontrada"}), 404

    db.session.delete(prop)
    db.session.commit()

    return jsonify({"message": "Propiedad eliminada exitosamente"}), 200

# ✅ Ruta para actualizar una propiedad por ID
@properties_bp.route('/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({"error": "Propiedad no encontrada"}), 404

    data = request.json

    # 🔹 Actualizamos solo los campos enviados en la solicitud
    for key, value in data.items():
        if hasattr(prop, key):
            setattr(prop, key, value)

    db.session.commit()

    return jsonify({"message": "Propiedad actualizada exitosamente"}), 200
