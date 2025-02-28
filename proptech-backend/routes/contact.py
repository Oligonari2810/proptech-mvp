from flask import Blueprint, request, jsonify

# ✅ Crear el blueprint para la ruta /api/contact
contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()

    if not data or "name" not in data or "email" not in data or "message" not in data:
        return jsonify({"error": "Faltan datos en la solicitud"}), 400

    # Simulación de guardado o envío de email
    print(f"Nuevo mensaje de contacto: {data}")

    return jsonify({"message": "Mensaje recibido correctamente"}), 200