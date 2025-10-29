from prometheus_client import Counter, Histogram, generate_latest, REGISTRY
from flask import request
import time

# Métricas técnicas
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP Requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['endpoint']
)

ERROR_COUNT = Counter(
    'http_errors_total',
    'Total HTTP Errors',
    ['endpoint', 'error_type']
)

FRONTEND_PERFORMANCE = Histogram(
    'frontend_page_load_seconds',
    'Frontend page load duration (seconds)',
    ['path', 'type']
)


def monitor_requests(app):
    @app.before_request
    def _before_request():
        request._start_time = time.time()

    @app.after_request
    def _after_request(response):
        try:
            endpoint = request.path or 'unknown'
            if hasattr(request, '_start_time'):
                latency = time.time() - request._start_time
                REQUEST_LATENCY.labels(endpoint).observe(latency)
            REQUEST_COUNT.labels(request.method, endpoint, str(response.status_code)).inc()
            if 400 <= response.status_code < 500:
                ERROR_COUNT.labels(endpoint, '4xx').inc()
            if response.status_code >= 500:
                ERROR_COUNT.labels(endpoint, '5xx').inc()
        except Exception:
            # Nunca romper la respuesta por un fallo de métricas
            pass
        return response

    # Exponer /metrics se realiza en app principal para evitar dependencias circulares


