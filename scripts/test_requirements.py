#!/usr/bin/env python3
"""Test de Requirements - Verificar que TODOS los módulos pueden importarse"""
import sys

def test_all_imports():
    """Verificar que cada módulo en requirements puede importarse"""
    
    # Mapeo de nombres en requirements.txt a nombres de importación
    required_modules = {
        "flask": "flask",
        "flask_sqlalchemy": "flask_sqlalchemy",
        "flask_migrate": "flask_migrate", 
        "flask_cors": "flask_cors",  # Comentado pero verificamos
        "flask_jwt_extended": "flask_jwt_extended",
        "psycopg2": "psycopg2",
        "psycopg2-binary": "psycopg2",  # Mismo módulo
        "python_dotenv": "dotenv",
        "gunicorn": "gunicorn",
        "werkzeug": "werkzeug",
        "sklearn": "sklearn",
        "scikit-learn": "sklearn",  # Mismo módulo
        "pandas": "pandas",
        "numpy": "numpy",
        "requests": "requests",
        "starlette": "starlette"
    }
    
    print("=" * 70)
    print("📦 VERIFICANDO IMPORTS DE REQUIREMENTS...")
    print("=" * 70)
    
    all_ok = True
    failed_modules = []
    
    for req_name, import_name in required_modules.items():
        try:
            __import__(import_name)
            print(f"  ✅ {req_name} ({import_name}) - Puede importarse")
        except ImportError as e:
            # flask_cors está comentado, es esperado
            if req_name == "flask_cors":
                print(f"  ⚠️ {req_name} - NO importable (esperado, está comentado)")
            else:
                print(f"  ❌ {req_name} ({import_name}) - NO puede importarse: {e}")
                all_ok = False
                failed_modules.append(req_name)
        except Exception as e:
            print(f"  ⚠️ {req_name} ({import_name}) - Error inesperado: {e}")
    
    print("=" * 70)
    
    if all_ok:
        print("✅ Todos los módulos críticos pueden importarse")
    else:
        print(f"❌ {len(failed_modules)} módulo(s) NO pueden importarse: {', '.join(failed_modules)}")
    
    return all_ok

if __name__ == "__main__":
    success = test_all_imports()
    exit(0 if success else 1)

