from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.properties import properties_bp
from routes.valuation import valuation_bp
from routes.contracts import contracts_bp
from routes.contact import contact_bp
from models import db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# ✅ Configuración de CORS para permitir conexión con el frontend en Vercel
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "https://proptech-frontend.onrender.com", "https://proptech-web.vercel.app"]}}, supports_credentials=True)

# ✅ Inicializar la base de datos (si aplica)
db.init_app(app)

# ✅ Registrar todas las rutas
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(properties_bp, url_prefix="/properties")
app.register_blueprint(valuation_bp, url_prefix="/valuation")
app.register_blueprint(contracts_bp, url_prefix="/contracts")
app.register_blueprint(contact_bp, url_prefix="/api") 

@app.route("/", methods=["GET"])
def home():
    return {"message": "API funcionando correctamente"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
