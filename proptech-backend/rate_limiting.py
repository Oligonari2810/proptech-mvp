from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from flask import Flask, jsonify
import os
import redis
import logging

logger = logging.getLogger('habitatpro')

limiter = Limiter(key_func=get_remote_address)

def setup_rate_limiting(app: Flask):
    """Configurar rate limiting con fallback a Redis si está disponible"""
    try:
        # Intentar usar Redis si está disponible
        redis_url = os.getenv('REDIS_URL')
        if redis_url:
            try:
                redis_client = redis.from_url(redis_url)
                redis_client.ping()
                # Usar Redis como storage para rate limiting
                limiter.storage_uri = redis_url
                logger.info("✅ Rate limiting usando Redis")
            except Exception as e:
                logger.warning(f"⚠️ Redis no disponible, usando memoria: {e}")
        else:
            logger.info("✅ Rate limiting usando memoria (Redis no configurado)")
        
        app.state.limiter = limiter
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
        
        logger.info("✅ Rate limiting configurado correctamente")
    except Exception as e:
        logger.error(f"❌ Error configurando rate limiting: {e}")
        # Continuar sin rate limiting si hay error

def custom_rate_limit_exceeded_handler(e):
    """Handler personalizado para rate limit exceeded"""
    return jsonify({
        'error': 'Límite de solicitudes excedido',
        'message': 'Has realizado demasiadas solicitudes. Por favor, intenta más tarde.',
        'retry_after': getattr(e, 'retry_after', None)
    }), 429
