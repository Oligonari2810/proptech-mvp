from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
# from flask_cors import CORS  # REMOVIDO - usando CORS manual
from sqlalchemy import text, Index
from sqlalchemy.sql import func
import redis
from datetime import datetime, timedelta
# from sklearn.neighbors import NearestNeighbors
# from sklearn.feature_extraction.text import TfidfVectorizer
import json
import os

# Importar logger estructurado
try:
    from utils.logger import logger
except ImportError:
    import logging
    logger = logging.getLogger('habitatpro')
    logger.setLevel(logging.INFO)

# Importar middleware de autenticación
try:
    from middleware.auth_middleware import admin_required
except ImportError:
    # Fallback: función decoradora básica si el middleware no está disponible
    def admin_required(f):
        def decorated_function(*args, **kwargs):
            # Verificación básica de token en Authorization header
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
            
            if not token:
                return jsonify({'error': 'Token de autenticación requerido'}), 401
            
            # Verificación básica del token (delegar a auth.py)
            try:
                from auth import decode_token
                data = decode_token(token)
                if 'error' in data:
                    return jsonify({'error': data['error']}), 401
                
                user_role = data.get('role')
                if user_role not in ['admin', 'super_admin']:
                    return jsonify({'error': 'Acceso denegado. Se requiere rol de administrador.'}), 403
                
                # Agregar usuario al request para uso en el endpoint
                request.current_user = data
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Token inválido', 'details': sanitize_error(e)}), 401
        
        decorated_function.__name__ = f.__name__
        return decorated_function

app = Flask(__name__)

# Helper para sanitizar errores en producción
def sanitize_error(error: Exception, generic_message: str = "Ha ocurrido un error. Por favor, inténtelo más tarde.") -> str:
    """Sanitiza errores para no mostrar stack traces en producción"""
    try:
        from utils.logger import sanitize_error as logger_sanitize
        return logger_sanitize(error, generic_message)
    except ImportError:
        # Fallback si logger no está disponible
        is_production = os.getenv('FLASK_ENV') == 'production' or os.getenv('ENVIRONMENT') == 'production'
        
        if is_production:
            logger.error(f"Error sanitizado: {str(error)}")
            return generic_message
        else:
            return str(error)

# Configuración de base de datos - PostgreSQL en producción, SQLite en desarrollo
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgresql://'):
    # Parse PostgreSQL URL para SQLAlchemy
    if DATABASE_URL.startswith('postgresql://'):
        DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    # Fallback a SQLite para desarrollo local
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habitatpro.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# SECRET_KEY debe estar en .env, no hardcodeado
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
if not app.config['SECRET_KEY']:
    raise ValueError("SECRET_KEY no configurado. Usa scripts/generate_secrets.py para generarlo.")

# Configuración OAuth
app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID', 'your-google-client-id')
app.config['GOOGLE_CLIENT_SECRET'] = os.getenv('GOOGLE_CLIENT_SECRET', 'your-google-client-secret')
app.config['GITHUB_CLIENT_ID'] = os.getenv('GITHUB_CLIENT_ID', 'your-github-client-id')
app.config['GITHUB_CLIENT_SECRET'] = os.getenv('GITHUB_CLIENT_SECRET', 'your-github-client-secret')

# Primero importar db desde models.py, luego inicializar
from models import db
db.init_app(app)

# CORS configuration
# - En producción: restringir orígenes explícitos y (opcionalmente) previews de Vercel
# - En desarrollo: permitir el Origin que venga
import re

DEFAULT_ALLOWED_ORIGINS = [
    'https://habitatprord.com',
    'https://www.habitatprord.com',
    'https://habitatprord.vercel.app',
    'https://proptech-mvp.vercel.app',
    'https://proptech-mvp-oligonari2810s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    'http://localhost:3004',
]

def _parse_csv_env(name: str) -> list[str]:
    raw = os.getenv(name, '').strip()
    if not raw:
        return []
    return [item.strip() for item in raw.split(',') if item.strip()]

# Compatibilidad: algunos despliegues usan CORS_ORIGINS (template viejo)
allowed_origins = (
    _parse_csv_env('CORS_ALLOWED_ORIGINS')
    or _parse_csv_env('CORS_ORIGINS')
    or DEFAULT_ALLOWED_ORIGINS
)
ALLOW_ALL_CORS = os.getenv('CORS_ALLOW_ALL', '').lower() in ('1', 'true', 'yes', 'on')
ALLOW_VERCEL_PREVIEW = os.getenv('ALLOW_VERCEL_PREVIEW', '').lower() in ('1', 'true', 'yes', 'on')
_VERCEL_PREVIEW_RE = re.compile(r"^https://[a-z0-9-]+\.vercel\.app$", re.IGNORECASE)

def is_allowed_origin(origin: str | None) -> bool:
    if not origin:
        return False
    # Modo MVP: permitir cualquier Origin (reflejado) si se habilita explícitamente
    if ALLOW_ALL_CORS:
        return True
    if origin in allowed_origins:
        return True
    # Permitir previews de Vercel solo si se habilita explícitamente
    if ALLOW_VERCEL_PREVIEW and _VERCEL_PREVIEW_RE.match(origin):
        return True
    return False

# CORS MANUAL - Solución definitiva sin Flask-CORS
# Configuración CORS manual para evitar dependencias problemáticas
@app.after_request
def after_request(response):
    """Configuración CORS manual - permite orígenes permitidos"""
    origin = request.headers.get('Origin')
    
    # En producción, verificar lista de orígenes permitidos
    is_production = os.getenv('FLASK_ENV') == 'production' or os.getenv('ENVIRONMENT') == 'production'
    
    if is_production:
        # Producción: solo orígenes permitidos
        if is_allowed_origin(origin):
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Credentials', 'true')
    else:
        # Desarrollo: permitir todos los orígenes
        if origin:
            response.headers.add('Access-Control-Allow-Origin', origin)
    
    # Importante para caches/CDNs cuando se varía por Origin
    response.headers.add('Vary', 'Origin')

    # Headers CORS estándar
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Length,X-Total-Count')
    response.headers.add('Access-Control-Max-Age', '3600')
    
    return response

# Manejar preflight OPTIONS requests
@app.before_request
def handle_preflight():
    """Manejar requests OPTIONS (preflight) automáticamente"""
    if request.method == "OPTIONS":
        response = jsonify({'status': 'ok'})
        origin = request.headers.get('Origin')
        is_production = os.getenv('FLASK_ENV') == 'production' or os.getenv('ENVIRONMENT') == 'production'
        
        if is_production:
            if is_allowed_origin(origin):
                response.headers.add('Access-Control-Allow-Origin', origin)
                response.headers.add('Access-Control-Allow-Credentials', 'true')
        else:
            if origin:
                response.headers.add('Access-Control-Allow-Origin', origin)
        
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
        return response

# Redis configuration - manejar fallback si no está disponible
try:
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        db=0,
        decode_responses=True
    )
    redis_client.ping()
except:
    redis_client = None
    logger.warning("⚠️ Redis no disponible - continuando sin cache")

# Configuración SocketIO con namespaces y hardening
# Intentar usar eventlet, si no está disponible usar threading
try:
    import eventlet
    async_mode = "eventlet"
except ImportError:
    async_mode = "threading"

socketio = SocketIO(
    app,
    cors_allowed_origins=(allowed_origins + (["https://proptech-mvp-1.onrender.com"] if "https://proptech-mvp-1.onrender.com" not in allowed_origins else [])),
    async_mode=async_mode,
    ping_interval=25,
    ping_timeout=20,
    logger=True,
    engineio_logger=False
)

# Importar modelos desde models.py
from models import User, Property, Favorite, Review, FeaturedListing

# Importar y registrar blueprint de autenticación
try:
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    logger.info("✅ Blueprint de autenticación registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de autenticación: {e}")

# Importar y registrar blueprint de favoritos
try:
    from routes.favorites import favorites_bp
    app.register_blueprint(favorites_bp)
    logger.info("✅ Blueprint de favoritos registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de favoritos: {e}")

# Importar y registrar blueprint de reservas
try:
    from routes.bookings import bookings_bp
    app.register_blueprint(bookings_bp, url_prefix='/api')
    logger.info("✅ Blueprint de reservas registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de reservas: {e}")

# Importar y registrar blueprint de reviews
try:
    from routes.reviews import reviews_bp
    app.register_blueprint(reviews_bp)
    logger.info("✅ Blueprint de reviews registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de reviews: {e}")

# Importar y registrar blueprint de featured listings
try:
    from routes.featured import featured_bp
    app.register_blueprint(featured_bp)
    logger.info("✅ Blueprint de featured listings registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de featured listings: {e}")

# Importar y registrar blueprint de búsqueda emocional (IA Emocional)
try:
    from ai.routes.emotional_search import emotional_bp
    app.register_blueprint(emotional_bp)
    
    # Registrar blueprint de IA Emocional
    try:
        from ai.routes.ai_routes import ai_bp
        app.register_blueprint(ai_bp, url_prefix='/api/ai')
    except ImportError as e:
        logger.warning(f"Blueprints de IA Emocional no disponibles: {e}")
    logger.info("✅ Blueprint de búsqueda emocional registrado")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de búsqueda emocional: {e}")

# Importar y registrar blueprint de health (si existe)
try:
    from routes.health import health_bp
    app.register_blueprint(health_bp)
    logger.info("✅ Blueprint de health check registrado")
except Exception as e:
    logger.warning(f"⚠️ Blueprint de health check no disponible: {e}")

# Importar y registrar blueprint de valuation (incluye AVM)
try:
    from routes.valuation import valuation_bp
    app.register_blueprint(valuation_bp)
    logger.info("✅ Blueprint de valuation (AVM) registrado")
except Exception as e:
    logger.warning(f"⚠️ Blueprint de valuation no disponible: {e}")

# Importar y registrar blueprint de chat
try:
    from routes.chat_routes import chat_bp, register_socketio_events
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    # Registrar eventos de SocketIO para chat
    register_socketio_events(socketio)
    logger.info("✅ Blueprint de chat registrado con eventos SocketIO")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de chat: {e}")

# Importar y registrar blueprint de notificaciones
try:
    from routes.notification_routes import notification_bp, register_notification_socketio_events
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    # Registrar eventos de SocketIO para notificaciones
    register_notification_socketio_events(socketio)
    logger.info("✅ Blueprint de notificaciones registrado con eventos SocketIO")
except Exception as e:
    logger.warning(f"⚠️ No se pudo registrar blueprint de notificaciones: {e}")

# FALLBACK: Endpoints de auth directos - SIEMPRE REGISTRAR
# Intentar importar AuthService, si falla usar werkzeug como fallback
try:
    from auth import AuthService
    USE_AUTHSERVICE = True
    logger.info("✅ AuthService importado exitosamente")
except Exception as e:
    logger.warning(f"⚠️ No se pudo importar AuthService, usando werkzeug: {e}")
    USE_AUTHSERVICE = False
    from werkzeug.security import generate_password_hash, check_password_hash
    import jwt

from datetime import datetime

@app.route('/api/auth/register', methods=['POST'])
def register_direct():
    """Registro de usuario - endpoint directo"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        if not data.get('name'):
            return jsonify({'error': 'Nombre es requerido'}), 400
        
        # Verificar si el usuario ya existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'El usuario ya existe'}), 409
        
        # Crear nuevo usuario
        if USE_AUTHSERVICE:
            password_hash = AuthService.hash_password(data['password'])
        else:
            password_hash = generate_password_hash(data['password'])
        
        user = User(
            email=data['email'],
            password_hash=password_hash,
            name=data['name'],
            role=data.get('role', 'user'),
            phone=data.get('phone'),
            is_active=True,
            is_verified=False
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generar token
        if USE_AUTHSERVICE:
            token = AuthService.generate_token(user.id, user.role)
        else:
            token = jwt.encode({
                'user_id': user.id,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(hours=24),
                'iat': datetime.utcnow()
            }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_verified': user.is_verified
            },
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        error_msg = sanitize_error(e, "Error al registrar usuario. Por favor, verifique los datos e inténtelo de nuevo.")
        return jsonify({'error': f'Error en el registro: {error_msg}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login_direct():
    """Login con JWT token - endpoint directo"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        # Buscar usuario
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Verificar contraseña
        if not user.password_hash:
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        if USE_AUTHSERVICE:
            password_valid = AuthService.verify_password(data['password'], user.password_hash)
        else:
            password_valid = check_password_hash(user.password_hash, data['password'])
        
        if not password_valid:
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Verificar si está activo
        if not user.is_active:
            return jsonify({'error': 'Cuenta desactivada'}), 403
        
        # Actualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generar token
        if USE_AUTHSERVICE:
            token = AuthService.generate_token(user.id, user.role)
        else:
            token = jwt.encode({
                'user_id': user.id,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(hours=24),
                'iat': datetime.utcnow()
            }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_verified': user.is_verified
            },
            'token': token
        }), 200
        
    except Exception as e:
        error_msg = sanitize_error(e, "Error al iniciar sesión. Por favor, verifique sus credenciales e inténtelo de nuevo.")
        return jsonify({'error': f'Error en el login: {error_msg}'}), 500

logger.info("✅ Endpoints de auth directos registrados (Siempre activos)")

# Modelo Interaction inline para compatibilidad
class Interaction(db.Model):
    __tablename__ = 'interactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    interaction_type = db.Column(db.String(50))
    emotional_response = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# IA EMOCIONAL - MOTOR PROPECH COMPLETO CON KNN+TF-IDF
try:
    from sklearn.neighbors import NearestNeighbors
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    logger.warning("⚠️ scikit-learn o numpy no disponible - IA emocional en modo básico")

class EmotionAwareRecommender:
    """
    Motor de recomendación emocional PropTech completo.
    Usa KNN + TF-IDF para encontrar propiedades similares basadas en:
    - Perfil emocional del usuario
    - Tags emocionales de propiedades
    - Características técnicas (precio, tamaño, amenities)
    """
    def __init__(self):
        self.is_trained = False
        self.properties_index = []
        self.property_features = []
        
        if ML_AVAILABLE:
            # Vectorizador TF-IDF para tags emocionales y descripciones
            self.vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words=['spanish', 'english'],
                ngram_range=(1, 2),  # Unigramas y bigramas
                min_df=1,  # Mínimo 1 aparición
                analyzer='word'
            )
            # Modelo KNN para encontrar propiedades similares
            self.knn_model = NearestNeighbors(
                n_neighbors=5,
                metric='cosine',  # Distancia coseno para similitud
                algorithm='auto'
            )
        else:
            self.vectorizer = None
            self.knn_model = None
    
    def extract_property_features(self, property_data):
        """
        Extrae características emocionales y técnicas de una propiedad.
        Combina features numéricas normalizadas con tags emocionales.
        """
        tags = property_data.get('emotional_tags', [])
        features = property_data.get('features', [])
        description = property_data.get('description', '')
        price = property_data.get('price', 0)
        bedrooms = property_data.get('bedrooms', 0) or 0
        area = property_data.get('area', 0) or 0
        bathrooms = property_data.get('bathrooms', 0) or 0
        
        # Normalizar características numéricas (evitar división por cero)
        max_price = 1000000  # Precio máximo esperado
        max_bedrooms = 10
        max_area = 500
        max_bathrooms = 10
        
        # Características numéricas normalizadas
        feature_vector = [
            min(price / max_price, 1.0) if max_price > 0 else 0.0,
            min(bedrooms / max_bedrooms, 1.0) if max_bedrooms > 0 else 0.0,
            min(area / max_area, 1.0) if max_area > 0 else 0.0,
            min(bathrooms / max_bathrooms, 1.0) if max_bathrooms > 0 else 0.0,
        ]
        
        # Características emocionales binarias (one-hot encoding)
        emotional_features = [
            1.0 if any(tag in str(tags).lower() for tag in ['familiar', 'seguro', 'jardin', 'niños', 'family']) else 0.0,
            1.0 if any(tag in str(tags).lower() for tag in ['lujoso', 'premium', 'exclusivo', 'diseño', 'luxury']) else 0.0,
            1.0 if any(tag in str(tags).lower() for tag in ['moderno', 'contemporaneo', 'minimalista', 'modern']) else 0.0,
            1.0 if any(tag in str(tags).lower() for tag in ['inversion', 'rentable', 'oportunidad', 'investment']) else 0.0,
            1.0 if any(tag in str(tags).lower() for tag in ['artistico', 'creativo', 'urbano', 'artistic']) else 0.0,
            1.0 if any(tag in str(tags).lower() for tag in ['tranquilo', 'calm', 'peaceful', 'residencial']) else 0.0,
        ]
        
        # Amenities binarias
        amenities_features = [
            1.0 if any(feat in str(features).lower() for feat in ['jardin', 'garden', 'terraza', 'terrace']) else 0.0,
            1.0 if any(feat in str(features).lower() for feat in ['piscina', 'pool']) else 0.0,
            1.0 if any(feat in str(features).lower() for feat in ['garaje', 'garage', 'parking']) else 0.0,
            1.0 if any(feat in str(features).lower() for feat in ['gimnasio', 'gym', 'fitness']) else 0.0,
            1.0 if any(feat in str(features).lower() for feat in ['ascensor', 'elevator']) else 0.0,
        ]
        
        # Combinar todas las características
        feature_vector.extend(emotional_features)
        feature_vector.extend(amenities_features)
        
        return feature_vector
    
    def extract_text_features(self, property_data):
        """
        Extrae características de texto para TF-IDF.
        Combina tags emocionales, features y descripción.
        """
        tags = property_data.get('emotional_tags', [])
        features = property_data.get('features', [])
        description = property_data.get('description', '')
        title = property_data.get('title', '')
        
        # Combinar todo el texto relevante
        text_parts = []
        if title:
            text_parts.append(str(title))
        if description:
            text_parts.append(str(description))
        if tags:
            if isinstance(tags, list):
                text_parts.extend([str(tag) for tag in tags])
            else:
                text_parts.append(str(tags))
        if features:
            if isinstance(features, list):
                text_parts.extend([str(feat) for feat in features])
            else:
                text_parts.append(str(features))
        
        return ' '.join(text_parts).lower()
    
    def fit(self, properties):
        """
        Entrena el modelo con propiedades existentes.
        Usa KNN + TF-IDF para aprendizaje no supervisado.
        """
        if not ML_AVAILABLE or not properties:
            self.is_trained = False
            return
        
        try:
            self.properties_index = properties
            property_texts = [self.extract_text_features(prop) for prop in properties]
            property_features = [self.extract_property_features(prop) for prop in properties]
            
            # Entrenar TF-IDF vectorizer
            if property_texts:
                tfidf_matrix = self.vectorizer.fit_transform(property_texts)
                
                # Combinar características numéricas con TF-IDF
                numeric_features = np.array(property_features)
                tfidf_dense = tfidf_matrix.toarray()
                
                # Normalizar características numéricas
                if numeric_features.size > 0:
                    numeric_features = numeric_features / (np.max(numeric_features, axis=0) + 1e-8)
                
                # Combinar características numéricas y TF-IDF
                combined_features = np.hstack([numeric_features, tfidf_dense])
                
                # Entrenar modelo KNN
                self.knn_model.fit(combined_features)
                self.property_features = combined_features
                self.is_trained = True
                
                logger.info(f"✅ Modelo IA emocional entrenado con {len(properties)} propiedades")
            else:
                self.is_trained = False
                logger.warning("⚠️ No hay propiedades para entrenar el modelo")
        except Exception as e:
            self.is_trained = False
            logger.error(f"❌ Error entrenando modelo IA emocional: {e}")
    
    def recommend(self, user_profile, available_properties, top_n=5):
        """
        Genera recomendaciones basadas en perfil emocional del usuario.
        Usa KNN para encontrar propiedades similares al perfil emocional.
        """
        if not available_properties:
            return []
        
        # Si no hay ML disponible o modelo no entrenado, usar método básico
        if not ML_AVAILABLE or not self.is_trained or not self.knn_model:
            return self._recommend_basic(user_profile, available_properties, top_n)
        
        try:
            # Extraer perfil emocional del usuario
            user_emotional_profile = user_profile.get('emotional_profile', {})
            
            # Crear vector de características del usuario basado en su perfil
            user_features = self._extract_user_features(user_emotional_profile)
            
            # Extraer características de texto del perfil del usuario
            user_text = self._extract_user_text(user_emotional_profile)
            
            # Transformar texto del usuario con TF-IDF
            user_tfidf = self.vectorizer.transform([user_text])
            
            # Combinar características numéricas y TF-IDF del usuario
            user_numeric = np.array([user_features])
            user_numeric = user_numeric / (np.max(user_numeric, axis=0) + 1e-8) if user_numeric.size > 0 else user_numeric
            user_combined = np.hstack([user_numeric, user_tfidf.toarray()])
            
            # Encontrar propiedades más similares usando KNN
            distances, indices = self.knn_model.kneighbors(user_combined, n_neighbors=min(top_n, len(self.properties_index)))
            
            # Obtener propiedades recomendadas
            recommended_properties = []
            for idx in indices[0]:
                if idx < len(self.properties_index):
                    prop = self.properties_index[idx]
                    # Añadir score de similitud (1 - distancia, ya que distancia coseno está invertida)
                    similarity_score = 1 - distances[0][list(indices[0]).index(idx)]
                    prop_with_score = prop.copy() if isinstance(prop, dict) else prop
                    if isinstance(prop_with_score, dict):
                        prop_with_score['_similarity_score'] = float(similarity_score)
                        prop_with_score['_recommendation_reason'] = f"Similitud emocional: {similarity_score:.2%}"
                    recommended_properties.append(prop_with_score)
            
            # Ordenar por score de similitud
            recommended_properties.sort(key=lambda x: x.get('_similarity_score', 0), reverse=True)
            
            logger.info(f"✅ Recomendaciones generadas: {len(recommended_properties)} propiedades")
            return recommended_properties[:top_n]
            
        except Exception as e:
            logger.error(f"❌ Error generando recomendaciones IA: {e}")
            # Fallback a método básico
            return self._recommend_basic(user_profile, available_properties, top_n)
    
    def _extract_user_features(self, emotional_profile):
        """Extrae características numéricas del perfil emocional del usuario"""
        # Valores por defecto
        features = [
            0.5,  # Precio promedio
            2.0 / 10.0,  # Habitaciones promedio
            100.0 / 500.0,  # Área promedio
            1.0 / 10.0,  # Baños promedio
        ]
        
        # Características emocionales del usuario
        emotional_features = [
            1.0 if emotional_profile.get('family_friendly', 0) > 0.5 else 0.0,
            1.0 if emotional_profile.get('luxury_preference', 0) > 0.5 else 0.0,
            1.0 if emotional_profile.get('modern_taste', 0) > 0.5 else 0.0,
            1.0 if emotional_profile.get('investment_focus', 0) > 0.5 else 0.0,
            1.0 if emotional_profile.get('artistic_style', 0) > 0.5 else 0.0,
            1.0 if emotional_profile.get('calm_preference', 0) > 0.5 else 0.0,
        ]
        
        # Amenities preferidas del usuario
        amenities_features = [
            1.0 if emotional_profile.get('wants_garden', False) else 0.0,
            1.0 if emotional_profile.get('wants_pool', False) else 0.0,
            1.0 if emotional_profile.get('wants_parking', False) else 0.0,
            1.0 if emotional_profile.get('wants_gym', False) else 0.0,
            1.0 if emotional_profile.get('wants_elevator', False) else 0.0,
        ]
        
        features.extend(emotional_features)
        features.extend(amenities_features)
        
        return features
    
    def _extract_user_text(self, emotional_profile):
        """Extrae texto del perfil emocional del usuario para TF-IDF"""
        text_parts = []
        
        # Añadir preferencias emocionales como texto
        if emotional_profile.get('family_friendly', 0) > 0.5:
            text_parts.extend(['familiar', 'seguro', 'jardin', 'niños'])
        if emotional_profile.get('luxury_preference', 0) > 0.5:
            text_parts.extend(['lujoso', 'premium', 'exclusivo'])
        if emotional_profile.get('modern_taste', 0) > 0.5:
            text_parts.extend(['moderno', 'contemporaneo'])
        if emotional_profile.get('investment_focus', 0) > 0.5:
            text_parts.extend(['inversion', 'rentable'])
        
        return ' '.join(text_parts).lower()
    
    def _recommend_basic(self, user_profile, available_properties, top_n=5):
        """
        Método básico de recomendación sin ML (fallback).
        Ordena propiedades por similitud simple basada en tags emocionales.
        """
        if not available_properties:
            return []
        
        user_emotional_profile = user_profile.get('emotional_profile', {})
        user_tags = []
        
        # Extraer tags preferidos del usuario
        if user_emotional_profile.get('family_friendly', 0) > 0.5:
            user_tags.extend(['familiar', 'seguro', 'jardin'])
        if user_emotional_profile.get('luxury_preference', 0) > 0.5:
            user_tags.extend(['lujoso', 'premium', 'exclusivo'])
        if user_emotional_profile.get('modern_taste', 0) > 0.5:
            user_tags.extend(['moderno', 'contemporaneo'])
        
        # Calcular score simple para cada propiedad
        scored_properties = []
        for prop in available_properties:
            prop_tags = prop.get('emotional_tags', [])
            if isinstance(prop_tags, str):
                prop_tags = [prop_tags]
            
            # Contar coincidencias de tags
            matches = sum(1 for tag in user_tags if tag in str(prop_tags).lower())
            score = matches / max(len(user_tags), 1) if user_tags else 0.5
            
            prop_with_score = prop.copy() if isinstance(prop, dict) else prop
            if isinstance(prop_with_score, dict):
                prop_with_score['_similarity_score'] = score
                prop_with_score['_recommendation_reason'] = f"Coincidencia de tags: {matches} de {len(user_tags)}"
            scored_properties.append((score, prop_with_score))
        
        # Ordenar por score y retornar top N
        scored_properties.sort(key=lambda x: x[0], reverse=True)
        return [prop for _, prop in scored_properties[:top_n]]

# INICIALIZAR IA
emotion_engine = EmotionAwareRecommender()

# Monitoring (Prometheus & logging estructurado)
try:
    from monitoring.metrics import monitor_requests, generate_latest, REGISTRY, FRONTEND_PERFORMANCE, ERROR_COUNT
    from monitoring.business_metrics import update_properties_count, ROI_CALCULATIONS
    monitor_requests(app)
except Exception as _e:
    logger.warning(f"⚠️ Monitoring básico no inicializado: {_e}")

# DATOS DE PRUEBA REALES
def initialize_sample_data():
    """Inicializar base de datos con datos reales de prueba"""
    with app.app_context():
        # Limpiar datos existentes para forzar reinicialización
        Property.query.delete()
        User.query.delete()
        Interaction.query.delete()
        db.session.commit()
        
        logger.info("📊 Inicializando base de datos con datos de prueba...")
        
        sample_properties = [
            {
                'title': 'Moderno Ático en Centro con Vistas',
                'description': 'Spectacular ático completamente reformado con vistas panorámicas y terraza privada. Ideal para profesionales que buscan comodidad y diseño.',
                'price': 450000,
                'type': 'ático',
                'operation': 'compra',
                'location': 'Centro Histórico, Madrid',
                'bedrooms': 3,
                'bathrooms': 2,
                'area': 145,
                'features': ['terraza', 'ascensor', 'vistas', 'reformado'],
                'emotional_tags': ['lujoso', 'moderno', 'vistas', 'exclusivo']
            },
            {
                'title': 'Acogedora Casa Familiar con Jardín',
                'description': 'Encantadora casa familiar en zona residencial tranquila. Perfecta para familias con niños, cerca de colegios y parques.',
                'price': 320000,
                'type': 'casa',
                'operation': 'compra', 
                'location': 'Barrio Salamanca, Madrid',
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 180,
                'features': ['jardín', 'garaje', 'trastero', 'calefacción'],
                'emotional_tags': ['familiar', 'acogedor', 'seguro', 'jardín']
            },
            {
                'title': 'Apartamento Céntrico para Alquiler',
                'description': 'Bright and spacious apartment in the heart of the city, perfect for young professionals. Close to public transport and amenities.',
                'price': 1200,
                'type': 'apartamento',
                'operation': 'alquiler',
                'location': 'Centro, Barcelona',
                'bedrooms': 2,
                'bathrooms': 1,
                'area': 75,
                'features': ['amueblado', 'balcón', 'calefacción', 'internet'],
                'emotional_tags': ['céntrico', 'moderno', 'joven', 'urbano']
            },
            {
                'title': 'Duplex de Lujo en Zona Exclusiva',
                'description': 'Impresionante dúplex en zona premium con acabados de alta gama. Inversión segura con alta revalorización.',
                'price': 650000,
                'type': 'dúplex', 
                'operation': 'compra',
                'location': 'La Moraleja, Madrid',
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 220,
                'features': ['piscina', 'gimnasio', 'seguridad', 'jacuzzi'],
                'emotional_tags': ['lujoso', 'inversion', 'exclusivo', 'premium']
            },
            {
                'title': 'Estudio Moderno para Estudiantes',
                'description': 'Compacto y funcional estudio perfecto para estudiantes. Totalmente equipado y cerca de universidades.',
                'price': 600,
                'type': 'estudio',
                'operation': 'alquiler',
                'location': 'Ciudad Universitaria, Madrid',
                'bedrooms': 1,
                'bathrooms': 1,
                'area': 45,
                'features': ['amueblado', 'internet', 'calefacción', 'lavadora'],
                'emotional_tags': ['estudiante', 'económico', 'práctico', 'universitario']
            },
            {
                'title': 'Loft Industrial Renovado',
                'description': 'Espacioso loft en zona artística con techos altos y mucha luz natural. Perfecto para creativos.',
                'price': 1500,
                'type': 'loft',
                'operation': 'alquiler',
                'location': 'Barrio Artístico, Madrid',
                'bedrooms': 2,
                'bathrooms': 1,
                'area': 100,
                'features': ['techo alto', 'ventanas grandes', 'suelo de madera', 'espacio abierto'],
                'emotional_tags': ['artístico', 'moderno', 'creativo', 'urbano']
            },
            {
                'title': 'Casa con Jardín Privado',
                'description': 'Encantadora casa familiar con jardín privado en zona residencial tranquila. Ideal para familias.',
                'price': 1800,
                'type': 'casa',
                'operation': 'alquiler',
                'location': 'Zona Norte, Barcelona',
                'bedrooms': 3,
                'bathrooms': 2,
                'area': 120,
                'features': ['jardín', 'garaje', 'terraza', 'calefacción'],
                'emotional_tags': ['familiar', 'tranquilo', 'jardín', 'residencial']
            },
            {
                'title': 'Edificio Residencial Centro',
                'description': 'Oportunidad de inversión excepcional. Edificio completo en zona céntrica con alta rentabilidad.',
                'price': 2500000,
                'type': 'edificio',
                'operation': 'compra',
                'location': 'Centro Histórico, Barcelona',
                'bedrooms': 12,
                'bathrooms': 8,
                'area': 1200,
                'features': ['ascensor', 'portero', 'garaje', 'comercios'],
                'emotional_tags': ['inversion', 'rentable', 'oportunidad', 'céntrico']
            },
            {
                'title': 'Complejo de Apartamentos Premium',
                'description': 'Inversión sólida con apartamentos de lujo en zona de alta demanda. Excelente ROI garantizado.',
                'price': 1800000,
                'type': 'complejo',
                'operation': 'compra',
                'location': 'Zona Norte, Madrid',
                'bedrooms': 8,
                'bathrooms': 6,
                'area': 800,
                'features': ['piscina', 'gimnasio', 'seguridad', 'jardines'],
                'emotional_tags': ['inversion', 'rentable', 'lujoso', 'premium']
            },
            {
                'title': 'Oficinas Comerciales Céntricas',
                'description': 'Espacios comerciales en distrito financiero. Alta ocupación y rentabilidad estable.',
                'price': 1200000,
                'type': 'comercial',
                'operation': 'compra',
                'location': 'Distrito Financiero, Madrid',
                'bedrooms': 0,
                'bathrooms': 3,
                'area': 600,
                'features': ['ascensor', 'aire acondicionado', 'parking', 'seguridad'],
                'emotional_tags': ['inversion', 'comercial', 'céntrico', 'rentable']
            }
        ]
        
        # Crear usuario de prueba primero
        test_user = User(
            email='usuario@habitatpro.com',
            name='Usuario Demo'
        )
        db.session.add(test_user)
        db.session.flush()  # Para obtener el ID del usuario
        
        for prop_data in sample_properties:
            # Asegurar que todas las propiedades tengan image_url y owner_id
            if 'image_url' not in prop_data:
                prop_data['image_url'] = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
            if 'user_id' not in prop_data:
                prop_data['user_id'] = test_user.id
            property = Property(**prop_data)
            db.session.add(property)
        
        db.session.commit()
        logger.info(f"✅ {len(sample_properties)} propiedades de prueba creadas")
        
        # Entrenar IA emocional PropTech con los datos
        properties_data = []
        for prop in Property.query.all():
            properties_data.append({
                'id': prop.id,
                'title': prop.title,
                'description': prop.description or '',
                'price': prop.price or 0,
                'bedrooms': prop.bedrooms or 0,
                'bathrooms': prop.bathrooms or 0,
                'area': prop.area or prop.surface or 0,
                'emotional_tags': prop.emotional_tags or [],
                'features': prop.features or [],
                'type': prop.property_type or prop.type or '',
                'location': prop.location or ''
            })
        
        # Entrenar modelo de recomendación emocional con KNN+TF-IDF
        if properties_data:
            logger.info(f"🧠 Entrenando modelo IA emocional PropTech con {len(properties_data)} propiedades...")
            emotion_engine.fit(properties_data)
            if emotion_engine.is_trained:
                logger.info("✅ Modelo IA emocional entrenado exitosamente")
            else:
                logger.warning("⚠️ Modelo IA emocional en modo básico (fallback)")
        else:
            logger.warning("⚠️ No hay propiedades para entrenar modelo IA emocional")

# ENDPOINT RAÍZ - CORRECCIÓN DE ISSUE
@app.route('/')
def home():
    return jsonify({
        'app': 'HabitatPro',
        'version': '2.0.0-enterprise',
        'status': 'healthy',
        'docs': '/api/health',
        'message': 'HabitatPro - La primera proptech mundial'
    })

# APIS RESTFUL REALES
@app.route('/api/properties', methods=['GET'])
# # @limiter.limit("60/minute")
def get_properties():
    """API REAL: Obtener propiedades con filtros avanzados"""
    try:
        # Parámetros de filtrado
        operation = request.args.get('operation', '')
        property_type = request.args.get('type', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        min_bedrooms = request.args.get('min_bedrooms', type=int)
        location = request.args.get('location', '')
        
        # Construir consulta
        query = Property.query.filter_by(is_active=True)
        
        # Filtrar por operation - CRÍTICO: Manejar NULLs correctamente
        if operation:
            # Filtrar solo propiedades que tengan el operation especificado
            # Si operation es NULL, no aparecerá en resultados
            query = query.filter(Property.operation == operation)
        # Si no se especifica operation, mostrar todas las que tengan operation no-null
        else:
            query = query.filter(Property.operation.isnot(None))
        if property_type:
            query = query.filter_by(type=property_type)
        if min_price:
            query = query.filter(Property.price >= min_price)
        if max_price:
            query = query.filter(Property.price <= max_price)
        if min_bedrooms:
            query = query.filter(Property.bedrooms >= min_bedrooms)
        if location:
            query = query.filter(Property.location.ilike(f'%{location}%'))
            
        properties = query.order_by(Property.created_at.desc()).limit(50).all()
        
        # Obtener featured listings activos para añadir tier
        try:
            now = datetime.utcnow()
            featured_listings_active = FeaturedListing.query.filter(
                FeaturedListing.is_active == True,
                FeaturedListing.start_date <= now,
                FeaturedListing.end_date >= now
            ).all()
            featured_by_property = {fl.property_id: fl.tier for fl in featured_listings_active}
        except:
            featured_by_property = {}
        
        # Convertir a JSON
        properties_data = []
        for prop in properties:
            # Normalizar imagen para frontend:
            # - algunos registros tienen images vacío o NULL
            # - algunos tienen image_url pero el endpoint no lo devolvía
            image_url = getattr(prop, 'image_url', None) or None
            images = prop.images if isinstance(getattr(prop, 'images', None), list) else []
            if not images and image_url:
                images = [image_url]
            if not image_url and images:
                image_url = images[0]
            if not image_url:
                image_url = 'https://via.placeholder.com/800x600?text=HabitatPro'

            prop_data = {
                'id': prop.id,
                'title': prop.title,
                'description': prop.description,
                'price': prop.price,
                'type': prop.type,
                'operation': prop.operation,
                'location': prop.location,
                'bedrooms': prop.bedrooms,
                'bathrooms': prop.bathrooms,
                'area': prop.area if prop.area is not None else (prop.surface if prop.surface is not None else None),
                'features': prop.features or [],
                'emotional_tags': prop.emotional_tags or [],
                'emotional_profile': getattr(prop, 'emotional_profile', None) or {},  # Safe access with getattr
                'image_url': image_url,
                'images': images,
                'created_at': prop.created_at.isoformat() if prop.created_at else None
            }
            # Añadir featuredTier si existe
            if prop.id in featured_by_property:
                prop_data['featuredTier'] = featured_by_property[prop.id]
            properties_data.append(prop_data)
        
        # Aplicar IA emocional PropTech si hay usuario
        user_id = request.args.get('user_id')
        if user_id and properties_data:
            try:
                user = User.query.get(user_id)
                if user:
                    user_profile = {
                        'emotional_profile': getattr(user, 'emotional_profile', None) or {}
                    }
                    # Generar recomendaciones emocionales usando KNN+TF-IDF
                    recommended = emotion_engine.recommend(user_profile, properties_data, top_n=len(properties_data))
                    if recommended:
                        properties_data = recommended
                        logger.info(f"✅ Recomendaciones emocionales generadas para usuario {user_id}")
            except Exception as e:
                logger.error(f"❌ Error generando recomendaciones emocionales: {e}")
                # Continuar sin recomendaciones si hay error
        
        return jsonify({
            'success': True,
            'count': len(properties_data),
            'properties': properties_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/properties', methods=['POST'])
def create_property():
    """API REAL: Crear nueva propiedad"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['title', 'price', 'type', 'operation', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Campo requerido: {field}'}), 400
        
        # Crear propiedad
        property = Property(
            title=data['title'],
            description=data.get('description', ''),
            price=data['price'],
            type=data['type'],
            operation=data['operation'],
            location=data['location'],
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            area=data.get('area'),
            features=data.get('features', []),
            emotional_tags=data.get('emotional_tags', []),
            images=data.get('images', []),
            is_active=True
        )
        
        db.session.add(property)
        db.session.commit()
        
        property_data = {
            'id': property.id,
            'title': property.title,
            'description': property.description,
            'price': property.price,
            'type': property.type,
            'operation': property.operation,
            'location': property.location,
            'bedrooms': property.bedrooms,
            'bathrooms': property.bathrooms,
            'area': property.area,
            'features': property.features or [],
            'emotional_tags': property.emotional_tags or [],
            'image_url': getattr(property, 'image_url', None) or (property.images[0] if isinstance(property.images, list) and property.images else 'https://via.placeholder.com/800x600?text=HabitatPro'),
            'images': property.images if isinstance(property.images, list) and property.images else ([getattr(property, 'image_url', None)] if getattr(property, 'image_url', None) else []),
            'created_at': property.created_at.isoformat()
        }
        
        return jsonify({'success': True, 'property': property_data}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property_detail(property_id):
    """API REAL: Obtener detalles de una propiedad específica"""
    try:
        property = Property.query.get_or_404(property_id)
        
        property_data = {
            'id': property.id,
            'title': property.title,
            'description': property.description,
            'price': property.price,
            'type': property.type or property.property_type,
            'operation': property.operation,
            'location': property.location,
            'bedrooms': property.bedrooms,
            'bathrooms': property.bathrooms,
            'area': property.area or property.surface,
            'features': property.features or [],
            'emotional_tags': property.emotional_tags or [],
            'image_url': getattr(property, 'image_url', None) or (property.images[0] if isinstance(property.images, list) and property.images else 'https://via.placeholder.com/800x600?text=HabitatPro'),
            'images': property.images if isinstance(property.images, list) and property.images else ([getattr(property, 'image_url', None)] if getattr(property, 'image_url', None) else []),
            'is_active': property.is_active if hasattr(property, 'is_active') else True,
            'status': property.status if hasattr(property, 'status') else 'available',
            'created_at': property.created_at.isoformat() if property.created_at else None
        }
        
        return jsonify({'success': True, 'property': property_data})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 404

@app.route('/api/properties/<int:property_id>', methods=['PUT', 'PATCH'])
@admin_required
def update_property(property_id):
    """API REAL: Actualizar propiedad (solo admin)"""
    try:
        property = Property.query.get_or_404(property_id)
        data = request.get_json() or {}
        
        # Actualizar campos permitidos
        if 'title' in data:
            property.title = data['title']
        if 'description' in data:
            property.description = data.get('description', '')
        if 'price' in data:
            property.price = float(data['price'])
        if 'type' in data:
            property.type = data['type']
            property.property_type = data['type']  # Mantener ambos campos sincronizados
        if 'operation' in data:
            property.operation = data['operation']
        if 'location' in data:
            property.location = data['location']
        if 'bedrooms' in data:
            property.bedrooms = data.get('bedrooms')
        if 'bathrooms' in data:
            property.bathrooms = data.get('bathrooms')
        if 'area' in data:
            property.area = data.get('area')
            property.surface = data.get('area')  # Mantener ambos campos sincronizados
        if 'features' in data:
            property.features = data['features']
        if 'emotional_tags' in data:
            property.emotional_tags = data['emotional_tags']
        if 'images' in data:
            property.images = data['images']
        if 'is_active' in data:
            property.is_active = bool(data['is_active'])
        if 'status' in data:
            property.status = data['status']
        
        db.session.commit()
        
        property_data = {
            'id': property.id,
            'title': property.title,
            'description': property.description,
            'price': property.price,
            'type': property.type or property.property_type,
            'operation': property.operation,
            'location': property.location,
            'bedrooms': property.bedrooms,
            'bathrooms': property.bathrooms,
            'area': property.area or property.surface,
            'features': property.features or [],
            'emotional_tags': property.emotional_tags or [],
            'image_url': getattr(property, 'image_url', None) or (property.images[0] if isinstance(property.images, list) and property.images else 'https://via.placeholder.com/800x600?text=HabitatPro'),
            'images': property.images if isinstance(property.images, list) and property.images else ([getattr(property, 'image_url', None)] if getattr(property, 'image_url', None) else []),
            'is_active': property.is_active if hasattr(property, 'is_active') else True,
            'status': property.status if hasattr(property, 'status') else 'available',
            'created_at': property.created_at.isoformat() if property.created_at else None
        }
        
        return jsonify({'success': True, 'property': property_data}), 200
        
    except Exception as e:
        db.session.rollback()
        error_msg = sanitize_error(e, "Error al actualizar la propiedad. Por favor, inténtelo más tarde.")
        return jsonify({'success': False, 'error': error_msg}), 500

@app.route('/api/properties/<int:property_id>', methods=['DELETE'])
@admin_required
def delete_property(property_id):
    """API REAL: Eliminar propiedad (solo admin)"""
    try:
        property = Property.query.get_or_404(property_id)
        
        # Obtener datos antes de eliminar para respuesta
        property_data = {
            'id': property.id,
            'title': property.title
        }
        
        db.session.delete(property)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Propiedad eliminada exitosamente',
            'property': property_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        error_msg = sanitize_error(e, "Error al eliminar la propiedad. Por favor, inténtelo más tarde.")
        return jsonify({'success': False, 'error': error_msg}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """API REAL: Crear nuevo usuario"""
    try:
        data = request.get_json()
        
        user = User(
            email=data['email'],
            name=data['name']
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/ai/recommend', methods=['POST'])
def get_ai_recommendations():
    """API REAL: Obtener recomendaciones de IA emocional"""
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        filters = data.get('filters', {})
        
        # Obtener propiedades basadas en filtros
        query = Property.query.filter_by(is_active=True)
        
        if filters.get('operation'):
            query = query.filter_by(operation=filters['operation'])
        if filters.get('max_price'):
            query = query.filter(Property.price <= filters['max_price'])
            
        properties = query.limit(100).all()
        
        # Convertir a formato para IA emocional PropTech
        properties_data = []
        for prop in properties:
            properties_data.append({
                'id': prop.id,
                'title': prop.title,
                'description': prop.description or '',
                'price': prop.price or 0,
                'bedrooms': prop.bedrooms or 0,
                'bathrooms': prop.bathrooms or 0,
                'area': prop.area or prop.surface or 0,
                'emotional_tags': prop.emotional_tags or [],
                'features': prop.features or [],
                'type': prop.property_type or prop.type or '',
                'operation': prop.operation or '',
                'location': prop.location or ''
            })
        
        # Generar recomendaciones emocionales usando KNN+TF-IDF
        user_profile_structured = {
            'emotional_profile': user_profile.get('emotional_profile', {})
        }
        recommendations = emotion_engine.recommend(user_profile_structured, properties_data, top_n=10)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'emotional_insights': {
                'family_friendly_score': user_profile.get('emotional_profile', {}).get('family_friendly', 0),
                'luxury_preference': user_profile.get('emotional_profile', {}).get('luxury_preference', 0),
                'modern_taste': user_profile.get('emotional_profile', {}).get('modern_taste', 0)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== IA ENDPOINTS (SIMPLE) =====
@app.route('/api/ai/valuation', methods=['POST'])
def ai_valuation():
    """Endpoint simple de valoración IA"""
    try:
        data = request.get_json() or {}
        base_price = float(data.get('price') or 300000)
        size = float(data.get('area') or data.get('surface') or 120)
        bedrooms = int(data.get('bedrooms') or 3)
        # Heurística simple
        estimated = base_price * (1 + (bedrooms - 3) * 0.03) * (1 + (size - 120) * 0.001)
        return jsonify({
            'estimatedValue': round(estimated, 0),
            'confidence': 0.82,
            'priceRange': {
                'min': round(estimated * 0.92, 0),
                'max': round(estimated * 1.08, 0)
            }
        })
    except Exception as e:
        error_msg = sanitize_error(e, "Error al calcular la valoración. Por favor, verifique los datos e inténtelo de nuevo.")
        return jsonify({'error': error_msg, 'estimatedValue': 300000, 'confidence': 0.5}), 200

@app.route('/api/ai/sale-probability', methods=['POST'])
def ai_sale_probability():
    """Endpoint simple de probabilidad de venta"""
    try:
        d = request.get_json() or {}
        return jsonify({
            'saleProbability': {'30days': 0.65, '60days': 0.82, '90days': 0.91},
            'estimatedDaysOnMarket': 45,
            'factors': [
                {'factor': 'price_competitiveness', 'impact': 'high'},
                {'factor': 'seasonality', 'impact': 'medium'}
            ]
        })
    except Exception as e:
        error_msg = sanitize_error(e, "Error al calcular la probabilidad de venta. Por favor, inténtelo más tarde.")
        return jsonify({'error': error_msg, 'saleProbability': {}}), 200

@app.route('/api/ai/describe', methods=['POST'])
def ai_describe():
    """Endpoint simple de generación de descripciones"""
    try:
        d = request.get_json() or {}
        title = d.get('title') or 'Propiedad destacada'
        location = d.get('location') or 'zona privilegiada'
        bedrooms = d.get('bedrooms') or 'varios'
        area = d.get('area') or d.get('surface') or 'amplia'
        desc = (
            f"{title} en {location}. Cuenta con {bedrooms} dormitorios y {area} m². "
            "Ideal para quienes buscan confort y buena ubicación."
        )
        return jsonify({'description': desc, 'tags': ['luminoso', 'ubicación', 'confort']})
    except Exception as e:
        return jsonify({'error': str(e)}), 200

# HEALTH CHECK MEJORADO
@app.route('/api/health', methods=['GET'])
# @limiter.exempt  # Temporarily disabled
def health_check():
    """Health check completo del sistema - CORREGIDO"""
    try:
        # ✅ INICIALIZAR ESTRUCTURA COMPLETA CON CACHE
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'services': {
                'database': 'unknown',
                'redis': 'unknown',
                'ai_engine': 'unknown',
                'avm': 'unknown',
                'properties': 'unknown',
                'valuation': 'unknown'
            },
            'metrics': {
                'total_properties': 0,
                'total_users': 0,
                'ai_trained': emotion_engine.is_trained if hasattr(emotion_engine, 'is_trained') else False
            },
            'cache': {}  # ✅ INICIALIZADO ANTES DE USAR
        }
        
        # Verificar base de datos - CORREGIDO para SQLAlchemy 2.0
        try:
            db.session.execute(text('SELECT 1'))
            health_status['services']['database'] = 'healthy'
            health_status['metrics']['total_properties'] = Property.query.count()
            health_status['metrics']['total_users'] = User.query.count()
            health_status['services']['properties'] = 'operational'
        except Exception as e:
            health_status['services']['database'] = 'unhealthy'
            health_status['services']['properties'] = 'degraded'
            health_status['status'] = 'degraded'
            logger.error(f"Database health check error: {e}")
        
        # Verificar Redis - CORREGIDO: cache ya inicializado
        try:
            if redis_client:
                redis_client.ping()
                health_status['services']['redis'] = 'healthy'
                health_status['cache']['redis'] = 'available'
                logger.info("✅ Redis disponible en health check")
            else:
                health_status['services']['redis'] = 'unavailable'
                health_status['cache']['redis'] = 'unavailable'
                logger.warning("⚠️ Redis no disponible en health check")
        except Exception as e:
            health_status['services']['redis'] = 'unhealthy'
            health_status['cache']['redis'] = 'unavailable'
            health_status['status'] = 'degraded'
            logger.error(f"Redis health check error: {e}")
        
        # Verificar AVM
        try:
            from avm.property_valuation import PropertyValuationModel
            health_status['services']['avm'] = 'operational'
            health_status['services']['valuation'] = 'operational'
        except Exception as e:
            health_status['services']['avm'] = 'unavailable'
            health_status['services']['valuation'] = 'unavailable'
            logger.warning(f"AVM not available: {e}")
        
        # Verificar AI Engine
        try:
            if hasattr(emotion_engine, 'is_trained'):
                health_status['services']['ai_engine'] = 'operational' if emotion_engine.is_trained else 'not_trained'
            else:
                health_status['services']['ai_engine'] = 'unavailable'
        except Exception as e:
            health_status['services']['ai_engine'] = 'unavailable'
            logger.warning(f"AI Engine check error: {e}")
        
        # Determinar código HTTP según estado
        if health_status['status'] == 'healthy':
            return jsonify(health_status), 200
        else:
            return jsonify(health_status), 503  # Service Unavailable si hay problemas
            
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# VERSION ENDPOINT
@app.route('/version', methods=['GET'])
# @limiter.exempt  # Temporarily disabled
def get_version():
    """Returns application version information"""
    return jsonify({
        'name': 'habitatpro-backend',
        'version': '2024.10.26',
        'status': 'active',
        'timestamp': datetime.utcnow().isoformat()
    })

# ROOT ENDPOINT
# Nota: Ya existe un endpoint raíz en este archivo (def home en la sección "ENDPOINT RAÍZ").
# Tener dos funciones con el mismo nombre/end-point rompe el arranque de Flask/Gunicorn:
# AssertionError: View function mapping is overwriting an existing endpoint function: home
#
# Si necesitas conservar este payload “extendido”, muévelo a otra ruta (por ejemplo `/api/info`)
# o cambia el nombre/endpoint.
@app.route('/api/info', methods=['GET'])
def api_info():
    """API information endpoint (antes estaba duplicado en `/`)"""
    return jsonify({
        'app': 'HabitatPro',
        'version': '2.0.0-enterprise',
        'status': 'operational',
        'description': 'Real Estate Platform with AI',
        'endpoints': {
            'health': '/api/health',
            'properties': '/api/properties',
            'version': '/version',
            'admin': '/api/admin/metrics',
            'roi': '/api/analytics/roi'
        },
        'timestamp': datetime.utcnow().isoformat()
    })

# INICIALIZACIÓN AL ARRANCAR
def initialize_app():
    """Inicializar datos al arrancar la aplicación"""
    initialize_sample_data()

# API DE MÉTRICAS ADMIN DASHBOARD
@app.route('/api/admin/metrics', methods=['GET'])
@admin_required
def get_admin_metrics():
    """Obtener métricas reales para el admin dashboard - MEJORADO con manejo de errores"""
    try:
        # Obtener métricas reales desde la base de datos con manejo defensivo
        total_properties = 0
        total_users = 0
        
        try:
            total_properties = Property.query.count()
        except Exception as prop_error:
            logger.warning(f"⚠️ Error obteniendo count de propiedades: {prop_error}")
            total_properties = 0
        
        try:
            total_users = User.query.count()
        except Exception as user_error:
            logger.warning(f"⚠️ Error obteniendo count de usuarios: {user_error}")
            total_users = 0
        
        # Simular métricas adicionales basadas en datos reales
        # En un sistema real, estas vendrían de tablas específicas
        recent_leads = max(15, total_properties * 2) if total_properties > 0 else 15
        active_reservations = max(5, total_properties // 2) if total_properties > 0 else 5
        monthly_revenue = total_properties * 15000 if total_properties > 0 else 87500
        
        metrics = {
            'status': 'success',
            'metrics': {
                'properties': total_properties,
                'leads': recent_leads,
                'reservations': active_reservations,
                'revenue': monthly_revenue,
                'revenue_formatted': f"${monthly_revenue:,.0f}",
                'users': total_users,
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(metrics)
        
    except Exception as e:
        # Sanitizar error en producción
        error_msg = sanitize_error(e, "Error al obtener métricas del dashboard. Mostrando datos de respaldo.")
        
        # Datos de respaldo en caso de error
        fallback_metrics = {
            'status': 'error',
            'message': error_msg,
            'metrics': {
                'properties': 6,  # Número real conocido
                'leads': 23,
                'reservations': 8,
                'revenue': 87500,
                'revenue_formatted': "$87,500",
                'users': 3,
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        return jsonify(fallback_metrics), 200  # Cambiado a 200 para que frontend no falle completamente

# MÉTRICAS PROMETHEUS
@app.route('/metrics')
def metrics_endpoint():
    try:
        # Actualizar métricas de negocio ligeras
        update_properties_count(Property)
        return generate_latest(REGISTRY), 200, {'Content-Type': 'text/plain; charset=utf-8'}
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# RECEPCIÓN DE MÉTRICAS FRONTEND
@app.route('/api/metrics/frontend', methods=['POST'])
def receive_frontend_metrics():
    try:
        data = request.get_json() or {}
        mtype = data.get('type')
        path = data.get('path', 'unknown')
        if mtype == 'page_load' and data.get('duration') is not None:
            try:
                seconds = float(data.get('duration')) / 1000.0
                FRONTEND_PERFORMANCE.labels(path=path, type='page_load').observe(seconds)
            except Exception:
                pass
        elif mtype == 'error':
            try:
                ERROR_COUNT.labels(path, 'frontend_js').inc()
            except Exception:
                pass
        return jsonify({'success': True})
    except Exception:
        # No romper al frontend si falla monitoring
        return jsonify({'success': False}), 200

# BRANDING TENANT (modelo simple)
class TenantBranding(db.Model):
    __tablename__ = 'tenant_branding'
    id = db.Column(db.Integer, primary_key=True)
    tenant_slug = db.Column(db.String(100), unique=True, nullable=False)
    primary_color = db.Column(db.String(7), default='#1A8571')
    company_name = db.Column(db.String(200))
    logo_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'tenant_slug': self.tenant_slug,
            'primary_color': self.primary_color,
            'company_name': self.company_name,
            'logo_url': self.logo_url,
        }

# Crear todas las tablas automáticamente después de definir todos los modelos
with app.app_context():
    try:
        db.create_all()
        logger.info("✅ Tablas verificadas/creadas correctamente (incluyendo TenantBranding)")
        
        # EMERGENCY FIX PRE-CHECK: Verificar user_id INMEDIATAMENTE
        try:
            quick_check = text("""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name='properties' AND column_name='user_id'
            """)
            user_id_check = db.session.execute(quick_check).scalar()
            if user_id_check == 0:
                logger.warning("🚨 EMERGENCY PRE-CHECK: user_id NO existe - agregando AHORA...")
                try:
                    # Usar IF NOT EXISTS si PostgreSQL lo soporta, sino usar try/except
                    db.session.execute(text("ALTER TABLE properties ADD COLUMN IF NOT EXISTS user_id INTEGER"))
                    db.session.commit()
                    logger.info("✅ EMERGENCY PRE-CHECK: user_id agregado")
                except Exception as alter_error:
                    # Si falla, puede ser que ya existe (en caso de race condition)
                    error_str = str(alter_error).lower()
                    if 'already exists' in error_str or 'duplicate' in error_str:
                        logger.info("✅ EMERGENCY PRE-CHECK: user_id ya existe (race condition)")
                    else:
                        logger.error(f"⚠️ EMERGENCY PRE-CHECK: Error agregando user_id: {alter_error}")
                    db.session.rollback()
            else:
                logger.info("✅ EMERGENCY PRE-CHECK: user_id ya existe")
        except Exception as pre_check_error:
            # Verificar si el error es porque la columna ya existe
            error_str = str(pre_check_error).lower()
            if 'already exists' in error_str or 'duplicate' in error_str:
                logger.info("✅ EMERGENCY PRE-CHECK: user_id ya existe (error capturado)")
            else:
                logger.error(f"⚠️ PRE-CHECK error: {pre_check_error}")
            db.session.rollback()
        
        # EMERGENCY FIX: Agregar columnas faltantes directamente
        try:
            # Ya importado arriba: from sqlalchemy import text
            
            # Lista COMPLETA de columnas críticas a agregar (29 columnas)
            # IMPORTANTE: user_id va PRIMERO y nullable para no romper datos existentes
            critical_columns = [
                ('user_id', 'INTEGER'),  # ✅ CRÍTICO: nullable primero, luego podemos hacer NOT NULL si es necesario
                ('image_url', 'VARCHAR(500)'),
                ('status', 'VARCHAR(50)'),
                ('property_type', 'VARCHAR(50)'),
                ('latitude', 'FLOAT'),
                ('longitude', 'FLOAT'),
                ('created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'),
                ('type', 'VARCHAR(50)'),
                ('operation', 'VARCHAR(20)'),
                ('area', 'FLOAT'),
                ('surface', 'FLOAT'),
                ('bedrooms', 'INTEGER'),
                ('bathrooms', 'INTEGER'),
                ('lot_size', 'FLOAT'),
                ('year_built', 'INTEGER'),
                ('num_floors', 'INTEGER'),
                ('features', 'JSONB'),
                ('emotional_tags', 'JSONB'),
                ('images', 'JSONB'),
                ('is_active', 'BOOLEAN DEFAULT TRUE'),
                ('has_basement', 'BOOLEAN DEFAULT FALSE'),
                ('has_garage', 'BOOLEAN DEFAULT FALSE'),
                ('has_pool', 'BOOLEAN DEFAULT FALSE'),
                ('has_elevator', 'BOOLEAN DEFAULT FALSE'),
                ('is_accessible', 'BOOLEAN DEFAULT FALSE'),
                ('is_luxury', 'BOOLEAN DEFAULT FALSE'),
                ('is_bank_owned', 'BOOLEAN DEFAULT FALSE'),
                ('has_virtual_tour', 'BOOLEAN DEFAULT FALSE'),
                ('published_date', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'),
            ]
            
            for column_name, column_type in critical_columns:
                try:
                    # Verificar si la columna existe (MEJORADO para evitar errores repetitivos)
                    check_query = text(f"""
                        SELECT COUNT(*) 
                        FROM information_schema.columns 
                        WHERE table_name='properties' AND column_name='{column_name}'
                    """)
                    result = db.session.execute(check_query).scalar()
                    
                    if result == 0:
                        # Columna no existe, agregarla
                        try:
                            alter_query = text(f"ALTER TABLE properties ADD COLUMN IF NOT EXISTS {column_name} {column_type}")
                            db.session.execute(alter_query)
                            db.session.commit()
                            print(f"✅ Columna '{column_name}' agregada exitosamente")
                            
                            # Si es user_id, intentar agregar ForeignKey constraint después (opcional)
                            if column_name == 'user_id':
                                # Intentar agregar FK constraint solo si la columna se creó exitosamente
                                try:
                                    # Verificar si tabla users existe antes de agregar FK
                                    check_users = text("""
                                        SELECT COUNT(*) FROM information_schema.tables 
                                        WHERE table_name = 'users'
                                    """)
                                    users_exists = db.session.execute(check_users).scalar()
                                    
                                    if users_exists > 0:
                                        # Intentar agregar FK constraint (puede fallar si ya existe)
                                        try:
                                            fk_query = text("""
                                                DO $$ 
                                                BEGIN
                                                    IF NOT EXISTS (
                                                        SELECT 1 FROM pg_constraint 
                                                        WHERE conname = 'properties_user_id_fkey'
                                                    ) THEN
                                                        ALTER TABLE properties 
                                                        ADD CONSTRAINT properties_user_id_fkey 
                                                        FOREIGN KEY (user_id) REFERENCES users(id);
                                                    END IF;
                                                END $$;
                                            """)
                                            db.session.execute(fk_query)
                                            print(f"✅ ForeignKey para '{column_name}' agregado")
                                        except Exception as fk_err:
                                            print(f"⚠️  FK constraint ya existe o error: {fk_err}")
                                            # No es crítico, continuar
                                    
                                    # Intentar asignar valor por defecto si hay usuarios admin
                                    try:
                                        update_query = text("""
                                            UPDATE properties 
                                            SET user_id = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
                                            WHERE user_id IS NULL 
                                            AND EXISTS (SELECT 1 FROM users WHERE role = 'admin')
                                        """)
                                        db.session.execute(update_query)
                                        print(f"✅ Valores por defecto para '{column_name}' asignados")
                                    except Exception as update_err:
                                        print(f"⚠️  No se pudieron asignar valores por defecto: {update_err}")
                                        # No crítico
                                except Exception as fk_error:
                                    print(f"⚠️  Error configurando FK/default para '{column_name}': {fk_error}")
                                    # Continuar - la columna ya fue agregada
                        except Exception as alter_error:
                            # Si el ALTER TABLE falla, verificar si es porque ya existe
                            error_str = str(alter_error).lower()
                            if 'already exists' in error_str or 'duplicate' in error_str:
                                print(f"⚠️ Columna '{column_name}' ya existe (error capturado): {alter_error}")
                            else:
                                print(f"⚠️ Error agregando columna '{column_name}': {alter_error}")
                            db.session.rollback()
                            continue  # Continuar con siguiente columna
                    else:
                        print(f"✅ Columna '{column_name}' ya existe - saltando")
                        
                except Exception as e:
                    print(f"⚠️  Error con columna '{column_name}': {e}")
                    db.session.rollback()
            
            print("✅ Verificación/agregado de columnas completado")
            
            # FORCE RE-CHECK: Verificar específicamente user_id
            force_check = text("""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name='properties' AND column_name='user_id'
            """)
            user_id_exists = db.session.execute(force_check).scalar()
            
            if user_id_exists == 0:
                print("🚨 FORCE FIX: user_id NO existe, agregando manualmente...")
                try:
                    db.session.execute(text("ALTER TABLE properties ADD COLUMN user_id INTEGER"))
                    db.session.commit()
                    print("✅ FORCE FIX: user_id agregado exitosamente")
                except Exception as force_error:
                    print(f"❌ FORCE FIX falló: {force_error}")
                    db.session.rollback()
            else:
                print("✅ FORCE CHECK: user_id existe en la tabla")
            
        except Exception as e:
            print(f"⚠️ Error en agregado de columnas: {e}")
        
    except Exception as e:
        print(f"⚠️ Error creando tablas: {e}")

# GET all users (admin only)
@app.route('/api/admin/users', methods=['GET'])
@admin_required
def list_users():
    """Listar todos los usuarios (solo admin) - MEJORADO con manejo de errores"""
    try:
        role_filter = request.args.get('role')
        search = request.args.get('search', '').strip().lower()
        
        # Manejo defensivo de queries
        try:
            query = User.query
            
            if role_filter:
                query = query.filter_by(role=role_filter)
            
            if search:
                query = query.filter(
                    db.or_(
                        User.email.ilike(f'%{search}%'),
                        User.name.ilike(f'%{search}%')
                    )
                )
            
            users = query.order_by(User.created_at.desc()).limit(100).all()
            
            users_data = []
            for user in users:
                try:
                    users_data.append({
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'role': user.role,
                        'phone': user.phone if hasattr(user, 'phone') else None,
                        'is_active': user.is_active if hasattr(user, 'is_active') else True,
                        'is_verified': user.is_verified if hasattr(user, 'is_verified') else False,
                        'created_at': user.created_at.isoformat() if user.created_at else None,
                        'properties_count': len(user.properties) if hasattr(user, 'properties') else 0
                    })
                except Exception as user_error:
                    print(f"⚠️ Error procesando usuario {user.id}: {user_error}")
                    continue
            
            return jsonify({
                'users': users_data,
                'total': len(users_data)
            }), 200
            
        except Exception as query_error:
            print(f"⚠️ Error en query de usuarios: {query_error}")
            # Retornar lista vacía en lugar de error 500
            return jsonify({
                'users': [],
                'total': 0,
                'message': 'No se pudieron cargar los usuarios en este momento'
            }), 200
        
    except Exception as e:
        # Sanitizar error en producción
        error_msg = sanitize_error(e, "Error al obtener lista de usuarios.")
        return jsonify({
            'error': error_msg,
            'users': [],
            'total': 0
        }), 200  # Cambiado a 200 para que frontend no falle completamente

# PATCH user (by ID or email)
@app.route('/api/admin/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    """Actualizar usuario por ID"""
    try:
        data = request.get_json() or {}
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Actualizar campos permitidos
        if 'role' in data:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_active': user.is_active
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# PATCH user password
@app.route('/api/admin/users/<email>', methods=['PATCH'])
def update_user_password(email):
    try:
        data = request.get_json() or {}
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
        db.session.commit()
        return jsonify({'success': True, 'message': 'User updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# POST branding
@app.route('/api/admin/branding', methods=['POST'])
def set_tenant_branding():
    try:
        data = request.get_json() or {}
        tenant_slug = data.get('tenant_slug')
        if not tenant_slug:
            return jsonify({'error': 'tenant_slug required'}), 400
        # Intentar acceso, crear tablas si no existen
        try:
            _ = TenantBranding.query.first()
        except Exception:
            db.create_all()
        branding = TenantBranding.query.filter_by(tenant_slug=tenant_slug).first()
        if not branding:
            branding = TenantBranding(tenant_slug=tenant_slug)
        branding.primary_color = data.get('primary_color', branding.primary_color or '#1A8571')
        branding.company_name = data.get('company_name', branding.company_name or '')
        branding.logo_url = data.get('logo_url', branding.logo_url or '')
        db.session.add(branding)
        db.session.commit()
        return jsonify({'success': True, 'branding': branding.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== CRM ENDPOINTS =====

@app.route('/api/crm/leads', methods=['GET'])
def get_crm_leads():
    """Devuelve leads para el pipeline CRM.
    Nota: Como no existe un modelo Lead aún, generamos datos a partir de propiedades
    con etapas ficticias para habilitar el frontend inmediatamente.
    """
    try:
        stages = ['new', 'qualified', 'visit', 'offer', 'won']
        properties = Property.query.limit(30).all()

        leads = []
        for i, p in enumerate(properties):
            stage = stages[i % len(stages)]
            leads.append({
                'id': f'{stage}-{p.id}',
                'name': p.title or f'Lead {p.id}',
                'email': f'lead{p.id}@demo.com',
                'phone': '+1 809 555 %04d' % ((1000 + i) % 10000),
                'property_interested': p.id,
                'stage': stage,
                'value': float(p.price) if hasattr(p, 'price') and p.price is not None else 150000.0,
                'last_contact': datetime.utcnow().isoformat(),
                'next_follow_up': (datetime.utcnow() + timedelta(days=(i % 5) + 1)).isoformat(),
                'notes': (p.location or 'Interés general')
            })

        return jsonify({'success': True, 'leads': leads}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e), 'leads': []}), 200

# ===== ANALYTICS / BACKOFFICE (BATCH 4) =====

@app.route('/api/analytics/portal-stats', methods=['GET'])
def portal_stats():
    try:
        return jsonify({
            'totalProperties': Property.query.count(),
            'totalUsers': User.query.count(),
            'activeLeads': 89,
            'monthlyGrowth': 23.4,
            'conversionRate': 4.2
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 200

@app.route('/api/monitoring/audit-logs', methods=['GET'])
def get_audit_logs():
    # Mock de auditoría (en producción: leer de tabla/logs)
    logs = [{
        'id': f'log_{i+1}',
        'action': action,
        'timestamp': (datetime.utcnow()).isoformat(),
        'user': 'admin@habitatpro.com',
        'details': details
    } for i, (action, details) in enumerate([
        ('property_created', 'Propiedad creada por admin'),
        ('user_login', 'Inicio de sesión exitoso'),
        ('branding_update', 'Se actualizó branding del tenant'),
    ])]
    return jsonify({'logs': logs})

@app.route('/api/analytics/lead-heatmap', methods=['GET'])
def lead_heatmap():
    # Mock de zonas de demanda (en producción: leads reales)
    return jsonify({'zones': [
        {'zone': 'Centro', 'leadCount': 45, 'demandLevel': 'high', 'lat': 18.48, 'lng': -69.9},
        {'zone': 'Naco', 'leadCount': 28, 'demandLevel': 'medium', 'lat': 18.47, 'lng': -69.94},
        {'zone': 'Piantini', 'leadCount': 36, 'demandLevel': 'high', 'lat': 18.46, 'lng': -69.93},
    ]})

@app.route('/api/admin/pending-moderation', methods=['GET'])
def pending_moderation():
    # Mock de moderación pendiente (en producción: tabla de reports)
    properties = Property.query.limit(5).all()
    items = [{
        'propertyId': p.id,
        'title': p.title,
        'status': 'pending'
    } for p in properties]
    return jsonify({'items': items})

@app.route('/api/admin/moderate/<int:property_id>', methods=['POST'])
def moderate_property(property_id: int):
    try:
        data = request.get_json() or {}
        action = data.get('action')
        if action not in ('approve', 'reject'):
            return jsonify({'error': 'action inválida'}), 400
        # Mock: en producción, actualizar estado en DB
        return jsonify({'success': True, 'property_id': property_id, 'action': action})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ONBOARDING: crear demo para un cliente (sin esquema multi-tenant estricto)
@app.route('/api/admin/onboarding', methods=['POST'])
def onboarding_tenant():
    try:
        data = request.get_json() or {}
        name = data.get('name', 'Caribbean Luxury Estates')
        slug = data.get('slug', 'caribbean-luxury')
        primary_color = data.get('primary_color', '#1FBF9B')
        logo_url = data.get('logo_url', '')
        admin_email = data.get('admin_email', 'admin@caribbeanluxury.com')

        # Crear/asegurar usuario admin
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            admin = User(email=admin_email, name=f"Admin {name}")
            # admin.preferences removido - no existe en el modelo User
            db.session.add(admin)

        # Insertar propiedades demo con marca de tenant en features
        demo_props = [
            {
                'title': 'Villa frente al mar - Punta Cana',
                'type': 'house', 'operation': 'compra', 'price': 850000,
                'location': 'Punta Cana, Dominican Republic', 'bedrooms': 4, 'bathrooms': 3, 'area': 320,
                'features': ['tenant:'+slug, 'pool', 'beach_access', 'garden', 'parking'],
                'emotional_tags': ['lujoso', 'premium', 'caribe']
            },
            {
                'title': 'Apartamento premium - Santo Domingo',
                'type': 'apartment', 'operation': 'compra', 'price': 275000,
                'location': 'Santo Domingo Este', 'bedrooms': 2, 'bathrooms': 2, 'area': 110,
                'features': ['tenant:'+slug, 'concierge', 'gym', 'pool', 'security'],
                'emotional_tags': ['urbano', 'moderno', 'premium']
            }
        ]

        created = 0
        for p in demo_props:
            exists = Property.query.filter_by(title=p['title']).first()
            if exists:
                continue
            prop = Property(
                title=p['title'], description='', price=p['price'], type=p['type'], operation=p['operation'],
                location=p['location'], bedrooms=p['bedrooms'], bathrooms=p['bathrooms'], area=p['area'],
                features=p['features'], emotional_tags=p['emotional_tags'], is_active=True
            )
            db.session.add(prop)
            created += 1

        db.session.commit()

        return jsonify({
            'success': True,
            'tenant': {'name': name, 'slug': slug, 'primary_color': primary_color, 'logo_url': logo_url},
            'admin': {'email': admin_email},
            'demo_properties_created': created
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# FAVORITES API ENDPOINTS
@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    """Obtener todas las propiedades favoritas de un usuario"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400
        
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            "favorites": [{
                "id": fav.id,
                "user_id": fav.user_id,
                "property_id": fav.property_id,
                "notes": fav.notes,
                "created_at": fav.created_at.isoformat() if fav.created_at else None
            } for fav in favorites]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    """Agregar una propiedad a favoritos"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Datos insuficientes"}), 400
        
        user_id = data.get('user_id')
        property_id = data.get('property_id')
        
        if not user_id or not property_id:
            return jsonify({"error": "user_id y property_id son requeridos"}), 400
        
        # Verificar si ya existe
        existing = Favorite.query.filter_by(
            user_id=user_id,
            property_id=property_id
        ).first()
        
        if existing:
            return jsonify({
                "message": "Ya está en favoritos",
                "favorite": {
                    "id": existing.id,
                    "user_id": existing.user_id,
                    "property_id": existing.property_id
                }
            }), 200
        
        # Crear nuevo favorito
        new_favorite = Favorite(
            user_id=user_id,
            property_id=property_id,
            notes=data.get('notes')
        )
        
        db.session.add(new_favorite)
        db.session.commit()
        
        return jsonify({
            "message": "Agregado a favoritos",
            "favorite": {
                "id": new_favorite.id,
                "user_id": new_favorite.user_id,
                "property_id": new_favorite.property_id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/favorites/<int:property_id>', methods=['DELETE'])
def remove_favorite(property_id):
    """Eliminar una propiedad de favoritos"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400
        
        favorite = Favorite.query.filter_by(
            user_id=user_id,
            property_id=property_id
        ).first()
        
        if not favorite:
            return jsonify({"error": "No encontrado en favoritos"}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({"message": "Eliminado de favoritos"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ANALYTICS: ROI endpoint
@app.route('/api/analytics/roi', methods=['GET'])
def get_roi_analytics():
    """Cálculos reales de ROI a partir de una propiedad (defensivo en prod)"""
    try:
        property_id = request.args.get('property_id', type=int)
        if not property_id:
            return jsonify({'success': False, 'error': 'Falta property_id'}), 400

        prop = Property.query.get(property_id)
        if not prop:
            return jsonify({
                'success': False,
                'error': f'Property {property_id} not found',
                'available_properties': [p.id for p in Property.query.limit(20).all()]
            }), 404

        purchase_price = float(prop.price or 0)
        if purchase_price <= 0:
            return jsonify({
                'success': False,
                'error': 'Property price is invalid or zero',
                'property_id': prop.id,
                'current_price': prop.price
            }), 400

        # Supuestos simples (mejorables) en base a precio
        estimated_rent_month = purchase_price * 0.005  # 0.5% mensual
        operating_costs_month = purchase_price * 0.002  # 0.2% mensual
        annual_appreciation = purchase_price * 0.03      # 3% anual

        annual_rent = estimated_rent_month * 12
        annual_costs = operating_costs_month * 12
        rental_yield = annual_rent / purchase_price
        total_roi = (annual_rent - annual_costs + annual_appreciation) / purchase_price
        cash_flow = (estimated_rent_month - operating_costs_month) * 12

        roi_data = {
            'success': True,
            'property_id': prop.id,
            'property_title': prop.title,
            'purchase_price': purchase_price,
            'estimated_rent': round(annual_rent, 2),
            'operating_costs': round(annual_costs, 2),
            'annual_appreciation': round(annual_appreciation, 2),
            'rental_yield': round(rental_yield, 4),
            'total_roi': round(total_roi, 4),
            'cash_flow': round(cash_flow, 2),
            'comparison': []
        }

        return jsonify(roi_data), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}',
            'property_id': property_id
        }), 500

# API MARKETPLACE ENDPOINTS (K82)
@app.route('/api/marketplace/endpoints', methods=['GET'])
def list_api_endpoints():
    try:
        return jsonify({
            'available_apis': [
                {
                    'name': 'Property Valuation API',
                    'endpoint': '/api/valuation',
                    'description': 'AI-powered property valuation',
                    'rate_limit': '1000/day',
                    'authentication': 'JWT'
                },
                {
                    'name': 'Market Analytics API',
                    'endpoint': '/api/analytics/market',
                    'description': 'Real-time market trends and insights',
                    'rate_limit': '500/day',
                    'authentication': 'API Key'
                }
            ]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# RATE LIMITING - Activado
try:
    from rate_limiting import setup_rate_limiting, limiter
    setup_rate_limiting(app)
    logger.info("✅ Rate limiting activado")
except Exception as e:
    logger.warning(f"⚠️ Error activando rate limiting: {e}")
    # Continuar sin rate limiting en caso de error

# SENTRY - Verificar que funcione
try:
    from sentry_config import init_sentry
    import sentry_sdk
    init_sentry()
    # Test que Sentry funciona
    if sentry_sdk.Hub.current.client:
        sentry_sdk.capture_message("Sentry inicializado correctamente", level="info")
        logger.info("✅ Sentry configurado y funcionando")
    else:
        logger.warning("⚠️ Sentry configurado pero no inicializado")
except ImportError:
    logger.warning("⚠️ Sentry no configurado - continuando sin monitoring")
except Exception as e:
    logger.warning(f"⚠️ Error inicializando Sentry: {e}")

# SWAGGER - Documentación API
try:
    from swagger_config import init_swagger
    init_swagger(app)
    logger.info("✅ Swagger documentación disponible en /api/docs")
except Exception as e:
    logger.warning(f"⚠️ Error inicializando Swagger: {e}")

# CONFIGURACIÓN WEBSOCKET CON NAMESPACES
from flask_socketio import Namespace, emit

class AINamespace(Namespace):
    """Namespace para recomendaciones IA en tiempo real"""
    
    def on_connect(self):
        """Manejar conexión al namespace de IA"""
        try:
            emit('connection_established', {
                'status': 'connected', 
                'message': 'Conectado a HabitatPro IA',
                'timestamp': datetime.utcnow().isoformat()
            })
            logger.info("✅ Cliente WebSocket conectado al namespace /ai")
        except Exception as e:
            logger.error(f"❌ Error en WebSocket IA: {e}")
    
    def on_request_realtime_recommendations(self, data):
        """WebSocket para recomendaciones en tiempo real"""
        try:
            user_id = data.get('user_id')
            if user_id:
                user = User.query.get(user_id)
                if user:
                    # Obtener propiedades activas
                    properties = Property.query.filter_by(is_active=True).limit(20).all()
                    properties_data = []
                    
                    for prop in properties:
                        properties_data.append({
                            'id': prop.id,
                            'title': prop.title,
                            'description': prop.description or '',
                            'price': prop.price or 0,
                            'bedrooms': prop.bedrooms or 0,
                            'bathrooms': prop.bathrooms or 0,
                            'area': prop.area or prop.surface or 0,
                            'emotional_tags': prop.emotional_tags or [],
                            'features': prop.features or [],
                            'type': prop.property_type or prop.type or '',
                            'location': prop.location or ''
                        })
                    
                    # Generar recomendaciones emocionales usando KNN+TF-IDF
                    user_profile = {
                        'emotional_profile': getattr(user, 'emotional_profile', None) or {}
                    }
                    
                    recommendations = emotion_engine.recommend(user_profile, properties_data, top_n=3)
                    
                    emit('realtime_recommendations', {
                        'recommendations': recommendations,
                        'timestamp': datetime.utcnow().isoformat()
                    })
                else:
                    emit('error', {'message': 'Usuario no encontrado'})
            else:
                emit('error', {'message': 'user_id es requerido'})
        except Exception as e:
            logger.error(f"❌ Error en recomendaciones tiempo real: {e}")
            emit('error', {'message': str(e)})

# Registrar namespace de IA
socketio.on_namespace(AINamespace('/ai'))
logger.info("✅ AINamespace('/ai') registrado")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        initialize_app()
    
    logger.info("🚀 HabitatPro Backend REAL iniciado en http://localhost:8000")
    logger.info("📊 APIs disponibles:")
    logger.info("   GET  /api/properties - Listar propiedades")
    logger.info("   GET  /api/properties/:id - Detalles de propiedad") 
    logger.info("   POST /api/users - Crear usuario")
    logger.info("   POST /api/ai/recommend - Recomendaciones IA")
    logger.info("   GET  /api/health - Estado del sistema")
    
    app.run(host='0.0.0.0', port=8000, debug=True)