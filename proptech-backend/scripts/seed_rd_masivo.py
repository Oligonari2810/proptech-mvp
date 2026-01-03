#!/usr/bin/env python3
"""
Script masivo de seed para propiedades RD realistas
Ejecutar: python scripts/seed_rd_masivo.py --count 50
"""

import sys
import os
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import app, db
from models import Property, User
from datetime import datetime

# Propiedades RD realistas con datos del mercado real
PROPERTIES_RD = [
    # COMPRA - APARTAMENTOS LUJO (Piantini, Naco, Bella Vista)
    {
        "title": "Penthouse de lujo en Piantini",
        "description": "Exclusivo penthouse con vista panorámica a la ciudad, acabados de lujo, 4 habitaciones, 4 baños, área social amplia, terraza privada",
        "price": 685000,
        "operation": "compra",
        "property_type": "apartamento",
        "bedrooms": 4,
        "bathrooms": 4,
        "area": 280,
        "location": "Piantini, Santo Domingo",
        "latitude": 18.4833,
        "longitude": -69.9167,
        "features": ["Piscina", "Gimnasio", "Seguridad 24/7", "Ascensor", "Terraza"],
        "emotional_tags": ["lujo", "exclusivo", "moderno"]
    },
    {
        "title": "Apartamento moderno en Naco",
        "description": "Apartamento contemporáneo con excelentes acabados, ubicado en zona residencial exclusiva",
        "price": 285000,
        "operation": "compra",
        "property_type": "apartamento",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 145,
        "location": "Naco, Santo Domingo",
        "latitude": 18.4700,
        "longitude": -69.9200,
        "features": ["Seguridad", "Ascensor", "Parqueo"],
        "emotional_tags": ["moderno", "cómodo", "centrico"]
    },
    {
        "title": "Apartamento familiar en Bella Vista",
        "description": "Amplio apartamento ideal para familias, excelente ubicación cerca de colegios y servicios",
        "price": 245000,
        "operation": "compra",
        "property_type": "apartamento",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 135,
        "location": "Bella Vista, Santo Domingo",
        "latitude": 18.4750,
        "longitude": -69.9300,
        "features": ["Parqueo", "Seguridad", "Áreas verdes"],
        "emotional_tags": ["familiar", "acogedor", "residencial"]
    },
    {
        "title": "Estudio moderno en Gazcue",
        "description": "Estudio funcional y moderno, perfecto para profesionales jóvenes, excelente ubicación",
        "price": 95000,
        "operation": "compra",
        "property_type": "apartamento",
        "bedrooms": 1,
        "bathrooms": 1,
        "area": 55,
        "location": "Gazcue, Santo Domingo",
        "latitude": 18.4700,
        "longitude": -69.9000,
        "features": ["Ascensor", "Seguridad"],
        "emotional_tags": ["práctico", "moderno", "económico"]
    },
    
    # COMPRA - CASAS (Piantini, Bella Vista, Piantini)
    {
        "title": "Casa de lujo en Piantini",
        "description": "Residencia exclusiva con diseño arquitectónico contemporáneo, jardín privado, piscina, área de entretenimiento",
        "price": 1250000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 5,
        "bathrooms": 4,
        "area": 450,
        "location": "Piantini, Santo Domingo",
        "latitude": 18.4850,
        "longitude": -69.9150,
        "features": ["Piscina", "Jardín", "Garaje", "Seguridad", "Cuarto servicio"],
        "emotional_tags": ["lujo", "espacioso", "exclusivo"]
    },
    {
        "title": "Casa familiar en Bella Vista",
        "description": "Amplia casa familiar con patio trasero, ideal para familias grandes, zona tranquila y segura",
        "price": 485000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 280,
        "location": "Bella Vista, Santo Domingo",
        "latitude": 18.4730,
        "longitude": -69.9280,
        "features": ["Jardín", "Parqueo", "Áreas verdes"],
        "emotional_tags": ["familiar", "espacioso", "residencial"]
    },
    {
        "title": "Villa en Punta Cana",
        "description": "Hermosa villa cerca de playa, ideal para vacaciones o residencia, acabados de lujo",
        "price": 850000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 350,
        "location": "Punta Cana, La Altagracia",
        "latitude": 18.5819,
        "longitude": -68.3706,
        "features": ["Piscina", "Jardín", "Cerca playa", "Seguridad"],
        "emotional_tags": ["vacacional", "lujo", "playa"]
    },
    {
        "title": "Casa en Santiago",
        "description": "Casa tradicional renovada en zona residencial de Santiago, perfecta para familias",
        "price": 385000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 220,
        "location": "Santiago de los Caballeros",
        "latitude": 19.4517,
        "longitude": -70.6970,
        "features": ["Jardín", "Parqueo", "Zona tranquila"],
        "emotional_tags": ["tradicional", "familiar", "cómodo"]
    },
    
    # COMPRA - LOCALES COMERCIALES
    {
        "title": "Local comercial en Churchill",
        "description": "Local comercial estratégico en zona de alto tráfico, ideal para negocio",
        "price": 285000,
        "operation": "compra",
        "property_type": "comercial",
        "bedrooms": 0,
        "bathrooms": 2,
        "area": 120,
        "location": "Churchill, Santo Domingo",
        "latitude": 18.4650,
        "longitude": -69.9100,
        "features": ["Alto tráfico", "Vidrieras", "Aire acondicionado"],
        "emotional_tags": ["comercial", "estratégico", "rentable"]
    },
    {
        "title": "Oficina en Naco",
        "description": "Espacio de oficina moderno en edificio empresarial, zona financiera",
        "price": 185000,
        "operation": "compra",
        "property_type": "oficina",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 85,
        "location": "Naco, Santo Domingo",
        "latitude": 18.4720,
        "longitude": -69.9180,
        "features": ["Ascensor", "Aire acondicionado", "Seguridad"],
        "emotional_tags": ["empresarial", "moderno", "profesional"]
    },
    
    # ALQUILER - APARTAMENTOS
    {
        "title": "Apartamento amueblado en Naco",
        "description": "Apartamento completamente amueblado, listo para habitar, zona exclusiva",
        "price": 1850,
        "operation": "alquiler",
        "property_type": "apartamento",
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 95,
        "location": "Naco, Santo Domingo",
        "latitude": 18.4710,
        "longitude": -69.9190,
        "features": ["Amueblado", "Ascensor", "Seguridad"],
        "emotional_tags": ["práctico", "listo", "cómodo"]
    },
    {
        "title": "Estudio en Gazcue",
        "description": "Estudio funcional y económico, perfecto para estudiantes o jóvenes profesionales",
        "price": 450,
        "operation": "alquiler",
        "property_type": "apartamento",
        "bedrooms": 1,
        "bathrooms": 1,
        "area": 42,
        "location": "Gazcue, Santo Domingo",
        "latitude": 18.4710,
        "longitude": -69.9010,
        "features": ["Económico", "Centrico"],
        "emotional_tags": ["económico", "práctico", "accesible"]
    },
    {
        "title": "Apartamento 3 habitaciones en Piantini",
        "description": "Amplio apartamento para familias, excelente ubicación, zonas comunes",
        "price": 1650,
        "operation": "alquiler",
        "property_type": "apartamento",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 125,
        "location": "Piantini, Santo Domingo",
        "latitude": 18.4840,
        "longitude": -69.9170,
        "features": ["Seguridad", "Ascensor", "Piscina"],
        "emotional_tags": ["familiar", "espacioso", "cómodo"]
    },
    {
        "title": "Penthouse en alquiler - Bella Vista",
        "description": "Lujoso penthouse con terraza privada, vistas panorámicas, acabados premium",
        "price": 3800,
        "operation": "alquiler",
        "property_type": "apartamento",
        "bedrooms": 4,
        "bathrooms": 4,
        "area": 260,
        "location": "Bella Vista, Santo Domingo",
        "latitude": 18.4760,
        "longitude": -69.9310,
        "features": ["Terraza", "Vista panorámica", "Lujo", "Piscina", "Gimnasio"],
        "emotional_tags": ["lujo", "exclusivo", "panorámico"]
    },
    
    # ALQUILER - CASAS
    {
        "title": "Casa familiar en Bella Vista",
        "description": "Amplia casa para familias grandes, jardín, zona tranquila",
        "price": 2200,
        "operation": "alquiler",
        "property_type": "casa",
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 250,
        "location": "Bella Vista, Santo Domingo",
        "latitude": 18.4740,
        "longitude": -69.9290,
        "features": ["Jardín", "Parqueo", "Seguridad"],
        "emotional_tags": ["familiar", "espacioso", "residencial"]
    },
    {
        "title": "Villa en alquiler - Punta Cana",
        "description": "Hermosa villa cerca de playa, alquiler mensual o anual, ideal para vacaciones",
        "price": 4500,
        "operation": "alquiler",
        "property_type": "casa",
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 320,
        "location": "Punta Cana, La Altagracia",
        "latitude": 18.5820,
        "longitude": -68.3710,
        "features": ["Piscina", "Cerca playa", "Jardín", "Seguridad"],
        "emotional_tags": ["vacacional", "playa", "lujo"]
    },
    
    # ALQUILER - LOCALES/OFICINAS
    {
        "title": "Local comercial en alquiler - Churchill",
        "description": "Local comercial en zona de alto tráfico, ideal para negocio",
        "price": 1800,
        "operation": "alquiler",
        "property_type": "comercial",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 85,
        "location": "Churchill, Santo Domingo",
        "latitude": 18.4660,
        "longitude": -69.9110,
        "features": ["Alto tráfico", "Vidrieras"],
        "emotional_tags": ["comercial", "estratégico"]
    },
    {
        "title": "Oficina en alquiler - Naco",
        "description": "Espacio de oficina moderno en edificio empresarial",
        "price": 850,
        "operation": "alquiler",
        "property_type": "oficina",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 65,
        "location": "Naco, Santo Domingo",
        "latitude": 18.4730,
        "longitude": -69.9170,
        "features": ["Aire acondicionado", "Ascensor"],
        "emotional_tags": ["empresarial", "profesional"]
    },
    # MÁS PROPIEDADES COMPRA - EXPANDIENDO
    {
        "title": "Apartamento 2 habitaciones en Naco",
        "description": "Apartamento acogedor en zona exclusiva, perfecto para profesionales jóvenes",
        "price": 195000,
        "operation": "compra",
        "property_type": "apartamento",
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 95,
        "location": "Naco, Santo Domingo",
        "latitude": 18.4720,
        "longitude": -69.9180,
        "features": ["Ascensor", "Seguridad", "Parqueo"],
        "emotional_tags": ["moderno", "cómodo", "accesible"]
    },
    {
        "title": "Casa en San Cristóbal",
        "description": "Amplia casa familiar en zona residencial tranquila, ideal para familias grandes",
        "price": 320000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 4,
        "bathrooms": 3,
        "area": 260,
        "location": "San Cristóbal",
        "latitude": 18.4167,
        "longitude": -70.1000,
        "features": ["Jardín", "Parqueo", "Zona tranquila"],
        "emotional_tags": ["familiar", "espacioso", "residencial"]
    },
    {
        "title": "Villa en Bávaro",
        "description": "Hermosa villa cerca de playa con piscina, ideal para vacaciones o residencia",
        "price": 720000,
        "operation": "compra",
        "property_type": "casa",
        "bedrooms": 5,
        "bathrooms": 4,
        "area": 380,
        "location": "Bávaro, Punta Cana",
        "latitude": 18.6700,
        "longitude": -68.4500,
        "features": ["Piscina", "Cerca playa", "Jardín", "Seguridad"],
        "emotional_tags": ["vacacional", "lujo", "playa"]
    },
    {
        "title": "Local comercial en Los Cacicazgos",
        "description": "Local estratégico en zona comercial, alto tráfico peatonal",
        "price": 185000,
        "operation": "compra",
        "property_type": "comercial",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 75,
        "location": "Los Cacicazgos, Santo Domingo",
        "latitude": 18.4800,
        "longitude": -69.9400,
        "features": ["Alto tráfico", "Vidrieras", "Aire acondicionado"],
        "emotional_tags": ["comercial", "estratégico", "rentable"]
    },
    # MÁS PROPIEDADES ALQUILER
    {
        "title": "Apartamento 2 habitaciones en Mirador Sur",
        "description": "Apartamento moderno con vista al parque, zona exclusiva",
        "price": 1200,
        "operation": "alquiler",
        "property_type": "apartamento",
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 85,
        "location": "Mirador Sur, Santo Domingo",
        "latitude": 18.4600,
        "longitude": -69.9100,
        "features": ["Vista", "Ascensor", "Seguridad"],
        "emotional_tags": ["vista", "moderno", "exclusivo"]
    },
    {
        "title": "Casa 3 habitaciones en San Pedro de Macorís",
        "description": "Casa cómoda en zona residencial, cerca de servicios",
        "price": 980,
        "operation": "alquiler",
        "property_type": "casa",
        "bedrooms": 3,
        "bathrooms": 2,
        "area": 180,
        "location": "San Pedro de Macorís",
        "latitude": 18.4583,
        "longitude": -69.3083,
        "features": ["Jardín", "Parqueo"],
        "emotional_tags": ["cómodo", "familiar", "residencial"]
    },
    {
        "title": "Local en alquiler - Gazcue",
        "description": "Local comercial en zona céntrica, ideal para negocio",
        "price": 650,
        "operation": "alquiler",
        "property_type": "comercial",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 55,
        "location": "Gazcue, Santo Domingo",
        "latitude": 18.4700,
        "longitude": -69.9000,
        "features": ["Céntrico", "Vidrieras"],
        "emotional_tags": ["comercial", "céntrico"]
    },
    {
        "title": "Oficina en alquiler - Churchill",
        "description": "Espacio de oficina moderno en edificio empresarial",
        "price": 950,
        "operation": "alquiler",
        "property_type": "oficina",
        "bedrooms": 0,
        "bathrooms": 1,
        "area": 70,
        "location": "Churchill, Santo Domingo",
        "latitude": 18.4650,
        "longitude": -69.9100,
        "features": ["Aire acondicionado", "Ascensor", "Seguridad"],
        "emotional_tags": ["empresarial", "profesional"]
    },
]

def seed_rd_properties(count=50):
    """Seed masivo de propiedades RD"""
    with app.app_context():
        # Obtener o crear usuario admin por defecto
        admin_user = User.query.filter_by(email='admin@habitatpro.com').first()
        if not admin_user:
            admin_user = User(
                email='admin@habitatpro.com',
                name='Admin HabitatPro',
                role='admin',
                is_active=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Usuario admin creado (ID: {admin_user.id})")
        
        # Limpiar propiedades existentes (opcional - comentar si no quieres borrar)
        # Property.query.delete()
        # db.session.commit()
        
        # Agregar propiedades
        added = 0
        skipped = 0
        for prop_data in PROPERTIES_RD[:count]:
            # Verificar si ya existe
            existing = Property.query.filter_by(
                title=prop_data["title"],
                location=prop_data["location"]
            ).first()
            
            if existing:
                print(f"⏭️  Saltando: {prop_data['title']} (ya existe)")
                skipped += 1
                continue
            
            # Asegurar que tenemos image_url (requerido)
            image_url = prop_data.get("image_url") or "https://picsum.photos/800/600?random=" + str(added)
            
            property = Property(
                title=prop_data["title"],
                description=prop_data.get("description", ""),
                price=prop_data["price"],
                operation=prop_data["operation"],
                property_type=prop_data["property_type"],
                bedrooms=prop_data.get("bedrooms", 0),
                bathrooms=prop_data.get("bathrooms", 0),
                area=prop_data.get("area", 0),
                surface=prop_data.get("area", 0),  # Alias para area
                location=prop_data["location"],
                latitude=prop_data.get("latitude"),
                longitude=prop_data.get("longitude"),
                image_url=image_url,
                images=[image_url],  # JSON array
                features=prop_data.get("features", []),
                emotional_tags=prop_data.get("emotional_tags", []),
                is_active=True,
                status="available",
                user_id=admin_user.id,  # ✅ CRÍTICO: Asignar user_id
                created_at=datetime.utcnow()
            )
            
            db.session.add(property)
            added += 1
        
        db.session.commit()
        print(f"\n{'='*60}")
        print(f"✅ RESULTADO SEED RD:")
        print(f"   - Propiedades agregadas: {added}")
        print(f"   - Propiedades saltadas: {skipped}")
        print(f"   - Total procesadas: {added + skipped}")
        print(f"{'='*60}\n")
        return added

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Seed masivo de propiedades RD')
    parser.add_argument('--count', type=int, default=50, help='Número de propiedades a crear')
    parser.add_argument('--clean', action='store_true', help='Limpiar propiedades existentes antes de seed')
    
    args = parser.parse_args()
    
    if args.clean:
        with app.app_context():
            Property.query.delete()
            db.session.commit()
            print("🗑️  Propiedades existentes eliminadas")
    
    seed_rd_properties(args.count)

