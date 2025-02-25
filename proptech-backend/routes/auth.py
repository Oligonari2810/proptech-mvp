from flask import Blueprint
from controllers.auth_controller import login, refresh_token  # Importamos correctamente las funciones

auth_bp = Blueprint('auth', __name__)

auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/refresh', methods=['POST'])(refresh_token)  # Aquí estaba el error
