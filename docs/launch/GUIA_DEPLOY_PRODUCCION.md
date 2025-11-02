# 🚀 Guía de Deploy a Producción - HabitatPro

**Tiempo Estimado:** 30-45 minutos  
**Dificultad:** Media (guiado paso a paso)

---

## 📋 **PREREQUISITOS**

- [ ] Tests automatizados pasando
- [ ] Variables de entorno configuradas (o usando fallback)
- [ ] Repositorio actualizado en GitHub
- [ ] Cuentas activas en Vercel y Render

---

## 🌐 **PASO 1: DEPLOY FRONTEND (Vercel)**

### **1.1 Verificar Conexión GitHub**
1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Verificar que el proyecto está conectado a GitHub
3. Si no está conectado:
   - Click **"Add New Project"**
   - Conectar repositorio `proptech-mvp`
   - Seleccionar directorio: `proptech-web`

### **1.2 Configurar Build Settings**
```
Framework Preset: Next.js
Root Directory: proptech-web
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **1.3 Configurar Variables de Entorno**
En Vercel Dashboard > Project Settings > Environment Variables:

**Variables Requeridas:**
```bash
NEXT_PUBLIC_BACKEND_URL=https://tu-backend-url.onrender.com
NEXTAUTH_URL=https://habitatprord.com
NEXTAUTH_SECRET=tu_secret_aqui
```

**Variables Opcionales:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu_codigo_aqui
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=tu_key_aqui
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_aqui
```

### **1.4 Deploy**
1. Push a `main` branch (auto-deploy)
2. O manual: Vercel Dashboard > Deployments > "Redeploy"

### **1.5 Verificar Deploy**
- ✅ Build exitoso sin errores
- ✅ Domain configurado (habitatprord.com)
- ✅ SSL activo
- ✅ Homepage carga correctamente

---

## 🔧 **PASO 2: DEPLOY BACKEND (Render)**

### **2.1 Verificar Servicio**
1. Ir a [Render Dashboard](https://dashboard.render.com)
2. Verificar que servicio backend está activo
3. Si no existe:
   - Click **"New" > "Web Service"**
   - Conectar repositorio `proptech-mvp`
   - Configurar:
     - **Name:** `habitatpro-backend`
     - **Root Directory:** `proptech-backend`
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `python app.py` o `gunicorn app:app`

### **2.2 Configurar Variables de Entorno**
En Render Dashboard > Environment:

**Variables Críticas:**
```bash
DATABASE_URL=postgresql://...
SECRET_KEY=tu_secret_key
JWT_SECRET_KEY=tu_jwt_secret
FLASK_ENV=production
```

**Variables Opcionales (APIs):**
```bash
GOOGLE_MAPS_API_KEY=tu_key
OPENWEATHER_API_KEY=tu_key
```

### **2.3 Deploy**
1. Push a `main` branch (auto-deploy)
2. O manual: Render Dashboard > "Manual Deploy"

### **2.4 Verificar Deploy**
- ✅ Build exitoso sin errores
- ✅ Health check respondiendo: `GET /api/health`
- ✅ Logs sin errores críticos
- ✅ Database connection estable

---

## ✅ **PASO 3: VERIFICACIÓN POST-DEPLOY**

### **3.1 Health Check Automatizado**
```bash
# Ejecutar health check en producción
curl https://tu-backend-url.onrender.com/api/health
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

### **3.2 Test Endpoint IA Emocional**
```bash
curl -X POST https://tu-backend-url.onrender.com/api/ai/valuation/emotional \
  -H "Content-Type: application/json" \
  -d '{
    "area": 100,
    "bedrooms": 3,
    "propertyType": "apartment",
    "zone": "premium"
  }'
```

**Resultado esperado:** JSON con valoración emocional

### **3.3 Verificar Frontend**
1. Ir a `https://habitatprord.com`
2. Verificar que carga correctamente
3. Test flujo básico:
   - ✅ Homepage carga
   - ✅ Navegación funciona
   - ✅ `/comprar` carga
   - ✅ `/valorar` funciona

### **3.4 Verificar Logs**
- ✅ Frontend (Vercel): No hay errores críticos
- ✅ Backend (Render): Logs sin errores 500
- ✅ Database: No hay connection errors

---

## 🔒 **PASO 4: CONFIGURACIÓN DOMAIN & SSL**

### **4.1 Custom Domain (Vercel)**
1. Vercel Dashboard > Settings > Domains
2. Agregar `habitatprord.com`
3. Configurar DNS según instrucciones Vercel:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (IP de Vercel)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Verificar DNS (puede tomar hasta 48h)

### **4.2 SSL Certificate**
- ✅ Automático en Vercel (Let's Encrypt)
- ✅ Verificar que está activo en Settings > Domains

---

## 📊 **PASO 5: CONFIGURAR MONITOREO**

### **5.1 Google Analytics**
1. Crear propiedad en [Google Analytics](https://analytics.google.com)
2. Obtener Measurement ID: `G-XXXXXXXXXX`
3. Agregar a Vercel env: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. Redeploy frontend

### **5.2 Sentry (Opcional)**
1. Crear proyecto en [Sentry](https://sentry.io)
2. Configurar en backend (`sentry_config.py`)
3. Agregar DSN a Render env
4. Verificar errores siendo capturados

### **5.3 Uptime Monitoring (Recomendado)**
- Usar [UptimeRobot](https://uptimerobot.com) gratis
- Monitorear:
  - Frontend: `https://habitatprord.com`
  - Backend: `https://tu-backend-url.onrender.com/api/health`

---

## ⚡ **PASO 6: OPTIMIZACIONES POST-DEPLOY**

### **6.1 Performance**
- ✅ Verificar Core Web Vitals en Vercel Analytics
- ✅ Verificar bundle size optimizado
- ✅ Verificar image optimization activa

### **6.2 Caching**
- ✅ Vercel edge caching automático
- ✅ Backend: Redis cache (si configurado)

### **6.3 CDN**
- ✅ Vercel CDN automático
- ✅ Imágenes optimizadas automáticamente

---

## ✅ **CHECKLIST POST-DEPLOY**

### **Frontend:**
- [ ] Domain configurado y funcionando
- [ ] SSL activo
- [ ] Build sin errores
- [ ] Homepage carga < 3s
- [ ] Navegación funciona
- [ ] IA Emocional operativa

### **Backend:**
- [ ] Health check responde
- [ ] Database connection estable
- [ ] APIs IA Emocional operativas
- [ ] Logs sin errores críticos
- [ ] Response time < 2s

### **Integración:**
- [ ] Frontend se comunica con backend
- [ ] Authentication funcionando
- [ ] Valoración IA Emocional funcionando
- [ ] Chatbot IA operativo

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Problema: Build falla en Vercel**
**Solución:**
- Verificar que `package.json` tiene todas las dependencias
- Verificar que TypeScript compilation pasa localmente
- Revisar logs de build en Vercel

### **Problema: Backend no responde**
**Solución:**
- Verificar que servicio está "Live" en Render
- Revisar logs de Render para errores
- Verificar que `PORT` está configurado correctamente

### **Problema: CORS errors**
**Solución:**
- Verificar que `NEXT_PUBLIC_BACKEND_URL` está configurado en Vercel
- Verificar CORS config en `app.py` permite dominio de Vercel

### **Problema: Database connection errors**
**Solución:**
- Verificar `DATABASE_URL` en Render
- Verificar que PostgreSQL service está activo en Render
- Revisar logs de database connection

---

## 📝 **NOTAS FINALES**

**Deploy Automático:**
- ✅ Vercel: Auto-deploy en push a `main`
- ✅ Render: Auto-deploy en push a `main`

**Rollback:**
- Vercel: Rollback desde Deployments > Previous deployment > "Promote to Production"
- Render: Rollback desde Deployments > Previous deployment

**Monitoring Post-Deploy:**
- Monitorear logs primeras 48 horas intensivamente
- Verificar métricas de performance
- Estar disponible para hotfixes rápidos

---

**¡Deploy exitoso! HabitatPro está LIVE en producción.** 🚀

