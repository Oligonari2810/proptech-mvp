"""
Featured Listings API Routes
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import logging
import sys
from pathlib import Path

# Agregar el directorio raíz al path para imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from middleware.auth_middleware import token_required, broker_required
except ImportError:
    def token_required(f):
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function
    
    def broker_required(f):
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function

try:
    from models import db, Property, FeaturedListing, User
except ImportError:
    logger = logging.getLogger(__name__)
    logger.warning("⚠️ No se pudo importar modelos de featured listings")

logger = logging.getLogger(__name__)

featured_bp = Blueprint('featured', __name__)

@featured_bp.route('/api/properties/featured', methods=['GET'])
def get_featured_properties():
    """Obtener propiedades destacadas"""
    try:
        tier = request.args.get('tier', None)
        limit = int(request.args.get('limit', 6))
        
        # Si hay modelo FeaturedListing, usarlo
        try:
            # Ordenar por tier: platinum > premium > featured > basic
            tier_priority = {'platinum': 4, 'premium': 3, 'featured': 2, 'basic': 1}
            
            # Query properties con featured listings activos
            from sqlalchemy import or_
            
            now = datetime.utcnow()
            featured_listings = FeaturedListing.query.filter(
                FeaturedListing.is_active == True,
                FeaturedListing.start_date <= now,
                FeaturedListing.end_date >= now
            ).all()
            
            if tier:
                featured_listings = [fl for fl in featured_listings if fl.tier == tier]
            
            # Ordenar por priority y tier
            featured_listings.sort(
                key=lambda x: (
                    x.priority or tier_priority.get(x.tier, 0),
                    tier_priority.get(x.tier, 0)
                ),
                reverse=True
            )
            
            # Obtener properties
            property_ids = [fl.property_id for fl in featured_listings[:limit]]
            
            if property_ids:
                properties = Property.query.filter(Property.id.in_(property_ids)).all()
                
                # Mantener orden de featured_listings
                properties_dict = {p.id: p for p in properties}
                ordered_properties = [properties_dict[pid] for pid in property_ids if pid in properties_dict]
                
                # Añadir tier a cada property
                for prop in ordered_properties:
                    fl = next((fl for fl in featured_listings if fl.property_id == prop.id), None)
                    if fl:
                        prop.featured_tier = fl.tier
                        prop.featured_priority = fl.priority or tier_priority.get(fl.tier, 0)
            else:
                ordered_properties = []
            
        except Exception as e:
            logger.warning(f"Error obteniendo featured listings, usando propiedades normales: {e}")
            # Fallback: propiedades normales
            ordered_properties = Property.query.filter_by(is_active=True).limit(limit).all()
        
        # Convertir a JSON
        properties_data = []
        for prop in ordered_properties:
            prop_dict = prop.to_dict() if hasattr(prop, 'to_dict') else {
                'id': prop.id,
                'title': prop.title,
                'price': prop.price,
                'location': prop.location,
                'image_url': prop.image_url,
                'bedrooms': prop.bedrooms,
                'bathrooms': prop.bathrooms,
                'area': prop.area or prop.surface,
                'square_meters': prop.surface or prop.area
            }
            
            # Añadir tier si existe
            if hasattr(prop, 'featured_tier'):
                prop_dict['featuredTier'] = prop.featured_tier
            
            properties_data.append(prop_dict)
        
        return jsonify({
            'properties': properties_data,
            'count': len(properties_data)
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo featured properties: {e}")
        return jsonify({'error': 'Error al obtener propiedades destacadas'}), 500

@featured_bp.route('/api/featured-listings', methods=['POST'])
@broker_required
def create_featured_listing(current_user):
    """Crear un featured listing (solo brokers)"""
    try:
        data = request.get_json()
        
        property_id = data.get('propertyId')
        tier = data.get('tier', 'featured')
        weeks = int(data.get('weeks', 1))
        
        if not property_id:
            return jsonify({'error': 'propertyId es requerido'}), 400
        
        if tier not in ['featured', 'premium', 'platinum']:
            return jsonify({'error': 'Tier inválido'}), 400
        
        # Verificar que la propiedad pertenece al broker
        property_obj = Property.query.get(property_id)
        if not property_obj:
            return jsonify({'error': 'Propiedad no encontrada'}), 404
        
        if property_obj.user_id != current_user.id and current_user.role not in ['admin', 'super_admin']:
            return jsonify({'error': 'No tienes permiso para destacar esta propiedad'}), 403
        
        # Crear featured listing
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(weeks=weeks)
        
        featured = FeaturedListing(
            property_id=property_id,
            tier=tier,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            priority=1, # Puede ajustarse según tier
            created_at=start_date
        )
        
        db.session.add(featured)
        db.session.commit()
        
        logger.info(f"Featured listing creado: Property {property_id}, Tier {tier} por usuario {current_user.id}")
        
        return jsonify({
            'success': True,
            'featuredListing': {
                'id': featured.id,
                'propertyId': featured.property_id,
                'tier': featured.tier,
                'startDate': featured.start_date.isoformat(),
                'endDate': featured.end_date.isoformat()
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error creando featured listing: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error al crear featured listing'}), 500

@featured_bp.route('/api/featured-listings/<int:listing_id>', methods=['DELETE'])
@broker_required
def delete_featured_listing(current_user, listing_id):
    """Eliminar un featured listing"""
    try:
        featured = FeaturedListing.query.get(listing_id)
        if not featured:
            return jsonify({'error': 'Featured listing no encontrado'}), 404
        
        # Verificar permiso
        property_obj = Property.query.get(featured.property_id)
        if property_obj.user_id != current_user.id and current_user.role not in ['admin', 'super_admin']:
            return jsonify({'error': 'No tienes permiso para eliminar este featured listing'}), 403
        
        db.session.delete(featured)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        logger.error(f"Error eliminando featured listing: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar featured listing'}), 500

@featured_bp.route('/api/featured-listings/my-properties', methods=['GET'])
@token_required
def get_my_featured_listings(current_user):
    """Obtener featured listings del usuario actual"""
    try:
        # Obtener propiedades del usuario
        user_properties = Property.query.filter_by(user_id=current_user.id).all()
        property_ids = [p.id for p in user_properties]
        
        if not property_ids:
            return jsonify({'featuredListings': [], 'properties': []}), 200
        
        # Obtener featured listings activos
        now = datetime.utcnow()
        featured_listings = FeaturedListing.query.filter(
            FeaturedListing.property_id.in_(property_ids),
            FeaturedListing.is_active == True,
            FeaturedListing.start_date <= now,
            FeaturedListing.end_date >= now
        ).all()
        
        listings_data = []
        for fl in featured_listings:
            property_obj = Property.query.get(fl.property_id)
            listings_data.append({
                'id': fl.id,
                'propertyId': fl.property_id,
                'propertyTitle': property_obj.title if property_obj else 'Propiedad eliminada',
                'tier': fl.tier,
                'startDate': fl.start_date.isoformat() if fl.start_date else None,
                'endDate': fl.end_date.isoformat() if fl.end_date else None,
                'isActive': fl.is_active,
                'daysRemaining': (fl.end_date - now).days if fl.end_date else 0
            })
        
        return jsonify({
            'featuredListings': listings_data,
            'count': len(listings_data)
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo featured listings del usuario: {e}")
        return jsonify({'error': 'Error al obtener featured listings'}), 500

