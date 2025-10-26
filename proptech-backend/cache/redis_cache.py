import redis
import json
import pickle
from functools import wraps
import os

class RedisCache:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0,
            decode_responses=False
        )
        self.default_ttl = 3600  # 1 hour
    
    def get(self, key):
        try:
            cached = self.redis_client.get(key)
            if cached:
                return pickle.loads(cached)
            return None
        except Exception:
            return None
    
    def set(self, key, value, ttl=None):
        try:
            self.redis_client.setex(
                key,
                ttl or self.default_ttl,
                pickle.dumps(value)
            )
            return True
        except Exception:
            return False
    
    def delete(self, key):
        try:
            self.redis_client.delete(key)
            return True
        except Exception:
            return False
    
    def clear_pattern(self, pattern):
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception:
            return False

def cached(ttl=3600, key_prefix='cache'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            cache_key = f"{key_prefix}:{f.__name__}:{str(args)}:{str(kwargs)}"
            cache = RedisCache()
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            
            return result
        return decorated_function
    return decorator

# Global cache instance
cache_manager = RedisCache()
