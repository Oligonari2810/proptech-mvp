import os

class ProductionConfig:
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://habitatpro_user:habitatpro_password@localhost:5432/proptech_habitatpro'
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'habitatpro-proptech-super-secret-key')
    
    # CORS
    CORS_ORIGINS = [
        "http://localhost:3000",
        "https://tudominio.com",
        "https://*.vercel.app"
    ]
    
    # AI Model paths
    AI_MODEL_PATH = '/app/ai/models/recommendation/emotion_model.json'
    
    # Redis
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    # Logging
    LOG_LEVEL = 'INFO'
    
    # Performance
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True
    }
