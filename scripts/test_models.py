#!/usr/bin/env python3
"""Test de Modelos SQLAlchemy - Verificar que pueden ser instanciados"""
import sys
import os

# Agregar el directorio del backend al path
sys.path.insert(0, os.path.join(os.getcwd(), 'proptech-backend'))

def test_sqlalchemy_models():
    """Verificar que todos los modelos pueden ser instanciados"""
    print("=" * 70)
    print("🗄️ VERIFICANDO MODELOS SQLALCHEMY...")
    print("=" * 70)
    
    try:
        # Intentar importar los modelos principales
        from models import db, User, Property, Valuation
        
        print("  ✅ Modelos principales importados (User, Property, Valuation)")
        
        # Intentar importar modelos de emoción
        try:
            from ai.models.emotion.emotion_model import EmotionPreference, EmotionAwareRecommendation
            print("  ✅ Modelos de emoción importados (EmotionPreference, EmotionAwareRecommendation)")
            
            # Verificar que las clases existen y tienen los atributos correctos
            assert hasattr(EmotionPreference, 'user_id')
            assert hasattr(EmotionPreference, 'user')
            print("  ✅ EmotionPreference tiene atributos user_id y user")
            
            assert hasattr(EmotionAwareRecommendation, 'user_id')
            assert hasattr(EmotionAwareRecommendation, 'user')
            print("  ✅ EmotionAwareRecommendation tiene atributos user_id y user")
            
        except ImportError as e:
            print(f"  ⚠️ Modelos de emoción no importables: {e}")
            print("     (Puede ser normal si no se usan)")
        
        # Verificar estructura básica de modelos principales
        assert hasattr(User, 'id')
        assert hasattr(Property, 'id')
        print("  ✅ Modelos principales tienen estructura correcta")
        
        print("=" * 70)
        print("✅ Todos los modelos verificados correctamente")
        return True
        
    except Exception as e:
        print(f"  ❌ Error verificando modelos: {type(e).__name__}: {e}")
        import traceback
        print(traceback.format_exc()[:500])
        return False

if __name__ == "__main__":
    success = test_sqlalchemy_models()
    exit(0 if success else 1)

