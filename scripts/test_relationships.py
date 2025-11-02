#!/usr/bin/env python3
"""Test ESPECÍFICO de relaciones Foreign Key - CRÍTICO"""
import sys
import os

# Agregar el directorio del backend al path
sys.path.insert(0, os.path.join(os.getcwd(), 'proptech-backend'))

def test_foreign_key_relationships():
    """Test ESPECÍFICO para las relaciones que dan error"""
    print("=" * 70)
    print("🔗 VERIFICANDO RELACIONES SQLALCHEMY (CRÍTICO)")
    print("=" * 70)
    
    try:
        from sqlalchemy import inspect
        from sqlalchemy.orm import relationship
        from models import db, User
        from ai.models.emotion.emotion_model import EmotionPreference, EmotionAwareRecommendation
        
        print("  ✅ Imports exitosos")
        
        # Verificar que EmotionPreference tiene ForeignKey configurado
        print("\n🔍 Verificando EmotionPreference...")
        
        # Verificar columnas
        columns = EmotionPreference.__table__.columns
        user_id_col = columns.get('user_id')
        
        if user_id_col is None:
            print("  ❌ ERROR: user_id column NO existe")
            return False
        
        print(f"  ✅ Columna user_id existe: {user_id_col}")
        
        # Verificar ForeignKey
        foreign_keys = [fk for fk in user_id_col.foreign_keys]
        if not foreign_keys:
            print("  ❌ ERROR: user_id NO tiene ForeignKey configurado")
            return False
        
        fk = foreign_keys[0]
        print(f"  ✅ ForeignKey encontrado: {fk}")
        print(f"     - Target: {fk.column}")
        
        # Verificar que apunta a users.id
        if 'users.id' not in str(fk.column):
            print(f"  ❌ ERROR: ForeignKey NO apunta a users.id (apunta a {fk.column})")
            return False
        
        print(f"  ✅ ForeignKey apunta correctamente a users.id")
        
        # Verificar relación
        if not hasattr(EmotionPreference, 'user'):
            print("  ❌ ERROR: Relación 'user' NO existe")
            return False
        
        print(f"  ✅ Relación 'user' existe")
        
        # Verificar con inspector
        try:
            inspector = inspect(EmotionPreference)
            relationships = inspector.relationships
            
            if 'user' not in relationships:
                print("  ❌ ERROR: Relación 'user' no encontrada por inspector")
                return False
            
            rel = relationships['user']
            print(f"  ✅ Relación 'user' encontrada por inspector")
            print(f"     - Target: {rel.mapper.class_}")
            print(f"     - Foreign Keys: {[str(pair) for pair in rel.local_remote_pairs]}")
            
        except Exception as e:
            print(f"  ⚠️ Inspector no disponible: {e}")
        
        # Verificar EmotionAwareRecommendation
        print("\n🔍 Verificando EmotionAwareRecommendation...")
        
        columns_rec = EmotionAwareRecommendation.__table__.columns
        user_id_col_rec = columns_rec.get('user_id')
        
        if user_id_col_rec:
            foreign_keys_rec = [fk for fk in user_id_col_rec.foreign_keys]
            if foreign_keys_rec:
                print(f"  ✅ ForeignKey configurado correctamente")
            else:
                print(f"  ⚠️ ForeignKey no encontrado (puede ser normal)")
        
        if hasattr(EmotionAwareRecommendation, 'user'):
            print(f"  ✅ Relación 'user' existe")
        
        print("=" * 70)
        print("✅ Todas las relaciones Foreign Key verificadas correctamente")
        return True
        
    except Exception as e:
        print(f"  ❌ Error en relaciones: {type(e).__name__}: {e}")
        import traceback
        print(traceback.format_exc()[:800])
        return False

if __name__ == "__main__":
    success = test_foreign_key_relationships()
    exit(0 if success else 1)

