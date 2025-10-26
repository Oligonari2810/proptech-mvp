from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
import redis
import json
import time
import threading
from datetime import datetime
import os

class RealtimeMetrics:
    """Gestor de métricas en tiempo real con WebSocket"""
    
    def __init__(self, app, socketio):
        self.app = app
        self.socketio = socketio
        self.redis_client = None
        self.metrics_thread = None
        self.running = False
        
        # Métricas actuales
        self.current_metrics = {
            'activeUsers': 0,
            'propertiesViewed': 0,
            'searchesPerformed': 0,
            'conversionRate': 0.0,
            'lastUpdated': datetime.now().isoformat()
        }
        
        # Conectar a Redis
        self._connect_redis()
        
        # Configurar eventos WebSocket
        self._setup_socket_events()
        
        # Iniciar hilo de métricas
        self._start_metrics_thread()
    
    def _connect_redis(self):
        """Conectar a Redis para métricas"""
        try:
            redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
            self.redis_client = redis.from_url(redis_url)
            self.redis_client.ping()
            print("✅ Redis conectado para métricas en tiempo real")
        except Exception as e:
            print(f"❌ Error conectando Redis para métricas: {e}")
            self.redis_client = None
    
    def _setup_socket_events(self):
        """Configurar eventos WebSocket"""
        
        @self.socketio.on('connect')
        def handle_connect():
            """Cliente conectado"""
            print(f"👤 Cliente conectado: {request.sid}")
            self._increment_active_users()
            try:
                emit('connected', {'message': 'Conectado a métricas en tiempo real'})
            except Exception as e:
                print(f"❌ Error enviando mensaje de conexión: {e}")
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            """Cliente desconectado"""
            print(f"👤 Cliente desconectado: {request.sid}")
            self._decrement_active_users()
        
        @self.socketio.on('join_dashboard')
        def handle_join_dashboard():
            """Cliente se une al dashboard"""
            join_room('dashboard')
            emit('joined_dashboard', {'message': 'Unido al dashboard'})
        
        @self.socketio.on('leave_dashboard')
        def handle_leave_dashboard():
            """Cliente sale del dashboard"""
            leave_room('dashboard')
            emit('left_dashboard', {'message': 'Salido del dashboard'})
        
        @self.socketio.on('property_viewed')
        def handle_property_viewed(data):
            """Propiedad vista por usuario"""
            property_id = data.get('property_id')
            print(f"🏠 Propiedad {property_id} vista")
            self._increment_properties_viewed()
        
        @self.socketio.on('search_performed')
        def handle_search_performed(data):
            """Búsqueda realizada por usuario"""
            search_term = data.get('search_term', '')
            print(f"🔍 Búsqueda realizada: {search_term}")
            self._increment_searches_performed()
        
        @self.socketio.on('conversion_event')
        def handle_conversion_event(data):
            """Evento de conversión (lead, contacto, etc.)"""
            event_type = data.get('event_type', 'unknown')
            print(f"📈 Conversión: {event_type}")
            self._update_conversion_rate()
    
    def _start_metrics_thread(self):
        """Iniciar hilo para actualizar métricas"""
        self.running = True
        self.metrics_thread = threading.Thread(target=self._update_metrics_loop)
        self.metrics_thread.daemon = True
        self.metrics_thread.start()
        print("✅ Hilo de métricas iniciado")
    
    def _update_metrics_loop(self):
        """Loop principal para actualizar métricas"""
        while self.running:
            try:
                # Actualizar métricas desde Redis si está disponible
                if self.redis_client:
                    self._load_metrics_from_redis()
                
                # Actualizar timestamp
                self.current_metrics['lastUpdated'] = datetime.now().isoformat()
                
                # Emitir métricas a clientes del dashboard
                self.socketio.emit('metrics_update', self.current_metrics, room='dashboard')
                
                # Guardar métricas en Redis
                if self.redis_client:
                    self._save_metrics_to_redis()
                
                time.sleep(5)  # Actualizar cada 5 segundos
                
            except Exception as e:
                print(f"❌ Error en loop de métricas: {e}")
                time.sleep(10)
    
    def _load_metrics_from_redis(self):
        """Cargar métricas desde Redis"""
        try:
            metrics_data = self.redis_client.get('realtime_metrics')
            if metrics_data:
                redis_metrics = json.loads(metrics_data)
                # Combinar con métricas actuales
                self.current_metrics.update(redis_metrics)
        except Exception as e:
            print(f"❌ Error cargando métricas desde Redis: {e}")
    
    def _save_metrics_to_redis(self):
        """Guardar métricas en Redis"""
        try:
            self.redis_client.setex(
                'realtime_metrics', 
                300,  # TTL 5 minutos
                json.dumps(self.current_metrics)
            )
        except Exception as e:
            print(f"❌ Error guardando métricas en Redis: {e}")
    
    def _increment_active_users(self):
        """Incrementar usuarios activos"""
        self.current_metrics['activeUsers'] += 1
    
    def _decrement_active_users(self):
        """Decrementar usuarios activos"""
        if self.current_metrics['activeUsers'] > 0:
            self.current_metrics['activeUsers'] -= 1
    
    def _increment_properties_viewed(self):
        """Incrementar propiedades vistas"""
        self.current_metrics['propertiesViewed'] += 1
    
    def _increment_searches_performed(self):
        """Incrementar búsquedas realizadas"""
        self.current_metrics['searchesPerformed'] += 1
    
    def _update_conversion_rate(self):
        """Actualizar tasa de conversión"""
        searches = self.current_metrics['searchesPerformed']
        if searches > 0:
            # Simular cálculo de conversión
            conversions = min(searches * 0.15, searches)  # 15% conversión simulada
            self.current_metrics['conversionRate'] = round((conversions / searches) * 100, 2)
    
    def get_current_metrics(self):
        """Obtener métricas actuales"""
        return self.current_metrics
    
    def stop(self):
        """Detener el gestor de métricas"""
        self.running = False
        if self.metrics_thread:
            self.metrics_thread.join(timeout=5)
        print("✅ Gestor de métricas detenido")

# Instancia global
realtime_metrics = None

def init_realtime_metrics(app, socketio):
    """Inicializar métricas en tiempo real"""
    global realtime_metrics
    realtime_metrics = RealtimeMetrics(app, socketio)
    return realtime_metrics

def get_realtime_metrics():
    """Obtener instancia de métricas en tiempo real"""
    return realtime_metrics
