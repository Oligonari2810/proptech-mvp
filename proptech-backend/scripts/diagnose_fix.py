#!/usr/bin/env python3
"""
🔍 BACKEND DIAGNÓSTICO Y REPARACIÓN AUTOMÁTICA
Diagnostica problemas del backend y genera plan de reparación
"""
import requests
import logging
import os
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BackendDiagnosis:
    def __init__(self):
        self.backend_url = os.getenv("BACKEND_URL", "https://proptech-mvp-1.onrender.com")
        self.problems = []
        self.warnings = []
        
    def check_health(self):
        """Verificar health check del backend"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            if response.status_code == 200:
                logger.info("✅ Health check PASSED")
                return "✅ Health check PASSED"
            else:
                self.problems.append(f"Health check failed: {response.status_code}")
                logger.error(f"❌ Health check FAILED: {response.status_code}")
                return f"❌ Health check FAILED: {response.status_code}"
        except Exception as e:
            self.problems.append(f"Health check error: {str(e)}")
            logger.error(f"❌ Health check ERROR: {str(e)}")
            return f"❌ Health check ERROR: {str(e)}"
    
    def check_properties_endpoint(self):
        """Verificar endpoint de propiedades"""
        try:
            response = requests.get(f"{self.backend_url}/api/properties?is_active=true&limit=5", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'properties' in data:
                    count = len(data.get('properties', []))
                    logger.info(f"✅ Properties endpoint PASSED ({count} properties)")
                    return f"✅ Properties endpoint PASSED ({count} properties)"
                else:
                    self.warnings.append("Properties endpoint returns unexpected format")
                    logger.warning("⚠️ Properties endpoint returns unexpected format")
                    return "⚠️ Properties endpoint: unexpected format"
            else:
                error_detail = response.text[:200] if response.content else "No error details"
                self.problems.append(f"Properties endpoint {response.status_code}: {error_detail}")
                logger.error(f"❌ Properties endpoint FAILED: {response.status_code}")
                return f"❌ Properties endpoint FAILED: {response.status_code}"
        except Exception as e:
            self.problems.append(f"Properties endpoint error: {str(e)}")
            logger.error(f"❌ Properties endpoint ERROR: {str(e)}")
            return f"❌ Properties endpoint ERROR: {str(e)}"
    
    def check_auth_endpoint(self):
        """Verificar endpoint de autenticación"""
        try:
            response = requests.get(f"{self.backend_url}/api/auth/health", timeout=10)
            if response.status_code in [200, 404]:  # 404 es aceptable si no existe health específico
                logger.info("✅ Auth endpoint accessible")
                return "✅ Auth endpoint accessible"
            else:
                self.warnings.append(f"Auth endpoint returned {response.status_code}")
                return f"⚠️ Auth endpoint: {response.status_code}"
        except Exception as e:
            self.warnings.append(f"Auth endpoint error: {str(e)}")
            return f"⚠️ Auth endpoint error: {str(e)}"
    
    def generate_fix_plan(self):
        """Generar plan de reparación basado en problemas encontrados"""
        fix_plan = []
        
        if any("Properties endpoint" in str(p) for p in self.problems):
            fix_plan.extend([
                "1. Verificar conexión PostgreSQL en producción",
                "2. Revisar serialización de modelos Property en routes/properties.py",
                "3. Verificar environment variables DATABASE_URL en Render",
                "4. Revisar logs de aplicación en Render dashboard",
                "5. Verificar CORS configuration en app.py",
                "6. Revisar manejo de errores en get_properties endpoint"
            ])
        
        if any("Health check" in str(p) for p in self.problems):
            fix_plan.extend([
                "1. Verificar que el backend esté desplegado y activo",
                "2. Revisar logs en Render para errores de inicio",
                "3. Verificar variables de entorno críticas",
                "4. Revisar Procfile y start command"
            ])
        
        return fix_plan if fix_plan else ["✅ No fixes needed - Backend is healthy!"]

    def run_full_diagnosis(self):
        """Ejecutar diagnóstico completo"""
        print("\n" + "="*60)
        print("🔍 RUNNING BACKEND DIAGNOSIS")
        print("="*60 + "\n")
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'health_check': self.check_health(),
            'properties_endpoint': self.check_properties_endpoint(),
            'auth_endpoint': self.check_auth_endpoint(),
            'problems': self.problems,
            'warnings': self.warnings
        }
        
        print("\n" + "="*60)
        print("📊 DIAGNOSIS SUMMARY")
        print("="*60)
        
        if self.problems:
            print("\n🚨 PROBLEMAS IDENTIFICADOS:")
            for problem in self.problems:
                print(f"   • {problem}")
        
        if self.warnings:
            print("\n⚠️ ADVERTENCIAS:")
            for warning in self.warnings:
                print(f"   • {warning}")
        
        if not self.problems and not self.warnings:
            print("\n✅ Backend está funcionando correctamente!")
        else:
            print("\n🔧 PLAN DE REPARACIÓN:")
            for fix in self.generate_fix_plan():
                print(f"   • {fix}")
        
        print("\n" + "="*60 + "\n")
        
        return results

if __name__ == "__main__":
    diagnosis = BackendDiagnosis()
    results = diagnosis.run_full_diagnosis()
    
    # Guardar resultados en archivo
    import json
    with open('diagnosis_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("💾 Results saved to diagnosis_results.json")

