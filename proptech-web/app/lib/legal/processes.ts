// Base de datos de trámites inmobiliarios República Dominicana
export interface Process {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'compra' | 'venta' | 'construccion' | 'registro' | 'extranjeros' | 'inversion';
  duracion: string; // "30-60 días"
  costoEstimado: string; // "4-6% del valor"
  pasos: ProcessStep[];
  documentosRequeridos: Document[];
  instituciones: Institution[];
  estimacionCostos: CostEstimate[];
  enlacesUtiles: string[];
  tips: string[];
  frecuentes: FAQ[];
}

export interface ProcessStep {
  numero: number;
  titulo: string;
  descripcion: string;
  institucion: string;
  dondeIr: string;
  direccion: string;
  telefono: string;
  horario: string;
  documentosNecesarios: string[];
  tiempoEstimado: string;
  costoEstimado: number;
  plazo: string; // Días hábiles
  importante: string[]; // Puntos importantes
}

export interface Document {
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  dondeObtener: string;
  costo: number;
  validez: string; // "30 días", "6 meses", etc.
}

export interface Institution {
  nombre: string;
  sigla: string;
  contacto: {
    telefono: string;
    email: string;
    direccion: string;
    horario: string;
    web: string;
  };
  rol: string; // Qué hace esta institución en el trámite
}

export interface CostEstimate {
  concepto: string;
  rango: string; // "RD$ 5,000 - 10,000"
  cuando: string; // Cuándo se paga
  obligatorio: boolean;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export const dominicanProcesses: Process[] = [
  {
    id: 'compra-venta-inmueble',
    nombre: 'Compra-Venta de Inmueble',
    descripcion: 'Proceso completo para transferir la propiedad de un inmueble en República Dominicana, incluyendo registro, impuestos y certificaciones.',
    categoria: 'compra',
    duracion: '30-60 días',
    costoEstimado: '4-6% del valor de la propiedad',
    pasos: [
      {
        numero: 1,
        titulo: 'Verificación de Título de Propiedad',
        descripcion: 'Verificar que el vendedor tiene título de propiedad válido y sin gravámenes en el Registro de Títulos.',
        institucion: 'Registro de Títulos',
        dondeIr: 'Oficina del Registro de Títulos correspondiente a la jurisdicción del inmueble',
        direccion: 'Varía por jurisdicción (Santo Domingo, Santiago, etc.)',
        telefono: '+1 (809) 682-7340',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Certificado de título actualizado',
          'Cédula de identidad del vendedor',
          'Cédula de identidad del comprador'
        ],
        tiempoEstimado: '5-10 días',
        costoEstimado: 5000, // RD$5,000
        plazo: '10 días hábiles',
        importante: [
          'Verificar que no hay gravámenes o embargos',
          'Confirmar que el título está actualizado',
          'Revisar medidas y linderos del terreno'
        ]
      },
      {
        numero: 2,
        titulo: 'Certificado de Libertad de Gravámenes',
        descripcion: 'Obtener certificado de la DGII confirmando que la propiedad no tiene deudas fiscales.',
        institucion: 'DGII - Dirección General de Impuestos Internos',
        dondeIr: 'Cualquier oficina de DGII',
        direccion: 'Av. Winston Churchill #71, Santo Domingo',
        telefono: '+1 (809) 689-4300',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Cédula del propietario',
          'Certificado de título',
          'Formulario DGII (disponible en oficina)'
        ],
        tiempoEstimado: '5-7 días',
        costoEstimado: 2000,
        plazo: '7 días hábiles',
        importante: [
          'El certificado tiene validez de 30 días',
          'Debe estar actualizado al momento de la escrituración'
        ]
      },
      {
        numero: 3,
        titulo: 'Certificado de No Deuda TSS',
        descripcion: 'Certificado de la Tesorería de la Seguridad Social confirmando que no hay deudas laborales.',
        institucion: 'TSS - Tesorería de la Seguridad Social',
        dondeIr: 'Oficinas TSS',
        direccion: 'Av. Independencia #506, Santo Domingo',
        telefono: '+1 (809) 541-1515',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Cédula del propietario',
          'Formulario TSS'
        ],
        tiempoEstimado: '3-5 días',
        costoEstimado: 1000,
        plazo: '5 días hábiles',
        importante: [
          'Solo necesario si la propiedad fue usada para actividad comercial',
          'Validez: 30 días'
        ]
      },
      {
        numero: 4,
        titulo: 'Escritura Notarial',
        descripcion: 'Firma de la escritura pública ante notario público para formalizar la compra-venta.',
        institucion: 'Notario Público',
        dondeIr: 'Despacho notarial de su elección',
        direccion: 'Varía por notario',
        telefono: 'Varía por notario',
        horario: 'Varía por notario',
        documentosNecesarios: [
          'Cédulas de identidad de vendedor y comprador',
          'Certificado de título actualizado',
          'Certificado de libertad de gravámenes DGII',
          'Certificado TSS (si aplica)',
          'Informe catastral (si aplica)',
          'Poder notarial (si alguna parte no puede estar presente)'
        ],
        tiempoEstimado: '1 día',
        costoEstimado: 0, // Se calcula como % del valor
        plazo: 'Mismo día',
        importante: [
          'Ambas partes deben estar presentes',
          'El notario calculará honorarios según valor de la propiedad (1-1.5%)',
          'Se firmará en el despacho notarial'
        ]
      },
      {
        numero: 5,
        titulo: 'Pago de Impuestos de Transferencia',
        descripcion: 'Pago del impuesto de transferencia (3% del valor) en la DGII antes de registrar la escritura.',
        institucion: 'DGII',
        dondeIr: 'Oficina de DGII',
        direccion: 'Av. Winston Churchill #71, Santo Domingo',
        telefono: '+1 (809) 689-4300',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Escritura notarial',
          'Formulario DGII de transferencia',
          'Certificado de título',
          'Recibo de pago notarial'
        ],
        tiempoEstimado: '1-2 días',
        costoEstimado: 0, // 3% del valor de la propiedad
        plazo: 'Mismo día si se paga en efectivo',
        importante: [
          'El impuesto es del 3% sobre el valor declarado',
          'Se debe pagar ANTES de registrar la escritura',
          'Se puede pagar con cheque o transferencia'
        ]
      },
      {
        numero: 6,
        titulo: 'Registro de la Escritura',
        descripcion: 'Inscripción de la escritura en el Registro de Títulos para transferir el dominio oficialmente.',
        institucion: 'Registro de Títulos',
        dondeIr: 'Oficina del Registro de Títulos',
        direccion: 'Varía por jurisdicción',
        telefono: '+1 (809) 682-7340',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Escritura notarial original',
          'Comprobante de pago de impuesto de transferencia',
          'Certificado de título anterior',
          'Formulario de registro'
        ],
        tiempoEstimado: '15-30 días',
        costoEstimado: 10000, // RD$10,000 aproximadamente
        plazo: '30 días hábiles',
        importante: [
          'Solo después de tener el comprobante de pago de impuestos',
          'El registro es obligatorio para transferir el dominio',
          'Una vez registrado, el comprador es el nuevo propietario oficial'
        ]
      },
      {
        numero: 7,
        titulo: 'Actualización Catastral (si aplica)',
        descripcion: 'Actualizar información catastral con el valor de la nueva transacción.',
        institucion: 'DGII - Catastro',
        dondeIr: 'Oficina de Catastro de DGII',
        direccion: 'Av. Winston Churchill #71, Santo Domingo',
        telefono: '+1 (809) 689-4300',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Escritura registrada',
          'Certificado de título nuevo',
          'Formulario catastral'
        ],
        tiempoEstimado: '5-10 días',
        costoEstimado: 3000,
        plazo: '10 días hábiles',
        importante: [
          'Necesario para cálculo correcto de impuesto inmobiliario anual',
          'Se actualiza automáticamente cuando se registra la escritura en algunos casos'
        ]
      },
      {
        numero: 8,
        titulo: 'Entrega de Llaves y Posesión',
        descripcion: 'Entrega física de la propiedad al comprador. Este paso es informal pero importante.',
        institucion: 'No aplica',
        dondeIr: 'En la propiedad',
        direccion: 'Dirección de la propiedad',
        telefono: 'N/A',
        horario: 'Acordar con vendedor',
        documentosNecesarios: [
          'Certificado de título nuevo',
          'Acta de entrega (opcional pero recomendado)'
        ],
        tiempoEstimado: '1 día',
        costoEstimado: 0,
        plazo: 'Acordar',
        importante: [
          'Asegurar que la propiedad esté vacía y en condiciones acordadas',
          'Verificar que todas las instalaciones funcionen',
          'Documentar cualquier daño o condición'
        ]
      }
    ],
    documentosRequeridos: [
      {
        nombre: 'Cédula de Identidad',
        descripcion: 'Cédula del vendedor y comprador (original y copia)',
        obligatorio: true,
        dondeObtener: 'Junta Central Electoral',
        costo: 500,
        validez: 'Permanente (renovar cada 10 años)'
      },
      {
        nombre: 'Certificado de Título',
        descripcion: 'Título de propiedad actualizado del inmueble',
        obligatorio: true,
        dondeObtener: 'Registro de Títulos',
        costo: 2000,
        validez: '30 días'
      },
      {
        nombre: 'Certificado de Libertad de Gravámenes DGII',
        descripcion: 'Certificado de no deuda fiscal',
        obligatorio: true,
        dondeObtener: 'DGII',
        costo: 2000,
        validez: '30 días'
      },
      {
        nombre: 'Certificado TSS',
        descripcion: 'Certificado de no deuda laboral',
        obligatorio: false,
        dondeObtener: 'TSS',
        costo: 1000,
        validez: '30 días'
      },
      {
        nombre: 'Informe Catastral',
        descripcion: 'Informe del valor catastral de la propiedad',
        obligatorio: false,
        dondeObtener: 'DGII - Catastro',
        costo: 3000,
        validez: '6 meses'
      }
    ],
    instituciones: [
      {
        nombre: 'Dirección General de Impuestos Internos',
        sigla: 'DGII',
        contacto: {
          telefono: '+1 (809) 689-4300',
          email: 'info@dgii.gov.do',
          direccion: 'Av. Winston Churchill #71, Santo Domingo',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'https://www.dgii.gov.do'
        },
        rol: 'Gestión de impuestos, certificados de no deuda, registro catastral'
      },
      {
        nombre: 'Registro de Títulos',
        sigla: 'Registro',
        contacto: {
          telefono: '+1 (809) 682-7340',
          email: 'info@registrotitulos.gov.do',
          direccion: 'Varía por jurisdicción',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'https://www.registrotitulos.gov.do'
        },
        rol: 'Registro y verificación de títulos de propiedad'
      },
      {
        nombre: 'Tesorería de la Seguridad Social',
        sigla: 'TSS',
        contacto: {
          telefono: '+1 (809) 541-1515',
          email: 'info@tss.gov.do',
          direccion: 'Av. Independencia #506, Santo Domingo',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'https://www.tss.gov.do'
        },
        rol: 'Certificado de no deuda laboral'
      }
    ],
    estimacionCostos: [
      {
        concepto: 'Honorarios Notariales',
        rango: '1-1.5% del valor de la propiedad',
        cuando: 'Al momento de escrituración',
        obligatorio: true
      },
      {
        concepto: 'Impuesto de Transferencia',
        rango: '3% del valor de la propiedad',
        cuando: 'Antes de registrar la escritura',
        obligatorio: true
      },
      {
        concepto: 'Registro de Título',
        rango: 'RD$ 8,000 - 12,000',
        cuando: 'Al momento de registro',
        obligatorio: true
      },
      {
        concepto: 'Certificaciones',
        rango: 'RD$ 5,000 - 8,000',
        cuando: 'Durante el proceso',
        obligatorio: true
      },
      {
        concepto: 'ITBIS (si primera venta)',
        rango: '18% del valor (solo primera venta por constructor)',
        cuando: 'Al momento de escrituración',
        obligatorio: false
      }
    ],
    enlacesUtiles: [
      'https://www.dgii.gov.do',
      'https://www.registrotitulos.gov.do',
      'https://www.tss.gov.do'
    ],
    tips: [
      'Contrata un abogado especializado para revisar toda la documentación',
      'Verifica que el título no tenga gravámenes antes de firmar',
      'Asegúrate de que todos los certificados estén vigentes (30 días)',
      'Negocia quién paga los impuestos (comprador o vendedor)',
      'Considera contratar un gestor para agilizar trámites',
      'Mantén copias de todos los documentos entregados'
    ],
    frecuentes: [
      {
        pregunta: '¿Cuánto tiempo tarda el proceso completo?',
        respuesta: 'El proceso completo de compra-venta puede tardar entre 30 y 60 días hábiles, dependiendo de la complejidad y la rapidez en obtener certificados.'
      },
      {
        pregunta: '¿Quién paga los impuestos de transferencia?',
        respuesta: 'Por convención, generalmente el comprador paga el impuesto de transferencia (3%), aunque esto es negociable entre las partes.'
      },
      {
        pregunta: '¿Es obligatorio contratar un abogado?',
        respuesta: 'Aunque no es estrictamente obligatorio, es altamente recomendable contratar un abogado especializado en derecho inmobiliario para revisar documentos y evitar problemas legales.'
      },
      {
        pregunta: '¿Qué pasa si el título tiene gravámenes?',
        respuesta: 'Si hay gravámenes registrados (hipotecas, embargos), estos deben ser liberados antes de la transferencia. El vendedor es responsable de esto.'
      },
      {
        pregunta: '¿Puedo comprar si soy extranjero?',
        respuesta: 'Sí, los extranjeros pueden comprar inmuebles en RD. Para zonas fronterizas se requiere autorización del Poder Ejecutivo. Ver Ley 544-14.'
      }
    ]
  },
  {
    id: 'permiso-construccion',
    nombre: 'Permiso de Construcción',
    descripcion: 'Proceso para obtener permiso de construcción en República Dominicana, incluyendo trámites en Ayuntamiento, MOPC y Medio Ambiente.',
    categoria: 'construccion',
    duracion: '60-90 días',
    costoEstimado: '2-4% del valor del proyecto',
    pasos: [
      {
        numero: 1,
        titulo: 'Plano Arquitectónico Aprobado',
        descripcion: 'Contratar arquitecto colegiado para diseñar planos según normativas locales.',
        institucion: 'Colegio de Arquitectos',
        dondeIr: 'Despacho de arquitecto colegiado',
        direccion: 'Varía',
        telefono: 'Varía',
        horario: 'Varía',
        documentosNecesarios: [
          'Certificado de título del terreno',
          'Informe de topografía',
          'Estudio de suelos (si aplica)'
        ],
        tiempoEstimado: '15-30 días',
        costoEstimado: 0, // % del proyecto
        plazo: '30 días',
        importante: [
          'El arquitecto debe estar colegiado',
          'Los planos deben cumplir normativas locales',
          'Se requiere licencia de construcción del Ayuntamiento'
        ]
      },
      {
        numero: 2,
        titulo: 'Aprobación en Ayuntamiento',
        descripcion: 'Solicitar y obtener aprobación del proyecto en el Ayuntamiento correspondiente.',
        institucion: 'Ayuntamiento',
        dondeIr: 'Oficina de Planificación Urbana del Ayuntamiento',
        direccion: 'Varía por municipio',
        telefono: 'Varía por municipio',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Plano arquitectónico',
          'Certificado de título',
          'Formulario de solicitud',
          'Cédula del propietario'
        ],
        tiempoEstimado: '20-30 días',
        costoEstimado: 15000,
        plazo: '30 días hábiles',
        importante: [
          'Varía según municipio',
          'Se puede requerir estudio de impacto ambiental',
          'Verificar zonificación del terreno'
        ]
      },
      {
        numero: 3,
        titulo: 'Aprobación Medio Ambiente',
        descripcion: 'Obtener aprobación ambiental si el proyecto supera ciertos metros cuadrados o impacto.',
        institucion: 'Ministerio de Medio Ambiente',
        dondeIr: 'Oficinas del Ministerio de Medio Ambiente',
        direccion: 'Av. Máximo Gómez, Santo Domingo',
        telefono: '+1 (809) 567-4300',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Estudio de impacto ambiental',
          'Plano del proyecto',
          'Formulario MIMARENA'
        ],
        tiempoEstimado: '30-45 días',
        costoEstimado: 25000,
        plazo: '45 días hábiles',
        importante: [
          'Solo necesario para proyectos grandes o en áreas sensibles',
          'Puede requerir estudio de impacto ambiental profesional'
        ]
      },
      {
        numero: 4,
        titulo: 'Licencia de Construcción',
        descripcion: 'Obtener licencia oficial de construcción del Ayuntamiento.',
        institucion: 'Ayuntamiento',
        dondeIr: 'Oficina de Obras Públicas del Ayuntamiento',
        direccion: 'Varía por municipio',
        telefono: 'Varía',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Aprobación de planos',
          'Aprobación ambiental (si aplica)',
          'Pago de licencia',
          'Seguro de construcción (si aplica)'
        ],
        tiempoEstimado: '5-10 días',
        costoEstimado: 0, // % del valor del proyecto
        plazo: '10 días hábiles',
        importante: [
          'La licencia tiene validez limitada',
          'Debe renovarse si no se inicia construcción en plazo'
        ]
      }
    ],
    documentosRequeridos: [
      {
        nombre: 'Plano Arquitectónico',
        descripcion: 'Planos firmados por arquitecto colegiado',
        obligatorio: true,
        dondeObtener: 'Arquitecto colegiado',
        costo: 0, // % del proyecto
        validez: '6 meses'
      },
      {
        nombre: 'Certificado de Título',
        descripcion: 'Título de propiedad del terreno',
        obligatorio: true,
        dondeObtener: 'Registro de Títulos',
        costo: 2000,
        validez: '30 días'
      },
      {
        nombre: 'Estudio de Impacto Ambiental',
        descripcion: 'Estudio para proyectos grandes o en áreas sensibles',
        obligatorio: false,
        dondeObtener: 'Consultor ambiental certificado',
        costo: 50000,
        validez: '1 año'
      }
    ],
    instituciones: [
      {
        nombre: 'Ayuntamiento',
        sigla: 'AMDE',
        contacto: {
          telefono: 'Varía por municipio',
          email: 'Varía',
          direccion: 'Varía por municipio',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'Varía'
        },
        rol: 'Aprobación de planos y licencia de construcción'
      },
      {
        nombre: 'Ministerio de Medio Ambiente',
        sigla: 'MIMARENA',
        contacto: {
          telefono: '+1 (809) 567-4300',
          email: 'info@ambiente.gob.do',
          direccion: 'Av. Máximo Gómez, Santo Domingo',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'https://ambiente.gob.do'
        },
        rol: 'Aprobación ambiental'
      }
    ],
    estimacionCostos: [
      {
        concepto: 'Diseño Arquitectónico',
        rango: '3-8% del valor del proyecto',
        cuando: 'Al inicio del proyecto',
        obligatorio: true
      },
      {
        concepto: 'Licencia de Construcción',
        rango: '1-2% del valor del proyecto',
        cuando: 'Antes de iniciar construcción',
        obligatorio: true
      },
      {
        concepto: 'Estudio Ambiental',
        rango: 'RD$ 30,000 - 100,000',
        cuando: 'Si es requerido',
        obligatorio: false
      }
    ],
    enlacesUtiles: [
      'https://ambiente.gob.do',
      'https://www.mopc.gob.do'
    ],
    tips: [
      'Contrata arquitecto colegiado con experiencia',
      'Verifica zonificación del terreno antes de diseñar',
      'Consulta requisitos específicos del Ayuntamiento',
      'Para proyectos grandes, contrata gestor de trámites',
      'Mantén todos los permisos actualizados'
    ],
    frecuentes: [
      {
        pregunta: '¿Cuánto tarda obtener el permiso?',
        respuesta: 'El proceso completo puede tardar entre 60 y 90 días, dependiendo de la complejidad del proyecto y la rapidez de las instituciones.'
      },
      {
        pregunta: '¿Necesito estudio ambiental?',
        respuesta: 'Depende del tamaño del proyecto y ubicación. Proyectos grandes o en áreas protegidas generalmente lo requieren.'
      },
      {
        pregunta: '¿Puedo construir sin permiso?',
        respuesta: 'No. Construir sin permiso puede resultar en multas, demolición y problemas legales. Es obligatorio obtener todos los permisos.'
      }
    ]
  },
  {
    id: 'compra-extranjero',
    nombre: 'Compra de Inmueble por Extranjero',
    descripcion: 'Proceso específico para extranjeros que desean comprar inmuebles en República Dominicana, incluyendo trámites especiales.',
    categoria: 'extranjeros',
    duracion: '45-75 días',
    costoEstimado: '5-7% del valor de la propiedad',
    pasos: [
      {
        numero: 1,
        titulo: 'Verificación de Elegibilidad',
        descripcion: 'Verificar que la ubicación del inmueble permite compra por extranjeros (zonas fronterizas requieren autorización especial).',
        institucion: 'Registro de Títulos',
        dondeIr: 'Oficina del Registro de Títulos',
        direccion: 'Varía por jurisdicción',
        telefono: '+1 (809) 682-7340',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Pasaporte o cédula extranjera',
          'Ubicación exacta del inmueble'
        ],
        tiempoEstimado: '3-5 días',
        costoEstimado: 2000,
        plazo: '5 días',
        importante: [
          'Zonas fronterizas requieren autorización del Poder Ejecutivo',
          'Consultar Ley 544-14 para restricciones'
        ]
      },
      {
        numero: 2,
        titulo: 'Autorización Poder Ejecutivo (si zona fronteriza)',
        descripcion: 'Solicitar autorización del Poder Ejecutivo para compra en zonas fronterizas.',
        institucion: 'Presidencia de la República',
        dondeIr: 'Oficina Presidencial',
        direccion: 'Palacio Nacional, Santo Domingo',
        telefono: '+1 (809) 695-8000',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Solicitud formal',
          'Documentación del inmueble',
          'Justificación de inversión'
        ],
        tiempoEstimado: '30-60 días',
        costoEstimado: 10000,
        plazo: '60 días hábiles',
        importante: [
          'Solo necesario para zonas fronterizas',
          'Proceso puede ser extenso',
          'Recomendable contratar abogado especializado'
        ]
      },
      {
        numero: 3,
        titulo: 'Verificación de Título',
        descripcion: 'Mismo proceso que comprador nacional - verificar título válido.',
        institucion: 'Registro de Títulos',
        dondeIr: 'Oficina del Registro de Títulos',
        direccion: 'Varía por jurisdicción',
        telefono: '+1 (809) 682-7340',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Pasaporte o documento de identidad',
          'Certificado de título del inmueble'
        ],
        tiempoEstimado: '5-10 días',
        costoEstimado: 5000,
        plazo: '10 días',
        importante: [
          'Documentos pueden requerir traducción y apostilla',
          'Verificar aceptación de documentos extranjeros'
        ]
      },
      {
        numero: 4,
        titulo: 'Traducción y Apostilla de Documentos',
        descripcion: 'Traducir documentos al español y apostillar si es necesario.',
        institucion: 'Traductor Público / Consulado',
        dondeIr: 'Traductor público certificado / Consulado',
        direccion: 'Varía',
        telefono: 'Varía',
        horario: 'Varía',
        documentosNecesarios: [
          'Documentos originales',
          'Pasaporte'
        ],
        tiempoEstimado: '5-7 días',
        costoEstimado: 15000,
        plazo: '7 días',
        importante: [
          'Algunos documentos pueden requerir apostilla',
          'Verificar requisitos específicos con notario'
        ]
      },
      {
        numero: 5,
        titulo: 'Escritura Notarial',
        descripcion: 'Firma de escritura con documentos traducidos y validados.',
        institucion: 'Notario Público',
        dondeIr: 'Despacho notarial',
        direccion: 'Varía',
        telefono: 'Varía',
        horario: 'Varía',
        documentosNecesarios: [
          'Pasaporte apostillado y traducido',
          'Documentos traducidos',
          'Certificados de no deuda',
          'Autorización fronteriza (si aplica)'
        ],
        tiempoEstimado: '1 día',
        costoEstimado: 0, // % del valor
        plazo: 'Mismo día',
        importante: [
          'El notario debe aceptar documentos extranjeros',
          'Puede requerir intérprete si no habla español'
        ]
      },
      {
        numero: 6,
        titulo: 'Pago de Impuestos',
        descripcion: 'Pago de impuestos de transferencia (3%) ante DGII.',
        institucion: 'DGII',
        dondeIr: 'Oficina DGII',
        direccion: 'Av. Winston Churchill #71, Santo Domingo',
        telefono: '+1 (809) 689-4300',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Escritura notarial',
          'Documentos de identidad traducidos',
          'Formulario DGII'
        ],
        tiempoEstimado: '1-2 días',
        costoEstimado: 0, // 3% del valor
        plazo: '2 días',
        importante: [
          'Se puede pagar con tarjeta internacional en algunos casos',
          'Consultar métodos de pago aceptados'
        ]
      },
      {
        numero: 7,
        titulo: 'Registro de Título',
        descripcion: 'Inscripción de la escritura en Registro de Títulos.',
        institucion: 'Registro de Títulos',
        dondeIr: 'Oficina del Registro de Títulos',
        direccion: 'Varía',
        telefono: '+1 (809) 682-7340',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Escritura notarial',
          'Comprobante de pago impuestos',
          'Documentos validados'
        ],
        tiempoEstimado: '15-30 días',
        costoEstimado: 10000,
        plazo: '30 días',
        importante: [
          'Una vez registrado, el extranjero es propietario oficial',
          'Se emite título a nombre del comprador extranjero'
        ]
      }
    ],
    documentosRequeridos: [
      {
        nombre: 'Pasaporte Apostillado',
        descripcion: 'Pasaporte válido con apostilla si es necesario',
        obligatorio: true,
        dondeObtener: 'Consulado o autoridad del país de origen',
        costo: 50000,
        validez: 'Según validez del pasaporte'
      },
      {
        nombre: 'Documentos Traducidos',
        descripcion: 'Traducción oficial al español de documentos relevantes',
        obligatorio: true,
        dondeObtener: 'Traductor público certificado',
        costo: 15000,
        validez: 'Permanente'
      },
      {
        nombre: 'Autorización Fronteriza',
        descripcion: 'Autorización del Poder Ejecutivo para zonas fronterizas',
        obligatorio: false,
        dondeObtener: 'Presidencia de la República',
        costo: 10000,
        validez: 'Hasta completar compra'
      }
    ],
    instituciones: [
      {
        nombre: 'Presidencia de la República',
        sigla: 'Presidencia',
        contacto: {
          telefono: '+1 (809) 695-8000',
          email: 'info@presidencia.gob.do',
          direccion: 'Palacio Nacional, Santo Domingo',
          horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
          web: 'https://presidencia.gob.do'
        },
        rol: 'Autorización para compra en zonas fronterizas'
      }
    ],
    estimacionCostos: [
      {
        concepto: 'Traducción y Apostilla',
        rango: 'RD$ 15,000 - 30,000',
        cuando: 'Antes de escrituración',
        obligatorio: true
      },
      {
        concepto: 'Impuesto de Transferencia',
        rango: '3% del valor',
        cuando: 'Antes de registro',
        obligatorio: true
      },
      {
        concepto: 'Honorarios Notariales',
        rango: '1-1.5% del valor',
        cuando: 'Al momento de escrituración',
        obligatorio: true
      }
    ],
    enlacesUtiles: [
      'https://presidencia.gob.do',
      'https://www.dgii.gov.do'
    ],
    tips: [
      'Contrata abogado especializado en derecho inmobiliario internacional',
      'Verifica requisitos de traducción y apostilla antes de viajar',
      'Para zonas fronterizas, inicia trámite de autorización temprano',
      'Considera contratar gestor especializado en trámites para extranjeros',
      'Mantén comunicación con notario sobre requisitos de documentos'
    ],
    frecuentes: [
      {
        pregunta: '¿Puedo comprar cualquier propiedad siendo extranjero?',
        respuesta: 'En la mayoría de zonas sí. Solo zonas fronterizas requieren autorización especial del Poder Ejecutivo según Ley 544-14.'
      },
      {
        pregunta: '¿Necesito traducir todos mis documentos?',
        respuesta: 'Sí, documentos oficiales (pasaporte, certificados) deben estar traducidos al español por traductor público certificado.'
      },
      {
        pregunta: '¿Qué pasa si compro en zona fronteriza sin autorización?',
        respuesta: 'La compra puede ser anulada. Es obligatorio obtener autorización del Poder Ejecutivo para zonas fronterizas.'
      }
    ]
  },
  {
    id: 'inversion-turistica-confotur',
    nombre: 'Inversión Turística con CONFOTUR',
    descripcion: 'Proceso para inversiones inmobiliarias turísticas que requieren aprobación y beneficios de CONFOTUR según Ley 158-01.',
    categoria: 'inversion',
    duracion: '90-180 días',
    costoEstimado: '3-5% del valor del proyecto + trámites CONFOTUR',
    pasos: [
      {
        numero: 1,
        titulo: 'Preparación del Proyecto',
        descripcion: 'Desarrollar documentación completa del proyecto turístico incluyendo plan de inversión, estudios de factibilidad y diseño.',
        institucion: 'No aplica',
        dondeIr: 'N/A',
        direccion: 'N/A',
        telefono: 'N/A',
        horario: 'N/A',
        documentosNecesarios: [
          'Plan de inversión detallado',
          'Estudio de factibilidad económica',
          'Diseño del proyecto',
          'Análisis de mercado',
          'Proyecciones financieras'
        ],
        tiempoEstimado: '30-60 días',
        costoEstimado: 0, // % del proyecto
        plazo: '60 días',
        importante: [
          'El proyecto debe tener características turísticas reconocidas',
          'Documentación debe ser profesional y completa',
          'Monto mínimo de inversión según categoría CONFOTUR'
        ]
      },
      {
        numero: 2,
        titulo: 'Solicitud a CONFOTUR',
        descripcion: 'Presentar solicitud formal ante CONFOTUR para aprobación del proyecto turístico.',
        institucion: 'CONFOTUR',
        dondeIr: 'Oficinas de CONFOTUR',
        direccion: 'Av. George Washington #500, Santo Domingo',
        telefono: '+1 (809) 221-4660',
        horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
        documentosNecesarios: [
          'Solicitud oficial a CONFOTUR',
          'Plan de inversión completo',
          'Estudio de factibilidad',
          'Diseño del proyecto',
          'Documentación de propiedad del terreno',
          'Estudio de impacto ambiental',
          'Plan de ejecución'
        ],
        tiempoEstimado: '1 día (presentación)',
        costoEstimado: 5000,
        plazo: '1 día',
        importante: [
          'Presentar toda la documentación requerida',
          'El proyecto debe cumplir estándares turísticos',
          'Monto mínimo según categoría'
        ]
      },
      {
        numero: 3,
        titulo: 'Revisión Técnica CONFOTUR',
        descripcion: 'CONFOTUR realiza revisión técnica del proyecto y documentación presentada.',
        institucion: 'CONFOTUR',
        dondeIr: 'CONFOTUR',
        direccion: 'Av. George Washington #500, Santo Domingo',
        telefono: '+1 (809) 221-4660',
        horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
        documentosNecesarios: [],
        tiempoEstimado: '30-45 días',
        costoEstimado: 0,
        plazo: '45 días hábiles',
        importante: [
          'CONFOTUR puede solicitar información adicional',
          'Se puede requerir reuniones con el consejo',
          'Proceso puede extenderse según complejidad'
        ]
      },
      {
        numero: 4,
        titulo: 'Aprobación CONFOTUR',
        descripcion: 'El Consejo evalúa y aprueba el proyecto. Se emite resolución oficial.',
        institucion: 'CONFOTUR',
        dondeIr: 'CONFOTUR',
        direccion: 'Av. George Washington #500, Santo Domingo',
        telefono: '+1 (809) 221-4660',
        horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
        documentosNecesarios: [
          'Cualquier información adicional solicitada'
        ],
        tiempoEstimado: '15-30 días',
        costoEstimado: 0,
        plazo: '30 días hábiles',
        importante: [
          'Una vez aprobado, se emite resolución oficial',
          'La resolución permite acceder a beneficios fiscales',
          'Debe cumplir con compromisos de inversión'
        ]
      },
      {
        numero: 5,
        titulo: 'Solicitud de Beneficios Fiscales',
        descripcion: 'Solicitar acceso a beneficios fiscales establecidos en Ley 158-01.',
        institucion: 'CONFOTUR / DGII',
        dondeIr: 'CONFOTUR y DGII',
        direccion: 'Varía',
        telefono: 'Varía',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Resolución de aprobación CONFOTUR',
          'Certificados de inicio de obra',
          'Plan de inversión actualizado'
        ],
        tiempoEstimado: '15-20 días',
        costoEstimado: 10000,
        plazo: '20 días hábiles',
        importante: [
          'Los beneficios incluyen exenciones de ITBIS, impuesto transferencia, etc.',
          'Debe iniciar construcción en plazo establecido',
          'Presentar avances periódicamente a CONFOTUR'
        ]
      },
      {
        numero: 6,
        titulo: 'Inicio de Construcción',
        descripcion: 'Obtener permisos de construcción y comenzar proyecto según cronograma aprobado.',
        institucion: 'Ayuntamiento / MOPC',
        dondeIr: 'Ayuntamiento y oficinas MOPC',
        direccion: 'Varía',
        telefono: 'Varía',
        horario: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
        documentosNecesarios: [
          'Licencia de construcción',
          'Permisos ambientales',
          'Planos aprobados'
        ],
        tiempoEstimado: '30-60 días',
        costoEstimado: 0, // % del proyecto
        plazo: '60 días',
        importante: [
          'Debe cumplir cronograma aprobado por CONFOTUR',
          'Presentar avances de obra periódicamente',
          'Mantener beneficios fiscales activos'
        ]
      }
    ],
    documentosRequeridos: [
      {
        nombre: 'Plan de Inversión',
        descripcion: 'Plan detallado con monto, cronograma y financiamiento',
        obligatorio: true,
        dondeObtener: 'Desarrollado por inversionista/consultor',
        costo: 0,
        validez: '6 meses'
      },
      {
        nombre: 'Estudio de Factibilidad',
        descripcion: 'Estudio económico y de mercado del proyecto',
        obligatorio: true,
        dondeObtener: 'Consultor especializado',
        costo: 100000,
        validez: '1 año'
      },
      {
        nombre: 'Resolución CONFOTUR',
        descripcion: 'Aprobación oficial de CONFOTUR',
        obligatorio: true,
        dondeObtener: 'CONFOTUR',
        costo: 5000,
        validez: 'Permanente con condiciones'
      }
    ],
    instituciones: [
      {
        nombre: 'CONFOTUR',
        sigla: 'CONFOTUR',
        contacto: {
          telefono: '+1 (809) 221-4660',
          email: 'confotur@mitur.gob.do',
          direccion: 'Av. George Washington #500, Santo Domingo',
          horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
          web: 'https://www.mitur.gob.do/confotur'
        },
        rol: 'Aprobación de proyectos turísticos y gestión de beneficios fiscales'
      }
    ],
    estimacionCostos: [
      {
        concepto: 'Solicitud CONFOTUR',
        rango: 'RD$ 5,000 - 10,000',
        cuando: 'Al presentar solicitud',
        obligatorio: true
      },
      {
        concepto: 'Estudio de Factibilidad',
        rango: 'RD$ 50,000 - 200,000',
        cuando: 'Antes de solicitud',
        obligatorio: true
      },
      {
        concepto: 'Beneficios Fiscales (ahorro)',
        rango: 'Exención ITBIS 18%, Transferencia 3%',
        cuando: 'Después de aprobación',
        obligatorio: false
      }
    ],
    enlacesUtiles: [
      'https://www.mitur.gob.do/confotur',
      'https://www.dgii.gov.do'
    ],
    tips: [
      'Contrata consultor especializado en proyectos turísticos',
      'Prepara documentación profesional y completa',
      'Mantén comunicación constante con CONFOTUR',
      'Cumple con cronograma de inversión aprobado',
      'Presenta avances periódicamente',
      'Aprovecha todos los beneficios fiscales disponibles'
    ],
    frecuentes: [
      {
        pregunta: '¿Cuánto tarda la aprobación CONFOTUR?',
        respuesta: 'El proceso completo puede tardar entre 90 y 180 días, dependiendo de la complejidad del proyecto y la rapidez en proporcionar documentación adicional solicitada.'
      },
      {
        pregunta: '¿Qué beneficios fiscales obtengo?',
        respuesta: 'Con aprobación CONFOTUR puedes acceder a: exención de ITBIS (18%), exención de impuesto de transferencia (3%), exención de impuesto inmobiliario (10-15 años), y facilidades de importación.'
      },
      {
        pregunta: '¿Cuál es el monto mínimo de inversión?',
        respuesta: 'Varía según categoría del proyecto. Proyectos hoteleros generalmente requieren mínimo USD $2-5 millones. Consulta directamente con CONFOTUR para tu caso específico.'
      },
      {
        pregunta: '¿Puedo iniciar construcción sin aprobación?',
        respuesta: 'No es recomendable. Los beneficios fiscales solo aplican a proyectos aprobados por CONFOTUR. Además, iniciar sin aprobación puede causar problemas legales.'
      }
    ]
  }
];

export function getProcessById(id: string): Process | undefined {
  return dominicanProcesses.find(proc => proc.id === id);
}

export function getProcessesByCategory(categoria: string): Process[] {
  return dominicanProcesses.filter(proc => proc.categoria === categoria);
}

export function searchProcesses(query: string): Process[] {
  const lowerQuery = query.toLowerCase();
  return dominicanProcesses.filter(proc =>
    proc.nombre.toLowerCase().includes(lowerQuery) ||
    proc.descripcion.toLowerCase().includes(lowerQuery) ||
    proc.pasos.some(step =>
      step.titulo.toLowerCase().includes(lowerQuery) ||
      step.descripcion.toLowerCase().includes(lowerQuery)
    )
  );
}

