#!/usr/bin/env python3
"""
Script para corregir valores de 'operation' en propiedades existentes
Ejecutar: python fix_properties_operation.py
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Configuración de base de datos
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL no está configurada")
    sys.exit(1)

# Crear engine y session
if DATABASE_URL.startswith('postgresql://'):
    # Parse PostgreSQL URL
    engine = create_engine(DATABASE_URL)
else:
    # Fallback a SQLite
    engine = create_engine('sqlite:///habitatpro.db')

Session = sessionmaker(bind=engine)
session = Session()

try:
    print("🔍 Analizando propiedades existentes...")
    
    # Verificar estado actual
    result = session.execute(text("""
        SELECT 
            operation,
            COUNT(*) as total
        FROM properties
        GROUP BY operation
    """))
    
    current_status = {}
    for row in result:
        op = row[0] if row[0] else 'NULL'
        current_status[op] = row[1]
        print(f"  - operation='{op}': {row[1]} propiedades")
    
    print("\n🔧 Corrigiendo propiedades...")
    
    # Estrategia 1: Propiedades con precio alto (>$100,000) → compra
    result1 = session.execute(text("""
        UPDATE properties
        SET operation = 'compra'
        WHERE (operation IS NULL OR operation = '')
        AND price > 100000
    """))
    compra_count = result1.rowcount
    print(f"  ✅ {compra_count} propiedades actualizadas a 'compra' (precio > $100k)")
    
    # Estrategia 2: Propiedades con precio bajo (<$5,000) → alquiler
    result2 = session.execute(text("""
        UPDATE properties
        SET operation = 'alquiler'
        WHERE (operation IS NULL OR operation = '')
        AND price < 5000
    """))
    alquiler_count = result2.rowcount
    print(f"  ✅ {alquiler_count} propiedades actualizadas a 'alquiler' (precio < $5k)")
    
    # Estrategia 3: Propiedades restantes → distribuir proporcionalmente
    result3 = session.execute(text("""
        SELECT COUNT(*) FROM properties
        WHERE operation IS NULL OR operation = ''
    """))
    remaining = result3.scalar()
    
    if remaining > 0:
        # Distribuir mitad y mitad entre compra y alquiler
        session.execute(text("""
            UPDATE properties
            SET operation = CASE 
                WHEN id % 2 = 0 THEN 'compra'
                ELSE 'alquiler'
            END
            WHERE operation IS NULL OR operation = ''
        """))
        print(f"  ✅ {remaining} propiedades restantes distribuidas (compra/alquiler)")
    
    # Commit cambios
    session.commit()
    
    print("\n📊 Estado final:")
    result_final = session.execute(text("""
        SELECT 
            operation,
            COUNT(*) as total
        FROM properties
        GROUP BY operation
        ORDER BY operation
    """))
    
    for row in result_final:
        op = row[0] if row[0] else 'NULL'
        print(f"  - operation='{op}': {row[1]} propiedades")
    
    print("\n✅ Corrección completada exitosamente!")
    
except Exception as e:
    session.rollback()
    print(f"\n❌ ERROR: {str(e)}")
    sys.exit(1)
finally:
    session.close()

