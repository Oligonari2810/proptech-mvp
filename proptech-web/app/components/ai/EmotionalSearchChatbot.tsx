'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, X, Sparkles } from 'lucide-react';
import { searchEmotional, EmotionalSearchResponse, EmotionalProperty } from '@/app/lib/ai/emotionalSearch';
import { EmotionalMatchCard } from './EmotionalMatchCard';
import { EmotionalSuggestions } from './EmotionalSuggestions';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  data?: EmotionalSearchResponse;
}

interface EmotionalSearchChatbotProps {
  onPropertySelect?: (property: EmotionalProperty) => void;
  initialQuery?: string;
  showSuggestions?: boolean;
  className?: string;
}

export function EmotionalSearchChatbot({
  onPropertySelect,
  initialQuery,
  showSuggestions = true,
  className = ''
}: EmotionalSearchChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastResponse, setLastResponse] = useState<EmotionalSearchResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mensaje inicial
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        text: '¡Hola! Soy tu asistente emocional de HabitatPro. ¿Qué tipo de hogar buscas? Puedo ayudarte a encontrar propiedades que realmente sientan bien. 💙',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Agregar mensaje de "pensando"
    const thinkingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'Analizando tus preferencias emocionales... 💭',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await searchEmotional(userMessage.text);
      
      setLastResponse(response);

      // Remover mensaje de "pensando"
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));

      // Agregar respuesta de IA
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        text: response.emotional_summary || `Encontré ${response.matches_found} propiedades que coinciden con lo que buscas.`,
        timestamp: new Date(),
        data: response
      };

      setMessages(prev => [...prev, aiMessage]);

      // Si no hay propiedades, agregar mensaje de sugerencia
      if (response.matches_found === 0) {
        const suggestionMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: '¿Podrías ser más específico? Por ejemplo: "hogar tranquilo para mi familia" o "apartamento vibrante para joven profesional".',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Error en búsqueda emocional:', error);
      
      // Remover mensaje de "pensando"
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));

      // Agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        text: 'Lo siento, hubo un error al procesar tu búsqueda. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Si no está abierto, mostrar solo el botón flotante
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        aria-label="Abrir asistente emocional"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl flex flex-col z-50 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Asistente Emocional</h3>
            <p className="text-xs text-white/80">HabitatPro IA</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Cerrar chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : message.type === 'system'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              
              {/* Mostrar propiedades si hay resultados */}
              {message.data && message.data.properties && message.data.properties.length > 0 && (
                <div className="mt-3 space-y-3">
                  {message.data.properties.slice(0, 3).map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onPropertySelect?.(property)}
                      className="cursor-pointer"
                    >
                      <EmotionalMatchCard 
                        property={property} 
                        showInsights={true}
                      />
                    </div>
                  ))}
                  
                  {message.data.properties.length > 3 && (
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Y {message.data.properties.length - 3} propiedades más...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && lastResponse && lastResponse.suggested_queries && lastResponse.suggested_queries.length > 0 && (
        <div className="px-4 pt-2 pb-2 border-t border-gray-200 bg-white">
          <EmotionalSuggestions
            suggestions={lastResponse.suggested_queries}
            onSuggestionClick={handleSuggestionClick}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe el hogar que buscas..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

