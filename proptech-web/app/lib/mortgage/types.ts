// Tipos para calculadora hipotecaria RD

export interface MortgageCalculation {
  precioPropiedad: number;
  montoFinanciar: number;
  enganche: number;
  tasaAnual: number;
  plazoAnos: number;
  banco: string;
  resultados: {
    cuotaMensual: number;
    totalPago: number;
    totalIntereses: number;
    tasaMensual: number;
    amortizacion: AmortizationRow[];
  };
}

export interface AmortizationRow {
  mes: number;
  cuota: number;
  capital: number;
  intereses: number;
  saldoRestante: number;
}

export interface DominicanBank {
  id: string;
  nombre: string;
  tasaMinima: number; // % anual
  tasaMaxima: number; // % anual
  tasaRecomendada: number; // % anual (tasa típica)
  engancheMinimo: number; // % del valor
  plazoMaximo: number; // años
  requisitos: string[];
  contacto: {
    telefono: string;
    web: string;
  };
}

export interface MortgageComparison {
  banco: string;
  tasaAnual: number;
  cuotaMensual: number;
  totalPago: number;
  totalIntereses: number;
  diferenciaMensual: number; // vs el más barato
}

