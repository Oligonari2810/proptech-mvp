# 🏠 HabitatPro - Plataforma Inmobiliaria con IA Emocional

## 📊 Estado del Proyecto

### ✅ Completado
- **Frontend**: Desplegado en Vercel (`https://habitatprord.com`)
- **Backend**: Scripts configurados, pendiente activación en Render
- **Features Implementadas**: 10 fases completas
  - FASE 1-3: Seguridad, Rate Limiting, Auth, Observabilidad
  - FASE 4-6: Audit Log, SEO Avanzado, Performance & Accesibilidad
  - FASE 7-10: E2E Testing, Migrations, SEO Completo, Accesibilidad Total

### ⚠️ Pendientes
- **Backend**: Reactivar servicio en Render (actualmente suspendido)
- **Frontend `/valorar`**: Verificar build y deploy en Vercel

## 🚀 Quick Start

### Prueba en Producción
```bash
# Smoke Test
./smoke.sh
```

### Desarrollo Local
```bash
# Backend
cd proptech-backend
source venv/bin/activate
python app.py

# Frontend
cd proptech-web
npm run dev
```

## 📁 Estructura

```
proptech-mvp/
├── proptech-backend/    # Flask API
├── proptech-web/        # Next.js Frontend
├── smoke.sh             # Smoke test production
└── monitoring/          # Prometheus config
```

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Flask, Python, PostgreSQL
- **Auth**: NextAuth (RBAC)
- **Monitoring**: Sentry
- **SEO**: Schema.org, Dynamic Sitemap
- **Testing**: Playwright E2E

## 📝 Comandos Útiles

```bash
# Verificar producción
./smoke.sh

# Commit seguro
git add . && git commit -m "feat: description" && git push origin main

# Ver logs backend
cat /tmp/backend*.log
```

## 🎯 Features Principales

1. **Búsqueda de Propiedades** - Listado con mapas interactivos
2. **HabitaScore AVM** - Valoración automática con IA
3. **Admin Panel** - Gestión completa con audit log
4. **SEO Avanzado** - Schema.org, sitemap dinámico
5. **Accesibilidad** - WCAG 2.1 AA compliant

## 📞 Contacto

- **Email**: support@habitatpro.com
- **Website**: https://habitatprord.com

---

---

## 🚀 Producción

### URLs Oficiales
- **Frontend**: https://habitatprord.com
- **Backend API**: https://proptech-mvp-1.onrender.com

### Estado de Servicios
- ✅ Frontend: Operativo (Vercel)
- ✅ Backend: Operativo (Render)
- ✅ Database: Operativa (PostgreSQL)

### Health Check
```bash
# Verificación rápida
./quick-health-check.sh

# Validación completa
./validate-production.sh
```

Para más detalles, ver: [PRODUCTION_URLS.md](./PRODUCTION_URLS.md)

---

**Estado**: 🟢 **Producción activa**
