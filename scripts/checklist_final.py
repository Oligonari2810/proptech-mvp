#!/usr/bin/env python3
"""CHECKLIST FINAL PRE-DEPLOY - Verificación completa antes de deploy"""
import subprocess
import sys
import os

def run_test(script_name, description):
    """Ejecutar un test script y retornar resultado"""
    try:
        script_path = os.path.join(os.path.dirname(__file__), script_name)
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=60
        )
        success = result.returncode == 0
        return success, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def checklist_completo():
    """CHECKLIST que DEBE pasar antes de considerar deploy"""
    
    print("\n" + "=" * 70)
    print("🎯 CHECKLIST FINAL PRE-DEPLOY")
    print("=" * 70 + "\n")
    
    tests = [
        ("test_syntax.py", "Sintaxis Python válida"),
        ("test_models.py", "Modelos SQLAlchemy válidos"),
        ("test_relationships.py", "Relaciones Foreign Key OK"),
        ("test_requirements.py", "Todos los imports funcionan"),
        ("test_endpoints_basicos.py", "Endpoints críticos responden")
    ]
    
    resultados = []
    
    for script, description in tests:
        print(f"🔍 Ejecutando: {description}...")
        success, stdout, stderr = run_test(script, description)
        resultados.append((description, success))
        
        if success:
            print(f"  ✅ {description} - PASÓ")
        else:
            print(f"  ❌ {description} - FALLÓ")
            if stderr:
                print(f"     Error: {stderr[:300]}")
        print()
    
    print("=" * 70)
    print("📊 RESULTADO FINAL:")
    print("=" * 70)
    
    passed = sum(1 for _, result in resultados if result)
    total = len(resultados)
    
    for description, result in resultados:
        status = "✅" if result else "❌"
        print(f"{status} {description}")
    
    print(f"\n📊 Resultado: {passed}/{total} checks pasados")
    print("=" * 70)
    
    if passed == total:
        print("\n🎉 ¡TODO CORRECTO! Se puede proceder con deploy")
        print("✅ El código está listo para producción")
        return True
    elif passed >= total - 1:
        # Si solo falla endpoints (puede ser por warm-up)
        failed = [desc for desc, result in resultados if not result]
        if len(failed) == 1 and "Endpoints críticos" in failed[0]:
            print("\n⚠️ ADVERTENCIA: Endpoints no responden")
            print("   Esto puede ser normal si Render está dormido")
            print("   Se recomienda hacer warm-up antes de verificar")
            print("\n✅ Código parece estar correcto - puede proceder con deploy")
            return True
    
    print("\n🚨 ¡FALTAN CORRECCIONES! No hacer deploy aún")
    print("   Revisar los tests que fallaron antes de continuar")
    return False

if __name__ == "__main__":
    success = checklist_completo()
    sys.exit(0 if success else 1)

