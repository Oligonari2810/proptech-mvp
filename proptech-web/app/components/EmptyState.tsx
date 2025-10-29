import { Search, Home, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'search' | 'properties' | 'general';
}

export const EmptyState = ({ 
  title, 
  description, 
  action,
  type = 'general'
}: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <Search className="w-16 h-16 text-gray-400 mb-4" />;
      case 'properties':
        return <Home className="w-16 h-16 text-gray-400 mb-4" />;
      default:
        return <Home className="w-16 h-16 text-gray-400 mb-4" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          title: 'No encontramos propiedades',
          description: 'Prueba ajustando los filtros de búsqueda o contáctanos directamente por WhatsApp para una atención personalizada.'
        };
      case 'properties':
        return {
          title: 'No hay propiedades disponibles',
          description: 'Estamos trabajando para agregar más propiedades. Mientras tanto, puedes contactarnos para recibir alertas de nuevas oportunidades.'
        };
      default:
        return {
          title: 'No hay contenido disponible',
          description: 'Vuelve pronto o contáctanos para más información.'
        };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description
  };

  const handleWhatsAppClick = () => {
    const message = 'Hola, me gustaría recibir información sobre propiedades disponibles.';
    const url = `https://wa.me/+18091234567?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="text-center py-12 px-6 bg-white rounded-xl border border-gray-200">
      {getIcon()}
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
        {content.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {action ? (
          <button
            onClick={action.onClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        ) : (
          <button
            onClick={handleWhatsAppClick}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <MessageCircle size={20} />
            Contactar por WhatsApp
          </button>
        )}
        
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Ajustar Filtros
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>¿Necesitas ayuda personalizada?</p>
        <p>Nuestros agentes están disponibles para asistirte</p>
      </div>
    </div>
  );
};
