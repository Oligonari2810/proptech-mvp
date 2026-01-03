from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from models import db, Valuation
import sys
import os
import logging

# Agregar ruta para importar AVM
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
try:
    from avm.property_valuation import PropertyValuationModel
    AVM_AVAILABLE = True
    avm_model = PropertyValuationModel()
except ImportError as e:
    AVM_AVAILABLE = False
    logging.warning(f"AVM model not available: {e}")

logger = logging.getLogger('habitatpro')

valuation_bp = Blueprint("valuation", __name__, url_prefix="/api/valuation")

# Simulación de datos de propiedades
np.random.seed(42)
df = pd.DataFrame({
    'metros_cuadrados': np.random.randint(50, 500, 500),
    'habitaciones': np.random.randint(1, 6, 500),
    'banos': np.random.randint(1, 4, 500),
    'antiguedad': np.random.randint(0, 50, 500),
    'precio_zona': np.random.randint(1000, 5000, 500),
    'infraestructura': np.random.randint(0, 10, 500),
    'seguridad': np.random.randint(1, 5, 500),
    'tendencia_mercado': np.random.uniform(-0.05, 0.05, 500),
    'anios_futuro': np.random.randint(1, 10, 500)
})

df['precio_actual'] = df['metros_cuadrados'] * df['precio_zona'] * (1 - df['antiguedad'] * 0.005)
df['precio_futuro'] = df['precio_actual'] * (1 + (df['tendencia_mercado'] * df['anios_futuro']))

# Preparar datos
X = df.drop(columns=['precio_futuro', 'precio_actual'])  # Excluir `precio_actual`
y = df['precio_futuro']

# Normalización
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Modelos de IA
modelo_tasacion = RandomForestRegressor(n_estimators=100, random_state=42)
modelo_tasacion.fit(X_scaled, y)

modelo_plusvalia = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, random_state=42)
modelo_plusvalia.fit(X_scaled, y)

@valuation_bp.route("/avm", methods=["POST"])
def avm_valuation():
    """Valoración automatizada usando modelo AVM"""
    if not AVM_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'AVM model not available'
        }), 503
        
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Datos de propiedad requeridos'
            }), 400
        
        # Obtener valoración del modelo AVM
        valuation = avm_model.predict_valuation(data)
        
        if not valuation:
            return jsonify({
                'success': False,
                'error': 'No se pudo calcular la valoración'
            }), 400
        
        # Obtener explicación de factores
        factors = avm_model.get_valuation_factors(data)
        
        return jsonify({
            'success': True,
            'valuation': valuation,
            'factors_explanation': factors,
            'disclaimer': 'Esta es una estimación automatizada. Consulte con un profesional para valoración oficial.'
        }), 200
        
    except Exception as e:
        logger.error(f"AVM Valuation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500

@valuation_bp.route("", methods=["POST"])
def create_valuation():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos insuficientes"}), 400

    try:
        column_names = ["metros_cuadrados", "habitaciones", "banos", "antiguedad",
                        "precio_zona", "infraestructura", "seguridad", "tendencia_mercado", "anios_futuro"]
        
        df_input = pd.DataFrame([[
            data.get("metros_cuadrados", 0), data.get("habitaciones", 0), data.get("banos", 0),
            data.get("antiguedad", 0), data.get("precio_zona", 0), data.get("infraestructura", 0),
            data.get("seguridad", 0), data.get("tendencia_mercado", 0), data.get("anios_futuro", 0)
        ]], columns=column_names)
        
        datos_scaled = scaler.transform(df_input)
        valor_estimado = float(modelo_tasacion.predict(datos_scaled)[0])  # Convertir a float
        valor_futuro = float(modelo_plusvalia.predict(datos_scaled)[0])  # Convertir a float

        new_valuation = Valuation(
            property_id=data.get("property_id", None),
            estimated_value=valor_estimado
        )
        db.session.add(new_valuation)
        db.session.commit()

        return jsonify({"valor_estimado": valor_estimado, "valor_futuro": valor_futuro, "message": "Tasación creada exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500