from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

def setup_security(app: Flask):
    # Rate limiting configuration
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="redis://localhost:6379",
        strategy="fixed-window"
    )
    
    # Security headers
    @app.after_request
    def set_security_headers(response):
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'"
        return response
    
    # CORS configuration
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return limiter
