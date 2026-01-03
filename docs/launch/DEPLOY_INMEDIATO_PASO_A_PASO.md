# 🚀 DEPLOY INMEDIATO - HABITATPRO

**Tiempo Estimado:** 30 minutos  
**Estado:** ✅ LISTO PARA EJECUTAR

---

## ⚡ **QUICK START (30 MINUTOS)**

### **OPCIÓN 1: Deploy Completo (Recomendado)**
```
⏱️ 5 min  - Configurar APIs (opcional)
⏱️ 10 min - Deploy Frontend Vercel
⏱️ 10 min - Deploy Backend Render  
⏱️ 5 min  - Verificación post-deploy
─────────────────────────────────
⏱️ 30 min - TOTAL
```

### **OPCIÓN 2: Deploy Mínimo (Sin Backend)**
```
⏱️ 10 min - Deploy Frontend Vercel
⏱️ 5 min  - Verificación básica
─────────────────────────────────
⏱️ 15 min - TOTAL (Frontend funcionando)
```

---

## 📋 **PASO 1: PREPARACIÓN (2 MINUTOS)**

### **1.1 Verificar Repositorio**
```bash
# Verificar que estás en main y todo está commiteado
git status
git branch  # Debe estar en main

# Si hay cambios sin commitear:
git add -A
git commit -m "Pre-deploy final"
git push origin main
```

### **1.2 Generar Secrets (si no los tienes)**
```bash
cd proptech-backend
python3 scripts/generate_secrets.py

# Esto genera:
# - SECRET_KEY
# - JWT_SECRET_KEY  
# - NEXTAUTH_SECRET

# Copia estos valores para usarlos en Vercel/Render
```

---

## 🌐 **PASO 2: DEPLOY FRONTEND (VERCEL) - 10 MIN**

### **2.1 Conectar Repositorio a Vercel**

**Si ya tienes proyecto en Vercel:**
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona proyecto existente
3. Settings > Git Repository > Reconnect if needed

**Si es proyecto nuevo:**
1. Ve a [Vercel New Project](https://vercel.com/new)
2. Click "Import Git Repository"
3. Selecciona `Oligonari2810/proptech-mvp`
4. Autoriza conexión GitHub si es necesario

### **2.2 Configurar Build Settings**

En la pantalla de configuración:

```
Framework Preset: Next.js
Root Directory: proptech-web
Build Command: npm run build
Output Directory: .next (default)
Install Command: npm install
```

**✅ Click "Deploy"**

### **2.3 Configurar Environment Variables**

**ANTES o DESPUÉS del primer deploy, ir a:**
Settings > Environment Variables

**Variables Críticas (OBLIGATORIAS):**
```bash
# Backend URL (reemplazar con tu URL de Render después del deploy backend)
NEXT_PUBLIC_BACKEND_URL=https://habitatpro-backend.onrender.com

# NextAuth (generado anteriormente)
NEXTAUTH_URL=https://habitatprord.com
NEXTAUTH_SECRET=pegar_secret_de_generate_secrets.py

# Google Places (si quieres autocompletado)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=tu_google_places_key (opcional)
```

**Variables Opcionales:**
```bash
# Analytics (puedes agregar después)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Verification (puedes agregar después)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu_codigo

# Mapbox (si quieres mapas)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token
```

**✅ Click "Save" después de cada variable**

### **2.4 Verificar Deploy**

**Después del deploy:**
1. Ve a "Deployments" tab
2. Espera build completo (2-5 minutos)
3. Verifica que dice "Ready"
4. Click en el dominio para verificar que carga

**✅ Checklist Frontend:**
- [ ] Build exitoso (no errores)
- [ ] Homepage carga correctamente
- [ ] No hay errores en console del navegador
- [ ] Navegación funciona
- [ ] Domain configurado (habitatprord.com)

---

## 🔧 **PASO 3: DEPLOY BACKEND (RENDER) - 10 MIN**

### **3.1 Crear Web Service en Render**

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click "New" > "Web Service"
3. Connect GitHub repo: `Oligonari2810/proptech-mvp`
4. Autoriza conexión si es necesario

### **3.2 Configurar Servicio**

**Configuración básica:**
```
Name: habitatpro-backend
Region: Ohio (US East) o más cercano
Branch: main
Root Directory: proptech-backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT

Plan: Free (para empezar)
```

**✅ Click "Create Web Service"**

### **3.3 Crear PostgreSQL Database**

**Mientras el servicio se crea:**
1. Click "New" > "PostgreSQL"
2. Configuración:
```
Name: habitatpro-db
Database: habitatpro
User: habitatpro_user
Region: Same as backend
Plan: Free (para empezar)
```
3. Click "Create Database"
4. **Copiar Internal Database URL** (la usarás en variables de entorno)

### **3.4 Configurar Environment Variables**

En el servicio web backend, ir a "Environment":

**Variables Críticas (OBLIGATORIAS):**
```bash
# Database (del paso 3.3)
DATABASE_URL=postgresql://user:pass@host:5432/habitatpro

# Flask
FLASK_ENV=production
SECRET_KEY=pegar_secret_de_generate_secrets.py
JWT_SECRET_KEY=pegar_jwt_secret_de_generate_secrets.py

# CORS (reemplazar con tu dominio Vercel después)
CORS_ORIGINS=https://habitatprord.com,https://*.vercel.app

# Port (Render lo asigna automáticamente)
PORT=10000
```

**Variables Opcionales:**
```bash
# APIs (si las configuraste)
GOOGLE_MAPS_API_KEY=tu_google_maps_key
OPENWEATHER_API_KEY=tu_openweather_key

# Sentry (si lo configuraste)
SENTRY_DSN=tu_sentry_dsn

# Redis (si lo configuraste)
REDIS_URL=tu_redis_url
```

**✅ Click "Save Changes"** (Render reiniciará automáticamente)

### **3.5 Actualizar CORS en Frontend**

**Después de que Render asigne URL al backend:**
1. Copiar URL del servicio (ej: `https://habitatpro-backend.onrender.com`)
2. Ir a Vercel > Environment Variables
3. Actualizar `NEXT_PUBLIC_BACKEND_URL` con la URL real
4. Ir a Render > Environment Variables
5. Actualizar `CORS_ORIGINS` con tu dominio Vercel
6. Redeploy ambos servicios

### **3.6 Verificar Deploy**

**Esperar que servicio esté "Live" (3-5 minutos)**

**Verificar health check:**
```bash
# Reemplazar con tu URL real
curl https://habitatpro-backend.onrender.com/api/health

# Debe responder:
# {"status": "healthy", "database": "connected", ...}
```

**✅ Checklist Backend:**
- [ ] Servicio está "Live"
- [ ] Database conectada
- [ ] Health check responde OK
- [ ] Logs sin errores críticos
- [ ] CORS configurado correctamente

---

## ✅ **PASO 4: VERIFICACIÓN POST-DEPLOY - 5 MIN**

### **4.1 Verificación Frontend**

**URLs a verificar:**
```bash
✅ https://habitatprord.com (homepage)
✅ https://habitatprord.com/comprar (búsqueda propiedades)
✅ https://habitatprord.com/valorar (valoración IA)
✅ https://habitatprord.com/calculadora-hipotecaria (calculadora)
✅ https://habitatprord.com/leyes-inmobiliarias (leyes RD)
```

**Para cada URL:**
- [ ] Carga correctamente (< 3 segundos)
- [ ] No hay errores en console del navegador
- [ ] Navegación funciona
- [ ] Componentes renderizan correctamente

### **4.2 Verificación Backend APIs**

**Ejecutar tests rápidos:**
```bash
# Health Check
curl https://tu-backend-url.onrender.com/api/health

# Emotional Valuation (test básico)
curl -X POST https://tu-backend-url.onrender.com/api/ai/valuation/emotional \
  -H "Content-Type: application/json" \
  -d '{"area": 100, "bedrooms": 3, "propertyType": "apartment", "zone": "premium", "condition": "good", "year": 2020, "hasPool": false, "hasParking": true, "proximityBeach": 5, "proximitySchools": 1}'

# Properties List
curl https://tu-backend-url.onrender.com/api/properties?limit=5
```

**✅ Debe responder JSON válido en todos**

### **4.3 Verificación Integración**

**Test flujo completo:**
1. Ir a `/comprar`
2. [ ] Lista de propiedades carga
3. [ ] Filtros funcionan
4. [ ] Click en propiedad abre detalles
5. [ ] Chatbot IA Emocional funciona (si implementado)
6. [ ] Calculadora hipotecaria calcula correctamente

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Problema: Build falla en Vercel**
```
Error: Module not found / Type error

Solución:
1. Verificar que Root Directory es "proptech-web"
2. Verificar que Build Command es "npm run build"
3. Revisar logs de build en Vercel
4. Verificar que package.json tiene todas las dependencias
```

### **Problema: Backend no inicia**
```
Error: Database connection failed

Solución:
1. Verificar DATABASE_URL en Render
2. Verificar que PostgreSQL está "Available"
3. Revisar logs de Render para errores específicos
4. Verificar que usuario/tabla existen
```

### **Problema: CORS errors**
```
Error: CORS policy blocked

Solución:
1. Verificar CORS_ORIGINS en Render incluye dominio Vercel
2. Verificar que NEXT_PUBLIC_BACKEND_URL en Vercel es correcta
3. Reiniciar ambos servicios
```

### **Problema: Frontend no conecta con backend**
```
Error: Network request failed

Solución:
1. Verificar que NEXT_PUBLIC_BACKEND_URL está en Vercel env vars
2. Verificar que backend URL es correcta (https://)
3. Verificar que backend está "Live" en Render
4. Probar health check directamente en navegador
```

---

## 📊 **CHECKLIST FINAL**

### **Antes de considerar deploy completo:**

- [ ] Frontend deploy exitoso en Vercel
- [ ] Backend deploy exitoso en Render
- [ ] Database conectada y funcionando
- [ ] Health check backend responde OK
- [ ] Homepage frontend carga correctamente
- [ ] CORS configurado correctamente
- [ ] Environment variables configuradas
- [ ] No hay errores críticos en logs
- [ ] Test flujo completo manual pasa

---

## 🎉 **POST-DEPLOY: PRÓXIMOS PASOS**

### **Inmediato (Hoy):**
1. ✅ Deploy completado
2. 📧 Enviar emails a 5-10 brokers beta
3. 📊 Configurar Google Analytics (opcional)
4. 🔔 Configurar Uptime monitoring (opcional)

### **Semana 1:**
1. 👥 Onboarding brokers beta
2. 📈 Monitorear métricas clave
3. 🔧 Hotfixes si necesario
4. 📝 Recopilar feedback

### **Semana 2-4:**
1. 🚀 Lanzamiento público
2. 📢 Marketing campaign
3. 💰 Activar Featured Listings
4. 📊 Analizar métricas de negocio

---

## 🎯 **ESTADO ACTUAL**

```
✅ Sistema 100% completo
✅ Tests pasando
✅ Materiales listos
✅ Documentación exhaustiva
✅ Listo para deploy
```

**¡Tiempo estimado para tener HabitatPro en producción: 30 minutos!** 🚀

---

**¿Dudas durante el deploy? Revisa esta guía o ejecuta el script de verificación post-deploy.**

