#!/usr/bin/env python3
"""Script para agregar columnas faltantes a la base de datos en producción"""
import os
from sqlalchemy import text

def add_missing_columns():
    """Agregar columnas faltantes si no existen"""
    from app import app, db
    
    with app.app_context():
        try:
            # Lista de columnas a agregar
            columns_to_add = [
                ('type', 'VARCHAR(50)'),
                ('operation', 'VARCHAR(20)'),
                ('area', 'FLOAT'),
                ('features', 'JSONB'),
                ('emotional_tags', 'JSONB'),
                ('images', 'JSONB'),
                ('is_active', 'BOOLEAN DEFAULT TRUE'),
            ]
            
            for column_name, column_type in columns_to_add:
                try:
                    # Verificar si la columna ya existe
                    check_query = text(f"""
                        SELECT COUNT(*) 
                        FROM information_schema.columns 
                        WHERE table_name='properties' AND column_name='{column_name}'
                    """)
                    result = db.session.execute(check_query).scalar()
                    
                    if result == 0:
                        # Columna no existe, agregarla
                        alter_query = text(f"ALTER TABLE properties ADD COLUMN {column_name} {column_type}")
                        db.session.execute(alter_query)
                        db.session.commit()
                        print(f"✅ Columna '{column_name}' agregada correctamente")
                    else:
                        print(f"⏭️  Columna '{column_name}' ya existe")
                        
                except Exception as e:
                    print(f"⚠️  Error verificando/agregando columna '{column_name}': {e}")
                    db.session.rollback()
            
            print("✅ Verificación de columnas completada")
            
        except Exception as e:
            print(f"❌ Error general: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_missing_columns()

