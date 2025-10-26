from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import os

def create_rate_limiter(app):
    """Crear y configurar rate limiter con Redis"""
    
    # Configurar Redis para rate limiting
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    try:
        redis_client = redis.from_url(redis_url)
        redis_client.ping()  # Test connection
        print("✅ Redis conectado para rate limiting")
    except Exception as e:
        print(f"❌ Error conectando Redis: {e}")
        redis_client = None
    
    # Configurar rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri=redis_url if redis_client else "memory://",
        strategy="fixed-window",
        default_limits=["1000 per hour", "100 per minute"]
    )
    
    # Configurar límites específicos por endpoint
    @app.before_request
    def before_request():
        """Aplicar rate limiting antes de cada request"""
        pass
    
    # Rate limits específicos
    @limiter.limit("10 per minute")
    def ai_endpoints():
        """Rate limit para endpoints de IA"""
        pass
    
    @limiter.limit("50 per minute") 
    def search_endpoints():
        """Rate limit para búsquedas"""
        pass
    
    @limiter.limit("20 per minute")
    def auth_endpoints():
        """Rate limit para autenticación"""
        pass
    
    @limiter.limit("5 per minute")
    def valuation_endpoints():
        """Rate limit para valoraciones (más restrictivo)"""
        pass
    
    return limiter

# Decoradores para aplicar rate limiting
def rate_limit_ai(f):
    """Decorador para endpoints de IA"""
    return f

def rate_limit_search(f):
    """Decorador para endpoints de búsqueda"""
    return f

def rate_limit_auth(f):
    """Decorador para endpoints de autenticación"""
    return f

def rate_limit_valuation(f):
    """Decorador para endpoints de valoración"""
    return f

# Configuración de rate limits por tipo de usuario
RATE_LIMITS = {
    'anonymous': {
        'general': "100 per hour",
        'search': "20 per minute", 
        'ai': "5 per minute",
        'valuation': "2 per minute"
    },
    'authenticated': {
        'general': "1000 per hour",
        'search': "100 per minute",
        'ai': "30 per minute", 
        'valuation': "10 per minute"
    },
    'premium': {
        'general': "5000 per hour",
        'search': "500 per minute",
        'ai': "100 per minute",
        'valuation': "50 per minute"
    }
}

def get_user_rate_limit(user_type='anonymous', endpoint_type='general'):
    """Obtener rate limit basado en tipo de usuario y endpoint"""
    return RATE_LIMITS.get(user_type, RATE_LIMITS['anonymous']).get(endpoint_type, "100 per hour")

# Middleware para detectar tipo de usuario
def detect_user_type(request):
    """Detectar tipo de usuario basado en headers o JWT"""
    # En producción, esto vendría del JWT token
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return 'anonymous'
    
    # Simular detección de tipo de usuario
    if 'premium' in auth_header.lower():
        return 'premium'
    elif 'Bearer' in auth_header:
        return 'authenticated'
    else:
        return 'anonymous'

# Función para aplicar rate limiting dinámico
def apply_dynamic_rate_limit(limiter, endpoint_type='general'):
    """Aplicar rate limiting dinámico basado en tipo de usuario"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Detectar tipo de usuario
            user_type = detect_user_type(request)
            
            # Obtener rate limit apropiado
            rate_limit = get_user_rate_limit(user_type, endpoint_type)
            
            # Aplicar rate limit
            return limiter.limit(rate_limit)(f)(*args, **kwargs)
        return wrapper
    return decorator
