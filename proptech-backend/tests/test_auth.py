"""
Tests críticos de autenticación
"""

import pytest
from app import app
from models import db, User
from werkzeug.security import generate_password_hash

@pytest.fixture
def client():
    """Crear cliente de test"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = 'test-secret-key'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

@pytest.fixture
def test_user(client):
    """Crear usuario de test"""
    with app.app_context():
        user = User(
            email='test@habitatpro.com',
            password_hash=generate_password_hash('Test123!'),
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
    assert 'checks' in data

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

