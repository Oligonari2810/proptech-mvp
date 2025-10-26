from .recommendation_service import EmotionAwareRecommender
from .cache_service import RecommendationCache

class OptimizedEmotionRecommender(EmotionAwareRecommender):
    def __init__(self):
        super().__init__()
        self.cache = RecommendationCache()
    
    def recommend_based_on_emotion(self, user_emotion, user_history, available_properties):
        """Recomendaciones optimizadas con cache"""
        
        # Verificar cache primero
        cached_result = self.cache.get_cached_recommendations(
            user_emotion, 
            user_history.get('user_id', 0), 
            available_properties
        )
        
        if cached_result:
            return cached_result
        
        # Si no hay cache, calcular recomendaciones
        recommendations = super().recommend_based_on_emotion(
            user_emotion, user_history, available_properties
        )
        
        # Guardar en cache
        self.cache.set_cached_recommendations(
            user_emotion,
            user_history.get('user_id', 0),
            available_properties,
            recommendations
        )
        
        return recommendations
