"""
Configuración global para tests
"""

import pytest
import sys
import os

# Agregar el directorio del proyecto al path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Configurar variables de entorno para tests
os.environ['FLASK_ENV'] = 'testing'
os.environ['SECRET_KEY'] = 'test-secret-key-for-tests'
os.environ['JWT_SECRET_KEY'] = 'test-jwt-secret-key-for-tests'

@pytest.fixture(scope='session', autouse=True)
def setup_test_environment():
    """Configurar entorno de tests"""
    # Variables de entorno para tests
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    os.environ['FLASK_ENV'] = 'testing'
    yield
    # Cleanup si es necesario

