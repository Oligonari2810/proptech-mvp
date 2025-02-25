from flask import request, jsonify
from services.auth_service import generate_token, decode_token

def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    if email == "admin@example.com" and password == "password":
        token = generate_token(email)
        return jsonify({"token": token})
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401

def refresh_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header or "Bearer " not in auth_header:
        return jsonify({"error": "Token no proporcionado"}), 401

    token = auth_header.split(" ")[1]
    decoded_token = decode_token(token)

    if not decoded_token:
        return jsonify({"error": "Token inválido o expirado"}), 401

    new_token = generate_token(decoded_token["email"])
    return jsonify({"token": new_token})
