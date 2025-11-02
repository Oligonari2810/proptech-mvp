#!/usr/bin/env python3
"""
Test REAL del backend actual - Ejecutar antes de hacer deploy
Muestra el estado REAL de los endpoints sin suposiciones
"""

import requests
import time
import json
from datetime import datetime

def test_backend_real():
    """Test REAL del backend actual"""
    base = "https://proptech-mvp-1.onrender.com"
    
    print("=" * 70)
    print("🧪 TEST REAL - ESTADO ACTUAL DEL BACKEND")
    print(f"⏰ Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    tests = [
        ("/api/health", "GET", "Health Check"),
        ("/api/properties", "GET", "Properties List"),
        ("/api/properties?operation=compra&limit=5", "GET", "Properties Filtered"),
    ]
    
    results = []
    
    for endpoint, method, description in tests:
        print(f"\n{'='*70}")
        print(f"🔍 Test: {description}")
        print(f"📍 Endpoint: {endpoint}")
        print(f"{'='*70}")
        
        try:
            url = base + endpoint
            start_time = time.time()
            resp = requests.get(url, timeout=15)
            elapsed = time.time() - start_time
            
            status_emoji = '✅' if resp.status_code == 200 else '⚠️' if resp.status_code < 500 else '❌'
            print(f"{status_emoji} Status: {resp.status_code} ({elapsed:.2f}s)")
            
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    print(f"   📦 Tipo respuesta: {type(data).__name__}")
                    
                    if isinstance(data, dict):
                        keys = list(data.keys())[:8]
                        print(f"   🔑 Keys: {keys}")
                        
                        # Verificaciones específicas
                        if endpoint == "/api/health":
                            if 'cache' in data:
                                print(f"   ✅ Key 'cache' existe: {data['cache']}")
                            else:
                                print(f"   ⚠️ Key 'cache' NO existe (podría causar KeyError)")
                            
                            if 'status' in data:
                                print(f"   📊 Status: {data['status']}")
                        
                        elif 'properties' in endpoint:
                            if 'properties' in data:
                                props_count = len(data['properties']) if isinstance(data['properties'], list) else 0
                                print(f"   🏠 Propiedades: {props_count}")
                            elif 'success' in data:
                                print(f"   ✅ Success: {data['success']}")
                    
                except json.JSONDecodeError:
                    print(f"   ⚠️ No es JSON válido")
                    print(f"   📄 Primeros 200 chars: {resp.text[:200]}")
            
            else:
                error_text = resp.text[:300]
                print(f"   ⚠️ Error response:")
                print(f"   {error_text}")
                
                # Detectar errores específicos
                if 'KeyError' in error_text or "'cache'" in error_text:
                    print(f"   🚨 DETECTADO: KeyError relacionado con 'cache'")
                if 'foreign key' in error_text.lower() or "'user.id'" in error_text.lower():
                    print(f"   🚨 DETECTADO: Error de Foreign Key")
                if 'ImportError' in error_text or 'ModuleNotFoundError' in error_text:
                    print(f"   🚨 DETECTADO: Error de Import")
            
            results.append((endpoint, description, resp.status_code, 'OK' if resp.status_code == 200 else 'ERROR', elapsed))
            
        except requests.exceptions.Timeout:
            print(f"❌ TIMEOUT (>15s)")
            results.append((endpoint, description, 'TIMEOUT', 'ERROR', 15.0))
        except requests.exceptions.ConnectionError:
            print(f"❌ CONNECTION ERROR (Servicio no disponible)")
            results.append((endpoint, description, 'CONNECTION_ERROR', 'ERROR', 0))
        except Exception as e:
            print(f"❌ EXCEPTION: {type(e).__name__}")
            print(f"   {str(e)[:200]}")
            results.append((endpoint, description, 'EXCEPTION', str(e)[:50], 0))
        
        time.sleep(1)
    
    # Resumen final
    print("\n" + "=" * 70)
    print("📊 RESUMEN DE RESULTADOS")
    print("=" * 70)
    
    for endpoint, description, status, result, elapsed in results:
        emoji = '✅' if result == 'OK' else '❌'
        status_str = f"{status}" if isinstance(status, int) else status
        elapsed_str = f" ({elapsed:.2f}s)" if elapsed > 0 else ""
        print(f"{emoji} {description}: {status_str}{elapsed_str}")
    
    # Decisión final
    print("\n" + "=" * 70)
    all_ok = all(r[3] == 'OK' for r in results)
    some_ok = any(r[3] == 'OK' for r in results)
    all_timeout = all('TIMEOUT' in str(r[2]) for r in results)
    
    if all_ok:
        print("✅ ✅ CONCLUSIÓN: TODOS LOS ENDPOINTS FUNCIONAN ✅ ✅")
        print("✅ ✅ LISTO PARA DEPLOY ✅ ✅")
        return True
    elif all_timeout:
        print("⏱️ CONCLUSIÓN: SERVIDOR MUY LENTO O DORMIDO")
        print("⏱️ Render necesita warm-up (puede tardar 30-60s en responder)")
        print("⚠️ Verificar nuevamente después de warm-up")
        return False
    elif some_ok:
        print("⚠️ CONCLUSIÓN: ALGUNOS ENDPOINTS FUNCIONAN")
        print("⚠️ Revisar errores específicos antes de deploy completo")
        return False
    else:
        print("❌ CONCLUSIÓN: PROBLEMAS CRÍTICOS DETECTADOS")
        print("❌ NO HACER DEPLOY - CORREGIR ERRORES PRIMERO")
        return False

if __name__ == "__main__":
    success = test_backend_real()
    exit(0 if success else 1)

