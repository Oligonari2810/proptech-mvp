from flask import Blueprint, jsonify
from controllers.properties_controller import get_properties

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/', methods=['GET'])
def get_all_properties():
    return get_properties()  # Llamamos al controlador de propiedades
