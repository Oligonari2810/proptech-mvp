"""
Rutas de Autenticación Enterprise para HabitatPro
JWT + OAuth2 + Registro + Login + Gestión de Roles
"""

from flask import Blueprint, request, jsonify, current_app, session, url_for
from datetime import datetime
import json
import os
import sys
from pathlib import Path

# Agregar directorio raíz al path para importar auth
sys.path.insert(0, str(Path(__file__).parent.parent))

from auth import AuthService, oauth, google, github
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Helper para sanitizar errores en producción
def sanitize_error(error: Exception, generic_message: str = "Ha ocurrido un error. Por favor, inténtelo más tarde.") -> str:
    """Sanitiza errores para no mostrar stack traces en producción"""
    is_production = os.getenv('FLASK_ENV') == 'production' or os.getenv('ENVIRONMENT') == 'production'
    
    if is_production:
        # En producción, solo mostrar mensaje genérico y log el error real
        print(f"ERROR (sanitizado en producción): {str(error)}")
        return generic_message
    else:
        # En desarrollo, mostrar el error completo para debugging
        return str(error)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registro de usuario con validación enterprise"""
    try:
        data = request.get_json()
        
        # Validaciones
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        if not data.get('name'):
            return jsonify({'error': 'Nombre es requerido'}), 400
        
        # Verificar si el usuario ya existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'El usuario ya existe'}), 409
        
        # Crear nuevo usuario
        user = User(
            email=data['email'],
            password_hash=AuthService.hash_password(data['password']),
            name=data['name'],
            role=data.get('role', 'user'),
            phone=data.get('phone'),
            is_active=True,
            is_verified=False
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generar token
        token = AuthService.generate_token(user.id, user.role)
        
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

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login con JWT token"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        # Buscar usuario
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Verificar contraseña
        if not AuthService.verify_password(data['password'], user.password_hash):
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Verificar si está activo
        if not user.is_active:
            return jsonify({'error': 'Cuenta desactivada'}), 403
        
        # Actualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generar token
        token = AuthService.generate_token(user.id, user.role)
        
        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_verified': user.is_verified,
                'last_login': user.last_login.isoformat() if user.last_login else None
            },
            'token': token
        }), 200
        
    except Exception as e:
        error_msg = sanitize_error(e, "Error al iniciar sesión. Por favor, verifique sus credenciales.")
        return jsonify({'error': f'Error en el login: {error_msg}'}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Obtener información del usuario actual"""
    try:
        user = AuthService.get_current_user()
        if not user:
            return jsonify({'error': 'No autenticado'}), 401
        
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'phone': user.phone,
                'avatar_url': user.avatar_url,
                'is_active': user.is_active,
                'is_verified': user.is_verified,
                'subscription_type': user.subscription_type,
                'subscription_status': user.subscription_status,
                'created_at': user.created_at.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        }), 200
        
    except Exception as e:
        error_msg = sanitize_error(e, "Error al obtener información del usuario.")
        return jsonify({'error': f'Error obteniendo usuario: {error_msg}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refrescar token JWT"""
    try:
        user = AuthService.get_current_user()
        if not user:
            return jsonify({'error': 'No autenticado'}), 401
        
        # Generar nuevo token
        new_token = AuthService.generate_token(user.id, user.role)
        
        return jsonify({
            'success': True,
            'token': new_token
        }), 200
        
    except Exception as e:
        error_msg = sanitize_error(e, "Error al refrescar el token. Por favor, inicie sesión nuevamente.")
        return jsonify({'error': f'Error refrescando token: {error_msg}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout (invalidar token en el cliente)"""
    return jsonify({
        'success': True,
        'message': 'Logout exitoso'
    }), 200

# ===== OAUTH ROUTES =====

@auth_bp.route('/oauth/google')
def google_login():
    """Iniciar login con Google"""
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@auth_bp.route('/oauth/google/callback')
def google_callback():
    """Callback de Google OAuth"""
    try:
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            return jsonify({'error': 'Error obteniendo información de Google'}), 400
        
        # Buscar o crear usuario
        user = User.query.filter_by(
            oauth_provider='google',
            oauth_id=user_info['sub']
        ).first()
        
        if not user:
            # Verificar si ya existe con este email
            existing_user = User.query.filter_by(email=user_info['email']).first()
            if existing_user:
                # Vincular OAuth a usuario existente
                existing_user.oauth_provider = 'google'
                existing_user.oauth_id = user_info['sub']
                existing_user.oauth_data = json.dumps(user_info)
                user = existing_user
            else:
                # Crear nuevo usuario
                user = User(
                    email=user_info['email'],
                    name=user_info.get('name', ''),
                    oauth_provider='google',
                    oauth_id=user_info['sub'],
                    oauth_data=json.dumps(user_info),
                    is_active=True,
                    is_verified=True,
                    avatar_url=user_info.get('picture')
                )
                db.session.add(user)
        
        # Actualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generar token
        token = AuthService.generate_token(user.id, user.role)
        
        return jsonify({
            'success': True,
            'message': 'Login con Google exitoso',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_verified': user.is_verified,
                'avatar_url': user.avatar_url
            },
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error en Google OAuth: {str(e)}'}), 500

@auth_bp.route('/oauth/github')
def github_login():
    """Iniciar login con GitHub"""
    redirect_uri = url_for('auth.github_callback', _external=True)
    return github.authorize_redirect(redirect_uri)

@auth_bp.route('/oauth/github/callback')
def github_callback():
    """Callback de GitHub OAuth"""
    try:
        token = github.authorize_access_token()
        resp = github.get('user', token=token)
        user_info = resp.json()
        
        if not user_info:
            return jsonify({'error': 'Error obteniendo información de GitHub'}), 400
        
        # Buscar o crear usuario
        user = User.query.filter_by(
            oauth_provider='github',
            oauth_id=str(user_info['id'])
        ).first()
        
        if not user:
            # Verificar si ya existe con este email
            existing_user = User.query.filter_by(email=user_info.get('email', '')).first()
            if existing_user:
                # Vincular OAuth a usuario existente
                existing_user.oauth_provider = 'github'
                existing_user.oauth_id = str(user_info['id'])
                existing_user.oauth_data = json.dumps(user_info)
                user = existing_user
            else:
                # Crear nuevo usuario
                user = User(
                    email=user_info.get('email', f"{user_info['login']}@github.local"),
                    name=user_info.get('name', user_info['login']),
                    oauth_provider='github',
                    oauth_id=str(user_info['id']),
                    oauth_data=json.dumps(user_info),
                    is_active=True,
                    is_verified=True,
                    avatar_url=user_info.get('avatar_url')
                )
                db.session.add(user)
        
        # Actualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generar token
        token = AuthService.generate_token(user.id, user.role)
        
        return jsonify({
            'success': True,
            'message': 'Login con GitHub exitoso',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_verified': user.is_verified,
                'avatar_url': user.avatar_url
            },
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error en GitHub OAuth: {str(e)}'}), 500

# ===== ADMIN ROUTES =====

@auth_bp.route('/users', methods=['GET'])
def list_users():
    """Listar usuarios (solo admin)"""
    from auth import require_role
    
    @require_role('admin')
    def _list_users(current_user):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            role_filter = request.args.get('role')
            
            query = User.query
            
            if role_filter:
                query = query.filter_by(role=role_filter)
            
            users = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return jsonify({
                'success': True,
                'users': [{
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'role': user.role,
                    'is_active': user.is_active,
                    'is_verified': user.is_verified,
                    'created_at': user.created_at.isoformat(),
                    'last_login': user.last_login.isoformat() if user.last_login else None
                } for user in users.items],
                'pagination': {
                    'page': users.page,
                    'pages': users.pages,
                    'per_page': users.per_page,
                    'total': users.total
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Error listando usuarios: {str(e)}'}), 500
    
    return _list_users()

@auth_bp.route('/users/<int:user_id>/role', methods=['PUT'])
def update_user_role():
    """Actualizar rol de usuario (solo super_admin)"""
    from auth import require_role
    
    @require_role('super_admin')
    def _update_role(current_user, user_id):
        try:
            data = request.get_json()
            new_role = data.get('role')
            
            if not new_role or new_role not in ['user', 'broker', 'admin', 'super_admin']:
                return jsonify({'error': 'Rol inválido'}), 400
            
            user = User.query.get_or_404(user_id)
            old_role = user.role
            user.role = new_role
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': f'Rol actualizado de {old_role} a {new_role}',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Error actualizando rol: {str(e)}'}), 500
    
    return _update_role()
