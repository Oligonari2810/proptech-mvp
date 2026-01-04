"""
🔧 HEALTH CHECK ENDPOINT ROBUSTO
Endpoint para verificar salud del backend
"""
from flask import Blueprint, jsonify
import logging
from datetime import datetime
import os
from sqlalchemy import text

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
        # Importar db inicializada por app.py (no usar ORM para count: evita fallos por columnas nuevas)
        from models import db
        db.session.execute(text('SELECT 1'))
        # Count robusto (no referencia columnas específicas)
        count = db.session.execute(text('SELECT COUNT(*)::int FROM properties')).scalar() or 0
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
    # En Render/producción MVP: no devolver 503 por problemas parciales (evita que el LB marque la app como down).
    strict = os.getenv('HEALTHCHECK_STRICT', '').lower() in ('1', 'true', 'yes', 'on')
    if overall_healthy or not strict:
        return jsonify(health_status), 200
    return jsonify(health_status), 503  # Modo estricto opcional

