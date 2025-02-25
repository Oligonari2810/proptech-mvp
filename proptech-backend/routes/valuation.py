from flask import Blueprint, request, jsonify
from models import db, Valuation

valuation_bp = Blueprint("valuation", __name__)  # ✅ Sin `url_prefix`

# ✅ Ruta para crear una tasación
@valuation_bp.route("/", methods=["POST"])
def create_valuation():
    data = request.get_json()
    if not data or "property_id" not in data or "estimated_value" not in data:
        return jsonify({"error": "Faltan datos"}), 400

    new_valuation = Valuation(
        property_id=data["property_id"],
        estimated_value=data["estimated_value"]
    )
    db.session.add(new_valuation)
    db.session.commit()

    return jsonify({"message": "Tasación creada exitosamente"}), 201
