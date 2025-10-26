#!/usr/bin/env python3
"""Script para actualizar la base de datos con nuevos campos"""

from app import app, db

def update_database():
    with app.app_context():
        try:
            # Crear todas las tablas
            db.create_all()
            print("✅ Base de datos actualizada exitosamente")
            print("✅ Campos de suscripción añadidos al modelo User")
        except Exception as e:
            print(f"❌ Error actualizando base de datos: {e}")

if __name__ == "__main__":
    update_database()
