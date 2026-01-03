#!/usr/bin/env python3
"""
🔍 POST-DEPLOYMENT MONITORING
Monitorea salud del sistema post-deployment
"""
import time
import requests
import json
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PostDeployMonitor:
    def __init__(self):
        self.frontend_url = "https://habitatprord.com"
        self.backend_url = "https://proptech-mvp-1.onrender.com"
        self.monitoring_data = []
        
    def check_frontend(self):
        """Verificar frontend"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            status = "HEALTHY" if response.status_code == 200 else f"UNHEALTHY ({response.status_code})"
            logger.info(f"Frontend: {status}")
            return status
        except Exception as e:
            status = f"ERROR: {str(e)}"
            logger.error(f"Frontend: {status}")
            return status
    
    def check_backend(self):
        """Verificar backend health"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            status = "HEALTHY" if response.status_code == 200 else f"UNHEALTHY ({response.status_code})"
            logger.info(f"Backend: {status}")
            return status
        except Exception as e:
            status = f"ERROR: {str(e)}"
            logger.error(f"Backend: {status}")
            return status
    
    def check_api_endpoints(self):
        """Verificar endpoints críticos"""
        endpoints = {
            'properties': '/api/properties?is_active=true&limit=5',
            'auth': '/api/auth/health'
        }
        
        results = {}
        for name, endpoint in endpoints.items():
            try:
                response = requests.get(f"{self.backend_url}{endpoint}", timeout=10)
                results[name] = "HEALTHY" if response.status_code == 200 else f"UNHEALTHY ({response.status_code})"
            except Exception as e:
                results[name] = f"ERROR: {str(e)}"
        
        return results
    
    def monitor_health(self, duration_minutes=60, check_interval=120):
        """Monitorear salud por tiempo determinado"""
        print("\n" + "="*60)
        print("🔍 STARTING POST-DEPLOYMENT MONITORING")
        print("="*60)
        print(f"Duration: {duration_minutes} minutes")
        print(f"Check interval: {check_interval} seconds")
        print("="*60 + "\n")
        
        start_time = datetime.now()
        checks_completed = 0
        total_checks = (duration_minutes * 60) // check_interval
        
        while (datetime.now() - start_time).total_seconds() < duration_minutes * 60:
            check_result = {
                'timestamp': datetime.now().isoformat(),
                'frontend_status': self.check_frontend(),
                'backend_status': self.check_backend(),
                'api_endpoints_health': self.check_api_endpoints()
            }
            
            self.monitoring_data.append(check_result)
            checks_completed += 1
            
            print(f"✅ Check {checks_completed}/{total_checks}: ", end="")
            print(f"Frontend: {check_result['frontend_status']}, ", end="")
            print(f"Backend: {check_result['backend_status']}")
            
            # Esperar antes del próximo check
            if checks_completed < total_checks:
                print(f"⏳ Waiting {check_interval} seconds until next check...\n")
                time.sleep(check_interval)
        
        self.generate_monitoring_report()
    
    def quick_check(self):
        """Verificación rápida (una vez)"""
        print("\n" + "="*60)
        print("🔍 QUICK POST-DEPLOYMENT CHECK")
        print("="*60 + "\n")
        
        frontend = self.check_frontend()
        backend = self.check_backend()
        apis = self.check_api_endpoints()
        
        print("\n" + "="*60)
        print("📊 QUICK CHECK RESULTS")
        print("="*60)
        print(f"Frontend: {frontend}")
        print(f"Backend: {backend}")
        print("API Endpoints:")
        for name, status in apis.items():
            print(f"  - {name}: {status}")
        print("="*60 + "\n")
        
        # Determinar si todo está saludable
        all_healthy = (
            "HEALTHY" in frontend and 
            "HEALTHY" in backend and
            all("HEALTHY" in status for status in apis.values())
        )
        
        if all_healthy:
            print("✅ All systems are HEALTHY!")
        else:
            print("⚠️  Some systems need attention")
        
        return {
            'frontend': frontend,
            'backend': backend,
            'apis': apis,
            'all_healthy': all_healthy
        }
    
    def calculate_uptime(self, status_key):
        """Calcular uptime porcentual"""
        if not self.monitoring_data:
            return 0
        
        healthy_count = sum(1 for check in self.monitoring_data if "HEALTHY" in str(check.get(status_key, "")))
        total_count = len(self.monitoring_data)
        
        return round((healthy_count / total_count) * 100, 2) if total_count > 0 else 0
    
    def generate_monitoring_report(self):
        """Generar reporte de monitoreo"""
        if not self.monitoring_data:
            print("⚠️  No monitoring data collected")
            return
        
        report = {
            'monitoring_period': f"{len(self.monitoring_data)} checks",
            'frontend_uptime': f"{self.calculate_uptime('frontend_status')}%",
            'backend_uptime': f"{self.calculate_uptime('backend_status')}%",
            'checks': self.monitoring_data
        }
        
        print("\n" + "="*60)
        print("📊 POST-DEPLOYMENT MONITORING REPORT")
        print("="*60)
        print(f"Checks completed: {len(self.monitoring_data)}")
        print(f"Frontend Uptime: {report['frontend_uptime']}")
        print(f"Backend Uptime: {report['backend_uptime']}")
        print("="*60 + "\n")
        
        # Guardar reporte
        with open('post_deploy_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print("💾 Report saved to post_deploy_report.json")

if __name__ == "__main__":
    import sys
    
    monitor = PostDeployMonitor()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--quick':
        # Verificación rápida
        monitor.quick_check()
    else:
        # Monitoreo completo
        duration = int(sys.argv[1]) if len(sys.argv) > 1 else 60
        monitor.monitor_health(duration)

