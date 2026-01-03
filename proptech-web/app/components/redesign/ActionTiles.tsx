'use client';

import React from 'react';
import Card from './Card';
import Button from './Button';

interface ActionTile {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

const actions: ActionTile[] = [
  {
    id: 'comprar',
    icon: '🏠',
    title: 'Comprar',
    description: 'Tu hogar ideal te está esperando',
    link: '/redesign/comprar',
    color: 'primary-teal'
  },
  {
    id: 'alquilar',
    icon: '🔑',
    title: 'Alquilar',
    description: 'Llaves para empezar tu historia',
    link: '/redesign/alquilar',
    color: 'primary-teal'
  },
  {
    id: 'invertir',
    icon: '📈',
    title: 'Invertir',
    description: 'Construye tu legado inmobiliario',
    link: '/redesign/invertir',
    color: 'primary-teal'
  },
  {
    id: 'vender',
    icon: '💰',
    title: 'Vender',
    description: 'Convierte tu propiedad en oportunidades',
    link: '/redesign/vender',
    color: 'primary-teal'
  }
];

export default function ActionTiles() {
  return (
    <section className="py-16 bg-warm-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-headline text-dark-green mb-4">
            Hogares que laten, no solo espacios
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Cada propiedad tiene una historia. Nosotros te ayudamos a encontrar la tuya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action) => (
            <Card
              key={action.id}
              hover
              onClick={() => {
                window.location.href = action.link;
              }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{action.icon}</div>
              <h3 className="text-title text-dark-green mb-2">{action.title}</h3>
              <p className="text-gray-medium mb-6">{action.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Explorar →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

