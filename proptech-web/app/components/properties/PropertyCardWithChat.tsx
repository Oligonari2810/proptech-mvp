'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Phone, MapPin, Bed, Bath, Square } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  latitude?: number;
  longitude?: number;
  brokerId: number;
  description?: string;
  features?: string[];
  emotional_tags?: string[];
  type?: string;
  operation?: string;
}

interface PropertyCardWithChatProps {
  property: Property;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'broker';
  timestamp: string;
  propertyId: number;
}

export default function PropertyCardWithChat({ property }: PropertyCardWithChatProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Cargar mensajes del chat
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history/${property.id}`);
        if (response.ok) {
          const data = await response.json();
          setChatMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (showChat) {
      fetchChatHistory();
    }
  }, [property.id, showChat]);

  // Simular conexión WebSocket
  useEffect(() => {
    if (showChat) {
      setIsConnected(true);
      // Aquí se conectaría al WebSocket real
      return () => setIsConnected(false);
    }
  }, [showChat]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Aquí se enviaría la acción de like al backend
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      propertyId: property.id
    };

    try {
      const response = await fetch(`/api/backend/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          text: newMessage,
          brokerId: property.brokerId
        })
      });

      if (response.ok) {
        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Agregar mensaje localmente si falla el backend
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type?: string) => {
    switch (type) {
      case 'casa':
        return '🏠';
      case 'apartamento':
        return '🏢';
      case 'ático':
        return '🏗️';
      case 'duplex':
        return '🏘️';
      case 'loft':
        return '🏭';
      case 'estudio':
        return '🏠';
      default:
        return '🏠';
    }
  };

  const getOperationColor = (operation?: string) => {
    switch (operation) {
      case 'compra':
        return 'bg-blue-100 text-blue-700';
      case 'alquiler':
        return 'bg-green-100 text-green-700';
      case 'inversion':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Imagen de la propiedad */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property.image || '/placeholder.svg'}
          alt={property.title}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.operation && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOperationColor(property.operation)}`}>
              {property.operation === 'compra' ? 'Compra' : 
               property.operation === 'alquiler' ? 'Alquiler' : 'Inversión'}
            </span>
          )}
          {property.type && (
            <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded-full">
              {getPropertyTypeIcon(property.type)} {property.type}
            </span>
          )}
        </div>

        {/* Botón de favorito */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>

        {/* Precio */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
            {property.operation === 'alquiler' && (
              <div className="text-sm text-gray-600">/mes</div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Título y ubicación */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>

        {/* Características */}
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.square_meters}m²
          </div>
        </div>

        {/* Tags emocionales */}
        {property.emotional_tags && property.emotional_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.emotional_tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button
            onClick={handleChatToggle}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            <Phone className="h-4 w-4" />
            <span>Llamar</span>
          </button>
        </div>
      </div>

      {/* Chat integrado */}
      {showChat && (
        <div className="border-t border-gray-200 bg-gray-50">
          {/* Header del chat */}
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">B</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Broker</div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'En línea' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleChatToggle}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mensajes del chat */}
          <div className="h-48 overflow-y-auto p-3 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Inicia una conversación sobre esta propiedad</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {message.text}
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input del chat */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
