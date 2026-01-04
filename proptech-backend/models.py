from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON, Index
from sqlalchemy.sql.sqltypes import Boolean  # ✅ Importar Boolean correctamente
from sqlalchemy.orm import relationship
from sqlalchemy import event
import datetime

from geoalchemy2 import Geometry
from geoalchemy2.elements import WKTElement

db = SQLAlchemy()

# ✅ Modelo de Usuario Enterprise
class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=True)  # Nullable para OAuth users
    role = Column(String(50), nullable=False, default="user")  # user, broker, admin, super_admin
    
    # ✅ Campos de perfil
    name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # ✅ OAuth Integration
    oauth_provider = Column(String(50), nullable=True)  # google, github, etc.
    oauth_id = Column(String(100), nullable=True)  # ID del proveedor OAuth
    oauth_data = Column(Text, nullable=True)  # JSON con datos del proveedor
    
    # ✅ Campos de suscripción para monetización
    subscription_type = Column(String(50), nullable=True, default="free")  # free, broker_basic, broker_pro
    subscription_status = Column(String(50), nullable=True, default="inactive")  # active, inactive, cancelled
    stripe_customer_id = Column(String(255), nullable=True)
    subscription_start = Column(DateTime, nullable=True)
    subscription_end = Column(DateTime, nullable=True)

    properties = relationship("Property", back_populates="owner", lazy=True)
    buyer_contracts = relationship("SmartContract", foreign_keys="[SmartContract.buyer_id]", back_populates="buyer", lazy=True)
    seller_contracts = relationship("SmartContract", foreign_keys="[SmartContract.seller_id]", back_populates="seller", lazy=True)

# ✅ Modelo de Propiedad
class Property(db.Model):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    # Geo v4: punto geoespacial (WGS84, SRID 4326)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="available")
    property_type = Column(String(50), nullable=False, default="apartment")  # ✅ Valor por defecto para evitar NULL
    type = Column(String(50), nullable=True)  # Alias para property_type (compatibilidad)
    operation = Column(String(20), nullable=True)  # compra, alquiler
    surface = Column(Float, nullable=True)  # Superficie en m²
    area = Column(Float, nullable=True)  # Área total (alias de surface)
    bedrooms = Column(Integer, nullable=True)  # Habitaciones
    bathrooms = Column(Integer, nullable=True)  # Baños
    features = Column(JSON, nullable=True)  # JSON con características
    emotional_tags = Column(JSON, nullable=True)  # JSON con tags emocionales (legacy - mantener para compatibilidad)
    emotional_profile = Column(JSON, nullable=True)  # JSON con perfil emocional rico: {vibes: [], lifestyle: [], community: [], energy: 1-10, privacy: 1-10, wellness: []}
    images = Column(JSON, nullable=True)  # JSON con URLs de imágenes
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
    has_virtual_tour = Column(Boolean, nullable=True, default=False)
    
    # Índices para optimización de queries
    __table_args__ = (
        Index('idx_properties_operation', 'operation'),
        Index('idx_properties_location', 'location'),
        Index('idx_properties_price', 'price'),
        Index('idx_properties_type', 'property_type'),
        Index('idx_properties_active', 'is_active'),
    )  # Tiene visita virtual
    is_active = Column(Boolean, nullable=True, default=True)  # Propiedad activa/públicada
    published_date = Column(DateTime, default=datetime.datetime.utcnow)  # Fecha de publicación
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Fecha de creación

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # ✅ `user_id` no puede ser NULL

    owner = relationship("User", back_populates="properties")
    valuations = relationship("Valuation", back_populates="property", lazy=True)
    contracts = relationship("SmartContract", back_populates="property", lazy=True)
    
    def to_dict(self):
        """Convierte el modelo a diccionario para JSON"""
        return {
            'id': self.id,
            'title': self.title,
            'price': self.price,
            'location': self.location,
            'latitude': self.latitude if self.latitude is not None else 0,
            'longitude': self.longitude if self.longitude is not None else 0,
            'image_url': self.image_url,
            'images': [self.image_url] if self.image_url else [],
            'bedrooms': self.bedrooms if self.bedrooms is not None else 0,
            'bathrooms': self.bathrooms if self.bathrooms is not None else 0,
            'features': [],
            'habitaScore': 450,  # Default score
            'status': self.status,
            'square_meters': self.surface if self.surface is not None else 0,
            'brokerId': 1  # Default broker
        }


def _sync_geom_from_latlng(target: Property) -> None:
    """
    Mantener `geom` alineado con `latitude/longitude`.
    - PostGIS espera POINT(lng lat) en SRID 4326.
    - En SQLite se guarda como WKT (texto) si no hay tipo geo real.
    """
    try:
        lat = getattr(target, "latitude", None)
        lng = getattr(target, "longitude", None)
        if lat is None or lng is None:
            return
        target.geom = WKTElement(f"POINT({lng} {lat})", srid=4326)
    except Exception:
        # No bloquear operaciones por falla geo en MVP
        return


@event.listens_for(Property, "before_insert")
def _property_before_insert(mapper, connection, target: Property):  # pragma: no cover
    _sync_geom_from_latlng(target)


@event.listens_for(Property, "before_update")
def _property_before_update(mapper, connection, target: Property):  # pragma: no cover
    _sync_geom_from_latlng(target)

# ✅ Modelo de Tasación Inteligente
class Valuation(db.Model):
    __tablename__ = "valuation"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    estimated_value = Column(Float, nullable=False)
    valuation_date = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="valuations")

# ✅ Modelo de Contrato Inteligente con Blockchain
class SmartContract(db.Model):
    __tablename__ = "smart_contract"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contract_hash = Column(String(256), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="contracts")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="buyer_contracts")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="seller_contracts")

# ✅ Modelo de Favoritos
class Favorite(db.Model):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'property_id', name='unique_user_property_favorite'),)

# ✅ Modelo de Reviews y Ratings
class Review(db.Model):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    broker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 estrellas
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, default="property")  # property, broker, process
    verified = Column(Boolean, default=False)  # Solo reviews de transacciones completadas
    tags = Column(JSON, nullable=True)  # Array de tags
    images = Column(JSON, nullable=True)  # Array de URLs de imágenes
    helpful_count = Column(Integer, default=0)  # Cuántos usuarios marcaron como útil
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    __table_args__ = (
        Index('idx_reviews_property', 'property_id'),
        Index('idx_reviews_broker', 'broker_id'),
        Index('idx_reviews_user', 'user_id'),
        Index('idx_reviews_rating', 'rating'),
        Index('idx_reviews_verified', 'verified'),
    )

# ✅ Modelo de Featured Listings
class FeaturedListing(db.Model):
    __tablename__ = "featured_listings"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    tier = Column(String(50), nullable=False, default="featured")  # featured, premium, platinum
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, nullable=True)  # Para ordenamiento (1 = más prioritario)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    __table_args__ = (
        Index('idx_featured_property', 'property_id'),
        Index('idx_featured_tier', 'tier'),
        Index('idx_featured_active', 'is_active'),
        Index('idx_featured_dates', 'start_date', 'end_date'),
    )
