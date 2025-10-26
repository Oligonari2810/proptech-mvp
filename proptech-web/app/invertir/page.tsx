'use client'

import React, { useState } from 'react'
import { PropertyGrid } from '../components/PropertyGrid'

export default function InvertirPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Oportunidades de Inversión</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 mb-6">Próximamente: Propiedades con potencial de inversión</p>
          <button 
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            onClick={() => window.open('https://wa.me/+18091234567', '_blank')}
          >
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
