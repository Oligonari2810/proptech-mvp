from datetime import datetime
from models import db

class EmotionPreference(db.Model):
    __tablename__ = 'emotion_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    emotion_type = db.Column(db.String(50))  # happy, sad, excited, etc.
    property_features = db.Column(db.JSON)   # Características que gustan con esta emoción
    success_rate = db.Column(db.Float)       # Tasa de acierto de recomendaciones
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('emotion_preferences', lazy=True))

class EmotionAwareRecommendation(db.Model):
    __tablename__ = 'emotion_recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    current_emotion = db.Column(db.String(50))
    recommended_properties = db.Column(db.JSON)  # Lista de property_ids
    reasoning = db.Column(db.Text)              # Por qué se recomiendan
    confidence_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
