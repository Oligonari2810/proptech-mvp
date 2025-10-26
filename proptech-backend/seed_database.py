from app import app, db
import random

# Importar modelos desde app.py (no models.py que tiene conflicto)
from app import Property, User

def generate_mock_properties():
    """Genera 50 propiedades de prueba"""
    cities = ['Santo Domingo', 'Punta Cana', 'Bávaro', 'La Romana', 'Santiago']
    property_types = ['casa', 'apartment', 'penthouse', 'villa']
    properties = []
    
    # Asegurar que exista un usuario para asociar las propiedades
    user = User.query.filter_by(email='admin@habitatpro.com').first()
    if not user:
        user = User(
            email='admin@habitatpro.com',
            name='Admin'
        )
        db.session.add(user)
        db.session.commit()
    
    for i in range(50):
        property = Property(
            title=f"{random.choice(['Hermosa', 'Moderno', 'Lujoso', 'Acogedor'])} {random.choice(['Apartamento', 'Casa', 'Villa'])} en {cities[i % len(cities)]}",
            price=random.randint(50000, 500000),
            location=cities[i % len(cities)] + ', República Dominicana',
            description=f"Descripción detallada de la propiedad {i+1}",
            images=[f"https://picsum.photos/800/600?random={i}"],
            is_active=True,
            type=random.choice(property_types),
            bedrooms=random.randint(1, 5),
            bathrooms=random.randint(1, 3),
            area=random.randint(50, 300)
        )
        properties.append(property)
    
    return properties

def seed_database():
    """Pobla la base de datos con propiedades de prueba"""
    with app.app_context():
        try:
            # Intentar limpiar propiedades existentes (solo si existen)
            try:
                db.session.query(Property).delete()
                db.session.commit()
            except:
                pass  # Si no hay propiedades, continuar
            
            # Agregar nuevas propiedades
            properties = generate_mock_properties()
            db.session.add_all(properties)
            db.session.commit()
            
            print(f"✅ {len(properties)} propiedades agregadas exitosamente")
            
        except Exception as e:
            print(f"❌ Error al poblar la base de datos: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()

if __name__ == '__main__':
    seed_database()
