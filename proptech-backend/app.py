from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes.auth import auth_bp
from routes.properties import properties_bp
from routes.valuation import valuation_bp
from routes.contracts import contracts_bp
from routes.contact import contact_bp
from config import Config

# ✅ Inicialización de Flask
app = Flask(__name__)
app.config.from_object(Config)

# ✅ Configurar CORS correctamente
CORS(app, resources={r"/*": {"origins": "*"}}, 
     supports_credentials=True, 
     allow_headers=["Content-Type", "Authorization"], 
     methods=["GET", "POST", "PUT", "DELETE"])

# ✅ Inicializar la base de datos y migraciones
db.init_app(app)
migrate = Migrate(app, db)

# ✅ Registrar Blueprints (rutas de la API)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(properties_bp, url_prefix="/api/properties")
app.register_blueprint(valuation_bp, url_prefix="/api/valuation")
app.register_blueprint(contracts_bp, url_prefix="/api/contracts")
app.register_blueprint(contact_bp, url_prefix="/api/contact")

# ✅ Ruta de prueba para verificar la API
@app.route("/", methods=["GET"])
def home():
    return {"message": "API funcionando correctamente"}

# ✅ Punto de entrada para ejecutar Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
