"use client";
import { HABITATPRO_IMAGES } from '../../config/images';

interface AssetPlaceholderProps {
  category: keyof typeof HABITATPRO_IMAGES;
  type: string;
  className?: string;
  showInstructions?: boolean;
}

export default function AssetPlaceholder({ 
  category, 
  type, 
  className = "",
  showInstructions = true 
}: AssetPlaceholderProps) {
  const getPlaceholderContent = () => {
    switch (category) {
      case 'hero':
        return {
          icon: '🏠',
          title: 'Imagen Hero Principal',
          description: 'Familia feliz en hogar de lujo',
          dimensions: '1920x1080px (16:9)',
          prompt: 'A happy diverse family of four smiling and laughing in a bright, sunlit modern luxury living room with large windows overlooking tropical greenery, natural wood accents, comfortable contemporary furniture, warm golden hour lighting, realistic photorealistic style, professional real estate photography, 8k, ultra detailed, cinematic lighting --ar 16:9 --style raw'
        };
      case 'lifestyle':
        const lifestylePrompts = {
          kitchen: {
            icon: '🍳',
            title: 'Cocina Moderna',
            description: 'Pareja cocinando juntos',
            dimensions: '1200x800px (3:2)',
            prompt: 'A couple cooking together in a stunning modern kitchen with marble countertops, premium appliances, natural light pouring through large windows, indoor plants, warm and inviting atmosphere, realistic photography, luxury home interior, family lifestyle moment --ar 3:2 --style raw'
          },
          living: {
            icon: '🛋️',
            title: 'Sala de Estar Acogedora',
            description: 'Momento familiar en la tarde',
            dimensions: '1200x800px (3:2)',
            prompt: 'Cozy evening scene in a luxury living room, family watching movie together with soft blanket, warm ambient lighting, elegant furniture, bookshelf in background, feeling of comfort and home, photorealistic, emotional real estate photography --ar 3:2 --style raw'
          },
          community: {
            icon: '🏘️',
            title: 'Comunidad Residencial',
            description: 'Familias disfrutando amenidades',
            dimensions: '1200x800px (3:2)',
            prompt: 'Luxury residential community with families enjoying amenities, swimming pool, green spaces, modern architecture, sunny day, lifestyle real estate photography --ar 3:2 --style raw'
          }
        };
        return lifestylePrompts[type as keyof typeof lifestylePrompts] || lifestylePrompts.kitchen;
      case 'professionals':
        const professionalPrompts = {
          broker: {
            icon: '👨‍💼',
            title: 'Broker Profesional',
            description: 'Retrato de confianza',
            dimensions: '400x400px (1:1)',
            prompt: 'A professional real estate broker in their 30s, smiling confidently, wearing elegant business casual attire, standing in a modern luxury apartment, holding tablet showing property details, warm natural lighting, professional headshot style, trustworthy expression, premium real estate agent portrait --ar 1:1 --style raw'
          },
          team: {
            icon: '👥',
            title: 'Equipo Profesional',
            description: 'Reunión de equipo',
            dimensions: '1200x800px (3:2)',
            prompt: 'Professional real estate team meeting in modern office, diverse group of agents and brokers around conference table, laptops and property listings, collaborative atmosphere, business professional photography --ar 3:2 --style raw'
          }
        };
        return professionalPrompts[type as keyof typeof professionalPrompts] || professionalPrompts.broker;
      case 'dashboards':
        return {
          icon: '📊',
          title: 'Dashboard Enterprise',
          description: 'Interfaz de administración',
          dimensions: '1920x1080px (16:9)',
          prompt: 'Sleek modern real estate dashboard interface on large desktop screen, showing analytics charts, property metrics, lead tracking, dark mode with gold accents, professional business intelligence dashboard, clean UI design, futuristic but approachable --ar 16:9 --style raw'
        };
      default:
        return {
          icon: '🖼️',
          title: 'Imagen Premium',
          description: 'Asset visual de alta calidad',
          dimensions: '1200x800px',
          prompt: 'Professional real estate photography, luxury home, modern design, warm lighting, photorealistic --ar 3:2 --style raw'
        };
    }
  };

  const content = getPlaceholderContent();

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center ${className}`}>
      <div className="text-6xl mb-4">{content.icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{content.title}</h3>
      <p className="text-slate-600 mb-4">{content.description}</p>
      <div className="bg-slate-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-mono text-slate-700">
          <strong>Dimensiones:</strong> {content.dimensions}
        </p>
        <p className="text-sm font-mono text-slate-700">
          <strong>Formato:</strong> WebP (optimizado)
        </p>
      </div>
      
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="font-bold text-blue-800 mb-2">📋 Instrucciones para Midjourney:</h4>
          <div className="bg-slate-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
            {content.prompt}
          </div>
          <div className="mt-3 text-sm text-blue-700">
            <p><strong>1.</strong> Copia el prompt de arriba</p>
            <p><strong>2.</strong> Pégalo en Midjourney</p>
            <p><strong>3.</strong> Genera 4 variantes</p>
            <p><strong>4.</strong> Elige la más natural y realista</p>
            <p><strong>5.</strong> Descarga en formato WebP</p>
            <p><strong>6.</strong> Renombra como: <code className="bg-slate-200 px-1 rounded">{type}.webp</code></p>
            <p><strong>7.</strong> Coloca en: <code className="bg-slate-200 px-1 rounded">/images/{category}/{type}/</code></p>
          </div>
        </div>
      )}
    </div>
  );
}
