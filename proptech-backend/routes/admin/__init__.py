from flask import Blueprint, jsonify
from auth import require_auth, require_role

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/metrics', methods=['GET'])
@require_auth
@require_role(['admin', 'super_admin'])
def get_admin_metrics():
    """Obtener métricas para el dashboard de admin"""
    return jsonify({
        'total_users': 1542,
        'total_properties': 287,
        'active_sessions': 43,
        'revenue_today': 12500,
        'system_health': 'healthy'
    })

@admin_bp.route('/users', methods=['GET'])
@require_auth
@require_role(['admin', 'super_admin'])
def get_users():
    """Obtener lista de usuarios"""
    return jsonify({
        'users': [
            {'id': 1, 'name': 'María González', 'email': 'maria@email.com', 'role': 'broker', 'status': 'active'},
            {'id': 2, 'name': 'Carlos Ruiz', 'email': 'carlos@email.com', 'role': 'user', 'status': 'active'},
        ]
    })
