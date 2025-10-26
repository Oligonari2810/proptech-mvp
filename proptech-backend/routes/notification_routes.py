from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
import json
from datetime import datetime
from models import db, User

notification_bp = Blueprint('notifications', __name__)

# Almacenar notificaciones en memoria (en producción usar Redis o DB)
notifications_db = {}
user_rooms = {}

def register_notification_socketio_events(socketio):
    @socketio.on('connect')
    def handle_notification_connect():
        print(f'Cliente conectado a notificaciones: {request.sid}')
        emit('status', {'message': 'Conectado al sistema de notificaciones'})

    @socketio.on('disconnect')
    def handle_notification_disconnect():
        print(f'Cliente desconectado de notificaciones: {request.sid}')
        # Limpiar salas del usuario
        if request.sid in user_rooms:
            for room in user_rooms[request.sid]:
                leave_room(room)
            del user_rooms[request.sid]

    @socketio.on('join_user_notifications')
    def handle_join_user_notifications(data):
        user_id = data.get('userId')
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

    @socketio.on('send_notification')
    def handle_send_notification(data):
        user_id = data.get('userId')
        title = data.get('title')
        message = data.get('message')
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

    @socketio.on('mark_notification_read')
    def handle_mark_notification_read(data):
        user_id = data.get('userId')
        notification_id = data.get('notificationId')
        
        if user_id and notification_id and user_id in notifications_db:
            for notification in notifications_db[user_id]:
                if notification['id'] == notification_id:
                    notification['read'] = True
                    break
            
            emit('notification_marked_read', {
                'userId': user_id,
                'notificationId': notification_id
            })

    @socketio.on('leave_user_notifications')
    def handle_leave_user_notifications(data):
        user_id = data.get('userId')
        if user_id:
            room = f'user_{user_id}'
            leave_room(room)
            
            # Remover de la lista de salas del usuario
            if request.sid in user_rooms:
                user_rooms[request.sid] = [r for r in user_rooms[request.sid] if r != room]
            
            emit('status', {'message': f'Salido de notificaciones del usuario {user_id}'})

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
    user_id = data.get('userId')
    title = data.get('title')
    message = data.get('message')
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
    
    # Enviar via WebSocket a la sala (requiere socketio global)
    # room = f'user_{user_id}'
    # socketio.emit('new_notification', notification, room=room)
    
    return jsonify({
        'success': True,
        'notification': notification
    })

# Endpoint REST para marcar como leída
@notification_bp.route('/mark-read', methods=['POST'])
def mark_notification_read():
    """Marcar notificación como leída"""
    data = request.get_json()
    user_id = data.get('userId')
    notification_id = data.get('notificationId')
    
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
