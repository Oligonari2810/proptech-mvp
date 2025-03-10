import os
import time
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Cargar variables de entorno
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("❌ SECRET_KEY no configurada")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("❌ DATABASE_URL no configurada")

    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", "False") == "True"

    REDIS_URL = os.getenv("REDIS_URL", "")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError("❌ JWT_SECRET_KEY no configurada")

    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    PORT = int(os.getenv("PORT", 5000))

    @staticmethod
    def validate():
        print("✅ Configuración cargada correctamente.")

        # 🔹 Verificar conexión a la base de datos con reintentos
        MAX_RETRIES = 5
        for i in range(MAX_RETRIES):
            try:
                engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
                conn = engine.connect()
                conn.close()
                print("✅ Conexión a la base de datos exitosa.")
                break
            except OperationalError as e:
                print(f"❌ Error de conexión a la BD (Intento {i+1}/{MAX_RETRIES}): {e}")
                time.sleep(3)
        else:
            raise Exception("❌ No se pudo conectar a la base de datos después de varios intentos.")

# Validar configuración
Config.validate()
