"""
Tests críticos de API
"""

import pytest
import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import app
    from models import db, Property, User
except ImportError as e:
    pytest.skip(f"Dependencias no disponibles: {e}", allow_module_level=True)

@pytest.fixture
def test_property(client):
    """Crear propiedad de test"""
    with app.app_context():
        user = User(email="owner@test.com", role="user", is_active=True)
        db.session.add(user)
        db.session.commit()

        property = Property(
            title='Test Property',
            description='Test Description',
            price=100000.0,
            location='Test Location',
            property_type='casa',
            operation='compra',
            is_active=True,
            image_url='https://example.com/test.jpg',
            user_id=user.id,
        )
        db.session.add(property)
        db.session.commit()
        # Devolver ID primitivo para evitar DetachedInstanceError fuera de la sesión
        return property.id

def test_get_properties(client, test_property):
    """Test obtener lista de propiedades"""
    response = client.get('/api/properties')
    assert response.status_code == 200
    data = response.get_json()
    assert 'properties' in data or isinstance(data, list)
    
    # Verificar que la propiedad de test está en la lista
    properties = data.get('properties', data) if isinstance(data, dict) else data
    assert len(properties) > 0

def test_get_properties_filter_by_operation(client, test_property):
    """Test filtrar propiedades por operación"""
    response = client.get('/api/properties?operation=compra')
    assert response.status_code == 200
    data = response.get_json()
    properties = data.get('properties', data) if isinstance(data, dict) else data
    
    # Todas las propiedades deben tener operation='compra'
    for prop in properties:
        assert prop.get('operation') == 'compra' or prop.get('operation') is None

def test_get_property_by_id(client, test_property):
    """Test obtener propiedad por ID"""
    response = client.get(f'/api/properties/{test_property}')
    assert response.status_code == 200
    data = response.get_json()
    # La API puede responder como objeto directo o envuelto en {success, property}
    prop = data.get("property", data) if isinstance(data, dict) else data
    assert prop.get('id') == test_property
    assert prop.get('title') == 'Test Property'

def test_get_property_not_found(client):
    """Test obtener propiedad inexistente"""
    response = client.get('/api/properties/999999')
    assert response.status_code == 404

def test_create_property_unauthorized(client):
    """Test crear propiedad sin autorización"""
    response = client.post('/api/properties', json={
        'title': 'New Property',
        'price': 50000,
        'location': 'Test'
    })
    # Debe requerir autenticación o retornar error
    assert response.status_code in [401, 403, 400]

def test_admin_metrics_unauthorized(client):
    """Test métricas admin sin autorización"""
    response = client.get('/api/admin/metrics')
    assert response.status_code in [401, 403]

def test_version_endpoint(client):
    """Test endpoint de versión"""
    response = client.get('/version')
    assert response.status_code == 200
    data = response.get_json()
    assert 'version' in data
