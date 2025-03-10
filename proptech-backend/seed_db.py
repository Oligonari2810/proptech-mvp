from app import create_app
from models import db, Property, User
from werkzeug.security import generate_password_hash

# ✅ Crear la aplicación dentro del contexto correcto
app = create_app()

with app.app_context():
    print("Inicializando base de datos...")
    db.create_all()

    # ✅ Crear usuario de prueba
    if not User.query.first():
        print("Añadiendo usuarios de prueba...")
        user1 = User(email="admin@example.com", password_hash=generate_password_hash("admin123", method='pbkdf2:sha256'))
        db.session.add(user1)
        db.session.commit()

    # ✅ Crear propiedades de prueba
    if not Property.query.first():
        print("Añadiendo propiedades de prueba...")
        property1 = Property(
            title="Casa en la playa",
            description="Hermosa casa frente al mar con 3 habitaciones y piscina.",
            price=350000,
            location="Punta Cana, RD",
            image_url="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741550991/casa_k9z13f.jpg",
            user_id=user1.id
        )
        property2 = Property(
            title="Apartamento en el centro",
            description="Moderno apartamento con excelente ubicación.",
            price=220000,
            location="Santo Domingo, RD",
            image_url="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741552606/apartamento_g9l9r5.webp",
            user_id=user1.id
        )
        db.session.add(property1)
        db.session.add(property2)
        db.session.commit()

    print("Base de datos inicializada con éxito.")
