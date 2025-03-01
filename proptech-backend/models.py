from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime

db = SQLAlchemy()

# ✅ Modelo de Usuario
class User(db.Model):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(50), nullable=False, default="user")

    properties = relationship("Property", back_populates="owner", lazy=True)
    buyer_contracts = relationship("SmartContract", foreign_keys="SmartContract.buyer_id", back_populates="buyer", lazy=True)
    seller_contracts = relationship("SmartContract", foreign_keys="SmartContract.seller_id", back_populates="seller", lazy=True)

# ✅ Modelo de Propiedad
class Property(db.Model):
    __tablename__ = "property"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="available")
    property_type = Column(String(50), nullable=False, default="apartment")  # ✅ Valor por defecto para evitar NULL
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # ✅ `user_id` no puede ser NULL

    owner = relationship("User", back_populates="properties")
    valuations = relationship("Valuation", back_populates="property", lazy=True)
    contracts = relationship("SmartContract", back_populates="property", lazy=True)

# ✅ Modelo de Tasación Inteligente
class Valuation(db.Model):
    __tablename__ = "valuation"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("property.id"), nullable=False)
    estimated_value = Column(Float, nullable=False)
    valuation_date = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="valuations")

# ✅ Modelo de Contrato Inteligente con Blockchain
class SmartContract(db.Model):
    __tablename__ = "smart_contract"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("property.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    contract_hash = Column(String(256), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="contracts")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="buyer_contracts")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="seller_contracts")
