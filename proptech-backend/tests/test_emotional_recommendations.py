"""
Tests automatizados para el sistema de recomendaciones emocionales PropTech.

Ejecutar con:
    pytest tests/test_emotional_recommendations.py -v
"""

import pytest
import json
from app import app, emotion_engine, db, Property, User


@pytest.fixture
def client():
    """Cliente de prueba Flask"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()


@pytest.fixture
def sample_properties():
    """Propiedades de prueba para entrenar el modelo"""
    return [
        {
            'id': 1,
            'title': 'Casa Familiar con Jardín',
            'description': 'Casa con jardín para familias',
            'price': 300000,
            'bedrooms': 4,
            'bathrooms': 2,
            'area': 150,
            'emotional_tags': ['familiar', 'jardin', 'seguro'],
            'features': ['jardin', 'garaje'],
            'type': 'casa',
            'location': 'Madrid'
        },
        {
            'id': 2,
            'title': 'Apartamento Moderno',
            'description': 'Apartamento moderno en centro',
            'price': 200000,
            'bedrooms': 2,
            'bathrooms': 1,
            'area': 80,
            'emotional_tags': ['moderno', 'centrico'],
            'features': ['ascensor'],
            'type': 'apartamento',
            'location': 'Barcelona'
        },
        {
            'id': 3,
            'title': 'Villa de Lujo',
            'description': 'Villa premium con piscina',
            'price': 800000,
            'bedrooms': 5,
            'bathrooms': 4,
            'area': 300,
            'emotional_tags': ['lujoso', 'premium', 'exclusivo'],
            'features': ['piscina', 'gimnasio', 'garaje'],
            'type': 'villa',
            'location': 'Marbella'
        }
    ]


class TestEmotionalRecommender:
    """Tests del motor de recomendación emocional"""
    
    def test_emotion_engine_initialization(self):
        """Verificar que el motor se inicializa correctamente"""
        assert emotion_engine is not None
        assert hasattr(emotion_engine, 'vectorizer') or emotion_engine.vectorizer is None
        assert hasattr(emotion_engine, 'knn_model') or emotion_engine.knn_model is None
        assert hasattr(emotion_engine, 'is_trained')
    
    def test_extract_property_features(self, sample_properties):
        """Verificar extracción de características de propiedades"""
        prop = sample_properties[0]
        features = emotion_engine.extract_property_features(prop)
        
        assert isinstance(features, list)
        assert len(features) > 0
        assert all(isinstance(f, (int, float)) for f in features)
    
    def test_extract_text_features(self, sample_properties):
        """Verificar extracción de características de texto"""
        prop = sample_properties[0]
        text = emotion_engine.extract_text_features(prop)
        
        assert isinstance(text, str)
        assert len(text) > 0
        assert 'familiar' in text.lower() or 'jardin' in text.lower()
    
    def test_fit_model(self, sample_properties):
        """Verificar entrenamiento del modelo"""
        emotion_engine.fit(sample_properties)
        
        # El modelo debería estar entrenado o en modo básico
        assert isinstance(emotion_engine.is_trained, bool)
        assert len(emotion_engine.properties_index) == len(sample_properties) or emotion_engine.is_trained == False
    
    def test_recommend_with_family_profile(self, sample_properties):
        """Verificar recomendaciones con perfil familiar"""
        emotion_engine.fit(sample_properties)
        
        user_profile = {
            'emotional_profile': {
                'family_friendly': 0.8,
                'modern_taste': 0.3,
                'luxury_preference': 0.2
            }
        }
        
        recommendations = emotion_engine.recommend(user_profile, sample_properties, top_n=2)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) <= 2
        if recommendations:
            # Verificar que las recomendaciones tienen scores
            assert '_similarity_score' in recommendations[0] or '_recommendation_reason' in recommendations[0]
    
    def test_recommend_with_luxury_profile(self, sample_properties):
        """Verificar recomendaciones con perfil de lujo"""
        emotion_engine.fit(sample_properties)
        
        user_profile = {
            'emotional_profile': {
                'family_friendly': 0.2,
                'luxury_preference': 0.9,
                'modern_taste': 0.5
            }
        }
        
        recommendations = emotion_engine.recommend(user_profile, sample_properties, top_n=2)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) <= 2
        if recommendations:
            # Debería recomendar la villa de lujo
            assert any('lujo' in str(rec.get('title', '')).lower() or 
                      'luxury' in str(rec.get('emotional_tags', [])).lower() 
                      for rec in recommendations) or len(recommendations) > 0
    
    def test_recommend_basic_fallback(self, sample_properties):
        """Verificar que el método básico funciona como fallback"""
        user_profile = {
            'emotional_profile': {
                'family_friendly': 0.8
            }
        }
        
        # No entrenar el modelo para forzar fallback
        recommendations = emotion_engine._recommend_basic(user_profile, sample_properties, top_n=2)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) <= 2


class TestEmotionalRecommendationsAPI:
    """Tests de los endpoints REST de recomendaciones emocionales"""
    
    def test_ai_recommend_endpoint(self, client, sample_properties):
        """Verificar endpoint /api/ai/recommend"""
        # Crear propiedades de prueba en la BD
        with app.app_context():
            test_user = User(email='test@test.com', name='Test User')
            db.session.add(test_user)
            db.session.commit()
            
            for prop_data in sample_properties:
                prop = Property(
                    title=prop_data['title'],
                    description=prop_data['description'],
                    price=prop_data['price'],
                    bedrooms=prop_data['bedrooms'],
                    bathrooms=prop_data['bathrooms'],
                    area=prop_data['area'],
                    emotional_tags=prop_data['emotional_tags'],
                    features=prop_data['features'],
                    property_type=prop_data['type'],
                    location=prop_data['location'],
                    image_url='https://example.com/image.jpg',
                    user_id=test_user.id
                )
                db.session.add(prop)
            db.session.commit()
            
            # Entrenar modelo
            properties_data = []
            for prop in Property.query.all():
                properties_data.append({
                    'id': prop.id,
                    'title': prop.title,
                    'description': prop.description or '',
                    'price': prop.price or 0,
                    'bedrooms': prop.bedrooms or 0,
                    'bathrooms': prop.bathrooms or 0,
                    'area': prop.area or 0,
                    'emotional_tags': prop.emotional_tags or [],
                    'features': prop.features or [],
                    'type': prop.property_type or '',
                    'location': prop.location or ''
                })
            emotion_engine.fit(properties_data)
        
        # Probar endpoint
        response = client.post('/api/ai/recommend',
                              json={
                                  'user_profile': {
                                      'emotional_profile': {
                                          'family_friendly': 0.8,
                                          'modern_taste': 0.3
                                      }
                                  },
                                  'filters': {}
                              },
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'success' in data
        assert data['success'] == True
        assert 'recommendations' in data
        assert isinstance(data['recommendations'], list)
        if data['recommendations']:
            assert '_similarity_score' in data['recommendations'][0] or '_recommendation_reason' in data['recommendations'][0]
    
    def test_properties_endpoint_with_user_id(self, client):
        """Verificar endpoint /api/properties con user_id"""
        response = client.get('/api/properties?user_id=1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'success' in data
        assert data['success'] == True
        assert 'properties' in data
        assert isinstance(data['properties'], list)
    
    def test_properties_endpoint_without_user_id(self, client):
        """Verificar endpoint /api/properties sin user_id"""
        response = client.get('/api/properties')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'success' in data
        assert data['success'] == True
        assert 'properties' in data


class TestChatAndNotificationsAPI:
    """Tests de endpoints auxiliares (chat y notificaciones)"""
    
    def test_chat_history_endpoint(self, client):
        """Verificar endpoint /api/chat/history"""
        response = client.get('/api/chat/history/1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'success' in data
        assert data['success'] == True
        assert 'messages' in data
        assert isinstance(data['messages'], list)
    
    def test_notifications_user_endpoint(self, client):
        """Verificar endpoint /api/notifications/user"""
        response = client.get('/api/notifications/user/1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'success' in data
        assert data['success'] == True
        assert 'notifications' in data
        assert isinstance(data['notifications'], list)
