// Información y trámites relacionados con CONFOTUR (Consejo Nacional de Fomento del Turismo)
// Para inversiones inmobiliarias turísticas en República Dominicana

export interface ConfoturProcedure {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'aprobacion' | 'beneficios' | 'extension' | 'modificacion';
  requisitos: string[];
  documentos: string[];
  tiempoEstimado: string;
  costoEstimado: number;
  pasos: ConfoturStep[];
  beneficios: string[];
  contacto: ConfoturContact;
}

export interface ConfoturStep {
  numero: number;
  titulo: string;
  descripcion: string;
  dondeIr?: string;
  documentosNecesarios?: string[];
  tiempoEstimado?: string;
  costo?: number;
}

export interface ConfoturContact {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  horario: string;
  paginaWeb: string;
}

export const confoturContact: ConfoturContact = {
  nombre: 'CONFOTUR - Consejo Nacional de Fomento del Turismo',
  telefono: '+1 (809) 221-4660',
  email: 'confotur@mitur.gob.do',
  direccion: 'Av. George Washington #500, Santo Domingo, República Dominicana',
  horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
  paginaWeb: 'https://www.mitur.gob.do/confotur'
};

export const confoturProcedures: ConfoturProcedure[] = [
  {
    id: 'aprobacion-proyecto-turistico',
    nombre: 'Aprobación de Proyecto Turístico',
    descripcion: 'Proceso para obtener la aprobación oficial de CONFOTUR para un proyecto inmobiliario turístico, lo cual permite acceder a beneficios fiscales e incentivos.',
    categoria: 'aprobacion',
    requisitos: [
      'Proyecto debe tener características turísticas reconocidas',
      'Monto mínimo de inversión según categoría',
      'Ubicación en zona turística o con potencial turístico',
      'Plan de inversión detallado y documentado',
      'Estudios de factibilidad y mercado',
      'Documentación de propiedad del terreno'
    ],
    documentos: [
      'Solicitud oficial a CONFOTUR',
      'Documento de identidad del inversionista',
      'Escritura de propiedad del terreno',
      'Plan de desarrollo del proyecto',
      'Estudio de factibilidad económica',
      'Estudio de impacto ambiental (si aplica)',
      'Planos arquitectónicos aprobados',
      'Presupuesto detallado del proyecto',
      'Cronograma de ejecución'
    ],
    tiempoEstimado: '30-60 días',
    costoEstimado: 50000, // RD$50,000 aprox
    pasos: [
      {
        numero: 1,
        titulo: 'Presentar Solicitud',
        descripcion: 'Presentar solicitud oficial ante CONFOTUR con toda la documentación requerida.',
        dondeIr: 'Oficinas de CONFOTUR, Av. George Washington #500, Santo Domingo',
        documentosNecesarios: ['Solicitud oficial', 'Documentos de identidad', 'Documentación del proyecto'],
        tiempoEstimado: '1 día',
        costo: 5000
      },
      {
        numero: 2,
        titulo: 'Revisión Técnica',
        descripcion: 'CONFOTUR realiza revisión técnica del proyecto y documentación presentada.',
        tiempoEstimado: '15-30 días'
      },
      {
        numero: 3,
        titulo: 'Evaluación y Aprobación',
        descripcion: 'El Consejo evalúa el proyecto y decide sobre la aprobación. Se puede solicitar información adicional.',
        tiempoEstimado: '15-30 días'
      },
      {
        numero: 4,
        titulo: 'Emisión de Resolución',
        descripcion: 'Si es aprobado, CONFOTUR emite resolución oficial que certifica la aprobación del proyecto turístico.',
        tiempoEstimado: '5-10 días'
      }
    ],
    beneficios: [
      'Exención de ITBIS (18%) en materiales de construcción',
      'Exención de impuesto de transferencia (3%)',
      'Exención de impuesto inmobiliario por 10-15 años',
      'Facilidades para importación de equipos',
      'Certificación oficial como proyecto turístico',
      'Acceso a financiamiento preferencial'
    ],
    contacto: confoturContact
  },
  {
    id: 'beneficios-fiscales-turisticos',
    nombre: 'Solicitud de Beneficios Fiscales para Proyectos Turísticos',
    descripcion: 'Proceso para solicitar y obtener los beneficios fiscales establecidos en la Ley 158-01 para inversiones turísticas aprobadas por CONFOTUR.',
    categoria: 'beneficios',
    requisitos: [
      'Proyecto debe estar previamente aprobado por CONFOTUR',
      'Inicio de construcción dentro del plazo establecido',
      'Cumplimiento de estándares turísticos',
      'Presentación de avances del proyecto periódicamente'
    ],
    documentos: [
      'Resolución de aprobación de CONFOTUR',
      'Copia de escritura de propiedad',
      'Planos de construcción aprobados',
      'Permisos de construcción',
      'Contratos con contratistas',
      'Certificados de inicio de obra'
    ],
    tiempoEstimado: '15-30 días',
    costoEstimado: 20000, // RD$20,000 aprox
    pasos: [
      {
        numero: 1,
        titulo: 'Solicitud de Beneficios',
        descripcion: 'Presentar solicitud formal para acceder a beneficios fiscales según Ley 158-01.',
        dondeIr: 'Oficinas de CONFOTUR',
        tiempoEstimado: '1 día'
      },
      {
        numero: 2,
        titulo: 'Verificación de Requisitos',
        descripcion: 'CONFOTUR verifica que el proyecto cumple con todos los requisitos para beneficios.',
        tiempoEstimado: '10-15 días'
      },
      {
        numero: 3,
        titulo: 'Aprobación de Beneficios',
        descripcion: 'Se emite certificado que permite acceder a los beneficios fiscales ante DGII.',
        tiempoEstimado: '5-10 días'
      }
    ],
    beneficios: [
      'Exención de ITBIS en compras locales',
      'Exención de impuestos de importación',
      'Exención temporal de impuesto inmobiliario',
      'Deducción acelerada de depreciación'
    ],
    contacto: confoturContact
  },
  {
    id: 'extension-beneficios',
    nombre: 'Extensión de Beneficios Fiscales',
    descripcion: 'Solicitud para extender los beneficios fiscales otorgados, generalmente por períodos adicionales según el avance del proyecto.',
    categoria: 'extension',
    requisitos: [
      'Proyecto con beneficios vigentes',
      'Avances significativos en ejecución',
      'Justificación para extensión',
      'Actualización de documentación del proyecto'
    ],
    documentos: [
      'Solicitud de extensión',
      'Informe de avances del proyecto',
      'Certificados de avance de obra',
      'Estados financieros actualizados'
    ],
    tiempoEstimado: '20-30 días',
    costoEstimado: 15000,
    pasos: [
      {
        numero: 1,
        titulo: 'Evaluación de Avances',
        descripcion: 'CONFOTUR evalúa el avance del proyecto para determinar elegibilidad de extensión.',
        tiempoEstimado: '10-15 días'
      },
      {
        numero: 2,
        titulo: 'Decisión sobre Extensión',
        descripcion: 'Se emite resolución sobre la extensión de beneficios.',
        tiempoEstimado: '10-15 días'
      }
    ],
    beneficios: ['Extensión de exenciones fiscales', 'Continuidad de beneficios'],
    contacto: confoturContact
  }
];

export function getConfoturProcedureById(id: string): ConfoturProcedure | undefined {
  return confoturProcedures.find(proc => proc.id === id);
}

export function getConfoturProceduresByCategory(categoria: string): ConfoturProcedure[] {
  return confoturProcedures.filter(proc => proc.categoria === categoria);
}

