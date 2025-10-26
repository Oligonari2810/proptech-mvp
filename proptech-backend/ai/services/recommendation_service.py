import numpy as np
import os
import json

class EmotionAwareRecommender:
    def __init__(self):
        self.model_path = 'ai/models/recommendation/emotion_model.json'
        self.load_model()
    
    def load_model(self):
        """Cargar modelo entrenado o crear uno nuevo"""
        if os.path.exists(self.model_path):
            with open(self.model_path, 'r') as f:
                self.model_data = json.load(f)
        else:
            self.model_data = {
                'emotion_weights': {
                    'happy': {'has_pool': 0.8, 'has_garden': 0.7, 'location_score': 0.6},
                    'excited': {'price_range': 0.9, 'property_type': 0.8},
                    'calm': {'location_score': 0.9, 'has_garden': 0.8},
                    'analytical': {'price_range': 0.7, 'bedrooms': 0.6},
                    'sad': {'location_score': 0.7, 'price_range': 0.5}
                },
                'base_weights': {
                    'location_score': 0.3,
                    'bedrooms': 0.2,
                    'bathrooms': 0.1,
                    'has_pool': 0.15,
                    'has_garden': 0.1
                }
            }
            self.save_model()
    
    def save_model(self):
        """Guardar modelo actualizado"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'w') as f:
            json.dump(self.model_data, f, indent=2)
    
    def extract_property_features(self, property_data):
        """Extraer características de una propiedad para el modelo"""
        return {
            'price_range': self._categorize_price(property_data.get('price', 0)),
            'bedrooms': property_data.get('bedrooms', 0),
            'bathrooms': property_data.get('bathrooms', 0),
            'has_pool': property_data.get('has_pool', False),
            'has_garden': property_data.get('has_garden', False),
            'location_score': property_data.get('location_score', 0),
            'property_type': property_data.get('property_type', 'apartment')
        }
    
    def _categorize_price(self, price):
        """Categorizar precio para el modelo"""
        if price < 100000: return 'low'
        elif price < 500000: return 'medium'
        else: return 'high'
    
    def recommend_based_on_emotion(self, user_emotion, user_history, available_properties):
        """Recomendar propiedades basado en emoción del usuario"""
        
        emotion_weights = self.model_data['emotion_weights'].get(user_emotion, {})
        base_weights = self.model_data['base_weights']
        
        scored_properties = []
        
        for prop in available_properties:
            score = 0
            features = self.extract_property_features(prop)
            
            # Calcular score basado en preferencias de la emoción
            for feature, weight in emotion_weights.items():
                if feature in features:
                    if feature == 'price_range':
                        if features[feature] == 'high' and weight > 0.7:
                            score += weight * 3
                        elif features[feature] == 'medium' and 0.4 < weight < 0.8:
                            score += weight * 2
                        elif features[feature] == 'low' and weight < 0.6:
                            score += weight * 2
                    elif feature == 'property_type':
                        if features[feature] == 'luxury' and weight > 0.7:
                            score += weight * 2
                        else:
                            score += weight
                    elif isinstance(features[feature], bool):
                        if features[feature]:
                            score += weight * 2
                    else:
                        score += features[feature] * weight
            
            # Añadir score base por características generales
            for feature, weight in base_weights.items():
                if feature in features:
                    if isinstance(features[feature], bool):
                        if features[feature]:
                            score += weight
                    else:
                        score += features[feature] * weight
            
            # Añadir reasoning personalizado
            reasoning_parts = []
            if emotion_weights.get('has_pool') and features.get('has_pool'):
                reasoning_parts.append("Tiene piscina (perfecto para tu estado de ánimo)")
            if emotion_weights.get('has_garden') and features.get('has_garden'):
                reasoning_parts.append("Incluye jardín (ideal para relajarte)")
            if emotion_weights.get('location_score') and features.get('location_score', 0) > 0.8:
                reasoning_parts.append("Excelente ubicación")
            
            reasoning = f"Recomendado para estado {user_emotion}"
            if reasoning_parts:
                reasoning += f" - {', '.join(reasoning_parts)}"
            
            scored_properties.append({
                'property': prop,
                'score': round(score, 2),
                'reasoning': reasoning,
                'confidence': min(score / 5, 1.0)  # Normalizar confidence
            })
        
        # Ordenar por score y devolver top 5
        scored_properties.sort(key=lambda x: x['score'], reverse=True)
        return scored_properties[:5]
    
    def train_model(self, training_data):
        """Entrenar modelo con datos históricos"""
        # En producción, esto se conectaría con datos reales
        # Por ahora, actualizamos los pesos basado en feedback
        for emotion, properties, feedback in training_data:
            if emotion not in self.model_data['emotion_weights']:
                self.model_data['emotion_weights'][emotion] = {}
            
            # Actualizar pesos basado en feedback
            for prop in properties:
                features = self.extract_property_features(prop)
                for feature, value in features.items():
                    if feature not in self.model_data['emotion_weights'][emotion]:
                        self.model_data['emotion_weights'][emotion][feature] = 0.5
                    
                    # Ajustar peso basado en feedback
                    if feedback > 0:
                        self.model_data['emotion_weights'][emotion][feature] += 0.1
                    else:
                        self.model_data['emotion_weights'][emotion][feature] -= 0.1
                    
                    # Mantener pesos entre 0 y 1
                    self.model_data['emotion_weights'][emotion][feature] = max(0, min(1, 
                        self.model_data['emotion_weights'][emotion][feature]))
        
        self.save_model()
