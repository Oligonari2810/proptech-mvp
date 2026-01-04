"""
Tests críticos de autenticación
"""

import pytest
import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import app
    from models import db, User
    from auth import AuthService
except ImportError as e:
    pytest.skip(f"Dependencias no disponibles: {e}", allow_module_level=True)

@pytest.fixture
def test_user(client):
    """Crear usuario de test"""
    with app.app_context():
        user = User(
            email='test@habitatpro.com',
            # El backend usa AuthService (bcrypt) en /api/auth/login
            password_hash=AuthService.hash_password('Test123!'),
            name='Test User',
            role='user',
            is_active=True
        )
        db.session.add(user)
        db.session.commit()
        return user

def test_health_endpoint(client):
    """Test health check"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert 'status' in data
    assert 'services' in data

def test_register_endpoint(client):
    """Test registro de usuario"""
    response = client.post('/api/auth/register', json={
        'email': 'newuser@habitatpro.com',
        'password': 'Secure123!',
        'name': 'New User'
    })
    assert response.status_code in [200, 201]
    data = response.get_json()
    assert 'token' in data or 'user' in data

def test_login_endpoint(client, test_user):
    """Test login"""
    response = client.post('/api/auth/login', json={
        'email': 'test@habitatpro.com',
        'password': 'Test123!'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'token' in data

def test_login_invalid_credentials(client, test_user):
    """Test login con credenciales inválidas"""
    response = client.post('/api/auth/login', json={
        'email': 'test@habitatpro.com',
        'password': 'WrongPassword'
    })
    assert response.status_code in [401, 403]

def test_get_current_user_unauthorized(client):
    """Test obtener usuario actual sin token"""
    response = client.get('/api/auth/me')
    assert response.status_code in [401, 403]

def test_get_current_user_authorized(client, test_user):
    """Test obtener usuario actual con token"""
    # Primero login para obtener token
    login_response = client.post('/api/auth/login', json={
        'email': 'test@habitatpro.com',
        'password': 'Test123!'
    })
    token = login_response.get_json().get('token')
    
    # Luego usar token para obtener usuario
    response = client.get('/api/auth/me', headers={
        'Authorization': f'Bearer {token}'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data.get('user', {}).get('email') == 'test@habitatpro.com'

