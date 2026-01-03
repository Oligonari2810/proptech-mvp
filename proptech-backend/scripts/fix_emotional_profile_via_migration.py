#!/usr/bin/env python3
"""
Ejecutar migración 003_add_emotional_profile_column directamente
Útil cuando Alembic no se ejecuta automáticamente
"""

import os
import sys
from pathlib import Path

# Agregar directorio del backend al path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def run_migration():
    """Ejecutar migración 003_add_emotional_profile_column manualmente"""
    
    from dotenv import load_dotenv
    load_dotenv()
    
    from alembic import config, script
    from alembic.runtime import migration
    from sqlalchemy import create_engine
    
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ ERROR: DATABASE_URL no encontrada")
        return False
    
    print("=" * 70)
    print("🔧 EJECUTANDO MIGRACIÓN: 003_add_emotional_profile_column")
    print("=" * 70)
    
    try:
        # Crear engine
        engine = create_engine(database_url)
        
        # Configurar Alembic
        alembic_cfg = config.Config(str(backend_dir / "migrations" / "alembic.ini"))
        alembic_cfg.set_main_option("script_location", str(backend_dir / "migrations"))
        
        # Obtener script de migración
        script_dir = script.ScriptDirectory.from_config(alembic_cfg)
        
        # Ejecutar migración específica
        migration_revision = '003_add_emotional_profile'
        script_obj = script_dir.get_revision(migration_revision)
        
        if not script_obj:
            print(f"❌ ERROR: Migración {migration_revision} no encontrada")
            return False
        
        print(f"\n✅ Migración encontrada: {migration_revision}")
        
        # Importar y ejecutar upgrade
        migration_module = script_obj.module
        
        with engine.connect() as connection:
            alembic_cfg.attributes['connection'] = connection
            migration_module.upgrade(connection, alembic_cfg)
            connection.commit()
        
        print("\n" + "=" * 70)
        print("✅ ÉXITO: Migración ejecutada correctamente")
        print("=" * 70)
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR ejecutando migración: {type(e).__name__}: {e}")
        import traceback
        print(traceback.format_exc()[:500])
        return False

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)

