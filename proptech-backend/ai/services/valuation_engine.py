import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import numpy as np
import os
from datetime import datetime

class HabitatEstimateEngine:
    """Motor de valoración avanzado tipo Zillow mejorado"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.features = [
            'square_meters', 'bedrooms', 'bathrooms', 'year_built',
            'location_score', 'amenities_count', 'transport_score',
            'market_trend', 'economic_index'
        ]
        self.model_path = 'habitat_estimate_model.joblib'
        
    def train_model(self, historical_data):
        """Entrena el modelo con datos históricos"""
        try:
            df = pd.DataFrame(historical_data)
            X = df[self.features]
            y = df['actual_price']
            
            # Escalar features
            X_scaled = self.scaler.fit_transform(X)
            
            # Entrenar modelo
            self.model = RandomForestRegressor(
                n_estimators=100, 
                random_state=42,
                max_depth=10,
                min_samples_split=5
            )
            self.model.fit(X_scaled, y)
            
            # Guardar modelo
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'features': self.features,
                'trained_at': datetime.utcnow().isoformat()
            }
            joblib.dump(model_data, self.model_path)
            
            return True
        except Exception as e:
            print(f"Error entrenando modelo: {e}")
            return False
    
    def load_model(self):
        """Cargar modelo entrenado"""
        try:
            if os.path.exists(self.model_path):
                model_data = joblib.load(self.model_path)
                self.model = model_data['model']
                self.scaler = model_data['scaler']
                self.features = model_data['features']
                return True
            else:
                # Crear modelo básico si no existe
                self._create_basic_model()
                return True
        except Exception as e:
            print(f"Error cargando modelo: {e}")
            self._create_basic_model()
            return True
    
    def _create_basic_model(self):
        """Crear modelo básico para demostración"""
        # Datos de ejemplo para entrenamiento básico
        sample_data = {
            'square_meters': [80, 120, 150, 200, 100, 90, 110, 180],
            'bedrooms': [2, 3, 3, 4, 2, 2, 3, 4],
            'bathrooms': [1, 2, 2, 3, 1, 1, 2, 3],
            'year_built': [2010, 2015, 2020, 2018, 2012, 2008, 2016, 2019],
            'location_score': [0.7, 0.8, 0.9, 0.95, 0.6, 0.5, 0.8, 0.9],
            'amenities_count': [3, 5, 7, 8, 2, 1, 4, 6],
            'transport_score': [0.6, 0.8, 0.9, 0.95, 0.5, 0.4, 0.7, 0.8],
            'market_trend': [0.02, 0.03, 0.04, 0.05, 0.01, 0.0, 0.03, 0.04],
            'economic_index': [100, 105, 110, 115, 98, 95, 108, 112],
            'actual_price': [180000, 280000, 350000, 450000, 150000, 120000, 220000, 380000]
        }
        
        df = pd.DataFrame(sample_data)
        X = df[self.features]
        y = df['actual_price']
        
        X_scaled = self.scaler.fit_transform(X)
        self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.model.fit(X_scaled, y)
    
    def predict_value(self, property_data):
        """Predice valor de propiedad con análisis detallado"""
        if not self.model:
            self.load_model()
        
        try:
            # Preparar datos de entrada
            input_data = {}
            for feature in self.features:
                input_data[feature] = property_data.get(feature, 0)
            
            # Calcular amenities_count si no está presente
            if 'amenities_count' not in property_data:
                amenities = ['has_pool', 'has_garden', 'has_garage', 'has_elevator', 'has_basement']
                input_data['amenities_count'] = sum(1 for amenity in amenities if property_data.get(amenity, False))
            
            # Calcular location_score si no está presente
            if 'location_score' not in property_data:
                input_data['location_score'] = self._calculate_location_score(property_data)
            
            # Calcular transport_score si no está presente
            if 'transport_score' not in property_data:
                input_data['transport_score'] = self._calculate_transport_score(property_data)
            
            # Obtener tendencias de mercado
            input_data['market_trend'] = self._get_market_trend()
            input_data['economic_index'] = self._get_economic_index()
            
            # Convertir a array para predicción
            input_array = np.array([[input_data[feature] for feature in self.features]])
            input_scaled = self.scaler.transform(input_array)
            
            # Predecir valor base
            base_price = self.model.predict(input_scaled)[0]
            
            # Ajustar por factores del mercado en tiempo real
            market_adjustment = self._calculate_market_adjustment(property_data)
            final_price = base_price * (1 + market_adjustment)
            
            # Calcular confianza
            confidence = self._calculate_confidence(input_array, property_data)
            
            # Generar explicación
            explanation = self._generate_explanation(property_data, final_price, confidence)
            
            # Encontrar propiedades comparables
            comparables = self._find_comparables(property_data, final_price)
            
            return {
                'estimated_value': round(final_price, 2),
                'confidence_score': round(confidence * 100, 1),
                'market_trend': round(market_adjustment * 100, 2),
                'price_range': {
                    'min': round(final_price * 0.9, 2),
                    'max': round(final_price * 1.1, 2)
                },
                'explanation': explanation,
                'comparable_properties': comparables,
                'valuation_date': datetime.utcnow().isoformat(),
                'method': 'HabitatEstimate AI v2.0'
            }
            
        except Exception as e:
            print(f"Error en predicción: {e}")
            return self._fallback_valuation(property_data)
    
    def _calculate_location_score(self, property_data):
        """Calcula score de ubicación basado en características"""
        score = 0.5  # Base
        
        # Ajustar por tipo de propiedad
        if property_data.get('property_type') == 'luxury':
            score += 0.3
        elif property_data.get('property_type') == 'apartment':
            score += 0.2
        
        # Ajustar por superficie
        sq_meters = property_data.get('square_meters', 0)
        if sq_meters > 150:
            score += 0.2
        elif sq_meters > 100:
            score += 0.1
        
        return min(score, 1.0)
    
    def _calculate_transport_score(self, property_data):
        """Calcula score de transporte"""
        # Simulación basada en características
        score = 0.6  # Base
        
        if property_data.get('has_garage'):
            score += 0.1
        if property_data.get('property_type') == 'apartment':
            score += 0.2
        
        return min(score, 1.0)
    
    def _get_market_trend(self):
        """Obtiene tendencia actual del mercado"""
        # En producción, esto se conectaría con APIs económicas
        return 0.03  # +3% tendencia positiva
    
    def _get_economic_index(self):
        """Obtiene índice económico actual"""
        # En producción, esto se conectaría con datos macroeconómicos
        return 105  # Índice base 100 + 5%
    
    def _calculate_market_adjustment(self, property_data):
        """Calcula ajuste basado en tendencias de mercado"""
        base_adjustment = 0.02  # +2% base
        
        # Ajustar por tipo de propiedad
        if property_data.get('property_type') == 'luxury':
            base_adjustment += 0.02
        elif property_data.get('property_type') == 'commercial':
            base_adjustment += 0.01
        
        return base_adjustment
    
    def _calculate_confidence(self, input_data, property_data):
        """Calcula confianza de la predicción"""
        base_confidence = 0.8
        
        # Ajustar por completitud de datos
        required_fields = ['square_meters', 'bedrooms', 'bathrooms']
        completeness = sum(1 for field in required_fields if property_data.get(field) is not None) / len(required_fields)
        
        # Ajustar por antigüedad de construcción
        year_built = property_data.get('year_built')
        if year_built:
            if year_built > 2015:
                base_confidence += 0.1
            elif year_built < 1990:
                base_confidence -= 0.1
        
        return min(base_confidence * completeness, 0.95)
    
    def _generate_explanation(self, property_data, price, confidence):
        """Genera explicación de la valoración"""
        sq_meters = property_data.get('square_meters', 0)
        bedrooms = property_data.get('bedrooms', 0)
        bathrooms = property_data.get('bathrooms', 0)
        
        explanation = f"Valoración basada en {sq_meters}m²"
        if bedrooms:
            explanation += f", {bedrooms} habitaciones"
        if bathrooms:
            explanation += f", {bathrooms} baños"
        
        explanation += f". Precio por m²: ${round(price/sq_meters, 2) if sq_meters > 0 else 0}"
        explanation += f". Confianza: {confidence:.1f}%"
        
        return explanation
    
    def _find_comparables(self, property_data, estimated_price):
        """Encuentra propiedades comparables"""
        # En producción, esto buscaría en la base de datos
        return [
            {
                "address": "Calle Similar 123",
                "price": round(estimated_price * 0.95, 2),
                "similarity": "95%",
                "sq_meters": property_data.get('square_meters', 0) + 10,
                "bedrooms": property_data.get('bedrooms', 0)
            },
            {
                "address": "Avenida Comparable 456",
                "price": round(estimated_price * 1.05, 2),
                "similarity": "88%",
                "sq_meters": property_data.get('square_meters', 0) - 5,
                "bedrooms": property_data.get('bedrooms', 0)
            }
        ]
    
    def _fallback_valuation(self, property_data):
        """Valoración de respaldo si falla el modelo"""
        sq_meters = property_data.get('square_meters', 100)
        base_price = sq_meters * 2000  # $2000 por m² base
        
        return {
            'estimated_value': round(base_price, 2),
            'confidence_score': 60.0,
            'market_trend': 2.0,
            'price_range': {
                'min': round(base_price * 0.8, 2),
                'max': round(base_price * 1.2, 2)
            },
            'explanation': f"Valoración estimada basada en {sq_meters}m² × $2000/m²",
            'comparable_properties': [],
            'valuation_date': datetime.utcnow().isoformat(),
            'method': 'Fallback Calculation'
        }
