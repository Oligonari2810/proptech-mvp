"""
Configuración Swagger/OpenAPI para HabitatPro API
"""

from flasgger import Swagger
from flask import Flask

def init_swagger(app: Flask):
    """Inicializar Swagger para documentación API"""
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/docs"
    }
    
    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "HabitatPro API",
            "description": "API Documentation para HabitatPro - Plataforma Inmobiliaria con IA",
            "version": "2.0.0",
            "contact": {
                "name": "HabitatPro Support",
                "email": "support@habitatpro.com"
            }
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT token. Ejemplo: Bearer <token>"
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    }
    
    Swagger(app, config=swagger_config, template=swagger_template)

