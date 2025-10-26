from datetime import datetime
from flask import request
import json

class AuditLog:
    @staticmethod
    def log_action(user_id: str, action: str, resource: str, details: dict = None):
        try:
            # En producción, guardar en base de datos
            log_entry = {
                'timestamp': datetime.utcnow().isoformat(),
                'user_id': user_id,
                'action': action,
                'resource': resource,
                'details': details or {},
                'ip_address': request.remote_addr if request else None,
                'user_agent': request.headers.get('User-Agent') if request else None
            }
            
            print(f"🔍 AUDIT LOG: {json.dumps(log_entry)}")
            
            # Aquí iría la inserción en la base de datos
            # db.session.add(AuditLogEntry(**log_entry))
            # db.session.commit()
            
        except Exception as e:
            print(f"Error en audit log: {e}")

    @staticmethod
    def log_property_change(user_id: str, action: str, property_id: str, changes: dict = None):
        AuditLog.log_action(
            user_id=user_id,
            action=action,
            resource=f"property:{property_id}",
            details={'changes': changes}
        )
