from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes.auth import auth_bp
from routes.properties import properties_bp
from routes.valuation import valuation_bp
from routes.contracts import contracts_bp
from routes.contact import contact_bp
from config import Config
import logging

def create_app():
    # ✅ Inicializar la aplicación Flask
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Configurar CORS para evitar errores en frontend
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         expose_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # ✅ Manejo de preflight requests manualmente para evitar redirecciones
    @app.before_request
    def handle_options_request():
        if request.method == "OPTIONS":
            return "", 200

    # ✅ Inicializar la base de datos y migraciones
    db.init_app(app)
    migrate = Migrate(app, db)

    # ✅ Registrar Blueprints con URL correcta
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(properties_bp, url_prefix="/api/properties")
    app.register_blueprint(valuation_bp, url_prefix="/api/valuation")
    app.register_blueprint(contracts_bp, url_prefix="/api/contracts")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    # ✅ Ruta de prueba para verificar si la API está funcionando
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "API funcionando correctamente"})

    return app

# ✅ Crear la app para Gunicorn
app = create_app()
