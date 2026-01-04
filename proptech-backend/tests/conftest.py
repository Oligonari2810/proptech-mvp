"""
Configuración global para tests
"""

import pytest
import sys
import os
from sqlalchemy import text

# Agregar el directorio del proyecto al path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Configurar variables de entorno para tests
os.environ['FLASK_ENV'] = 'testing'
os.environ['SECRET_KEY'] = 'test-secret-key-for-tests'
os.environ['JWT_SECRET_KEY'] = 'test-jwt-secret-key-for-tests'
os.environ['FEATURE_GEO'] = os.getenv('FEATURE_GEO', 'true')

@pytest.fixture(scope='session', autouse=True)
def setup_test_environment():
    """Configurar entorno de tests"""
    # Variables de entorno para tests
    # No forzar SQLite: CI usa Postgres(PostGIS). Solo usar sqlite si no hay DATABASE_URL.
    os.environ['DATABASE_URL'] = os.getenv('DATABASE_URL', 'sqlite:///:memory:')
    os.environ['FLASK_ENV'] = 'testing'
    yield
    # Cleanup si es necesario


@pytest.fixture
def client():
    """
    Cliente Flask para tests usando DATABASE_URL del entorno.
    CI usa Postgres+PostGIS (postgis/postgis).
    """
    from app import app
    from models import db

    app.config["TESTING"] = True
    # Respetar DATABASE_URL ya seteada por CI (Postgres)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///:memory:")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "test-secret-key")

    with app.test_client() as client:
        with app.app_context():
            # PostGIS debe existir antes de crear tablas con Geometry
            try:
                if db.engine.dialect.name == "postgresql":
                    db.session.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
                    db.session.commit()
            except Exception:
                # Si falla, que el test falle en create_all (no ocultar)
                raise

            db.drop_all()
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

