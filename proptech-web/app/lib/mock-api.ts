// Backend temporal mientras se arregla Render
export const mockApi = {
  getListings: async () => {
    const mockListings = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Propiedad ${i + 1} en Santo Domingo`,
      price: Math.floor(Math.random() * 500000) + 50000,
      location: 'Santo Domingo, República Dominicana',
      latitude: 18.4 + Math.random() * 0.5,
      longitude: -69.9 + Math.random() * 0.8,
      image: `https://picsum.photos/800/600?random=${i}`,
      images: [`https://picsum.photos/800/600?random=${i}`],
      features: ['Piscina', 'Estacionamiento', 'Seguridad 24/7'],
      habitaScore: Math.floor(Math.random() * 100) + 400,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      square_meters: Math.floor(Math.random() * 200) + 50,
      brokerId: 1,
      type: 'apartment',
      operation: 'compra'
    }));
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { listings: mockListings };
  }
};
