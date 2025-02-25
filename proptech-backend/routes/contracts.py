from flask import Blueprint, request, jsonify
from models import db, SmartContract

contracts_bp = Blueprint("contracts", __name__)

@contracts_bp.route("/smart-contract", methods=["POST"])
def create_smart_contract():
    data = request.get_json()
    if not data or "property_id" not in data or "buyer_id" not in data or "seller_id" not in data:
        return jsonify({"error": "Faltan datos"}), 400

    new_contract = SmartContract(
        property_id=data["property_id"],
        buyer_id=data["buyer_id"],
        seller_id=data["seller_id"],
        contract_hash="hash_simulado",
        status="pending"
    )
    db.session.add(new_contract)
    db.session.commit()

    return jsonify({"message": "Contrato inteligente generado exitosamente"}), 201
