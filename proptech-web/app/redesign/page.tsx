'use client';

import HeroSection from '../components/redesign/HeroSection';
import ActionTiles from '../components/redesign/ActionTiles';
import '../styles/redesign/globals.css';
import '../styles/redesign/theme.css';

export default function RedesignHomePage() {
  return (
    <div className="min-h-screen bg-warm-bg">
      <HeroSection />
      <ActionTiles />
      
      {/* Sección Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline text-dark-green mb-4">¿Por qué elegir HabitatPro?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-title text-dark-green mb-2">IA que siente tu esencia</h3>
              <p className="text-gray-medium">
                No solo buscamos propiedades, encontramos espacios donde tus risas resonarán por años
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-title text-dark-green mb-2">Búsqueda con alma</h3>
              <p className="text-gray-medium">
                Dejamos atrás los filtros fríos para conectar con lo que realmente importa: tu bienestar
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">💖</div>
              <h3 className="text-title text-dark-green mb-2">Asesoría que abraza</h3>
              <p className="text-gray-medium">
                Tecnología con latido, profesionales que escuchan antes de vender
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

