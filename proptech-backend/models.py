from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import datetime

db = SQLAlchemy()

# ✅ Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')

    # Relación con propiedades y contratos
    properties = relationship('Property', backref='owner', lazy=True)
    buyer_contracts = relationship('SmartContract', foreign_keys='SmartContract.buyer_id', backref='buyer', lazy=True)
    seller_contracts = relationship('SmartContract', foreign_keys='SmartContract.seller_id', backref='seller', lazy=True)

# ✅ Modelo de Propiedad
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False, index=True)
    location = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    images = db.Column(db.JSON, nullable=True)  # ✅ Mejor formato que `Text`
    status = db.Column(db.String(50), nullable=False, default='available', index=True)
    property_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # ✅ Ahora puede ser nulo (si la propiedad es de un admin)

    # Relación con Tasaciones y Contratos
    valuations = relationship('Valuation', backref='property', lazy=True)
    contracts = relationship('SmartContract', backref='property', lazy=True)

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
