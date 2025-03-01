from flask import Blueprint, request, jsonify
from models import db, User  # ✅ Importar User correctamente
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

# ✅ Ruta para registrar un usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    # Verificamos que el email y la contraseña estén presentes
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña requeridos"}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "El usuario ya existe"}), 400

    # Crear nuevo usuario con contraseña encriptada
    hashed_password = generate_password_hash(data["password"])
    new_user = User(email=data["email"], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente", "user": {"email": new_user.email}}), 201


# ✅ Ruta para iniciar sesión y obtener un token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña requeridos"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    # Generar token JWT
    token = jwt.encode({
        "user_id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, os.getenv("SECRET_KEY"), algorithm="HS256")

    return jsonify({"message": "Inicio de sesión exitoso", "token": token})


# ✅ Ruta para refrescar el token JWT
@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({"error": "Token requerido"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])

        new_token = jwt.encode({
            "user_id": decoded_token["user_id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, os.getenv("SECRET_KEY"), algorithm="HS256")

        return jsonify({"message": "Token renovado", "token": new_token})

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401
