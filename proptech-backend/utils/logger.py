"""
Logger estructurado para HabitatPro
Reemplaza print() y console.log con logging estructurado
"""

import logging
import sys
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

# Configurar nivel de log según entorno
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO').upper()
ENVIRONMENT = os.getenv('FLASK_ENV', 'development')

# Crear logger
logger = logging.getLogger('habitatpro')
logger.setLevel(getattr(logging, LOG_LEVEL, logging.INFO))

# Evitar duplicados
if not logger.handlers:
    # Handler para consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    
    # Formato estructurado
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Handler para archivo (solo en producción)
    if ENVIRONMENT == 'production':
        log_dir = '/tmp/logs'
        os.makedirs(log_dir, exist_ok=True)
        
        file_handler = RotatingFileHandler(
            f'{log_dir}/habitatpro.log',
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(logging.WARNING)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

def sanitize_error(error: Exception, generic_message: str = "Ha ocurrido un error. Por favor, inténtelo más tarde.") -> str:
    """Sanitiza errores para no mostrar stack traces en producción"""
    is_production = ENVIRONMENT == 'production'
    
    if is_production:
        # En producción, log error completo pero retornar mensaje genérico
        logger.error(f"Error sanitizado: {str(error)}", exc_info=True)
        return generic_message
    else:
        # En desarrollo, mostrar error completo para debugging
        logger.debug(f"Error detallado: {str(error)}", exc_info=True)
        return str(error)

