'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  className?: string;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onResult,
  onError,
  language = 'es-ES',
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Verificar soporte de Speech Recognition
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        onResult(transcript);
        setTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errorMessage =
        event.error === 'no-speech'
          ? 'No se detectó habla. Intenta de nuevo.'
          : event.error === 'not-allowed'
          ? 'Permiso de micrófono denegado.'
          : `Error: ${event.error}`;
      onError?.(errorMessage);
      setTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        onError?.('No se pudo iniciar el reconocimiento de voz');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title={isListening ? 'Detener grabación' : 'Iniciar búsqueda por voz'}
        aria-label={isListening ? 'Detener grabación' : 'Iniciar búsqueda por voz'}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>
      {isListening && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Escuchando...</span>
          {transcript && <span className="font-medium">"{transcript}"</span>}
        </div>
      )}
    </div>
  );
};

