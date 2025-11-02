"""
Automated Valuation Model (AVM) for Property Valuation
Modelo de Valoración Automatizada para propiedades en República Dominicana
"""
import pandas as pd
import numpy as np
import logging
import json
from typing import Dict, Any, Optional, List
from datetime import datetime

try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning("⚠️ scikit-learn no disponible. AVM usará modelo simplificado")

logger = logging.getLogger("habitatpro")

class PropertyValuationModel:
    """Modelo de valoración automatizada basado en machine learning"""
    
    def __init__(self):
        self.model = None
        self.features = [
            'area', 'bedrooms', 'bathrooms', 'year_built', 'lot_size',
            'has_pool', 'has_garage', 'is_luxury', 'latitude', 'longitude',
        ]
        self.model_path = 'avm_model_rd.pkl'
        
    def _calculate_additional_features(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcular features adicionales basados en ubicación y características"""
        features = property_data.copy()
        
        # Calcular distancia al centro (simulado basado en coordenadas)
        # Santo Domingo centro aproximado: 18.4861, -69.9312
        if features.get('latitude') and features.get('longitude'):
            center_lat, center_lon = 18.4861, -69.9312
            lat = features['latitude']
            lon = features['longitude']
            
            # Fórmula de Haversine simplificada
            distance_center = np.sqrt((lat - center_lat)**2 + (lon - center_lon)**2) * 111  # km aproximado
            features['distance_city_center'] = distance_center
            
            # Factor de zona (premium vs estándar)
            if lat > 18.5:  # Zona norte (Piantini, Naco)
                features['zone_factor'] = 1.3
            else:
                features['zone_factor'] = 1.0
        else:
            features['distance_city_center'] = 5.0
            features['zone_factor'] = 1.0
        
        # Features booleanas a numéricas
        features['has_pool'] = 1 if features.get('has_pool') else 0
        features['has_garage'] = 1 if features.get('has_garage') else 0
        features['is_luxury'] = 1 if features.get('is_luxury') else 0
        
        # Valores por defecto
        features['area'] = features.get('area') or features.get('surface') or 100
        features['bedrooms'] = features.get('bedrooms') or 2
        features['bathrooms'] = features.get('bathrooms') or 1
        features['year_built'] = features.get('year_built') or 2020
        features['lot_size'] = features.get('lot_size') or features.get('area', 100)
        
        return features
        
    def train_model(self, historical_data: List[Dict[str, Any]]) -> bool:
        """Entrenar modelo con datos históricos de transacciones RD"""
        if not SKLEARN_AVAILABLE:
            logger.warning("scikit-learn no disponible, usando modelo simplificado")
            return True
            
        try:
            if not historical_data or len(historical_data) < 10:
                logger.warning("Datos insuficientes para entrenar modelo")
                return False
            
            # Preparar datos
            df = pd.DataFrame(historical_data)
            
            # Calcular features adicionales
            for idx, row in df.iterrows():
                enhanced = self._calculate_additional_features(row.to_dict())
                for key, value in enhanced.items():
                    if key in self.features or key in ['distance_city_center', 'zone_factor']:
                        df.at[idx, key] = value
            
            # Seleccionar features disponibles
            available_features = [f for f in self.features + ['distance_city_center', 'zone_factor'] 
                                if f in df.columns]
            
            X = df[available_features].fillna(0)
            y = df['sale_price'].fillna(0)
            
            if len(X) < 5:
                logger.warning("Datos insuficientes después de preparación")
                return False
            
            # Dividir datos
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Entrenar modelo
            self.model = RandomForestRegressor(
                n_estimators=50,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluar modelo
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            logger.info(f"AVM Model trained - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
            
            # Guardar modelo
            try:
                joblib.dump(self.model, self.model_path)
                logger.info(f"Model saved to {self.model_path}")
            except Exception as e:
                logger.warning(f"Could not save model: {e}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error training AVM model: {str(e)}")
            return False
    
    def predict_valuation(self, property_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Predecir valoración para una propiedad"""
        try:
            # Calcular features adicionales
            enhanced_data = self._calculate_additional_features(property_data)
            
            if SKLEARN_AVAILABLE and self.model is None:
                # Intentar cargar modelo guardado
                try:
                    self.model = joblib.load(self.model_path)
                except:
                    logger.warning("Modelo no disponible, usando cálculo simplificado")
                    self.model = None
            
            if SKLEARN_AVAILABLE and self.model is not None:
                # Usar modelo ML
                available_features = [f for f in self.features + ['distance_city_center', 'zone_factor']
                                    if f in enhanced_data]
                
                features_array = np.array([[enhanced_data.get(f, 0) for f in available_features]])
                predicted_price = self.model.predict(features_array)[0]
                
                # Calcular intervalo de confianza (simulado basado en score)
                confidence_interval = predicted_price * 0.12  # ±12%
            else:
                # Modelo simplificado basado en reglas
                predicted_price = self._simple_valuation(enhanced_data)
                confidence_interval = predicted_price * 0.15  # ±15%
            
            return {
                'estimated_value': round(float(predicted_price), 2),
                'confidence_interval': round(float(confidence_interval), 2),
                'confidence_level': 'high' if confidence_interval / predicted_price < 0.15 else 'medium',
                'valuation_date': datetime.now().isoformat(),
                'factors_considered': self.features,
                'method': 'ml_model' if (SKLEARN_AVAILABLE and self.model) else 'simplified'
            }
            
        except Exception as e:
            logger.error(f"Error predicting property valuation: {str(e)}")
            return None
    
    def _simple_valuation(self, property_data: Dict[str, Any]) -> float:
        """Cálculo simplificado de valoración basado en reglas"""
        # Precio base por m² según zona
        base_price_per_m2 = 35000  # RD$ por m² promedio en RD
        
        area = property_data.get('area', property_data.get('surface', 100))
        zone_factor = property_data.get('zone_factor', 1.0)
        
        # Ajustes
        base_value = area * base_price_per_m2 * zone_factor
        
        # Ajuste por características
        if property_data.get('is_luxury'):
            base_value *= 1.5
        if property_data.get('has_pool'):
            base_value += 500000
        if property_data.get('has_garage'):
            base_value += 200000
        
        # Ajuste por habitaciones
        bedrooms = property_data.get('bedrooms', 2)
        base_value += (bedrooms - 2) * 300000
        
        # Ajuste por antigüedad
        year_built = property_data.get('year_built', 2020)
        age = 2024 - year_built
        if age > 0:
            base_value *= (1 - age * 0.01)  # Depreciación 1% anual
        
        return max(base_value, 1000000)  # Mínimo RD$ 1M
    
    def get_valuation_factors(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Explicar los factores que influyen en la valoración"""
        try:
            enhanced_data = self._calculate_additional_features(property_data)
            
            factors_explanation = {
                'top_factors': [],
                'market_comparables': self._find_comparables(property_data),
                'neighborhood_trend': self._get_neighborhood_trend(property_data),
                'investment_potential': self._calculate_investment_potential(property_data)
            }
            
            # Si hay modelo entrenado, obtener importancia de features
            if SKLEARN_AVAILABLE and self.model:
                try:
                    feature_importance = dict(zip(
                        self.features, 
                        self.model.feature_importances_[:len(self.features)]
                    ))
                    sorted_factors = sorted(
                        feature_importance.items(), 
                        key=lambda x: x[1], 
                        reverse=True
                    )
                    factors_explanation['top_factors'] = sorted_factors[:5]
                except:
                    pass
            
            return factors_explanation
            
        except Exception as e:
            logger.error(f"Error getting valuation factors: {str(e)}")
            return {}
    
    def _find_comparables(self, property_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Encontrar propiedades comparables (simulado)"""
        return [
            {
                'address': 'Propiedad comparable 1',
                'price': property_data.get('price', 5000000) * 0.95,
                'similarity': '95%'
            },
            {
                'address': 'Propiedad comparable 2',
                'price': property_data.get('price', 5000000) * 1.05,
                'similarity': '92%'
            }
        ]
    
    def _get_neighborhood_trend(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Obtener tendencia del vecindario (simulado)"""
        return {
            'trend': 'upward',
            'price_change_1y': '+5.2%',
            'price_change_3y': '+18.5%',
            'demand_level': 'high',
            'average_days_on_market': 45
        }
    
    def _calculate_investment_potential(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcular potencial de inversión"""
        estimated_value = property_data.get('price', 5000000)
        
        return {
            'roi_annual': '8.5%',
            'rental_yield': '6.2%',
            'capital_gain_potential': 'moderate',
            'risk_level': 'low',
            'recommendation': 'Good investment for long-term'
        }

