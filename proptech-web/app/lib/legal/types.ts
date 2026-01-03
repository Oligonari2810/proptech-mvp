// Tipos TypeScript para módulo legal RD
export interface TaxCalculationRD {
  precioPropiedad: number;
  tipoTransaccion: 'compra' | 'venta' | 'alquiler';
  tipoPropiedad: 'residencial' | 'comercial' | 'terreno';
  primeraVenta: boolean;
  incluirImpuestoAnual: boolean;
  resultados: {
    itbis?: number;
    impuestoTransferencia: number;
    impuestoInmobiliarioAnual: number;
    gastosNotariales: number;
    certificaciones: number;
    registroTitulo: number;
    total: number;
    desglose: TaxBreakdownItem[];
  };
}

export interface TaxBreakdownItem {
  concepto: string;
  monto: number;
  porcentaje?: string;
  descripcion: string;
  obligatorio: boolean;
}

export interface DominicanTaxLaw {
  ley: string;
  articulo: string;
  descripcion: string;
  tasa: string;
  excepciones: string[];
}

