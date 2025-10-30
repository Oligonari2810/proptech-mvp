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

# ✅ Ruta para crear una nueva propiedad
@properties_bp.route('/', methods=['POST'])
def create_property():
    """Crear una nueva propiedad"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Datos insuficientes"}), 400
        
        # Validaciones básicas
        if not data.get('title'):
            return jsonify({"error": "El título es requerido"}), 400
        if not data.get('price'):
            return jsonify({"error": "El precio es requerido"}), 400
        if not data.get('location'):
            return jsonify({"error": "La ubicación es requerida"}), 400
        
        # Obtener user_id del request (debe venir del token JWT o session)
        user_id = data.get('user_id') or data.get('brokerId') or 1  # Fallback a 1 si no se envía
        
        # Crear nueva propiedad
        new_property = Property(
            title=data.get('title'),
            price=float(data.get('price', 0)),
            location=data.get('location'),
            description=data.get('description', ''),
            image_url=data.get('image_url') or data.get('images', [None])[0] or 'https://via.placeholder.com/600x400',
            property_type=data.get('property_type') or data.get('type', 'apartment'),
            surface=float(data.get('surface') or data.get('area', 0)),
            bedrooms=int(data.get('bedrooms', 0)) if data.get('bedrooms') else None,
            bathrooms=int(data.get('bathrooms', 0)) if data.get('bathrooms') else None,
            latitude=float(data.get('latitude')) if data.get('latitude') else None,
            longitude=float(data.get('longitude')) if data.get('longitude') else None,
            status=data.get('status', 'available'),
            user_id=user_id,
            # Características booleanas desde features array
            has_pool='Piscina' in data.get('features', []),
            has_garage='Garaje' in data.get('features', []),
            has_elevator='Ascensor' in data.get('features', [])
        )
        
        db.session.add(new_property)
        db.session.commit()
        
        return jsonify({
            "message": "Propiedad creada exitosamente",
            "property": {
                "id": new_property.id,
                "title": new_property.title,
                "price": new_property.price,
                "location": new_property.location,
                "status": new_property.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
