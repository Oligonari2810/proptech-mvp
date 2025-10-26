import pytest
import json
from app_enterprise import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_properties_endpoint(client):
    response = client.get('/api/properties')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'properties' in data

def test_ai_recommendation_endpoint(client):
    response = client.post('/api/ai/recommend', 
                         json={'user_profile': {'preferences': {'location': 'madrid'}}})
    assert response.status_code == 200
