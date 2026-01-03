# 🔑 Template de Environment Variables

**Usar este template para configurar variables de entorno en Vercel y Render**

---

## 🌐 **VERCEL (Frontend) - Variables Requeridas**

### **Críticas (OBLIGATORIAS):**
```bash
# Backend URL (actualizar con tu URL real de Render)
NEXT_PUBLIC_BACKEND_URL=https://habitatpro-backend.onrender.com

# NextAuth Configuration
NEXTAUTH_URL=https://habitatprord.com
NEXTAUTH_SECRET=pegar_secret_generado_aqui
```

### **Opcionales (Recomendadas):**
```bash
# Google Places API (para autocompletado direcciones)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=tu_google_places_key_aqui

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu_codigo_verificacion

# Mapbox (para mapas interactivos)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token_aqui
```

---

## 🔧 **RENDER (Backend) - Variables Requeridas**

### **Críticas (OBLIGATORIAS):**
```bash
# Database Connection (de PostgreSQL service en Render)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=pegar_secret_generado_aqui
JWT_SECRET_KEY=pegar_jwt_secret_generado_aqui

# CORS Origins (actualizar con tu dominio Vercel)
CORS_ORIGINS=https://habitatprord.com,https://*.vercel.app

# Port (Render lo asigna automáticamente, pero puedes definirlo)
PORT=10000
```

### **Opcionales (Recomendadas):**
```bash
# Google Maps API (para datos geoespaciales reales)
GOOGLE_MAPS_API_KEY=tu_google_maps_key_aqui

# OpenWeather API (para calidad del aire)
OPENWEATHER_API_KEY=tu_openweather_key_aqui

# Sentry Error Tracking
SENTRY_DSN=tu_sentry_dsn_aqui

# Redis (si configuraste Redis service)
REDIS_URL=tu_redis_url_aqui
```

---

## 🔐 **GENERAR SECRETS**

**Ejecutar para generar secrets seguros:**
```bash
cd proptech-backend
python3 scripts/generate_secrets.py
```

**Output esperado:**
```
🔐 Generando secrets seguros...

SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET_KEY=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
NEXTAUTH_SECRET=zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz

✅ Secrets generados correctamente
```

**Copiar estos valores y usarlos en:**
- Vercel: `NEXTAUTH_SECRET`
- Render: `SECRET_KEY`, `JWT_SECRET_KEY`

---

## 📋 **CHECKLIST DE CONFIGURACIÓN**

### **Vercel:**
- [ ] `NEXT_PUBLIC_BACKEND_URL` configurada
- [ ] `NEXTAUTH_URL` configurada
- [ ] `NEXTAUTH_SECRET` configurada
- [ ] Variables opcionales agregadas (si aplica)

### **Render:**
- [ ] `DATABASE_URL` configurada
- [ ] `FLASK_ENV=production` configurada
- [ ] `SECRET_KEY` configurada
- [ ] `JWT_SECRET_KEY` configurada
- [ ] `CORS_ORIGINS` configurada
- [ ] Variables opcionales agregadas (si aplica)

---

## ⚠️ **NOTAS IMPORTANTES**

1. **NUNCA** commitear secrets al repositorio
2. **SIEMPRE** usar environment variables, no hardcoded values
3. **VERIFICAR** que valores no tienen espacios extras
4. **ACTUALIZAR** `CORS_ORIGINS` después de obtener dominio final
5. **ACTUALIZAR** `NEXT_PUBLIC_BACKEND_URL` después de obtener backend URL

---

## 🔄 **ACTUALIZACIÓN POST-DEPLOY**

**Después de hacer deploy inicial:**

1. **Obtener URLs reales:**
   - Frontend: Vercel te da URL (ej: `habitatprord.com`)
   - Backend: Render te da URL (ej: `habitatpro-backend.onrender.com`)

2. **Actualizar variables:**
   - Vercel: Actualizar `NEXT_PUBLIC_BACKEND_URL` con URL real de Render
   - Render: Actualizar `CORS_ORIGINS` con dominio real de Vercel

3. **Redeploy:**
   - Vercel: Auto-redeploy o manual desde Deployments
   - Render: Auto-redeploy o manual desde Deployments

---

**✅ Listo para configurar en Vercel y Render**

