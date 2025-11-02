#!/usr/bin/env python3
"""
🔧 REPARACIÓN AUTOMÁTICA HABITATPRO
Script para diagnosticar y sugerir soluciones
"""
import requests
import os
import json
from datetime import datetime

class HabitatProFixer:
    def __init__(self):
        self.backend_url = "https://proptech-mvp-1.onrender.com"
        self.frontend_url = "https://habitatprord.com"
        self.fixes_applied = []
        self.suggestions = []
        
    def warm_up_backend(self):
        """Hacer warm-up del backend para evitar sleep"""
        print("\n🔧 Warm-up Backend Service")
        try:
            for i in range(3):
                print(f"   Warm-up request {i+1}/3...")
                response = requests.get(f"{self.backend_url}/api/health", timeout=10)
                print(f"      Response: {response.status_code}")
                if response.status_code == 200:
                    self.fixes_applied.append("Backend warm-up successful")
                    return True
            print("   ⚠️  Backend warm-up incomplete")
            return False
        except Exception as e:
            print(f"   ❌ Warm-up failed: {str(e)}")
            self.suggestions.append("Backend may be sleeping - force redeploy in Render")
            return False
    
    def check_environment_variables(self):
        """Verificar variables de entorno sugeridas"""
        print("\n🔧 Checking Environment Variables")
        
        required_vars = {
            'MAPBOX_ACCESS_TOKEN': {
                'description': 'Token de Mapbox para mapas',
                'check': lambda x: x.startswith('pk.'),
                'example': 'pk.eyJ1Ijoi...'
            },
            'DATABASE_URL': {
                'description': 'URL de conexión PostgreSQL',
                'check': lambda x: 'postgresql://' in x or 'postgres://' in x,
                'example': 'postgresql://user:pass@host:5432/db'
            },
            'SECRET_KEY': {
                'description': 'Secret key para JWT',
                'check': lambda x: len(x) >= 32,
                'example': 'your-secret-key-here'
            }
        }
        
        print("   Variables requeridas en Render:")
        for var_name, var_info in required_vars.items():
            print(f"   • {var_name}: {var_info['description']}")
            print(f"     Example: {var_info['example'][:30]}...")
    
    def generate_fix_report(self):
        """Generar reporte de soluciones"""
        print("\n" + "="*60)
        print("🔧 ACCIONES RECOMENDADAS")
        print("="*60)
        
        print("\n1. BACKEND (Render):")
        print("   ✅ Verificar que el servicio esté activo")
        print("   ✅ Revisar logs para errores específicos")
        print("   ✅ Forzar redeploy desde Render dashboard")
        print("   ✅ Verificar variables de entorno:")
        print("      - DATABASE_URL")
        print("      - SECRET_KEY")
        print("      - FLASK_ENV")
        
        print("\n2. FRONTEND (Vercel):")
        print("   ✅ Verificar variables de entorno:")
        print("      - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN")
        print("      - NEXT_PUBLIC_BACKEND_URL")
        print("   ✅ Actualizar CSP en next.config.js")
        print("   ✅ Forzar redeploy si es necesario")
        
        print("\n3. MAPBOX:")
        print("   ✅ Verificar token en Mapbox dashboard")
        print("   ✅ Asegurar que token tenga permisos correctos")
        print("   ✅ Verificar límites de uso")
        
        print("\n4. BASE DE DATOS:")
        print("   ✅ Verificar conexión PostgreSQL")
        print("   ✅ Revisar logs de conexión")
        print("   ✅ Verificar que columnas existan")
        
        if self.suggestions:
            print("\n⚠️  SUGERENCIAS ESPECÍFICAS:")
            for suggestion in self.suggestions:
                print(f"   • {suggestion}")
        
        print("\n" + "="*60)
    
    def check_backend_status(self):
        """Verificar estado actual del backend"""
        print("\n🔧 Checking Backend Status")
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=15)
            if response.status_code == 200:
                print("   ✅ Backend is responding")
                data = response.json()
                print(f"   Status: {data.get('status', 'unknown')}")
                return True
            else:
                print(f"   ❌ Backend returned {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.suggestions.append("Backend may need redeploy")
                return False
        except requests.exceptions.Timeout:
            print("   ⚠️  Backend timeout (may be sleeping)")
            self.suggestions.append("Backend is sleeping - first request will take time")
            return False
        except Exception as e:
            print(f"   ❌ Backend error: {str(e)}")
            self.suggestions.append(f"Backend connection failed: {str(e)}")
            return False
    
    def run_diagnosis(self):
        """Ejecutar diagnóstico completo"""
        print("\n" + "="*60)
        print("🔧 DIAGNÓSTICO Y REPARACIÓN HABITATPRO")
        print("="*60)
        
        # Verificar estado
        self.check_backend_status()
        
        # Warm-up
        self.warm_up_backend()
        
        # Variables de entorno
        self.check_environment_variables()
        
        # Reporte
        self.generate_fix_report()

if __name__ == "__main__":
    fixer = HabitatProFixer()
    fixer.run_diagnosis()

