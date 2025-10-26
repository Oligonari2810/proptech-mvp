from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
import json
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

# Almacenar mensajes en memoria (en producción usar Redis o DB)
chat_messages = {}
property_rooms = {}

def register_socketio_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print(f'Cliente conectado: {request.sid}')
        emit('status', {'message': 'Conectado al chat'})

    @socketio.on('disconnect')
    def handle_disconnect():
        print(f'Cliente desconectado: {request.sid}')
        # Limpiar salas del usuario
        for room in property_rooms.get(request.sid, []):
            leave_room(room)

    @socketio.on('join_property_chat')
    def handle_join_property_chat(data):
        property_id = data.get('propertyId')
        if property_id:
            room = f'property_{property_id}'
            join_room(room)
            
            # Registrar la sala para este usuario
            if request.sid not in property_rooms:
                property_rooms[request.sid] = []
            property_rooms[request.sid].append(room)
            
            # Enviar mensajes anteriores de esta propiedad
            if property_id in chat_messages:
                emit('chat_history', {
                    'propertyId': property_id,
                    'messages': chat_messages[property_id]
                })
            
            emit('status', {'message': f'Unido al chat de la propiedad {property_id}'})

    @socketio.on('send_message')
    def handle_send_message(data):
        property_id = data.get('propertyId')
        message_text = data.get('text')
        broker_id = data.get('brokerId')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat())
        
        if not property_id or not message_text:
            emit('error', {'message': 'Datos de mensaje inválidos'})
            return
        
        # Determinar el remitente (simplificado: si hay broker_id es usuario, sino es broker)
        sender = 'broker' if not broker_id else 'user'
        
        message = {
            'id': len(chat_messages.get(property_id, [])) + 1,
            'text': message_text,
            'sender': sender,
            'timestamp': timestamp,
            'propertyId': property_id
        }
        
        # Almacenar mensaje
        if property_id not in chat_messages:
            chat_messages[property_id] = []
        chat_messages[property_id].append(message)
        
        # Enviar a todos en la sala de la propiedad
        room = f'property_{property_id}'
        emit('new_message', message, room=room)
        
        # Respuesta de confirmación
        emit('message_sent', {'status': 'success', 'messageId': message['id']})

    @socketio.on('leave_property_chat')
    def handle_leave_property_chat(data):
        property_id = data.get('propertyId')
        if property_id:
            room = f'property_{property_id}'
            leave_room(room)
            
            # Remover de la lista de salas del usuario
            if request.sid in property_rooms:
                property_rooms[request.sid] = [r for r in property_rooms[request.sid] if r != room]
            
            emit('status', {'message': f'Salido del chat de la propiedad {property_id}'})

# Endpoint REST para obtener historial de chat
@chat_bp.route('/history/<int:property_id>', methods=['GET'])
def get_chat_history(property_id):
    """Obtener historial de chat de una propiedad"""
    if property_id in chat_messages:
        return jsonify({
            'success': True,
            'propertyId': property_id,
            'messages': chat_messages[property_id]
        })
    else:
        return jsonify({
            'success': True,
            'propertyId': property_id,
            'messages': []
        })

# Endpoint REST para enviar mensaje (alternativa a WebSocket)
@chat_bp.route('/send', methods=['POST'])
def send_message_rest():
    """Enviar mensaje via REST API"""
    data = request.get_json()
    property_id = data.get('propertyId')
    message_text = data.get('text')
    broker_id = data.get('brokerId')
    
    if not property_id or not message_text:
        return jsonify({'error': 'Datos de mensaje inválidos'}), 400
    
    sender = 'broker' if not broker_id else 'user'
    timestamp = datetime.utcnow().isoformat()
    
    message = {
        'id': len(chat_messages.get(property_id, [])) + 1,
        'text': message_text,
        'sender': sender,
        'timestamp': timestamp,
        'propertyId': property_id
    }
    
    # Almacenar mensaje
    if property_id not in chat_messages:
        chat_messages[property_id] = []
    chat_messages[property_id].append(message)
    
    # Enviar via WebSocket a la sala (requiere socketio global)
    # room = f'property_{property_id}'
    # socketio.emit('new_message', message, room=room)
    
    return jsonify({
        'success': True,
        'message': message
    })
