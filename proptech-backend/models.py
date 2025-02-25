from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

# ✅ Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')

# ✅ Modelo de Propiedad
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    images = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='available')
    property_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# ✅ Modelo de Tasación Inteligente
class Valuation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    estimated_value = db.Column(db.Float, nullable=False)
    valuation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ✅ Modelo de Contrato Inteligente con Blockchain
class SmartContract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    contract_hash = db.Column(db.String(256), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
