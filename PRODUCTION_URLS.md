# 🚀 URLs OFICIALES DE PRODUCCIÓN - HABITATPRO

**Última actualización**: $(date)

---

## 🌐 DOMINIO PRINCIPAL
**https://habitatprord.com**

---

## 🎨 FRONTEND (Vercel)

| Página | URL | Estado |
|--------|-----|--------|
| **Homepage** | https://habitatprord.com/ | ✅ Operativo |
| **Comprar** | https://habitatprord.com/comprar | ✅ Operativo |
| **Alquilar** | https://habitatprord.com/alquilar | ✅ Operativo |
| **Invertir** | https://habitatprord.com/invertir | ✅ Operativo |
| **Vender** | https://habitatprord.com/vender | ✅ Operativo |
| **Redesign (Preview)** | https://habitatprord.com/redesign | ✅ Operativo |
| **Admin Dashboard** | https://habitatprord.com/admin | ✅ Operativo (Protegido) |
| **Property Form** | https://habitatprord.com/redesign/vender | ✅ Operativo (Protegido) |

---

## ⚙️ BACKEND API (Render)

| Endpoint | URL | Método | Descripción |
|----------|-----|--------|-------------|
| **Base URL** | https://proptech-mvp-1.onrender.com | - | API Principal |
| **Health Check** | /api/health | GET | Estado del sistema |
| **Propiedades** | /api/properties | GET | Listar propiedades |
| **Crear Propiedad** | /api/properties | POST | Crear nueva propiedad |
| **Admin Metrics** | /api/admin/metrics | GET | Métricas del dashboard |
| **Favoritos** | /api/favorites | GET/POST/DELETE | Sistema de favoritos |
| **ROI Analytics** | /api/analytics/roi | GET | Cálculos de ROI |
| **Auth** | /api/auth/* | POST | Autenticación |

---

## 🔐 AUTHENTICATION (NextAuth)

| Función | URL |
|---------|-----|
| **Login** | https://habitatprord.com/auth/signin |
| **Callback** | https://habitatprord.com/api/auth/callback |
| **Session** | https://habitatprord.com/api/auth/session |

---

## 📊 ESTADO DE SERVICIOS

| Servicio | Estado | URL | Notas |
|----------|--------|-----|-------|
| **Frontend** | ✅ **Operativo** | habitatprord.com | Vercel Auto-deploy |
| **Backend** | ✅ **Operativo** | proptech-mvp-1.onrender.com | Render Standard Plan |
| **Database** | ✅ **Operativa** | PostgreSQL | Render Managed |
| **Authentication** | ✅ **Operativa** | NextAuth | JWT + OAuth2 |
| **Monitoring** | ✅ **Configurado** | Prometheus + Grafana | Local setup |

---

## 🚨 PROCEDIMIENTOS DE EMERGENCIA

### Frontend Caído
1. Verificar Vercel Dashboard: https://vercel.com/dashboard
2. Revisar logs de build y deployment
3. Verificar dominio configurado
4. Re-deploy manual si es necesario

### Backend Caído
1. Verificar Render Dashboard: https://dashboard.render.com
2. Revisar logs del servicio
3. Verificar health check: `curl https://proptech-mvp-1.onrender.com/api/health`
4. Reiniciar servicio si es necesario

### Database Issues
1. Verificar estado en Render Dashboard
2. Revisar conexiones activas
3. Contactar soporte Render si es crítico

---

## 🔧 VARIABLES DE ENTORNO

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=https://proptech-mvp-1.onrender.com
NEXT_PUBLIC_APP_URL=https://habitatprord.com
NEXTAUTH_URL=https://habitatprord.com
NEXTAUTH_SECRET=[generated-secret]
```

### Backend (Render Environment)
```bash
DATABASE_URL=[render-postgres-url]
SECRET_KEY=[generated-secret]
FLASK_ENV=production
PORT=8000
```

---

## 📞 CONTACTOS Y SOPORTE

- **Deployments**: Automáticos (GitHub → Vercel + Render)
- **Monitoring**: Prometheus + Grafana configurado
- **Backup**: Configurado en Render (PostgreSQL)

---

## 🎯 URLs ALTERNATIVAS (NO OFICIALES)

⚠️ **NOTA**: Estas URLs pueden no estar operativas o configuradas:
- `https://proptech-mvp.vercel.app` - Requiere configuración adicional
- `https://habitatpro-backend.onrender.com` - Suspendido (usar proptech-mvp-1.onrender.com)

**Recomendación**: Usar exclusivamente las URLs oficiales listadas arriba.

---

**Mantenido por**: Team HabitatPro  
**Versión**: 2.0.0-enterprise

