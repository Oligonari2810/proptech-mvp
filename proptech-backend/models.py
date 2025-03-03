from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.sql.sqltypes import Boolean  # ✅ Importar Boolean correctamente
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
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="available")
    property_type = Column(String(50), nullable=False, default="apartment")  # ✅ Valor por defecto para evitar NULL
    surface = Column(Float, nullable=True)  # Superficie en m²
    bedrooms = Column(Integer, nullable=True)  # Habitaciones
    bathrooms = Column(Integer, nullable=True)  # Baños
    lot_size = Column(Float, nullable=True)  # Tamaño del terreno en m²
    year_built = Column(Integer, nullable=True)  # Año de construcción
    num_floors = Column(Integer, nullable=True)  # Número de pisos
    has_basement = Column(Boolean, nullable=True, default=False)  # Tiene sótano
    has_garage = Column(Boolean, nullable=True, default=False)  # Tiene garaje
    has_pool = Column(Boolean, nullable=True, default=False)  # Tiene piscina
    has_elevator = Column(Boolean, nullable=True, default=False)  # Tiene ascensor
    is_accessible = Column(Boolean, nullable=True, default=False)  # Es accesible
    is_luxury = Column(Boolean, nullable=True, default=False)  # Es propiedad de lujo
    is_bank_owned = Column(Boolean, nullable=True, default=False)  # Es propiedad de banco
    has_virtual_tour = Column(Boolean, nullable=True, default=False)  # Tiene visita virtual
    published_date = Column(DateTime, default=datetime.datetime.utcnow)  # Fecha de publicación

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
