# 🗺️ **CONFIGURACIÓN GOOGLE PLACES API - HABITATPRO**

## 📅 **Fecha:** 2025-10-31
## 🎯 **Objetivo:** Configurar autocompletado de direcciones para República Dominicana

---

## ✅ **IMPLEMENTACIÓN COMPLETADA:**

### **1. Componente AddressAutocomplete**
- ✅ Creado componente con Google Places API
- ✅ Restricción a República Dominicana (country: 'do')
- ✅ Autocompletado de direcciones
- ✅ Obtención de coordenadas (lat/lng)
- ✅ Fallback si API no está disponible

### **2. Integraciones:**
- ✅ Integrado en `PropertyForm.tsx` (formulario principal)
- ✅ Integrado en `vender/page.tsx` (página vender)
- ✅ Integrado en `valorar/page.tsx` (página valorar)

### **3. Backend:**
- ✅ Interfaz `PropertyData` actualizada con `latitude` y `longitude`
- ✅ Transformación de datos incluye coordenadas
- ✅ Backend puede recibir y guardar coordenadas

### **4. Configuración:**
- ✅ Variable de entorno `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` configurada
- ✅ CSP actualizado para permitir Google Maps
- ✅ Next.js config actualizado

---

## 🔧 **CONFIGURACIÓN REQUERIDA:**

### **1. Obtener API Key de Google Places**

1. **Ir a Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Crear o seleccionar proyecto**

3. **Habilitar Google Places API:**
   - Buscar "Places API" en la biblioteca de APIs
   - Hacer click en "Habilitar"

4. **Crear credenciales (API Key):**
   - Ir a "Credenciales" → "Crear credenciales" → "Clave de API"
   - Copiar la API key generada

5. **Configurar restricciones (Recomendado):**
   - Editar la API key
   - Restricciones de aplicación:
     - Agregar dominio: `habitatprord.com`, `*.vercel.app`
   - Restricciones de API:
     - Seleccionar solo "Places API"

---

### **2. Configurar Variable de Entorno**

#### **Opción A: Archivo `.env.local` (Desarrollo local)**
```bash
# Crear archivo proptech-web/.env.local
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

#### **Opción B: Vercel (Producción)**
1. Ir a Vercel Dashboard
2. Seleccionar proyecto `proptech-web`
3. Ir a "Settings" → "Environment Variables"
4. Agregar:
   - **Name:** `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
   - **Value:** `tu_api_key_aqui`
   - **Environment:** Production, Preview, Development

---

### **3. Verificar Configuración**

1. **Verificar que la variable está disponible:**
   ```typescript
   console.log(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)
   ```

2. **Verificar que el script de Google Maps se carga:**
   - Abrir DevTools → Network
   - Buscar request a `maps.googleapis.com`
   - Debe retornar 200 OK

3. **Probar autocompletado:**
   - Ir a `/vender` o `/valorar`
   - Escribir en el campo de dirección
   - Deberían aparecer sugerencias después de 3 caracteres

---

## 💰 **COSTOS:**

### **Google Places API:**
- **$200 crédito gratis** (nuevos usuarios - primer año)
- **$0.003 por autocompletado** (Session Token)
- **Estimación mensual:** $30-50 para tráfico moderado (10,000-15,000 requests)

### **Optimización de Costos:**
1. **Usar Session Tokens:** Ya implementado
2. **Implementar cache:** Considerar cachear direcciones comunes
3. **Debounce:** Ya implementado (requiere 3 caracteres mínimo)

---

## 🔍 **TROUBLESHOOTING:**

### **Problema: Autocompletado no funciona**
**Solución:**
1. Verificar que `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` está configurada
2. Verificar que Places API está habilitada en Google Cloud
3. Verificar restricciones de API key (dominos permitidos)
4. Verificar console para errores de CORS o permisos

### **Problema: Error "API key not valid"**
**Solución:**
1. Verificar que la API key es correcta
2. Verificar que Places API está habilitada
3. Verificar restricciones de la API key

### **Problema: No aparecen direcciones de RD**
**Solución:**
1. Verificar que `country="do"` está configurado
2. Verificar que el usuario está escribiendo en español
3. Verificar que Places API incluye resultados de República Dominicana

---

## 📋 **ARCHIVOS MODIFICADOS:**

1. **`proptech-web/app/components/AddressAutocomplete.tsx`** - **NUEVO**
   - Componente de autocompletado con Google Places API

2. **`proptech-web/app/components/PropertyForm.tsx`** - **MODIFICADO**
   - Integrado AddressAutocomplete
   - Guarda coordenadas junto con dirección

3. **`proptech-web/app/vender/page.tsx`** - **MODIFICADO**
   - Integrado AddressAutocomplete

4. **`proptech-web/app/valorar/page.tsx`** - **MODIFICADO**
   - Integrado AddressAutocomplete

5. **`proptech-web/app/lib/propertyAPI.ts`** - **MODIFICADO**
   - Interfaz actualizada con `latitude` y `longitude`
   - Transformación incluye coordenadas

6. **`proptech-web/next.config.js`** - **MODIFICADO**
   - Variable de entorno configurada
   - CSP actualizado para Google Maps

---

## ✅ **FUNCIONALIDADES:**

### **✅ Autocompletado:**
- [x] Búsqueda de direcciones en República Dominicana
- [x] Sugerencias después de 3 caracteres
- [x] Selección de dirección de la lista
- [x] Obtención automática de coordenadas

### **✅ Integración:**
- [x] Integrado en formulario principal de propiedades
- [x] Integrado en página de vender
- [x] Integrado en página de valorar
- [x] Coordenadas se guardan junto con dirección

### **✅ UX:**
- [x] Loading state durante búsqueda
- [x] Dropdown con sugerencias
- [x] Click fuera cierra dropdown
- [x] Indicador visual de coordenadas

---

## 🚀 **PRÓXIMOS PASOS (Opcionales):**

1. **Mapa Interactivo:**
   - Mostrar mapa después de seleccionar dirección
   - Permitir ajustar marcador manualmente
   - Actualizar coordenadas al mover marcador

2. **Normalización Direcciones RD:**
   - Estructurar direcciones (Calle, Sector, Municipio, Provincia)
   - Validar formato de direcciones dominicanas

3. **Cache de Direcciones:**
   - Cachear direcciones comunes
   - Reducir requests a Google Places API

4. **Búsqueda Avanzada:**
   - Autocompletado en búsqueda de propiedades
   - Filtros por zona/sector

---

## 📚 **REFERENCIAS:**

- **Google Places API:** https://developers.google.com/maps/documentation/places/web-service
- **Autocomplete Service:** https://developers.google.com/maps/documentation/javascript/places-autocomplete
- **Geocoding API:** https://developers.google.com/maps/documentation/geocoding

---

## ✅ **RESUMEN:**

**Estado:** ✅ **IMPLEMENTADO** - Requiere configuración de API key

**Funcionalidades:**
- Autocompletado de direcciones para República Dominicana
- Obtención automática de coordenadas
- Integrado en todos los formularios relevantes
- Configuración lista (solo falta API key)

**Próximo paso:** Configurar `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` en Vercel

