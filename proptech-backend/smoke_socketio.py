#!/usr/bin/env python3
"""
Smoke test para verificar que los namespaces de SocketIO funcionan correctamente.

Ejecutar con:
    python smoke_socketio.py

Requisitos:
    pip install python-socketio
"""

import socketio
import time
import sys

# Configuración
BASE_URL = 'http://localhost:8000'
ok = {"chat": False, "notifications": False, "ai": False}

def run_chat():
    """Test del namespace /chat"""
    print("\n[CHAT] Probando namespace /chat...")
    sio = socketio.Client()
    
    try:
        @sio.event(namespace='/chat')
        def connect():
            print('[CHAT] ✅ Conectado al namespace /chat')
            sio.emit('join_property_chat', {'propertyId': 'TEST_PROPERTY_ID'}, namespace='/chat')
        
        @sio.on('status', namespace='/chat')
        def on_status(data):
            print(f'[CHAT] Status: {data}')
        
        @sio.on('chat_history', namespace='/chat')
        def on_chat_history(data):
            print(f'[CHAT] ✅ Historial recibido: {len(data.get("messages", []))} mensajes')
        
        @sio.on('new_message', namespace='/chat')
        def on_new_message(data):
            print(f'[CHAT] ✅ Nuevo mensaje recibido: {data.get("text", "")[:50]}')
        
        @sio.on('message_sent', namespace='/chat')
        def on_message_sent(data):
            print(f'[CHAT] ✅ Mensaje enviado: {data}')
            ok["chat"] = True
        
        sio.connect(BASE_URL, namespaces=['/chat'], wait_timeout=10, transports=['websocket', 'polling'])
        print('[CHAT] Enviando mensaje de prueba...')
        sio.emit('send_message', {
            'propertyId': 'TEST_PROPERTY_ID',
            'text': 'Hola desde smoke test',
            'brokerId': 'B1'
        }, namespace='/chat')
        time.sleep(2)
        sio.disconnect()
        print('[CHAT] ✅ Test completado\n')
        
    except Exception as e:
        print(f'[CHAT] ❌ Error: {e}')
        ok["chat"] = False
        if sio.connected:
            sio.disconnect()

def run_notifications():
    """Test del namespace /notifications"""
    print("\n[NOTIFICACIONES] Probando namespace /notifications...")
    sio = socketio.Client()
    
    try:
        @sio.event(namespace='/notifications')
        def connect():
            print('[NOTIFICACIONES] ✅ Conectado al namespace /notifications')
            sio.emit('join_user_notifications', {'userId': 'U1'}, namespace='/notifications')
        
        @sio.on('status', namespace='/notifications')
        def on_status(data):
            print(f'[NOTIFICACIONES] Status: {data}')
        
        @sio.on('notifications_history', namespace='/notifications')
        def on_notifications_history(data):
            print(f'[NOTIFICACIONES] ✅ Historial recibido: {len(data.get("notifications", []))} notificaciones')
        
        @sio.on('new_notification', namespace='/notifications')
        def on_new_notification(data):
            print(f'[NOTIFICACIONES] ✅ Nueva notificación recibida: {data.get("title", "")}')
        
        @sio.on('notification_sent', namespace='/notifications')
        def on_notification_sent(data):
            print(f'[NOTIFICACIONES] ✅ Notificación enviada: {data}')
            ok["notifications"] = True
        
        sio.connect(BASE_URL, namespaces=['/notifications'], wait_timeout=10, transports=['websocket', 'polling'])
        print('[NOTIFICACIONES] Enviando notificación de prueba...')
        sio.emit('send_notification', {
            'userId': 'U1',
            'title': 'Ping',
            'message': 'Demo desde smoke test',
            'type': 'info'
        }, namespace='/notifications')
        time.sleep(2)
        sio.disconnect()
        print('[NOTIFICACIONES] ✅ Test completado\n')
        
    except Exception as e:
        print(f'[NOTIFICACIONES] ❌ Error: {e}')
        ok["notifications"] = False
        if sio.connected:
            sio.disconnect()

def run_ai():
    """Test del namespace /ai"""
    print("\n[IA] Probando namespace /ai...")
    sio = socketio.Client()
    
    try:
        @sio.event(namespace='/ai')
        def connect():
            print('[IA] ✅ Conectado al namespace /ai')
        
        @sio.on('connection_established', namespace='/ai')
        def on_connection_established(data):
            print(f'[IA] ✅ Conexión establecida: {data.get("message", "")}')
        
        @sio.on('realtime_recommendations', namespace='/ai')
        def on_realtime_recommendations(data):
            recommendations = data.get('recommendations', [])
            print(f'[IA] ✅ Recomendaciones recibidas: {len(recommendations)} propiedades')
            ok["ai"] = True
        
        @sio.on('error', namespace='/ai')
        def on_error(data):
            print(f'[IA] ⚠️ Error recibido: {data.get("message", "")}')
        
        sio.connect(BASE_URL, namespaces=['/ai'], wait_timeout=10, transports=['websocket', 'polling'])
        print('[IA] Solicitando recomendaciones en tiempo real...')
        sio.emit('request_realtime_recommendations', {
            'user_id': 1
        }, namespace='/ai')
        time.sleep(3)
        sio.disconnect()
        print('[IA] ✅ Test completado\n')
        
    except Exception as e:
        print(f'[IA] ❌ Error: {e}')
        ok["ai"] = False
        if sio.connected:
            sio.disconnect()

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 SMOKE TEST - SOCKET.IO NAMESPACES")
    print("=" * 60)
    print(f"Conectando a: {BASE_URL}")
    print("Asegúrate de que el backend esté corriendo en el puerto 8000\n")
    
    try:
        run_chat()
        run_notifications()
        run_ai()
        
        print("=" * 60)
        print("📊 RESULTADOS:")
        print("=" * 60)
        for namespace, result in ok.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {namespace.upper()}: {status}")
        
        if all(ok.values()):
            print("\n✅ Todos los tests pasaron correctamente!")
            sys.exit(0)
        else:
            print("\n❌ Algunos tests fallaron")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error fatal: {e}")
        sys.exit(1)

