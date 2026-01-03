# 🇩🇴 **PLAN MODULO LEGAL RD - HABITATPRO**

**Fecha:** Octubre 2024  
**Objetivo:** Completar módulo legal específico para República Dominicana  
**Prioridad:** 🔴 **ALTA** (Puntos 45, 46, 48, 49 de los 82 competitivos)

---

## 📊 **ESTADO ACTUAL**

### **❌ No Implementado:**
- Leyes inmobiliarias RD (punto 45)
- Documentación local RD (punto 46)
- Impuestos locales calculados (punto 48)
- Trámites RD guiados (punto 49)

### **✅ Base Existente:**
- Sistema de roles (brokers, clients)
- Formularios de propiedades
- Panel admin

---

## 🎯 **FEATURES A IMPLEMENTAR**

### **1. LEYES INMOBILIARIAS RD (Punto 45)**

#### **Descripción:**
Sistema que explica las leyes y regulaciones inmobiliarias de República Dominicana aplicables a cada tipo de transacción.

#### **Archivos a Crear:**
```
proptech-backend/
└── routes/
    └── legal_routes.py        # API de leyes RD

proptech-web/
├── app/
│   ├── legal/                 # NUEVO
│   │   ├── page.tsx          # Página principal leyes
│   │   ├── [category]/
│   │   │   └── page.tsx      # Leyes por categoría
│   │   └── [law-id]/
│   │       └── page.tsx      # Detalle de ley específica
│   └── components/
│       └── legal/
│           ├── LawCard.tsx    # Tarjeta de ley
│           ├── LawDetail.tsx  # Detalle de ley
│           └── LegalGuide.tsx # Guía legal interactiva
```

#### **Contenido Base:**
```typescript
interface Law {
  id: string;
  title: string;
  category: 'venta' | 'alquiler' | 'inversion' | 'extranjeros' | 'tributacion';
  description: string;
  articles: Article[];
  lastUpdated: string;
  applicability: string[]; // ['compra', 'alquiler', etc.]
}

interface Article {
  number: string;
  content: string;
  reference: string;
}
```

#### **Funcionalidades:**
- ✅ Biblioteca de leyes RD organizadas por categoría
- ✅ Búsqueda de leyes por palabra clave
- ✅ Leyes aplicables a cada tipo de operación
- ✅ Actualizaciones de normativas
- ✅ Enlaces a documentos oficiales

**Estimación:** 8-10 horas

---

### **2. DOCUMENTACIÓN LOCAL RD (Punto 46)**

#### **Descripción:**
Documentos y plantillas específicas para transacciones inmobiliarias en República Dominicana.

#### **Archivos a Crear:**
```
proptech-backend/
└── routes/
    └── documents_routes.py    # API de documentos

proptech-web/
├── app/
│   ├── documentos/            # NUEVO
│   │   ├── page.tsx          # Listado documentos
│   │   ├── [doc-type]/
│   │   │   └── page.tsx      # Documento por tipo
│   │   └── templates/
│   │       └── page.tsx      # Plantillas descargables
│   └── components/
│       └── documents/
│           ├── DocumentList.tsx
│           ├── DocumentViewer.tsx
│           └── TemplateDownload.tsx
```

#### **Tipos de Documentos:**
- ✅ Contrato de compraventa RD
- ✅ Contrato de arrendamiento RD
- ✅ Poder notarial para extranjeros
- ✅ Certificado de títulos (Registro de Títulos)
- ✅ Certificado de libertad de gravámenes
- ✅ Actas notariales
- ✅ Formularios de impuestos

**Estimación:** 6-8 horas

---

### **3. IMPUESTOS LOCALES CALCULADOS (Punto 48)**

#### **Descripción:**
Calculadora automática de impuestos y costos asociados a transacciones inmobiliarias en RD.

#### **Archivos a Crear:**
```
proptech-backend/
└── routes/
    └── taxes_routes.py        # API de cálculo de impuestos

proptech-web/
├── app/
│   ├── calculadora-impuestos/  # NUEVO
│   │   └── page.tsx          # Calculadora principal
│   └── components/
│       └── taxes/
│           ├── TaxCalculator.tsx
│           ├── TaxBreakdown.tsx
│           └── TaxInfo.tsx
```

#### **Impuestos a Calcular:**
```typescript
interface TaxCalculation {
  propertyValue: number;
  transactionType: 'compra' | 'venta' | 'alquiler';
  
  // Impuestos RD
  itbis: number;           // ITBIS (si aplica)
  impuestoInmobiliario: number; // Impuesto sobre propiedades
  registroTitulo: number;   // Registro de títulos
  honorariosNotariales: number; // Honorarios notariales
  certificacionCatastral: number; // Certificación catastral
  
  // Impuestos para extranjeros
  isrVenta: number;        // ISR por venta (extranjeros)
  
  // Costos adicionales
  inspeccionTecnica: number;
  certificadoLibertad: number;
  
  total: number;
  desglose: TaxItem[];
}
```

#### **Lógica de Cálculo:**
```typescript
// proptech-web/app/lib/taxes/rdCalculator.ts
export function calculateRDTaxes(
  propertyValue: number,
  transactionType: 'compra' | 'venta' | 'alquiler',
  isForeigner: boolean = false
): TaxCalculation {
  // ITBIS (solo en alquiler comercial)
  const itbis = transactionType === 'alquiler' ? propertyValue * 0.18 : 0;
  
  // Impuesto de registro (1% del valor)
  const registroTitulo = propertyValue * 0.01;
  
  // Honorarios notariales (escala progresiva)
  const honorariosNotariales = calculateNotaryFees(propertyValue);
  
  // ISR para extranjeros (25% sobre ganancia)
  const isrVenta = isForeigner && transactionType === 'venta' 
    ? calculateISR(propertyValue) 
    : 0;
  
  // ... más cálculos
  
  return {
    propertyValue,
    transactionType,
    itbis,
    registroTitulo,
    honorariosNotariales,
    isrVenta,
    total: itbis + registroTitulo + honorariosNotariales + isrVenta + ...,
    desglose: [...]
  };
}
```

**Estimación:** 8-10 horas

---

### **4. TRÁMITES RD GUIADOS (Punto 49)**

#### **Descripción:**
Guía paso a paso interactiva para realizar trámites inmobiliarios en República Dominicana.

#### **Archivos a Crear:**
```
proptech-backend/
└── routes/
    └── procedures_routes.py   # API de trámites

proptech-web/
├── app/
│   ├── tramites/              # NUEVO
│   │   ├── page.tsx          # Listado trámites
│   │   ├── [procedure-id]/
│   │   │   └── page.tsx      # Guía paso a paso
│   │   └── checklist/
│   │       └── page.tsx       # Checklist interactivo
│   └── components/
│       └── procedures/
│           ├── ProcedureGuide.tsx
│           ├── StepTracker.tsx
│           ├── Checklist.tsx
│           └── RequiredDocuments.tsx
```

#### **Trámites a Incluir:**
- ✅ Compra de propiedad (nacionales)
- ✅ Compra de propiedad (extranjeros)
- ✅ Venta de propiedad
- ✅ Registro de títulos
- ✅ Transferencia de propiedad
- ✅ Obtención de certificado catastral
- ✅ Liberación de gravámenes
- ✅ Inscripción en Registro de Títulos

#### **Estructura de Guía:**
```typescript
interface Procedure {
  id: string;
  title: string;
  description: string;
  category: 'compra' | 'venta' | 'registro' | 'extranjeros';
  estimatedTime: string; // "15-30 días"
  estimatedCost: number;
  steps: Step[];
  requiredDocuments: Document[];
  relevantLaws: string[]; // IDs de leyes relacionadas
}

interface Step {
  number: number;
  title: string;
  description: string;
  instructions: string[];
  whereToGo?: string;
  documents?: string[];
  duration?: string;
}
```

#### **Funcionalidades:**
- ✅ Guía paso a paso interactiva
- ✅ Checklist de documentos requeridos
- ✅ Estimación de tiempo y costos
- ✅ Enlaces a oficinas públicas
- ✅ Recordatorios y notificaciones
- ✅ Progreso guardado para usuarios

**Estimación:** 10-12 horas

---

## 🔗 **INTEGRACIÓN CON EXISTENTE**

### **1. Integración en Formularios:**
```tsx
// app/vender/page.tsx
import { TaxCalculator } from '../components/taxes/TaxCalculator';
import { LegalGuide } from '../components/legal/LegalGuide';

export default function VenderPage() {
  return (
    <div>
      <PropertyForm />
      
      {/* Nueva sección: Calculadora de impuestos */}
      <TaxCalculator 
        propertyValue={propertyValue}
        transactionType="venta"
      />
      
      {/* Nueva sección: Leyes aplicables */}
      <LegalGuide 
        operation="venta"
        category="venta"
      />
    </div>
  );
}
```

### **2. Integración en PropertyCard:**
```tsx
// app/components/PropertyCard.tsx
import { Link } from 'next/link';

export function PropertyCard({ property }) {
  return (
    <div>
      {/* ... contenido existente ... */}
      
      {/* Nuevo: Link a trámites */}
      <Link href={`/tramites/compra?propertyId=${property.id}`}>
        Ver guía de compra
      </Link>
      
      {/* Nuevo: Calculadora de impuestos */}
      <Link href={`/calculadora-impuestos?value=${property.price}`}>
        Calcular impuestos
      </Link>
    </div>
  );
}
```

---

## 📊 **ESTIMACIÓN TOTAL**

| Feature | Tiempo | Archivos | Prioridad |
|---------|--------|----------|-----------|
| **Leyes RD** | 8-10h | 5-7 | Alta |
| **Documentación** | 6-8h | 4-6 | Alta |
| **Impuestos Calculados** | 8-10h | 4-5 | Alta |
| **Trámites Guiados** | 10-12h | 6-8 | Alta |
| **Integración** | 4-6h | 5-10 | Alta |
| **Testing** | 4-6h | - | Alta |
| **TOTAL** | **40-52h** | **24-36** | - |

**Duración:** 1-1.5 semanas

---

## 🎯 **PRIORIZACIÓN DE IMPLEMENTACIÓN**

### **SPRINT 1 (Semana 1):**
1. ✅ **Impuestos Calculados** (8-10h) - Más valor inmediato
2. ✅ **Leyes RD** (8-10h) - Diferenciación clara

### **SPRINT 2 (Semana 2):**
3. ✅ **Trámites Guiados** (10-12h) - Completa el módulo
4. ✅ **Documentación** (6-8h) - Valor adicional

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **Backend:**
- [ ] Crear `routes/legal_routes.py`
- [ ] Crear `routes/documents_routes.py`
- [ ] Crear `routes/taxes_routes.py`
- [ ] Crear `routes/procedures_routes.py`
- [ ] Crear modelos de BD (si necesario)
- [ ] Seed data de leyes RD

### **Frontend:**
- [ ] Crear páginas `/legal`
- [ ] Crear páginas `/documentos`
- [ ] Crear páginas `/calculadora-impuestos`
- [ ] Crear páginas `/tramites`
- [ ] Componentes de visualización
- [ ] Integración en formularios existentes

### **Contenido:**
- [ ] Escribir contenido legal base
- [ ] Crear documentos template
- [ ] Verificar cálculos de impuestos con contador
- [ ] Validar trámites con notario local

---

## 🔐 **CONSIDERACIONES LEGALES**

### **⚠️ IMPORTANTE:**
1. **Consultar con abogado local** antes de publicar contenido legal
2. **Disclaimer legal** en todas las páginas legales
3. **Actualización periódica** de leyes y normativas
4. **No reemplazar asesoría legal profesional**

### **Disclaimer Propuesto:**
```tsx
<LegalDisclaimer>
  La información proporcionada es de carácter informativo y educativo.
  No constituye asesoría legal profesional. Para asesoría específica,
  consulte con un abogado colegiado en República Dominicana.
</LegalDisclaimer>
```

---

## 📈 **IMPACTO ESPERADO**

### **Puntos Competitivos:**
- ✅ **+4 puntos** (45, 46, 48, 49)
- ✅ **Total proyectado:** 46/82 (56%) → **50/82 (61%)**

### **Ventajas Competitivas:**
- ✅ **Diferenciación única** vs Idealista, Zillow, Lianjia
- ✅ **Especialización RD** real
- ✅ **Valor concreto** para usuarios dominicanos
- ✅ **Confianza** en la plataforma

---

## 🚀 **PRÓXIMOS PASOS**

### **FASE 1: Impuestos (Día 1-2)**
1. Investigar tasas de impuestos RD actuales
2. Crear calculadora base
3. Integrar en formularios

### **FASE 2: Leyes (Día 3-4)**
1. Recopilar leyes principales RD
2. Crear estructura de datos
3. Implementar búsqueda

### **FASE 3: Trámites (Día 5-6)**
1. Crear guías paso a paso
2. Implementar checklist
3. Integrar en flujo de compra

### **FASE 4: Documentos (Día 7)**
1. Crear templates base
2. Implementar descarga
3. Testing completo

---

**¿Procedo con la implementación del Módulo Legal RD?** 🇩🇴⚖️

**Última actualización:** Octubre 2024

