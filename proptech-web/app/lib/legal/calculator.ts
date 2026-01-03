// Lógica de cálculo de impuestos RD
import { TaxCalculationRD, TaxBreakdownItem } from './types';

export function calculateRDTaxes(data: {
  precioPropiedad: number;
  tipoTransaccion: 'compra' | 'venta' | 'alquiler';
  tipoPropiedad: 'residencial' | 'comercial' | 'terreno';
  primeraVenta: boolean;
  incluirImpuestoAnual: boolean;
}): TaxCalculationRD {
  const { precioPropiedad, tipoTransaccion, tipoPropiedad, primeraVenta, incluirImpuestoAnual } = data;
  
  const desglose: TaxBreakdownItem[] = [];
  let total = precioPropiedad;

  // 1. ITBIS (Ley 11-92) - Solo primera venta por constructores
  if (primeraVenta && tipoTransaccion === 'compra') {
    const itbis = precioPropiedad * 0.18;
    desglose.push({
      concepto: 'ITBIS',
      monto: itbis,
      porcentaje: '18%',
      descripcion: 'Impuesto sobre primera venta (Ley 11-92) - Tasa general ITBIS 18%',
      obligatorio: primeraVenta
    });
    total += itbis;
  }

  // 2. Impuesto Transferencia (3%) - Ley 173-07
  if (tipoTransaccion === 'compra') {
    const impuestoTransferencia = precioPropiedad * 0.03;
    desglose.push({
      concepto: 'Impuesto Transferencia',
      monto: impuestoTransferencia,
      porcentaje: '3%',
      descripcion: 'Sobre valor de transacción (Ley 173-07)',
      obligatorio: true
    });
    total += impuestoTransferencia;
  }

  // 3. Gastos Notariales (~1%)
  const gastosNotariales = precioPropiedad * 0.01;
  desglose.push({
    concepto: 'Honorarios Notariales',
    monto: gastosNotariales,
    porcentaje: '1%',
    descripcion: 'Escrituración y legalización',
    obligatorio: true
  });
  total += gastosNotariales;

  // 4. Certificaciones (valores fijos RD)
  const certificaciones = 15000; // RD$15,000 aprox
  desglose.push({
    concepto: 'Certificaciones',
    monto: certificaciones,
    descripcion: 'Cert. no deuda DGII, TSS, etc.',
    obligatorio: true
  });
  total += certificaciones;

  // 5. Registro de Título
  const registroTitulo = 10000; // RD$10,000 aprox
  desglose.push({
    concepto: 'Registro de Título',
    monto: registroTitulo,
    descripcion: 'Inscripción en Registro de Títulos',
    obligatorio: true
  });
  total += registroTitulo;

  // 6. Impuesto Inmobiliario Anual (Ley 173-07)
  let impuestoInmobiliarioAnual = 0;
  if (incluirImpuestoAnual) {
    impuestoInmobiliarioAnual = precioPropiedad * 0.01; // 1% anual aprox
    desglose.push({
      concepto: 'Impuesto Inmobiliario Anual',
      monto: impuestoInmobiliarioAnual,
      porcentaje: '~1%',
      descripcion: 'Pago anual a DGII (varía por municipio)',
      obligatorio: true
    });
  }

  return {
    precioPropiedad,
    tipoTransaccion,
    tipoPropiedad,
    primeraVenta,
    incluirImpuestoAnual,
    resultados: {
      itbis: primeraVenta ? precioPropiedad * 0.18 : undefined,
      impuestoTransferencia: tipoTransaccion === 'compra' ? precioPropiedad * 0.03 : 0,
      impuestoInmobiliarioAnual,
      gastosNotariales,
      certificaciones,
      registroTitulo,
      total,
      desglose
    }
  };
}

