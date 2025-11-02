#!/usr/bin/env python3
"""
Script para agregar columna emotional_profile a la tabla properties
Ejecuta SQL directamente en PostgreSQL para evitar problemas de timeout
"""

import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def add_emotional_profile_column():
    """Agregar columna emotional_profile usando conexión directa a PostgreSQL"""
    
    try:
        import psycopg2
        from psycopg2 import sql
    except ImportError:
        print("❌ ERROR: psycopg2 no está instalado")
        print("   Instalar con: pip install psycopg2-binary")
        return False
    
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ ERROR: DATABASE_URL no encontrada en variables de entorno")
        return False
    
    print("=" * 70)
    print("🔍 AGREGANDO COLUMNA emotional_profile")
    print("=" * 70)
    
    print(f"\n1. Conectando a base de datos...")
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        print("   ✅ Conexión exitosa")
    except Exception as e:
        print(f"   ❌ Error de conexión: {type(e).__name__}: {e}")
        return False
    
    try:
        # Verificar si la columna ya existe
        print(f"\n2. Verificando si la columna ya existe...")
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='properties' AND column_name='emotional_profile'
        """)
        
        exists = cur.fetchone()
        
        if exists:
            print("   ⚠️ La columna emotional_profile YA EXISTE")
            print("   ✅ No es necesario agregarla")
            cur.close()
            conn.close()
            return True
        
        print("   ✅ La columna NO existe - procediendo a agregarla")
        
        # Agregar la columna
        print(f"\n3. Agregando columna emotional_profile...")
        cur.execute("""
            ALTER TABLE properties 
            ADD COLUMN IF NOT EXISTS emotional_profile JSON
        """)
        
        conn.commit()
        print("   ✅ Columna agregada exitosamente")
        
        # Verificar que se creó
        print(f"\n4. Verificando que la columna se creó...")
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name='properties' AND column_name='emotional_profile'
        """)
        
        result = cur.fetchone()
        
        if result:
            col_name, data_type, is_nullable = result
            print(f"   ✅ Columna verificada:")
            print(f"      - Nombre: {col_name}")
            print(f"      - Tipo: {data_type}")
            print(f"      - Nullable: {is_nullable}")
        else:
            print("   ⚠️ La columna no se encontró después de agregarla")
            return False
        
        cur.close()
        conn.close()
        
        print("\n" + "=" * 70)
        print("✅ ÉXITO: Columna emotional_profile agregada definitivamente")
        print("=" * 70)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR al agregar columna: {type(e).__name__}: {e}")
        import traceback
        print(traceback.format_exc()[:500])
        conn.rollback()
        cur.close()
        conn.close()
        return False

if __name__ == "__main__":
    success = add_emotional_profile_column()
    sys.exit(0 if success else 1)

