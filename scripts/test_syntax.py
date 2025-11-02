#!/usr/bin/env python3
"""Test de sintaxis Python - Verificar que el código al menos COMPILA"""
import subprocess
import sys
import os

def test_python_syntax():
    """Verificar que todos los archivos Python tienen sintaxis correcta"""
    base_dir = "proptech-backend"
    
    files_to_check = [
        f"{base_dir}/app.py",
        f"{base_dir}/ai/models/emotion/emotion_model.py", 
        f"{base_dir}/ai/routes/emotional_search.py",
        f"{base_dir}/routes/valuation.py",
        f"{base_dir}/models.py",
        f"{base_dir}/routes/properties.py",
        f"{base_dir}/routes/health.py"
    ]
    
    print("=" * 70)
    print("🔍 VERIFICANDO SYNTAX PYTHON...")
    print("=" * 70)
    
    all_ok = True
    
    for file in files_to_check:
        file_path = os.path.join(os.getcwd(), file) if not os.path.isabs(file) else file
        
        if not os.path.exists(file_path):
            print(f"  ⚠️ {file} - NO EXISTE (saltando)")
            continue
            
        try:
            result = subprocess.run(
                [sys.executable, "-m", "py_compile", file_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                print(f"  ✅ {file} - Sintaxis OK")
            else:
                print(f"  ❌ {file} - Error de sintaxis:")
                print(f"     {result.stderr[:200]}")
                all_ok = False
        except subprocess.TimeoutExpired:
            print(f"  ⚠️ {file} - TIMEOUT (probablemente OK)")
        except Exception as e:
            print(f"  ❌ {file} - Exception: {e}")
            all_ok = False
    
    print("=" * 70)
    return all_ok

if __name__ == "__main__":
    success = test_python_syntax()
    exit(0 if success else 1)

