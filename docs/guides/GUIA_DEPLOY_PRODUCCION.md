# 🚀 Guía de Deploy a Producción - HabitatPro

**Fecha:** $(date +%Y-%m-%d)  
**Estado:** ✅ Listo para Producción

---

## 📋 PRE-CHECKLIST DE DEPLOY

### ✅ Verificaciones Pre-Deploy

- [x] Testing completo realizado (ver `TESTING_COMPLETO_REPORTE.md`)
- [x] 0 errores de TypeScript
- [x] 0 errores de Python
- [x] Todos los blueprints registrados
- [x] Todos los modelos de BD creados
- [x] Variables de entorno documentadas
- [x] CSP configurado correctamente
- [x] CORS configurado para producción

---

## 🔧 DEPLOY FRONTEND (Vercel)

### Paso 1: Preparar Variables de Entorno

Verifica que estas variables estén configuradas en Vercel:

```bash
# Backend URL
NEXT_PUBLIC_BACKEND_URL=https://proptech-mvp-1.onrender.com

# Google Places API
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=tu_api_key_aqui

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_aqui

# NextAuth
NEXTAUTH_SECRET=tu_secret_generado
NEXTAUTH_URL=https://habitatprord.com

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=opcional
```

### Paso 2: Verificar Build

```bash
cd proptech-web
npm run build
```

Si el build pasa sin errores, está listo para deploy.

### Paso 3: Deploy en Vercel

1. **Opción A: Deploy Automático (GitHub)**
   - Push a `main` branch
   - Vercel detecta automáticamente y hace deploy
   - Verifica en dashboard de Vercel

2. **Opción B: Deploy Manual**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Paso 4: Verificación Post-Deploy Frontend

- [ ] Homepage carga correctamente
- [ ] Navegación premium funciona
- [ ] Calculadoras funcionan (`/calculadora-impuestos`, `/calculadora-hipotecaria`)
- [ ] Módulo legal carga (`/leyes-inmobiliarias`, `/tramites-inmobiliarios`, `/confotur`)
- [ ] Featured section muestra propiedades
- [ ] PropertyDetail muestra calculadoras compactas
- [ ] Sistema de reputación funciona (`/properties/[id]`)
- [ ] Admin panel accesible (`/admin/*`)
- [ ] Responsive en mobile funciona

---

## 🔧 DEPLOY BACKEND (Render)

### Paso 1: Preparar Variables de Entorno

Configura estas variables en Render:

```bash
# Flask
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=tu_secret_key_aqui

# JWT
JWT_SECRET_KEY=tu_jwt_secret_aqui

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Redis (opcional)
REDIS_URL=redis://host:port

# CORS
ALLOWED_ORIGINS=https://habitatprord.com,https://www.habitatprord.com

# Sentry (opcional)
SENTRY_DSN=tu_sentry_dsn
```

### Paso 2: Verificar Requisitos

Asegúrate que `requirements.txt` tenga todas las dependencias:

```bash
cd proptech-backend
pip install -r requirements.txt
```

### Paso 3: Deploy en Render

1. **Conectar GitHub Repo**
   - Ve a Render Dashboard
   - New → Web Service
   - Conecta tu repositorio GitHub

2. **Configurar Build**
   ```bash
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

3. **Verificar Health Check**
   - Render debería hacer health check en `/health`
   - Si no funciona, ajusta el endpoint en Render

### Paso 4: Verificación Post-Deploy Backend

- [ ] Health check responde (`/health`)
- [ ] API de propiedades funciona (`/api/properties`)
- [ ] API de autenticación funciona (`/api/auth/*`)
- [ ] API de reviews funciona (`/api/reviews/*`)
- [ ] API de featured listings funciona (`/api/featured-listings`)
- [ ] Base de datos conectada
- [ ] Migraciones aplicadas (si hay)

---

## 🗄️ BASE DE DATOS (PostgreSQL)

### Migraciones Necesarias

Si es primera vez, ejecuta estas migraciones:

```sql
-- Tabla de Featured Listings
CREATE TABLE IF NOT EXISTS featured_listings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id),
    tier VARCHAR(50) NOT NULL DEFAULT 'featured',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    broker_id INTEGER REFERENCES users(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'property',
    verified BOOLEAN DEFAULT FALSE,
    tags JSONB,
    images JSONB,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_featured_property ON featured_listings(property_id);
CREATE INDEX IF NOT EXISTS idx_featured_tier ON featured_listings(tier);
CREATE INDEX IF NOT EXISTS idx_featured_active ON featured_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_broker ON reviews(broker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
```

---

## ✅ CHECKLIST POST-DEPLOY COMPLETO

### Frontend (Vercel)
- [ ] Homepage carga
- [ ] Navegación funciona
- [ ] Todas las rutas accesibles
- [ ] Calculadoras funcionan
- [ ] Módulo legal funciona
- [ ] Featured listings muestra badges
- [ ] PropertyDetail completo
- [ ] Responsive funciona en mobile
- [ ] Sin errores en consola

### Backend (Render)
- [ ] Health check pasa
- [ ] APIs responden correctamente
- [ ] Base de datos conectada
- [ ] CORS configurado
- [ ] Logs funcionando
- [ ] No hay errores 500

### Integración
- [ ] Frontend puede comunicarse con backend
- [ ] Autenticación funciona end-to-end
- [ ] Featured listings se crean desde dashboard
- [ ] Reviews se crean y muestran
- [ ] Calculadoras calculan correctamente

---

## 🐛 TROUBLESHOOTING COMÚN

### Error: CORS
```python
# Verifica en app.py que CORS permita tu dominio Vercel
CORS(app, origins=[
    "https://habitatprord.com",
    "https://www.habitatprord.com",
    "https://*.vercel.app"  # Para previews
])
```

### Error: Database Connection
```bash
# Verifica DATABASE_URL en Render
# Formato: postgresql://user:password@host:port/dbname
```

### Error: Build Fails (Frontend)
```bash
# Verifica que todas las variables NEXT_PUBLIC_* estén en Vercel
# Verifica que no haya errores de TypeScript locales
npm run build
```

### Error: Featured Listings No Muestran
```bash
# Verifica que la tabla featured_listings existe
# Verifica que hay listings activos en la BD
# Verifica que el endpoint /api/properties/featured funciona
```

---

## 📊 MONITOREO POST-DEPLOY

### Métricas a Monitorear

1. **Performance**
   - Tiempo de carga de páginas
   - API response times
   - Error rates

2. **Uso**
   - Usuarios activos
   - Propiedades vistas
   - Calculadoras usadas
   - Featured listings creados

3. **Errores**
   - 500 errors en backend
   - JavaScript errors en frontend
   - API errors

### Herramientas Recomendadas

- **Vercel Analytics**: Automático si tienes Vercel Pro
- **Render Metrics**: Dashboard de Render
- **Sentry**: Para error tracking (opcional)
- **Google Analytics**: Para métricas de negocio (opcional)

---

## 🚀 PRÓXIMOS PASOS POST-DEPLOY

1. **Día 1**: Verificar que todo funciona
2. **Día 2**: Onboard primeros brokers beta
3. **Semana 1**: Marketing suave a brokers
4. **Semana 2-4**: Crecimiento y ajustes

---

## 📞 CONTACTO DE EMERGENCIA

Si hay problemas críticos post-deploy:

1. Verifica logs en Vercel/Render
2. Revisa `TESTING_COMPLETO_REPORTE.md`
3. Verifica variables de entorno
4. Revisa health checks

---

**¡Éxito en el lanzamiento! 🚀**

