# backend/seed_db.py
import os
from app import db, Property, User
from werkzeug.security import generate_password_hash

# Crear base de datos y tablas
print("Inicializando base de datos...")
db.create_all()

# Crear usuarios de ejemplo
if not User.query.first():
    print("Añadiendo usuarios de prueba...")
    user1 = User(username="admin", password_hash=generate_password_hash("admin123", method='pbkdf2:sha256'))
    db.session.add(user1)
    db.session.commit()

# Crear propiedades de ejemplo
if not Property.query.first():
    print("Añadiendo propiedades de prueba...")
    property1 = Property(
        title="Casa en la playa",
        description="Hermosa casa frente al mar con 3 habitaciones y piscina.",
        price=350000,
        location="Punta Cana, RD",
        image_url="https://example.com/images/casa1.jpg"
    )
    property2 = Property(
        title="Apartamento en el centro",
        description="Moderno apartamento con excelente ubicación.",
        price=220000,
        location="Santo Domingo, RD",
        image_url="https://example.com/images/apartamento1.jpg"
    )
    db.session.add(property1)
    db.session.add(property2)
    db.session.commit()

print("Base de datos inicializada con éxito.")
