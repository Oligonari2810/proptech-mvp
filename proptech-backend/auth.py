"""
Sistema de Autenticación Enterprise para HabitatPro
JWT + OAuth2 + Roles + Middleware de Autorización
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from authlib.integrations.flask_client import OAuth
import os

# Configuración JWT - DEBE estar en .env
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY no configurado. Usa scripts/generate_secrets.py para generarlo.")
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# OAuth Configuration
oauth = OAuth()

# Google OAuth
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID', 'your-google-client-id'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET', 'your-google-client-secret'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# GitHub OAuth
github = oauth.register(
    name='github',
    client_id=os.getenv('GITHUB_CLIENT_ID', 'your-github-client-id'),
    client_secret=os.getenv('GITHUB_CLIENT_SECRET', 'your-github-client-secret'),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)

class AuthService:
    """Servicio de autenticación enterprise"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password con bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verificar password"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def generate_token(user_id: int, role: str = 'user') -> str:
        """Generar JWT token"""
        payload = {
            'user_id': user_id,
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verificar JWT token"""
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception('Token expirado')
        except jwt.InvalidTokenError:
            raise Exception('Token inválido')
    
    @staticmethod
    def get_current_user():
        """Obtener usuario actual del token"""
        token = request.headers.get('Authorization')
        if not token:
            return None
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            payload = AuthService.verify_token(token)
            from models import User
            return User.query.get(payload['user_id'])
        except:
            return None

# Decoradores de autorización
def require_auth(f):
    """Decorador para requerir autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = AuthService.get_current_user()
        if not user:
            return jsonify({'error': 'Token de autenticación requerido'}), 401
        return f(user, *args, **kwargs)
    return decorated_function

def require_role(required_role):
    """Decorador para requerir rol específico"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = AuthService.get_current_user()
            if not user:
                return jsonify({'error': 'Token de autenticación requerido'}), 401
            
            # Jerarquía de roles
            role_hierarchy = {
                'user': 1,
                'broker': 2,
                'admin': 3,
                'super_admin': 4
            }
            
            user_level = role_hierarchy.get(user.role, 0)
            required_level = role_hierarchy.get(required_role, 0)
            
            if user_level < required_level:
                return jsonify({'error': 'Permisos insuficientes'}), 403
            
            return f(user, *args, **kwargs)
        return decorated_function
    return decorator

def require_any_role(*roles):
    """Decorador para requerir cualquiera de los roles especificados"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = AuthService.get_current_user()
            if not user:
                return jsonify({'error': 'Token de autenticación requerido'}), 401
            
            if user.role not in roles:
                return jsonify({'error': 'Permisos insuficientes'}), 403
            
            return f(user, *args, **kwargs)
        return decorated_function
    return decorator

# Funciones de utilidad
def get_user_from_token():
    """Obtener usuario desde el token de la request"""
    return AuthService.get_current_user()

def is_authenticated():
    """Verificar si el usuario está autenticado"""
    return AuthService.get_current_user() is not None

def has_role(role):
    """Verificar si el usuario tiene un rol específico"""
    user = AuthService.get_current_user()
    return user and user.role == role

def has_any_role(*roles):
    """Verificar si el usuario tiene cualquiera de los roles especificados"""
    user = AuthService.get_current_user()
    return user and user.role in roles
