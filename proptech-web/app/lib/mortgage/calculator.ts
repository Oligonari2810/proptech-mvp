// Lógica de cálculo hipotecario RD

import { MortgageCalculation, AmortizationRow, MortgageComparison } from './types';

export function calculateMortgage(data: {
  precioPropiedad: number;
  enganche: number; // % del precio
  tasaAnual: number; // % anual
  plazoAnos: number;
  banco?: string;
}): MortgageCalculation {
  const { precioPropiedad, enganche, tasaAnual, plazoAnos, banco } = data;

  // Validaciones básicas
  if (precioPropiedad <= 0) {
    throw new Error('El precio de la propiedad debe ser mayor a 0');
  }
  if (enganche < 0 || enganche >= 100) {
    throw new Error('El enganche debe estar entre 0% y 100%');
  }
  if (tasaAnual <= 0 || tasaAnual > 50) {
    throw new Error('La tasa anual debe estar entre 0% y 50%');
  }
  if (plazoAnos <= 0 || plazoAnos > 50) {
    throw new Error('El plazo debe estar entre 1 y 50 años');
  }

  // Cálculos
  const engancheMonto = (precioPropiedad * enganche) / 100;
  const montoFinanciar = precioPropiedad - engancheMonto;
  
  // Tasa mensual (convertir de anual a mensual)
  const tasaMensual = tasaAnual / 12 / 100;
  
  // Número de pagos
  const numeroPagos = plazoAnos * 12;

  // Cálculo de cuota mensual usando fórmula de amortización francesa
  // Cuota = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  // donde P = principal, r = tasa mensual, n = número de pagos
  const cuotaMensual = montoFinanciar * 
    (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / 
    (Math.pow(1 + tasaMensual, numeroPagos) - 1);

  // Total a pagar
  const totalPago = cuotaMensual * numeroPagos;
  const totalIntereses = totalPago - montoFinanciar;

  // Tabla de amortización
  const amortizacion: AmortizationRow[] = [];
  let saldoRestante = montoFinanciar;

  for (let mes = 1; mes <= numeroPagos; mes++) {
    const intereses = saldoRestante * tasaMensual;
    const capital = cuotaMensual - intereses;
    saldoRestante = saldoRestante - capital;

    amortizacion.push({
      mes,
      cuota: cuotaMensual,
      capital,
      intereses,
      saldoRestante: Math.max(0, saldoRestante) // Evitar negativos por redondeo
    });
  }

  return {
    precioPropiedad,
    montoFinanciar,
    enganche: engancheMonto,
    tasaAnual,
    plazoAnos,
    banco: banco || 'No especificado',
    resultados: {
      cuotaMensual,
      totalPago,
      totalIntereses,
      tasaMensual: tasaMensual * 100, // Convertir a porcentaje
      amortizacion
    }
  };
}

export function compareMortgages(
  montoFinanciar: number,
  plazoAnos: number,
  tasas: Array<{ banco: string; tasaAnual: number }>
): MortgageComparison[] {
  const comparaciones: MortgageComparison[] = [];

  for (const { banco, tasaAnual } of tasas) {
    const calculo = calculateMortgage({
      precioPropiedad: montoFinanciar / (1 - 0.2), // Precio estimado con 20% enganche
      enganche: 20,
      tasaAnual,
      plazoAnos,
      banco
    });

    comparaciones.push({
      banco,
      tasaAnual,
      cuotaMensual: calculo.resultados.cuotaMensual,
      totalPago: calculo.resultados.totalPago,
      totalIntereses: calculo.resultados.totalIntereses,
      diferenciaMensual: 0 // Se calcula después
    });
  }

  // Ordenar por cuota mensual (más barata primero)
  comparaciones.sort((a, b) => a.cuotaMensual - b.cuotaMensual);

  // Calcular diferencia vs la más barata
  const cuotaMasBarata = comparaciones[0].cuotaMensual;
  comparaciones.forEach(comp => {
    comp.diferenciaMensual = comp.cuotaMensual - cuotaMasBarata;
  });

  return comparaciones;
}

