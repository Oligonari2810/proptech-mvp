# 🔑 Guía de Configuración de APIs - HabitatPro

**Para:** Lanzamiento con datos geoespaciales en tiempo real  
**Tiempo Estimado:** 15-20 minutos

---

## 📋 **APIS REQUERIDAS**

### **Críticas (Bloquean Funcionalidad):**
- ❌ Ninguna (sistema funciona con fallback)

### **Opcionales (Mejoran Experiencia):**
- ⚠️ **Google Maps API** - Para green spaces y amenities reales
- ⚠️ **OpenWeather API** - Para calidad del aire en tiempo real

---

## 🔑 **1. GOOGLE MAPS API KEY**

### **Paso 1: Crear API Key**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Ir a **"APIs & Services" > "Library"**
4. Buscar y habilitar:
   - ✅ **Places API** (crítico)
   - ✅ **Maps JavaScript API** (opcional, si usas mapas)
   - ✅ **Geocoding API** (opcional)

### **Paso 2: Crear API Key**
1. Ir a **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "API Key"**
3. Copiar la API key generada
4. (Recomendado) Restringir la key:
   - **Application restrictions:** HTTP referrers
   - **Website restrictions:** `habitatprord.com/*`
   - **API restrictions:** Solo Places API

### **Paso 3: Configurar en Backend**
```bash
# En Render Dashboard o .env local
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### **Verificación:**
```bash
# Test rápido
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.4861,-69.9312&radius=1000&type=park&key=TU_API_KEY"
```

**Resultado esperado:** JSON con resultados de lugares cercanos

---

## 🌤️ **2. OPENWEATHER API KEY**

### **Paso 1: Obtener API Key Gratuita**
1. Ir a [OpenWeatherMap](https://openweathermap.org/api)
2. Click **"Sign Up"** o **"API keys"**
3. Crear cuenta gratuita
4. En dashboard, copiar **"API Key"** (gratis incluye 60 calls/min)

### **Paso 2: Configurar en Backend**
```bash
# En Render Dashboard o .env local
OPENWEATHER_API_KEY=tu_api_key_aqui
```

### **Verificación:**
```bash
# Test rápido (lat, lng de Santo Domingo)
curl "http://api.openweathermap.org/data/2.5/air_pollution?lat=18.4861&lon=-69.9312&appid=TU_API_KEY"
```

**Resultado esperado:** JSON con datos de calidad del aire

---

## 🔧 **3. CONFIGURACIÓN EN RENDER**

### **Backend (Render Dashboard):**
1. Ir a tu servicio en [Render Dashboard](https://dashboard.render.com)
2. Click en **"Environment"**
3. Agregar variables:
   ```
   GOOGLE_MAPS_API_KEY=tu_google_maps_key
   OPENWEATHER_API_KEY=tu_openweather_key
   ```
4. Click **"Save Changes"**
5. Render reiniciará el servicio automáticamente

### **Verificar que se aplicaron:**
```bash
# En logs de Render, deberías ver:
# "✅ Google Maps API Key configurada" (si está configurada)
# "⚠️  Google Maps API Key no configurada (usando fallback)" (si no está)
```

---

## ✅ **4. VERIFICACIÓN POST-CONFIGURACIÓN**

### **Test 1: Health Check con APIs**
```bash
# Ejecutar health check
cd proptech-backend
python3 scripts/health_check_apis.py
```

**Resultado esperado:**
```
✅ Google Maps Places API: 250ms
✅ OpenWeather Air Quality API: 180ms
```

### **Test 2: Valoración con Datos Reales**
```bash
# Usar endpoint con use_geospatial=true
curl -X POST http://tu-backend-url/api/ai/valuation/emotional \
  -H "Content-Type: application/json" \
  -d '{
    "area": 100,
    "latitude": 18.4861,
    "longitude": -69.9312,
    "use_geospatial": true
  }'
```

**Resultado esperado:** Valoración con `green_spaces`, `air_quality` con datos reales

---

## 💰 **COSTOS APROXIMADOS**

### **Google Maps API:**
- **Gratis:** $200 crédito/mes
- **Incluye:** 40,000+ requests/mes
- **Suficiente para:** ~50-100 propiedades/día

### **OpenWeather API:**
- **Gratis:** 1,000 calls/día (60 calls/min)
- **Suficiente para:** ~50 propiedades/día con calidad aire real

**Total Costo:** **$0/mes** para MVP (dentro de límites gratis)

---

## ⚠️ **NOTAS IMPORTANTES**

### **Fallback Automático:**
- ✅ Sistema funciona **sin APIs** usando estimaciones
- ✅ APIs solo **mejoran precisión**, no bloquean funcionalidad
- ✅ Puedes lanzar **sin APIs** y agregarlas después

### **Límites y Cuotas:**
- ⚠️ Monitorear uso en dashboards de Google/OpenWeather
- ⚠️ Configurar alertas si te acercas a límites
- ⚠️ Implementar caching para reducir llamadas

### **Seguridad:**
- ✅ **NUNCA** commitear API keys al repositorio
- ✅ Usar variables de entorno siempre
- ✅ Restringir API keys en dashboards
- ✅ Rotar keys periódicamente

---

## 🚀 **QUICK START (SIN APIS)**

Si prefieres lanzar **inmediatamente sin configurar APIs**:

```bash
# Sistema funcionará con fallback
# No necesitas configurar nada adicional
# Puedes agregar APIs después para mejorar precisión
```

**El sistema está diseñado para funcionar perfectamente sin APIs externas.**

---

## 📞 **SOPORTE**

**Problemas con configuración?**
- Verificar logs de Render para errores
- Revisar que variables de entorno están en Render
- Verificar formato de API keys (sin espacios)
- Confirmar que APIs están habilitadas en dashboards

**¿Listo para configurar?**
Sigue los pasos arriba y estarás listo en 15-20 minutos.

