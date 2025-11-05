# ✅ CHECKLIST - REFACTORIZACIÓN SOCKET.IO A NAMESPACES

## 📋 Estado de la Refactorización

### ✅ Completado

- [x] **ChatNamespace('/chat')** - Refactorizado a namespace
  - [x] `on_connect()` - Maneja conexión al namespace
  - [x] `on_disconnect()` - Limpia salas al desconectar
  - [x] `on_join_property_chat()` - Unirse a chat de propiedad
  - [x] `on_send_message()` - Enviar mensaje
  - [x] `on_leave_property_chat()` - Salir del chat
  - [x] Endpoints REST: `/history/<property_id>`, `/send`

- [x] **NotificationNamespace('/notifications')** - Refactorizado a namespace
  - [x] `on_connect()` - Maneja conexión al namespace
  - [x] `on_disconnect()` - Limpia salas al desconectar
  - [x] `on_join_user_notifications()` - Unirse a notificaciones de usuario
  - [x] `on_send_notification()` - Enviar notificación
  - [x] `on_mark_notification_read()` - Marcar como leída
  - [x] `on_leave_user_notifications()` - Salir de notificaciones
  - [x] Endpoints REST: `/user/<user_id>`, `/create`, `/mark-read`

- [x] **AINamespace('/ai')** - Refactorizado a namespace
  - [x] `on_connect()` - Maneja conexión al namespace
  - [x] `on_request_realtime_recommendations()` - Solicitar recomendaciones IA

- [x] **Registro en app.py**
  - [x] `chat_bp` registrado con `url_prefix='/api/chat'`
  - [x] `notification_bp` registrado con `url_prefix='/api/notifications'`
  - [x] Namespaces registrados correctamente
  - [x] Sin conflictos de handlers `connect` en namespace `/`

- [x] **Scripts de Smoke Test**
  - [x] `smoke_test.sh` - Tests HTTP endpoints
  - [x] `smoke_socketio.py` - Tests WebSocket namespaces

### ⚠️ Pendiente de Testing

- [ ] **Backend Startup**
  - [ ] Verificar que `app.py` inicia sin errores
  - [ ] Verificar que todos los blueprints se registran correctamente
  - [ ] Verificar que los namespaces se registran sin conflictos

- [ ] **HTTP Endpoints**
  - [ ] `GET /api/chat/history/<property_id>` - Devuelve 200/OK
  - [ ] `POST /api/chat/send` - Devuelve 200/OK
  - [ ] `GET /api/notifications/user/<user_id>` - Devuelve 200/OK
  - [ ] `POST /api/notifications/create` - Devuelve 200/OK
  - [ ] `POST /api/notifications/mark-read` - Devuelve 200/OK

- [ ] **WebSocket Namespaces**
  - [ ] `/chat` - Conecta correctamente
  - [ ] `/chat` - Eventos `join_property_chat`, `send_message` funcionan
  - [ ] `/notifications` - Conecta correctamente
  - [ ] `/notifications` - Eventos `join_user_notifications`, `send_notification` funcionan
  - [ ] `/ai` - Conecta correctamente
  - [ ] `/ai` - Evento `request_realtime_recommendations` funciona

- [ ] **Integración Frontend**
  - [ ] Componentes frontend se conectan a namespaces correctos
  - [ ] Eventos se emiten/reciben correctamente
  - [ ] Sin errores de conexión en consola del navegador

### 🔧 Configuración Requerida

- [ ] **CORS configurado** para rutas HTTP y WebSocket
- [ ] **Autenticación** (si aplica) coherente entre HTTP y WebSocket
- [ ] **Redis** (si se usa en producción) para almacenamiento de mensajes/notificaciones
- [ ] **Logging** configurado para debugging de WebSockets

## 🚀 Ejecución de Tests

### 1. Smoke Test HTTP

```bash
cd proptech-backend
./smoke_test.sh
```

### 2. Smoke Test WebSocket

```bash
cd proptech-backend
python smoke_socketio.py
```

### 3. Test Manual con curl

```bash
# Chat
curl -i http://localhost:8000/api/chat/history/1
curl -i -X POST http://localhost:8000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"1","text":"Hola","brokerId":"B1"}'

# Notificaciones
curl -i http://localhost:8000/api/notifications/user/1
curl -i -X POST http://localhost:8000/api/notifications/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"1","title":"Ping","message":"Demo","type":"info"}'
```

## 📝 Notas Importantes

1. **Namespaces**: Cada dominio funcional ahora tiene su propio namespace, evitando conflictos de handlers `connect`

2. **Compatibilidad**: Los handlers ahora aceptan tanto `propertyId`/`property_id` como `userId`/`user_id` para mayor flexibilidad

3. **Logging**: Todos los eventos ahora usan el logger estructurado en lugar de `print()`

4. **Almacenamiento**: Actualmente en memoria. Para producción, considerar Redis o base de datos

5. **Autenticación**: Los namespaces no incluyen autenticación actualmente. Agregar si es necesario para producción

## 🔍 Verificación Post-Refactor

1. ✅ No hay conflictos de handlers `connect` en namespace `/`
2. ✅ Cada namespace está aislado correctamente
3. ✅ Endpoints REST funcionan independientemente de WebSocket
4. ✅ Logs muestran correctamente qué namespace se registra
5. ✅ Frontend puede conectarse a cada namespace por separado

