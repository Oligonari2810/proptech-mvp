"""
Routes para sistema de reservas y citas
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models import db
import logging

logger = logging.getLogger(__name__)

bookings_bp = Blueprint('bookings', __name__)

# Almacenamiento temporal (en producción usar BD)
bookings_storage = {}

@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    """Crear una nueva reserva de visita"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['property_id', 'date', 'time', 'visitor_name', 'visitor_phone', 'visitor_email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido faltante: {field}'}), 400
        
        property_id = data.get('property_id')
        broker_id = data.get('broker_id')
        date = data.get('date')
        time = data.get('time')
        visitor_name = data.get('visitor_name')
        visitor_phone = data.get('visitor_phone')
        visitor_email = data.get('visitor_email')
        notes = data.get('notes', '')
        
        # Validar formato de fecha y hora
        try:
            booking_datetime = datetime.fromisoformat(f"{date}T{time}:00")
            if booking_datetime < datetime.now():
                return jsonify({'error': 'La fecha y hora deben ser futuras'}), 400
        except ValueError:
            return jsonify({'error': 'Formato de fecha/hora inválido'}), 400
        
        # Generar ID de reserva
        booking_id = f"booking-{property_id}-{int(datetime.now().timestamp())}"
        
        # Crear reserva
        booking = {
            'id': booking_id,
            'property_id': property_id,
            'broker_id': broker_id,
            'date': date,
            'time': time,
            'visitor_name': visitor_name,
            'visitor_phone': visitor_phone,
            'visitor_email': visitor_email,
            'notes': notes,
            'status': 'confirmed',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        bookings_storage[booking_id] = booking
        
        logger.info(f"✅ Reserva creada: {booking_id} para propiedad {property_id}")
        
        # En producción: enviar notificación email al broker
        # En producción: agregar a base de datos
        # En producción: sincronizar con Google Calendar
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'booking': booking,
            'message': 'Reserva confirmada exitosamente'
        }), 201
        
    except Exception as e:
        logger.error(f"Error creando reserva: {e}")
        return jsonify({'error': 'Error interno al crear reserva'}), 500

@bookings_bp.route('/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Obtener detalles de una reserva"""
    try:
        booking = bookings_storage.get(booking_id)
        if not booking:
            return jsonify({'error': 'Reserva no encontrada'}), 404
        
        return jsonify({
            'success': True,
            'booking': booking
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo reserva: {e}")
        return jsonify({'error': 'Error interno'}), 500

@bookings_bp.route('/bookings/property/<property_id>', methods=['GET'])
def get_property_bookings(property_id):
    """Obtener todas las reservas de una propiedad"""
    try:
        property_bookings = [
            booking for booking in bookings_storage.values()
            if booking.get('property_id') == int(property_id)
        ]
        
        return jsonify({
            'success': True,
            'bookings': property_bookings,
            'count': len(property_bookings)
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo reservas: {e}")
        return jsonify({'error': 'Error interno'}), 500

@bookings_bp.route('/bookings/<booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """Actualizar estado de una reserva (cancelar, confirmar, etc.)"""
    try:
        booking = bookings_storage.get(booking_id)
        if not booking:
            return jsonify({'error': 'Reserva no encontrada'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status and new_status in ['confirmed', 'cancelled', 'completed']:
            booking['status'] = new_status
            booking['updated_at'] = datetime.utcnow().isoformat()
            bookings_storage[booking_id] = booking
            
            return jsonify({
                'success': True,
                'booking': booking,
                'message': 'Reserva actualizada exitosamente'
            }), 200
        else:
            return jsonify({'error': 'Estado inválido'}), 400
            
    except Exception as e:
        logger.error(f"Error actualizando reserva: {e}")
        return jsonify({'error': 'Error interno'}), 500

@bookings_bp.route('/bookings/available-slots', methods=['GET'])
def get_available_slots():
    """Obtener slots disponibles para una propiedad y fecha"""
    try:
        property_id = request.args.get('property_id', type=int)
        date = request.args.get('date')
        
        if not property_id or not date:
            return jsonify({'error': 'property_id y date son requeridos'}), 400
        
        # Generar slots disponibles (ejemplo)
        time_slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        available_slots = []
        
        for time in time_slots:
            # En producción: verificar si hay conflicto con otras reservas
            is_available = True  # Lógica de verificación real aquí
            
            available_slots.append({
                'time': time,
                'available': is_available
            })
        
        return jsonify({
            'success': True,
            'date': date,
            'slots': available_slots
        }), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo slots: {e}")
        return jsonify({'error': 'Error interno'}), 500

