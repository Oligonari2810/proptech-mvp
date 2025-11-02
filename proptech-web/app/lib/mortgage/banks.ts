// Base de datos de bancos dominicanos y sus tasas hipotecarias

import { DominicanBank } from './types';

export const dominicanBanks: DominicanBank[] = [
  {
    id: 'banreservas',
    nombre: 'BanReservas',
    tasaMinima: 9.5,
    tasaMaxima: 13.5,
    tasaRecomendada: 11.5,
    engancheMinimo: 20,
    plazoMaximo: 30,
    requisitos: [
      'Ingresos mínimos RD$ 50,000/mes',
      'Historial crediticio de mínimo 2 años',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 3 meses'
    ],
    contacto: {
      telefono: '+1 (809) 960-2121',
      web: 'https://www.banreservas.com'
    }
  },
  {
    id: 'popular',
    nombre: 'Banco Popular',
    tasaMinima: 9.75,
    tasaMaxima: 13.75,
    tasaRecomendada: 11.75,
    engancheMinimo: 20,
    plazoMaximo: 30,
    requisitos: [
      'Ingresos mínimos RD$ 55,000/mes',
      'Score crediticio mínimo 650',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 6 meses'
    ],
    contacto: {
      telefono: '+1 (809) 544-5000',
      web: 'https://www.popularenlinea.com'
    }
  },
  {
    id: 'bhd',
    nombre: 'Banco BHD León',
    tasaMinima: 9.25,
    tasaMaxima: 13.25,
    tasaRecomendada: 11.25,
    engancheMinimo: 20,
    plazoMaximo: 30,
    requisitos: [
      'Ingresos mínimos RD$ 60,000/mes',
      'Score crediticio mínimo 680',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 3 meses'
    ],
    contacto: {
      telefono: '+1 (809) 563-2244',
      web: 'https://www.bhdleon.com'
    }
  },
  {
    id: 'scotiabank',
    nombre: 'Scotiabank República Dominicana',
    tasaMinima: 10.0,
    tasaMaxima: 14.0,
    tasaRecomendada: 12.0,
    engancheMinimo: 20,
    plazoMaximo: 25,
    requisitos: [
      'Ingresos mínimos RD$ 65,000/mes',
      'Score crediticio mínimo 700',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 6 meses'
    ],
    contacto: {
      telefono: '+1 (809) 566-6161',
      web: 'https://www.scotiabank.com/do'
    }
  },
  {
    id: 'banco-leon',
    nombre: 'Banco León',
    tasaMinima: 9.5,
    tasaMaxima: 13.5,
    tasaRecomendada: 11.5,
    engancheMinimo: 25,
    plazoMaximo: 30,
    requisitos: [
      'Ingresos mínimos RD$ 50,000/mes',
      'Historial crediticio de mínimo 2 años',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 3 meses'
    ],
    contacto: {
      telefono: '+1 (809) 687-5000',
      web: 'https://www.bancoleon.com'
    }
  },
  {
    id: 'santander',
    nombre: 'Banco Santander',
    tasaMinima: 10.25,
    tasaMaxima: 14.25,
    tasaRecomendada: 12.25,
    engancheMinimo: 20,
    plazoMaximo: 30,
    requisitos: [
      'Ingresos mínimos RD$ 60,000/mes',
      'Score crediticio mínimo 670',
      'Cédula de identidad válida',
      'Comprobante de ingresos últimos 6 meses'
    ],
    contacto: {
      telefono: '+1 (809) 688-5000',
      web: 'https://www.santander.com.do'
    }
  }
];

export function getBankById(id: string): DominicanBank | undefined {
  return dominicanBanks.find(bank => bank.id === id);
}

export function getRecommendedBank(precioPropiedad: number, enganche: number): DominicanBank {
  // Lógica simple: recomendar banco con mejor tasa para el monto
  // En producción, esto podría considerar más factores
  const banksSorted = [...dominicanBanks].sort((a, b) => 
    a.tasaRecomendada - b.tasaRecomendada
  );
  return banksSorted[0]; // Mejor tasa
}

