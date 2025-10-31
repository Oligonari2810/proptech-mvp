from functools import wraps
from flask import request, jsonify
from auth import decode_token

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            else:
                token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        
        if not token:
            return jsonify({'error': 'Token es requerido'}), 401
        
        try:
            data = decode_token(token)
            if 'error' in data:
                return jsonify({'error': data['error']}), 401
            
            if data.get('role') != 'admin' and data.get('role') != 'super_admin':
                return jsonify({'error': 'Admin access required'}), 403
                
            request.user = data
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token inválido', 'details': str(e)}), 401
    return decorated_function

def broker_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Token es requerido'}), 401
        
        try:
            data = decode_token(token)
            if 'error' in data:
                return jsonify({'error': data['error']}), 401
            
            if data.get('role') not in ['admin', 'super_admin', 'broker']:
                return jsonify({'error': 'Broker access required'}), 403
                
            request.user = data
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token inválido', 'details': str(e)}), 401
    return decorated_function
