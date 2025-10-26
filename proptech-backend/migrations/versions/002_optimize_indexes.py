"""Optimize database indexes for performance"""
from alembic import op

def upgrade():
    # Índices para búsquedas de propiedades
    op.create_index('idx_properties_price', 'property', ['price'])
    op.create_index('idx_properties_location', 'property', ['latitude', 'longitude'])
    op.create_index('idx_properties_type', 'property', ['property_type'])
    op.create_index('idx_properties_status', 'property', ['status'])
    
    # Índices para recomendaciones IA
    op.create_index('idx_emotion_recommendations_user', 'emotion_recommendations', ['user_id'])
    op.create_index('idx_emotion_recommendations_emotion', 'emotion_recommendations', ['current_emotion'])
    op.create_index('idx_emotion_recommendations_created', 'emotion_recommendations', ['created_at'])
    
    # Índices para analytics
    op.create_index('idx_user_preferences_emotion', 'emotion_preferences', ['emotion_type'])
    op.create_index('idx_user_preferences_user', 'emotion_preferences', ['user_id'])
    
    # Índices para usuarios
    op.create_index('idx_users_email', 'user', ['email'])
    op.create_index('idx_users_role', 'user', ['role'])

def downgrade():
    op.drop_index('idx_properties_price')
    op.drop_index('idx_properties_location') 
    op.drop_index('idx_properties_type')
    op.drop_index('idx_properties_status')
    op.drop_index('idx_emotion_recommendations_user')
    op.drop_index('idx_emotion_recommendations_emotion')
    op.drop_index('idx_emotion_recommendations_created')
    op.drop_index('idx_user_preferences_emotion')
    op.drop_index('idx_user_preferences_user')
    op.drop_index('idx_users_email')
    op.drop_index('idx_users_role')
