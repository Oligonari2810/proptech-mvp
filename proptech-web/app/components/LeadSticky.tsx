'use client';
import { MessageCircle } from 'lucide-react';

interface LeadStickyProps {
  listingId?: string;
  agentPhone?: string;
}

export const LeadSticky = ({ 
  listingId = 'general', 
  agentPhone = '+18091234567' 
}: LeadStickyProps) => {
  const handleWhatsAppClick = () => {
    const message = `¡Hola! Me interesa la propiedad en HabitatPro. ¿Podrían darme más información?`;
    const url = `https://wa.me/${agentPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold">Agendar Visita</span>
      </button>
    </div>
  );
};
