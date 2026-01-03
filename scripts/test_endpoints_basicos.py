#!/usr/bin/env python3
"""Test de Endpoints Críticos - Verificar endpoints MÍNIMOS"""
import requests
import time

def test_endpoints_minimos():
    """Test de los endpoints ABSOLUTAMENTE esenciales"""
    base_url = "https://proptech-mvp-1.onrender.com"
    
    endpoints_criticos = [
        ("/api/health", "GET", "Health Check"),
        ("/api/properties", "GET", "Lista de Propiedades"),
        ("/api/properties?operation=compra&limit=5", "GET", "Propiedades Filtradas"),
    ]
    
    print("=" * 70)
    print("🚨 TEST ENDPOINTS CRÍTICOS:")
    print(f"📍 URL Base: {base_url}")
    print("=" * 70)
    
    todos_ok = True
    resultados = []
    
    for endpoint, method, description in endpoints_criticos:
        try:
            start_time = time.time()
            response = requests.get(f"{base_url}{endpoint}", timeout=15)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                print(f"  ✅ {description} ({endpoint})")
                print(f"     Status: 200 OK ({elapsed:.2f}s)")
                
                # Verificar estructura básica
                try:
                    data = response.json()
                    if endpoint == "/api/health" and 'status' in data:
                        print(f"     Status sistema: {data.get('status', 'unknown')}")
                    elif 'properties' in endpoint and ('properties' in data or 'success' in data):
                        props_count = len(data.get('properties', [])) if isinstance(data.get('properties'), list) else 0
                        print(f"     Propiedades: {props_count}")
                except:
                    pass
                
                resultados.append((description, 200, True))
            else:
                print(f"  ❌ {description} ({endpoint})")
                print(f"     Status: {response.status_code}")
                error_text = response.text[:200]
                print(f"     Error: {error_text}")
                todos_ok = False
                resultados.append((description, response.status_code, False))
                
        except requests.exceptions.Timeout:
            print(f"  ⏱️ {description} ({endpoint}) - TIMEOUT (>15s)")
            print("     (Render puede estar dormido - warm-up necesario)")
            resultados.append((description, "TIMEOUT", False))
        except requests.exceptions.ConnectionError:
            print(f"  ❌ {description} ({endpoint}) - CONNECTION ERROR")
            print("     (Servicio no disponible)")
            todos_ok = False
            resultados.append((description, "CONNECTION_ERROR", False))
        except Exception as e:
            print(f"  ❌ {description} ({endpoint}) - ERROR: {type(e).__name__}: {e}")
            todos_ok = False
            resultados.append((description, "EXCEPTION", False))
        
        time.sleep(1)
    
    print("=" * 70)
    print("📊 RESUMEN:")
    print("=" * 70)
    
    for desc, status, ok in resultados:
        emoji = "✅" if ok else "❌"
        print(f"{emoji} {desc}: {status}")
    
    return todos_ok

if __name__ == "__main__":
    success = test_endpoints_minimos()
    exit(0 if success else 1)

