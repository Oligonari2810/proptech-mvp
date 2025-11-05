from flask import Blueprint, request, jsonify
from flask_socketio import Namespace, emit, join_room, leave_room
from datetime import datetime
from models import db, User
import logging

logger = logging.getLogger('habitatpro')

notification_bp = Blueprint('notifications', __name__)

# Almacenar notificaciones en memoria (en producción usar Redis o DB)
notifications_db = {}
user_rooms = {}

class NotificationNamespace(Namespace):
    """Namespace para notificaciones en tiempo real"""
    
    def on_connect(self):
        """Manejar conexión al namespace de notificaciones"""
        logger.info("WS connected", extra={
            "ns": self.namespace,
            "sid": request.sid,
            "event": "connect"
        })
        emit('status', {'message': 'Conectado al sistema de notificaciones'})
    
    def on_disconnect(self):
        """Manejar desconexión del namespace de notificaciones"""
        logger.info("WS disconnected", extra={
            "ns": self.namespace,
            "sid": request.sid,
            "event": "disconnect"
        })
        # Limpiar salas del usuario
        if request.sid in user_rooms:
            for room in user_rooms[request.sid]:
                leave_room(room)
            del user_rooms[request.sid]
    
    def on_join_user_notifications(self, data):
        """Unirse a las notificaciones de un usuario"""
        user_id = data.get('userId') or data.get('user_id')
        if user_id:
            room = f'user_{user_id}'
            join_room(room)
            
            # Registrar la sala para este usuario
            if request.sid not in user_rooms:
                user_rooms[request.sid] = []
            user_rooms[request.sid].append(room)
            
            # Enviar notificaciones pendientes del usuario
            if user_id in notifications_db:
                emit('notifications_history', {
                    'userId': user_id,
                    'notifications': notifications_db[user_id]
                })
            
            emit('status', {'message': f'Unido a notificaciones del usuario {user_id}'})
        else:
            emit('error', {'message': 'userId es requerido'})
    
    def on_send_notification(self, data):
        """Enviar notificación a un usuario"""
        user_id = data.get('userId') or data.get('user_id')
        title = data.get('title')
        message = data.get('message') or data.get('body')
        notification_type = data.get('type', 'info')
        
        if not user_id or not title or not message:
            emit('error', {'message': 'Datos de notificación inválidos'})
            return
        
        notification = {
            'id': len(notifications_db.get(user_id, [])) + 1,
            'title': title,
            'message': message,
            'type': notification_type,
            'timestamp': datetime.utcnow().isoformat(),
            'read': False,
            'userId': user_id
        }
        
        # Almacenar notificación
        if user_id not in notifications_db:
            notifications_db[user_id] = []
        notifications_db[user_id].append(notification)
        
        # Enviar a la sala del usuario
        room = f'user_{user_id}'
        emit('new_notification', notification, room=room)
        
        # Respuesta de confirmación
        emit('notification_sent', {'status': 'success', 'notificationId': notification['id']})
    
    def on_mark_notification_read(self, data):
        """Marcar notificación como leída"""
        user_id = data.get('userId') or data.get('user_id')
        notification_id = data.get('notificationId') or data.get('notification_id')
        
        if user_id and notification_id and user_id in notifications_db:
            for notification in notifications_db[user_id]:
                if notification['id'] == notification_id:
                    notification['read'] = True
                    break
            
            emit('notification_marked_read', {
                'userId': user_id,
                'notificationId': notification_id
            })
        else:
            emit('error', {'message': 'Datos inválidos'})
    
    def on_leave_user_notifications(self, data):
        """Salir de las notificaciones de un usuario"""
        user_id = data.get('userId') or data.get('user_id')
        if user_id:
            room = f'user_{user_id}'
            leave_room(room)
            
            # Remover de la lista de salas del usuario
            if request.sid in user_rooms:
                user_rooms[request.sid] = [r for r in user_rooms[request.sid] if r != room]
            
            emit('status', {'message': f'Salido de notificaciones del usuario {user_id}'})

def register_notification_socketio_events(socketio):
    """Registrar namespace de notificaciones"""
    socketio.on_namespace(NotificationNamespace('/notifications'))
    logger.info("✅ NotificationNamespace('/notifications') registrado")

# Endpoint REST para obtener notificaciones
@notification_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_notifications(user_id):
    """Obtener notificaciones de un usuario"""
    if user_id in notifications_db:
        return jsonify({
            'success': True,
            'userId': user_id,
            'notifications': notifications_db[user_id]
        })
    else:
        return jsonify({
            'success': True,
            'userId': user_id,
            'notifications': []
        })

# Endpoint REST para crear notificación
@notification_bp.route('/create', methods=['POST'])
def create_notification():
    """Crear una nueva notificación"""
    data = request.get_json()
    user_id = data.get('userId') or data.get('user_id')
    title = data.get('title')
    message = data.get('message') or data.get('body')
    notification_type = data.get('type', 'info')
    
    if not user_id or not title or not message:
        return jsonify({'error': 'Datos de notificación inválidos'}), 400
    
    notification = {
        'id': len(notifications_db.get(user_id, [])) + 1,
        'title': title,
        'message': message,
        'type': notification_type,
        'timestamp': datetime.utcnow().isoformat(),
        'read': False,
        'userId': user_id
    }
    
    # Almacenar notificación
    if user_id not in notifications_db:
        notifications_db[user_id] = []
    notifications_db[user_id].append(notification)
    
    # Nota: Para emitir via WebSocket desde aquí, se necesitaría acceso a socketio global
    
    return jsonify({
        'success': True,
        'notification': notification
    })

# Endpoint REST para marcar como leída
@notification_bp.route('/mark-read', methods=['POST'])
def mark_notification_read():
    """Marcar notificación como leída"""
    data = request.get_json()
    user_id = data.get('userId') or data.get('user_id')
    notification_id = data.get('notificationId') or data.get('notification_id')
    
    if not user_id or not notification_id:
        return jsonify({'error': 'Datos inválidos'}), 400
    
    if user_id in notifications_db:
        for notification in notifications_db[user_id]:
            if notification['id'] == notification_id:
                notification['read'] = True
                return jsonify({
                    'success': True,
                    'message': 'Notificación marcada como leída'
                })
    
    return jsonify({'error': 'Notificación no encontrada'}), 404
