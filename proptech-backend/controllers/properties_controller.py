from flask import jsonify

def get_properties():
    properties = [
        {"id": 1, "title": "Casa en la playa", "price": 250000},
        {"id": 2, "title": "Apartamento en la ciudad", "price": 180000}
    ]
    return jsonify(properties)
