import redis
import json
import hashlib
from datetime import timedelta

class RecommendationCache:
    def __init__(self):
        self.redis_client = redis.Redis(
            host='localhost',
            port=6379,
            db=0,
            decode_responses=True
        )
    
    def get_cache_key(self, emotion, user_id, properties_hash):
        """Generar clave única para cache"""
        key_data = f"{emotion}:{user_id}:{properties_hash}"
        return f"rec:{hashlib.md5(key_data.encode()).hexdigest()}"
    
    def get_cached_recommendations(self, emotion, user_id, properties):
        """Obtener recomendaciones del cache"""
        properties_hash = hashlib.md5(json.dumps(properties, sort_keys=True).encode()).hexdigest()
        cache_key = self.get_cache_key(emotion, user_id, properties_hash)
        
        cached = self.redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
        return None
    
    def set_cached_recommendations(self, emotion, user_id, properties, recommendations, ttl_minutes=30):
        """Guardar recomendaciones en cache"""
        properties_hash = hashlib.md5(json.dumps(properties, sort_keys=True).encode()).hexdigest()
        cache_key = self.get_cache_key(emotion, user_id, properties_hash)
        
        self.redis_client.setex(
            cache_key,
            timedelta(minutes=ttl_minutes),
            json.dumps(recommendations)
        )
    
    def invalidate_user_cache(self, user_id):
        """Invalidar cache de un usuario"""
        pattern = f"rec:*:{user_id}:*"
        keys = self.redis_client.keys(pattern)
        if keys:
            self.redis_client.delete(*keys)
