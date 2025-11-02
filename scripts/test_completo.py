#!/usr/bin/env python3
"""
🔍 DIAGNÓSTICO COMPLETO HABITATPRO
Script para verificar estado completo de la plataforma
"""
import requests
import json
import time
import sys
from datetime import datetime

class HabitatProTester:
    def __init__(self):
        self.base_url = "https://proptech-mvp-1.onrender.com"
        self.frontend_url = "https://habitatprord.com"
        self.results = {}
        self.errors = []
        self.warnings = []
        
    def test_backend_health(self):
        """Test endpoint de salud del backend"""
        print("\n🔍 Testing: Backend Health Check")
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=15)
            result = {
                'status': response.status_code,
                'timestamp': datetime.now().isoformat(),
                'response': response.json() if response.status_code == 200 else response.text[:200]
            }
            self.results['backend_health'] = result
            
            if response.status_code == 200:
                print(f"   ✅ Backend Health: HEALTHY ({response.status_code})")
                return True
            else:
                print(f"   ❌ Backend Health: UNHEALTHY ({response.status_code})")
                self.errors.append(f"Backend health returned {response.status_code}")
                return False
        except requests.exceptions.Timeout:
            print("   ⚠️  Backend Health: TIMEOUT (posiblemente en sleep)")
            self.warnings.append("Backend health check timed out")
            self.results['backend_health'] = {'error': 'Timeout - Backend may be sleeping'}
            return False
        except Exception as e:
            print(f"   ❌ Backend Health: ERROR ({str(e)})")
            self.errors.append(f"Backend health error: {str(e)}")
            self.results['backend_health'] = {'error': str(e)}
            return False
    
    def test_properties_endpoint(self):
        """Test endpoint de propiedades"""
        print("\n🔍 Testing: Properties Endpoint")
        try:
            response = requests.get(
                f"{self.base_url}/api/properties?operation=compra&limit=5", 
                timeout=15
            )
            result = {
                'status': response.status_code,
                'timestamp': datetime.now().isoformat(),
            }
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    result['response'] = {
                        'success': data.get('success', False),
                        'count': data.get('count', len(data.get('properties', []))),
                        'total': data.get('total', 0)
                    }
                    print(f"   ✅ Properties Endpoint: SUCCESS ({response.status_code})")
                    print(f"      Properties found: {result['response']['count']}")
                except:
                    result['response'] = response.text[:200]
            else:
                result['response'] = response.text[:200]
                print(f"   ❌ Properties Endpoint: FAILED ({response.status_code})")
                self.errors.append(f"Properties endpoint returned {response.status_code}")
            
            self.results['properties_endpoint'] = result
            return response.status_code == 200
            
        except requests.exceptions.Timeout:
            print("   ⚠️  Properties Endpoint: TIMEOUT")
            self.warnings.append("Properties endpoint timed out")
            self.results['properties_endpoint'] = {'error': 'Timeout'}
            return False
        except Exception as e:
            print(f"   ❌ Properties Endpoint: ERROR ({str(e)})")
            self.errors.append(f"Properties endpoint error: {str(e)}")
            self.results['properties_endpoint'] = {'error': str(e)}
            return False
    
    def test_avm_endpoint(self):
        """Test endpoint AVM"""
        print("\n🔍 Testing: AVM Valuation Endpoint")
        try:
            test_data = {
                "area": 120,
                "bedrooms": 3,
                "bathrooms": 2,
                "year_built": 2015,
                "lot_size": 200,
                "has_pool": True,
                "has_garage": True,
                "is_luxury": False,
                "latitude": 18.4861,
                "longitude": -69.9312
            }
            response = requests.post(
                f"{self.base_url}/api/valuation/avm",
                json=test_data,
                timeout=15,
                headers={'Content-Type': 'application/json'}
            )
            result = {
                'status': response.status_code,
                'timestamp': datetime.now().isoformat(),
            }
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    result['response'] = {
                        'success': data.get('success', False),
                        'has_valuation': 'valuation' in data
                    }
                    print(f"   ✅ AVM Endpoint: SUCCESS ({response.status_code})")
                except:
                    result['response'] = response.text[:200]
            elif response.status_code == 503:
                print(f"   ⚠️  AVM Endpoint: NOT AVAILABLE ({response.status_code})")
                self.warnings.append("AVM endpoint not available (503)")
            else:
                result['response'] = response.text[:200]
                print(f"   ❌ AVM Endpoint: FAILED ({response.status_code})")
                self.errors.append(f"AVM endpoint returned {response.status_code}")
            
            self.results['avm_endpoint'] = result
            return response.status_code == 200
            
        except requests.exceptions.Timeout:
            print("   ⚠️  AVM Endpoint: TIMEOUT")
            self.warnings.append("AVM endpoint timed out")
            self.results['avm_endpoint'] = {'error': 'Timeout'}
            return False
        except Exception as e:
            print(f"   ❌ AVM Endpoint: ERROR ({str(e)})")
            self.errors.append(f"AVM endpoint error: {str(e)}")
            self.results['avm_endpoint'] = {'error': str(e)}
            return False
    
    def test_frontend_access(self):
        """Test acceso al frontend"""
        print("\n🔍 Testing: Frontend Access")
        try:
            response = requests.get(self.frontend_url, timeout=10, allow_redirects=True)
            result = {
                'status': response.status_code,
                'url': response.url,
                'timestamp': datetime.now().isoformat()
            }
            self.results['frontend_access'] = result
            
            if response.status_code == 200:
                print(f"   ✅ Frontend Access: SUCCESS ({response.status_code})")
                return True
            else:
                print(f"   ⚠️  Frontend Access: UNEXPECTED ({response.status_code})")
                self.warnings.append(f"Frontend returned {response.status_code}")
                return False
        except Exception as e:
            print(f"   ❌ Frontend Access: ERROR ({str(e)})")
            self.errors.append(f"Frontend access error: {str(e)}")
            self.results['frontend_access'] = {'error': str(e)}
            return False
    
    def test_auth_endpoint(self):
        """Test endpoint de autenticación"""
        print("\n🔍 Testing: Auth Endpoint")
        try:
            # Test health check de auth si existe, sino skip
            response = requests.get(
                f"{self.base_url}/api/auth/health",
                timeout=10
            )
            result = {
                'status': response.status_code,
                'timestamp': datetime.now().isoformat()
            }
            self.results['auth_endpoint'] = result
            
            if response.status_code in [200, 404]:
                print(f"   ✅ Auth Endpoint: ACCESSIBLE ({response.status_code})")
                return True
            else:
                print(f"   ⚠️  Auth Endpoint: {response.status_code}")
                return True  # No crítico
        except Exception as e:
            # No crítico si falla
            print(f"   ℹ️  Auth Endpoint: Not available")
            self.results['auth_endpoint'] = {'note': 'Endpoint not required'}
            return True
    
    def run_full_test(self):
        """Ejecutar todos los tests"""
        print("\n" + "="*60)
        print("🚀 DIAGNÓSTICO COMPLETO HABITATPRO")
        print("="*60)
        print(f"Backend URL: {self.base_url}")
        print(f"Frontend URL: {self.frontend_url}")
        print("="*60)
        
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Properties Endpoint", self.test_properties_endpoint),
            ("AVM Endpoint", self.test_avm_endpoint),
            ("Frontend Access", self.test_frontend_access),
            ("Auth Endpoint", self.test_auth_endpoint)
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            try:
                success = test_func()
                if success:
                    passed += 1
                else:
                    failed += 1
                time.sleep(1)  # Pausa entre tests
            except Exception as e:
                print(f"   ❌ Error ejecutando {test_name}: {str(e)}")
                failed += 1
        
        # Generar reporte
        self.generate_report(passed, failed)
    
    def generate_report(self, passed, total):
        """Generar reporte detallado"""
        print("\n" + "="*60)
        print("📊 REPORTE DE DIAGNÓSTICO HABITATPRO")
        print("="*60)
        
        print(f"\n🎯 RESUMEN:")
        print(f"   ✅ Tests exitosos: {passed}")
        print(f"   ❌ Tests fallidos: {total - passed}")
        print(f"   ⚠️  Advertencias: {len(self.warnings)}")
        print(f"   ❌ Errores críticos: {len(self.errors)}")
        
        if self.errors:
            print(f"\n❌ ERRORES CRÍTICOS:")
            for error in self.errors:
                print(f"   • {error}")
        
        if self.warnings:
            print(f"\n⚠️  ADVERTENCIAS:")
            for warning in self.warnings:
                print(f"   • {warning}")
        
        print(f"\n📋 DETALLES COMPLETOS:")
        for test_name, result in self.results.items():
            print(f"\n🔧 {test_name.upper().replace('_', ' ')}:")
            print(json.dumps(result, indent=2, default=str))
        
        print("\n" + "="*60)
        
        if passed == total and not self.errors:
            print("✅ ¡HABITATPRO ESTÁ OPERATIVO AL 100%!")
            return 0
        elif self.errors:
            print("❌ SE REQUIEREN AJUSTES INMEDIATOS")
            print("\n🔧 ACCIONES RECOMENDADAS:")
            print("1. Verificar variables de entorno en Render")
            print("2. Revisar logs del backend en Render dashboard")
            print("3. Verificar conexión a base de datos")
            print("4. Forzar redeploy si es necesario")
            return 1
        else:
            print("⚠️  ALGUNAS FUNCIONALIDADES NECESITAN ATENCIÓN")
            return 2

if __name__ == "__main__":
    tester = HabitatProTester()
    exit_code = tester.run_full_test()
    sys.exit(exit_code)

