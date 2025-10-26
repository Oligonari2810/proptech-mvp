from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

broker_bp = Blueprint('broker', __name__)

@broker_bp.route('/api/broker/metrics', methods=['GET'])
def get_broker_metrics():
    """Obtener métricas del broker"""
    try:
        # Simular métricas del broker
        metrics = {
            "total_properties": random.randint(8, 25),
            "active_leads": random.randint(5, 15),
            "monthly_commission": random.randint(3000, 8000),
            "conversion_rate": round(random.uniform(12.0, 25.0), 1),
            "properties_sold_this_month": random.randint(2, 8),
            "avg_days_on_market": random.randint(15, 45),
            "client_satisfaction": round(random.uniform(4.2, 5.0), 1),
            "last_updated": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@broker_bp.route('/api/broker/leads', methods=['GET'])
def get_recent_leads():
    """Obtener leads recientes"""
    try:
        limit = request.args.get('limit', 5, type=int)
        
        # Simular leads
        leads = []
        names = ["María González", "Carlos Ruiz", "Ana Martín", "David López", "Laura Sánchez", 
                "Jorge Pérez", "Carmen García", "Miguel Torres", "Isabel Moreno", "Antonio Jiménez"]
        
        for i in range(min(limit, 10)):
            lead = {
                "id": i + 1,
                "name": random.choice(names),
                "email": f"lead{i+1}@email.com",
                "phone": f"+34 600 {random.randint(100, 999)} {random.randint(100, 999)}",
                "property_interest": random.choice([
                    "Apartamento 3 hab", "Casa con jardín", "Piso en centro", 
                    "Chalet con piscina", "Ático de lujo", "Estudio moderno"
                ]),
                "status": random.choice(["nuevo", "en_proceso", "calificado", "negociación"]),
                "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
                "budget": random.randint(200000, 800000),
                "source": random.choice(["web", "referido", "redes_sociales", "publicidad"])
            }
            leads.append(lead)
        
        return jsonify({
            "success": True,
            "leads": leads,
            "total": len(leads)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@broker_bp.route('/api/broker/properties', methods=['GET'])
def get_broker_properties():
    """Obtener propiedades del broker"""
    try:
        # Simular propiedades
        properties = []
        locations = ["Madrid Centro", "Barcelona Eixample", "Valencia Centro", "Sevilla Triana", "Bilbao Abando"]
        
        for i in range(12):
            property_data = {
                "id": i + 1,
                "title": f"Propiedad {i+1}",
                "location": random.choice(locations),
                "price": random.randint(150000, 600000),
                "bedrooms": random.randint(1, 4),
                "bathrooms": random.randint(1, 3),
                "type": random.choice(["Apartamento", "Casa", "Piso", "Ático"]),
                "status": random.choice(["disponible", "reservada", "vendida"]),
                "days_on_market": random.randint(1, 90),
                "views": random.randint(50, 500),
                "image_url": f"https://res.cloudinary.com/demo/image/upload/v1/property_{i+1}.jpg"
            }
            properties.append(property_data)
        
        return jsonify({
            "success": True,
            "properties": properties,
            "total": len(properties)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
