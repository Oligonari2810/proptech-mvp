#!/usr/bin/env python3
"""
Health Check de APIs Externas
Verifica que todas las APIs críticas estén operativas antes del lanzamiento
"""

import os
import sys
import requests
import json
from datetime import datetime
from typing import Dict, List, Any

# Configuración de APIs
API_ENDPOINTS = [
    {
        'name': 'Backend Health Check',
        'url': os.getenv('BACKEND_URL', 'http://localhost:5000') + '/api/health',
        'method': 'GET',
        'required': True
    },
    {
        'name': 'Emotional Valuation API',
        'url': os.getenv('BACKEND_URL', 'http://localhost:5000') + '/api/ai/valuation/emotional',
        'method': 'POST',
        'required': True,
        'body': {
            'area': 100,
            'bedrooms': 3,
            'bathrooms': 2,
            'location': 'Santo Domingo',
            'propertyType': 'apartment',
            'zone': 'premium',
            'condition': 'good',
            'year': 2020,
            'hasPool': False,
            'hasParking': True,
            'proximityBeach': 5,
            'proximitySchools': 1
        }
    },
    {
        'name': 'Emotional Factors API',
        'url': os.getenv('BACKEND_URL', 'http://localhost:5000') + '/api/ai/emotional/factors',
        'method': 'POST',
        'required': True,
        'body': {
            'location': 'Santo Domingo',
            'zone': 'premium',
            'property_type': 'apartment',
            'features': ['gym', 'pool']
        }
    },
    {
        'name': 'AI Health Check',
        'url': os.getenv('BACKEND_URL', 'http://localhost:5000') + '/api/ai/health',
        'method': 'GET',
        'required': True
    }
]

# APIs externas (opcionales si están configuradas)
EXTERNAL_APIS = []
google_maps_key = os.getenv('GOOGLE_MAPS_API_KEY', '')
openweather_key = os.getenv('OPENWEATHER_API_KEY', '')

if google_maps_key:
    EXTERNAL_APIS.append({
        'name': 'Google Maps Places API',
        'url': f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.4861,-69.9312&radius=1000&type=park&key={google_maps_key}',
        'method': 'GET',
        'required': False  # Opcional para lanzamiento
    })

if openweather_key:
    EXTERNAL_APIS.append({
        'name': 'OpenWeather Air Quality API',
        'url': f'http://api.openweathermap.org/data/2.5/air_pollution?lat=18.4861&lon=-69.9312&appid={openweather_key}',
        'method': 'GET',
        'required': False  # Opcional para lanzamiento
    })

def check_api_health(endpoint: Dict[str, Any]) -> Dict[str, Any]:
    """Verifica el estado de una API"""
    try:
        start_time = datetime.now()
        
        if endpoint['method'] == 'GET':
            response = requests.get(endpoint['url'], timeout=10)
        else:
            response = requests.post(
                endpoint['url'],
                json=endpoint.get('body', {}),
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
        
        response_time = (datetime.now() - start_time).total_seconds() * 1000  # ms
        
        return {
            'name': endpoint['name'],
            'status': '✅ HEALTHY',
            'statusCode': response.status_code,
            'responseTime': f'{response_time:.0f}ms',
            'required': endpoint.get('required', False),
            'success': response.status_code < 400
        }
    except requests.exceptions.Timeout:
        return {
            'name': endpoint['name'],
            'status': '❌ TIMEOUT',
            'error': 'Request timeout (>10s)',
            'required': endpoint.get('required', False),
            'success': False
        }
    except requests.exceptions.ConnectionError:
        return {
            'name': endpoint['name'],
            'status': '❌ CONNECTION ERROR',
            'error': 'No se pudo conectar al servidor',
            'required': endpoint.get('required', False),
            'success': False
        }
    except Exception as e:
        return {
            'name': endpoint['name'],
            'status': '❌ ERROR',
            'error': str(e),
            'required': endpoint.get('required', False),
            'success': False
        }

def check_all_apis():
    """Verifica todas las APIs"""
    print('🏥 INICIANDO HEALTH CHECK DE APIS\n')
    print('=' * 60)
    
    all_results = []
    
    # Verificar APIs internas (críticas)
    print('\n📡 VERIFICANDO APIS INTERNAS (CRÍTICAS):')
    print('-' * 60)
    
    for endpoint in API_ENDPOINTS:
        result = check_api_health(endpoint)
        all_results.append(result)
        
        status_icon = result['status']
        response_info = f" ({result.get('responseTime', '')})" if result.get('responseTime') else ''
        print(f'{status_icon} {result["name"]}{response_info}')
        
        if not result.get('success') and result.get('required'):
            print(f'   ⚠️  ERROR: {result.get("error", "Unknown error")}')
    
    # Verificar APIs externas (opcionales)
    if EXTERNAL_APIS:
        print('\n📡 VERIFICANDO APIS EXTERNAS (OPCIONALES):')
        print('-' * 60)
        
        for endpoint in EXTERNAL_APIS:
            result = check_api_health(endpoint)
            all_results.append(result)
            
            status_icon = result['status']
            response_info = f" ({result.get('responseTime', '')})" if result.get('responseTime') else ''
            print(f'{status_icon} {result["name"]}{response_info}')
    
    # Análisis de resultados
    print('\n' + '=' * 60)
    print('📊 RESUMEN HEALTH CHECK:')
    print('=' * 60)
    
    healthy_apis = [r for r in all_results if r.get('success', False)]
    unhealthy_critical = [r for r in all_results if not r.get('success', False) and r.get('required', False)]
    unhealthy_optional = [r for r in all_results if not r.get('success', False) and not r.get('required', False)]
    
    print(f'\n✅ APIs Saludables: {len(healthy_apis)}/{len(all_results)}')
    print(f'❌ APIs Críticas Falladas: {len(unhealthy_critical)}')
    print(f'⚠️  APIs Opcionales Falladas: {len(unhealthy_optional)}')
    
    # Mostrar APIs críticas falladas
    if unhealthy_critical:
        print('\n🚨 APIS CRÍTICAS NO DISPONIBLES:')
        print('-' * 60)
        for api in unhealthy_critical:
            print(f'   ❌ {api["name"]}: {api.get("error", "Unknown error")}')
    
    # Mostrar APIs opcionales falladas
    if unhealthy_optional:
        print('\n⚠️  APIS OPCIONALES NO DISPONIBLES (no bloquean lanzamiento):')
        print('-' * 60)
        for api in unhealthy_optional:
            print(f'   ⚠️  {api["name"]}: {api.get("error", "Unknown error")}')
    
    # Resultado final
    print('\n' + '=' * 60)
    if len(unhealthy_critical) == 0:
        print('🎉 ¡TODAS LAS APIS CRÍTICAS ESTÁN OPERATIVAS!')
        print('✅ Sistema listo para lanzamiento')
        return True
    else:
        print(f'⚠️  {len(unhealthy_critical)} API(s) CRÍTICA(S) NO ESTÁN DISPONIBLES')
        print('❌ Revisar antes de lanzamiento')
        return False

if __name__ == '__main__':
    try:
        is_healthy = check_all_apis()
        sys.exit(0 if is_healthy else 1)
    except KeyboardInterrupt:
        print('\n\n⚠️  Health check interrumpido por el usuario')
        sys.exit(1)
    except Exception as e:
        print(f'\n❌ Error crítico en health check: {e}')
        sys.exit(1)

