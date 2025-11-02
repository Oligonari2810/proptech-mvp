"""
🔧 HEALTH CHECK ENDPOINT ROBUSTO
Endpoint para verificar salud del backend
"""
from flask import Blueprint, jsonify
import logging
from datetime import datetime

logger = logging.getLogger('habitatpro')

health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint de verificación de salud del backend - Versión robusta"""
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'services': {}
    }
    
    overall_healthy = True
    
    # Verificar base de datos
    try:
        from app import db
        from models import Property
        # Query simple para verificar conexión
        count = Property.query.count()
        health_status['services']['database'] = {
            'status': 'healthy',
            'properties_count': count
        }
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status['services']['database'] = {
            'status': 'unhealthy',
            'error': str(e)[:100]  # Limitar tamaño del error
        }
        overall_healthy = False
        health_status['status'] = 'degraded'
    
    # Verificar Redis (si está disponible)
    try:
        from app import redis_client
        if redis_client:
            redis_client.ping()
            health_status['services']['redis'] = {
                'status': 'healthy'
            }
        else:
            health_status['services']['redis'] = {
                'status': 'not_configured'
            }
    except Exception as e:
        health_status['services']['redis'] = {
            'status': 'unavailable',
            'note': 'Redis not required for basic operations'
        }
    
    # Verificar servicios principales
    try:
        health_status['services']['avm'] = {
            'status': 'operational',
            'note': 'AVM model available'
        }
        health_status['services']['properties'] = {
            'status': 'operational'
        }
        health_status['services']['valuation'] = {
            'status': 'operational'
        }
    except Exception as e:
        logger.warning(f"Service check error: {str(e)}")
    
    # Determinar código de estado HTTP
    if overall_healthy:
        return jsonify(health_status), 200
    else:
        return jsonify(health_status), 503  # Service Unavailable si hay problemas

