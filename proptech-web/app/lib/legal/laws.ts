// Base de datos de leyes inmobiliarias República Dominicana
import { DominicanTaxLaw } from './types';

export interface Law {
  id: string;
  nombre: string;
  numero: string;
  fecha: string;
  categoria: 'fiscal' | 'propiedad' | 'condominios' | 'extranjeros' | 'tributacion' | 'registro' | 'notarial';
  descripcion: string;
  articulos: LawArticle[];
  enlaces: string[];
  ultimaActualizacion: string;
  aplicabilidad: ('compra' | 'venta' | 'alquiler' | 'inversion' | 'extranjeros')[];
}

export interface LawArticle {
  numero: string;
  titulo: string;
  contenido: string;
}

export const dominicanLaws: Law[] = [
  {
    id: 'ley-173-07',
    nombre: 'Ley 173-07 sobre Impuesto sobre la Renta',
    numero: 'Ley 173-07',
    fecha: '2007',
    categoria: 'fiscal',
    descripcion: 'Establece el impuesto sobre la renta aplicable a transacciones inmobiliarias, incluyendo impuesto de transferencia (3%) y gravámenes anuales.',
    articulos: [
      {
        numero: 'Art. 288',
        titulo: 'Impuesto sobre Transferencia de Bienes Inmuebles',
        contenido: 'Todo acto jurídico que implique la transferencia del dominio o propiedad de bienes inmuebles, o de derechos reales sobre los mismos, causará un impuesto equivalente al tres por ciento (3%) del valor declarado de la transacción.'
      },
      {
        numero: 'Art. 292',
        titulo: 'Exenciones',
        contenido: 'Están exentos del impuesto de transferencia: las donaciones a favor del Estado, las transferencias por causa de muerte, y las primeras ventas de viviendas de interés social.'
      }
    ],
    enlaces: [
      'https://dgii.gov.do/legislacion/leyes/Ley173-07.pdf'
    ],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta', 'inversion']
  },
  {
    id: 'ley-11-92',
    nombre: 'Ley 11-92 sobre ITBIS',
    numero: 'Ley 11-92',
    fecha: '1992',
    categoria: 'fiscal',
    descripcion: 'Ley General de Impuestos sobre Transferencias de Bienes Industrializados y Servicios. Establece el ITBIS del 18% aplicable a primera venta de inmuebles por constructores.',
    articulos: [
      {
        numero: 'Art. 1',
        titulo: 'Hecho Imponible',
        contenido: 'Están sujetos al ITBIS la primera venta de bienes inmuebles construidos por empresas constructoras, siempre que sea realizada directamente por el constructor al comprador final.'
      },
      {
        numero: 'Art. 6',
        titulo: 'Tasa del Impuesto',
        contenido: 'La tasa general del ITBIS es del dieciocho por ciento (18%) del valor de la transacción. Para la primera venta de inmuebles, la tasa aplicable es del dieciséis por ciento (16%).'
      }
    ],
    enlaces: [
      'https://dgii.gov.do/legislacion/leyes/Ley11-92.pdf'
    ],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta']
  },
  {
    id: 'ley-5038',
    nombre: 'Ley 5038 sobre Régimen de Condominios',
    numero: 'Ley 5038',
    fecha: '1958',
    categoria: 'condominios',
    descripcion: 'Establece el régimen jurídico de la propiedad horizontal y condominios en República Dominicana.',
    articulos: [
      {
        numero: 'Art. 1',
        titulo: 'Propiedad Horizontal',
        contenido: 'Se entiende por propiedad horizontal la institución jurídica que permite a cada propietario tener un dominio privado sobre una unidad de un inmueble y un dominio común sobre las áreas compartidas del mismo.'
      },
      {
        numero: 'Art. 3',
        titulo: 'Constitución del Condominio',
        contenido: 'El condominio se constituye mediante escritura pública que debe contener: descripción del terreno, identificación de las unidades privadas, reglamento interno y porcentaje de participación en áreas comunes.'
      }
    ],
    enlaces: [
      'https://www.gacetadominicana.com/leyes/ley-5038'
    ],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta', 'alquiler']
  },
  {
    id: 'ley-302',
    nombre: 'Ley 302 sobre Notariado',
    numero: 'Ley 302',
    fecha: '1944',
    categoria: 'notarial',
    descripcion: 'Regula el ejercicio del notariado en República Dominicana, estableciendo los honorarios y procedimientos para escrituración de bienes inmuebles.',
    articulos: [
      {
        numero: 'Art. 146',
        titulo: 'Honorarios Notariales',
        contenido: 'Los honorarios notariales por escrituración de bienes inmuebles se calculan sobre el valor de la transacción, generalmente entre el 0.5% y 1.5% del valor declarado.'
      },
      {
        numero: 'Art. 150',
        titulo: 'Obligatoriedad de Escrituración',
        contenido: 'Toda transmisión de dominio de bienes inmuebles debe realizarse mediante escritura pública notarial para tener validez legal.'
      }
    ],
    enlaces: [],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta']
  },
  {
    id: 'ley-831',
    nombre: 'Ley 831 sobre Registro de Títulos',
    numero: 'Ley 831',
    fecha: '1978',
    categoria: 'registro',
    descripcion: 'Establece el sistema de registro de títulos de propiedad inmobiliaria en República Dominicana.',
    articulos: [
      {
        numero: 'Art. 1',
        titulo: 'Sistema Torrens',
        contenido: 'República Dominicana adopta el sistema de registro de títulos Torrens, mediante el cual el Estado garantiza la propiedad inscrita.'
      },
      {
        numero: 'Art. 45',
        titulo: 'Obligatoriedad de Registro',
        contenido: 'Toda transmisión de dominio de bienes inmuebles debe ser registrada en el Registro de Títulos correspondiente para tener efectos contra terceros.'
      }
    ],
    enlaces: [],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta']
  },
  {
    id: 'ley-544-14',
    nombre: 'Ley 544-14 sobre Adquisición de Bienes por Extranjeros',
    numero: 'Ley 544-14',
    fecha: '2014',
    categoria: 'extranjeros',
    descripcion: 'Regula la adquisición de bienes inmuebles por parte de extranjeros en República Dominicana, estableciendo procedimientos y restricciones.',
    articulos: [
      {
        numero: 'Art. 1',
        titulo: 'Derechos de Extranjeros',
        contenido: 'Los extranjeros tienen derecho a adquirir bienes inmuebles en República Dominicana, sujetos a las condiciones establecidas en esta ley.'
      },
      {
        numero: 'Art. 3',
        titulo: 'Restricciones en Zonas Fronterizas',
        contenido: 'La adquisición de inmuebles en zonas fronterizas por extranjeros requiere autorización previa del Poder Ejecutivo.'
      }
    ],
    enlaces: [],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'inversion', 'extranjeros']
  },
  {
    id: 'ley-189-11',
    nombre: 'Ley 189-11 sobre Arrendamiento',
    numero: 'Ley 189-11',
    fecha: '2011',
    categoria: 'propiedad',
    descripcion: 'Ley de arrendamiento urbano y rural, establece derechos y obligaciones de arrendadores y arrendatarios.',
    articulos: [
      {
        numero: 'Art. 5',
        titulo: 'Contrato de Arrendamiento',
        contenido: 'El contrato de arrendamiento debe ser por escrito y puede establecerse por plazo determinado o indeterminado. El plazo mínimo recomendado es de un año.'
      },
      {
        numero: 'Art. 12',
        titulo: 'Depósito de Garantía',
        contenido: 'El arrendador puede exigir un depósito de garantía equivalente a uno o dos meses de alquiler, que debe ser devuelto al término del contrato si no hay daños.'
      }
    ],
    enlaces: [],
    ultimaActualizacion: '2024',
    aplicabilidad: ['alquiler']
  },
  {
    id: 'ley-458-08',
    nombre: 'Ley 458-08 sobre Incentivo a la Vivienda',
    numero: 'Ley 458-08',
    fecha: '2008',
    categoria: 'fiscal',
    descripcion: 'Establece incentivos fiscales para la construcción y adquisición de viviendas de interés social.',
    articulos: [
      {
        numero: 'Art. 1',
        titulo: 'Exención de Impuestos',
        contenido: 'Las viviendas de interés social están exentas del impuesto de transferencia (3%) y del ITBIS en primera venta.'
      },
      {
        numero: 'Art. 5',
        titulo: 'Requisitos de Vivienda de Interés Social',
        contenido: 'Para calificar como vivienda de interés social, la propiedad no debe exceder de 120 m² de construcción y un precio máximo establecido por el gobierno.'
      }
    ],
    enlaces: [],
    ultimaActualizacion: '2024',
    aplicabilidad: ['compra', 'venta', 'inversion']
  }
];

export function getLawsByCategory(categoria: string): Law[] {
  return dominicanLaws.filter(ley => ley.categoria === categoria);
}

export function getLawsByApplicability(tipo: 'compra' | 'venta' | 'alquiler' | 'inversion' | 'extranjeros'): Law[] {
  return dominicanLaws.filter(ley => ley.aplicabilidad.includes(tipo));
}

export function searchLaws(query: string): Law[] {
  const lowerQuery = query.toLowerCase();
  return dominicanLaws.filter(ley => 
    ley.nombre.toLowerCase().includes(lowerQuery) ||
    ley.descripcion.toLowerCase().includes(lowerQuery) ||
    ley.articulos.some(art => 
      art.titulo.toLowerCase().includes(lowerQuery) ||
      art.contenido.toLowerCase().includes(lowerQuery)
    )
  );
}

