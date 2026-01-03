# 🧪 Testing Completo: IA Emocional - HabitatPro

## 📋 **CHECKLIST DE TESTING**

### **✅ FASE 1: Testing Funcional del Chatbot**

#### **1.1 Interfaz del Chatbot**
- [ ] **Botón flotante aparece** en homepage (esquina inferior derecha)
- [ ] **Botón flotante aparece** en página `/comprar`
- [ ] **Abre correctamente** al hacer click
- [ ] **Cierra correctamente** al hacer click en X
- [ ] **Mensaje de bienvenida** aparece al abrir
- [ ] **Header con gradiente** azul-morado visible
- [ ] **Input de texto** funcional y enfocado automáticamente
- [ ] **Botón de envío** visible y funcional

#### **1.2 Funcionalidad Conversacional**
- [ ] **Envío de mensaje** con Enter funciona
- [ ] **Envío de mensaje** con botón funciona
- [ ] **Mensaje de usuario** aparece en bubble azul
- [ ] **Mensaje de IA** aparece en bubble blanco
- [ ] **Estado de loading** ("Analizando...") aparece durante búsqueda
- [ ] **Auto-scroll** al último mensaje funciona
- [ ] **Historial de mensajes** se mantiene durante la sesión

#### **1.3 Búsqueda Emocional**
- [ ] **Query simple**: "hogar tranquilo para mi familia"
  - [ ] Analiza correctamente (vibes: tranquilo, lifestyle: family-friendly)
  - [ ] Devuelve propiedades relevantes
  - [ ] Muestra resumen emocional
  - [ ] Muestra sugerencias inteligentes
  
- [ ] **Query compleja**: "apartamento vibrante para joven profesional que trabaja desde casa"
  - [ ] Analiza múltiples factores emocionales
  - [ ] Devuelve propiedades con alta compatibilidad
  - [ ] Muestra insights emocionales específicos

- [ ] **Query de inversión**: "propiedad con buen ROI para rentar"
  - [ ] Detecta intención de inversión
  - [ ] Filtra por propiedades rentables
  - [ ] Muestra sugerencias relacionadas

#### **1.4 Visualización de Propiedades**
- [ ] **Cards de propiedades** aparecen en el chat
- [ ] **Badge de compatibilidad** muestra % correcto
- [ ] **Insights emocionales** son legibles y relevantes
- [ ] **Imágenes** cargan correctamente (o fallback)
- [ ] **Click en propiedad** redirige a `/properties/{id}`
- [ ] **Máximo 3 propiedades** mostradas inicialmente

#### **1.5 Sugerencias Inteligentes**
- [ ] **Sugerencias aparecen** después de primera búsqueda
- [ ] **Click en sugerencia** ejecuta nueva búsqueda
- [ ] **Sugerencias son relevantes** al contexto
- [ ] **Sugerencias predefinidas** funcionan si no hay del backend

---

### **✅ FASE 2: Testing del Backend**

#### **2.1 Endpoint `/api/ai/emotional-search`**
```bash
# Test 1: Query básica
curl -X POST https://proptech-mvp-1.onrender.com/api/ai/emotional-search \
  -H "Content-Type: application/json" \
  -d '{"query": "hogar tranquilo para mi familia"}'

# Expected: 200 OK, properties con compatibility_score
```

- [ ] **Endpoint responde** con 200 OK
- [ ] **JSON válido** en respuesta
- [ ] **Campo `emotional_analysis`** presente
- [ ] **Campo `emotional_summary`** presente
- [ ] **Campo `properties`** es array
- [ ] **Cada propiedad** tiene `compatibility_score`
- [ ] **Cada propiedad** tiene `emotional_insights`

#### **2.2 Análisis NLP**
- [ ] **Vibes detectados** correctamente (tranquilo, vibrante, etc.)
- [ ] **Lifestyle detectado** correctamente (family-friendly, pet-friendly, etc.)
- [ ] **Community detectado** correctamente (familiar, joven, etc.)
- [ ] **Intención detectada** correctamente (investment, rental, family_living, etc.)
- [ ] **Confidence score** está entre 0-1

#### **2.3 Matching Emocional**
- [ ] **Compatibilidad calculada** correctamente (0-1)
- [ ] **Propiedades ordenadas** por compatibility_score descendente
- [ ] **Solo propiedades** con score > 0.1 aparecen
- [ ] **Insights emocionales** son relevantes y explicativos

#### **2.4 Manejo de Errores**
- [ ] **Query vacía** devuelve error 400
- [ ] **Query inválida** no causa crash
- [ ] **Sin propiedades** devuelve array vacío con mensaje
- [ ] **Error de servidor** devuelve 500 con mensaje apropiado

---

### **✅ FASE 3: Testing de Integración**

#### **3.1 Integración en Homepage**
- [ ] **Chatbot no interfiere** con otros elementos
- [ ] **Z-index correcto** (no se superpone con header)
- [ ] **Responsive** en mobile (< 768px)
- [ ] **Responsive** en tablet (768px - 1024px)
- [ ] **Responsive** en desktop (> 1024px)

#### **3.2 Integración en `/comprar`**
- [ ] **Chatbot disponible** en página de búsqueda
- [ ] **No interfiere** con filtros
- [ ] **No interfiere** con lista de propiedades
- [ ] **Funciona** independientemente de filtros aplicados

#### **3.3 Redirección a Propiedades**
- [ ] **Click en card** redirige correctamente
- [ ] **URL correcta**: `/properties/{id}`
- [ ] **Propiedad existe** en la página de detalle
- [ ] **Estado se mantiene** (historial, etc.)

---

### **✅ FASE 4: Testing de UX/UI**

#### **4.1 Animaciones y Transiciones**
- [ ] **Apertura del chatbot** es suave (no abrupta)
- [ ] **Cierre del chatbot** es suave
- [ ] **Envío de mensaje** tiene feedback visual
- [ ] **Loading state** muestra spinner
- [ ] **Hover effects** en sugerencias funcionan
- [ ] **Hover effects** en cards funcionan

#### **4.2 Diseño Visual**
- [ ] **Colores emocionales** correctos (verde=alto, azul=medio, ámbar=bajo)
- [ ] **Tipografía** legible en todos los tamaños
- [ ] **Espaciado** consistente
- [ ] **Bordes y sombras** visibles pero sutiles
- [ ] **Badge de compatibilidad** destacado pero no invasivo

#### **4.3 Accesibilidad**
- [ ] **Contraste de colores** suficiente (WCAG AA)
- [ ] **Focus states** visibles en elementos interactivos
- [ ] **Aria labels** presentes en botones
- [ ] **Keyboard navigation** funcional (Tab, Enter, Esc)

---

### **✅ FASE 5: Testing de Performance**

#### **5.1 Velocidad de Respuesta**
- [ ] **Tiempo de respuesta** < 2 segundos (backend)
- [ ] **Renderizado del chatbot** < 500ms
- [ ] **Carga de imágenes** optimizada (lazy loading)
- [ ] **Sin lag** al hacer scroll en el chat

#### **5.2 Carga de Página**
- [ ] **Homepage carga** con chatbot sin retraso
- [ ] **Página `/comprar` carga** con chatbot sin retraso
- [ ] **No bloquea** el renderizado de otros elementos

---

### **✅ FASE 6: Testing Cross-Browser**

#### **6.1 Navegadores Desktop**
- [ ] **Chrome** (última versión)
- [ ] **Firefox** (última versión)
- [ ] **Safari** (última versión)
- [ ] **Edge** (última versión)

#### **6.2 Navegadores Mobile**
- [ ] **Chrome Mobile** (Android)
- [ ] **Safari Mobile** (iOS)
- [ ] **Firefox Mobile** (Android)

---

## 📊 **QUERIES DE TESTING RECOMENDADAS**

### **Categoría: Familia**
1. "hogar tranquilo para mi familia y mi perro"
2. "casa familiar con jardín cerca de escuela"
3. "apartamento seguro para niños"

### **Categoría: Profesional**
1. "apartamento vibrante para joven profesional"
2. "casa moderna para trabajar desde casa"
3. "loft en zona empresarial"

### **Categoría: Retiro**
1. "casa acogedora para retiro"
2. "propiedad tranquila para jubilación"
3. "hogar para descansar después del trabajo"

### **Categoría: Inversión**
1. "propiedad con buen ROI para rentar"
2. "inversión inmobiliaria rentable"
3. "apartamento para generar ingresos"

### **Categoría: Emocional Complejo**
1. "hogar bohemio y artístico para creativo"
2. "casa lujosa pero acogedora para familia"
3. "apartamento moderno y tranquilo"

---

## 🐛 **ERRORES CONOCIDOS Y SOLUCIONES**

### **Error 1: Chatbot no aparece**
**Solución:** Verificar que el componente está importado y renderizado en la página.

### **Error 2: Endpoint retorna 404**
**Solución:** Verificar que el blueprint está registrado en `app.py`.

### **Error 3: No se muestran propiedades**
**Solución:** Verificar que hay propiedades activas en la BD con `emotional_profile` o `emotional_tags`.

### **Error 4: Compatibilidad siempre 0%**
**Solución:** Verificar que las propiedades tienen datos emocionales en formato correcto.

---

## 📈 **MÉTRICAS A TRACKEAR**

### **KPIs del Chatbot:**
- **Tasa de apertura**: % de usuarios que abren el chatbot
- **Queries por sesión**: Promedio de queries por usuario
- **Tasa de conversión**: % de queries que resultan en clicks en propiedades
- **Tiempo en chatbot**: Tiempo promedio de interacción
- **Satisfacción**: Rating de experiencia (1-5 estrellas)

### **KPIs del Backend:**
- **Tiempo de respuesta**: Promedio de latencia del endpoint
- **Tasa de error**: % de requests que fallan
- **Propiedades encontradas**: Promedio de propiedades por query
- **Compatibilidad promedio**: Score de compatibilidad promedio

---

## ✅ **CHECKLIST FINAL ANTES DE LANZAMIENTO**

- [ ] Todos los tests funcionales pasan (95%+)
- [ ] No hay errores en console
- [ ] Performance es aceptable (< 2s respuesta)
- [ ] Responsive funciona en mobile/tablet/desktop
- [ ] Cross-browser funciona en Chrome/Firefox/Safari/Edge
- [ ] Accesibilidad básica implementada
- [ ] Documentación para brokers completa
- [ ] Analytics configurado para tracking
- [ ] Error handling robusto implementado
- [ ] Fallbacks implementados para errores

---

**Fecha de Testing:** _____________  
**Probado por:** _____________  
**Resultado:** ☐ APROBADO ☐ NECESITA AJUSTES  

**Notas:** 
_____________________________________________
_____________________________________________
_____________________________________________

