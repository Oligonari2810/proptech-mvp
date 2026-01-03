'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface PropertyChatbotProps {
  propertyId?: number;
  onClose?: () => void;
  className?: string;
}

export function PropertyChatbot({ propertyId, onClose, className = '' }: PropertyChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';

  // Scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensaje inicial del bot
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: propertyId 
          ? '¡Hola! Soy el asistente de HabitatPro. ¿Tienes alguna pregunta sobre esta propiedad?'
          : '¡Hola! Soy el asistente de HabitatPro. ¿En qué puedo ayudarte?',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, propertyId]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Si hay propertyId, usar endpoint de chat por propiedad
      if (propertyId) {
        const response = await fetch(`${backendUrl}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId,
            text: userMessage.text,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            // En una implementación real, aquí obtendrías la respuesta del broker
            // Por ahora simulamos una respuesta
            setTimeout(() => {
              const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto. ¿Hay algo más en lo que pueda ayudarte?',
                sender: 'bot',
                timestamp: new Date().toISOString(),
              };
              setMessages(prev => [...prev, botMessage]);
              setIsLoading(false);
            }, 1000);
          }
        } else {
          throw new Error('Error al enviar mensaje');
        }
      } else {
        // Chat general - aquí se integraría con IA
        // Por ahora simulamos respuesta
        setTimeout(() => {
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: 'Entiendo tu pregunta. ¿Te gustaría que te ayude a buscar propiedades específicas? Puedo ayudarte con filtros de precio, ubicación, características, etc.',
            sender: 'bot',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Abrir chat"
        >
          <Bot size={24} />
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={chatContainerRef}
      className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="bg-brand-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <div>
            <h3 className="font-semibold">Asistente HabitatPro</h3>
            <p className="text-xs text-brand-100">Estamos aquí para ayudarte</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="text-white hover:text-brand-200 transition-colors"
          aria-label="Cerrar chat"
        >
          ✕
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-brand-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <Loader2 size={16} className="animate-spin text-brand-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Enviar mensaje"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

