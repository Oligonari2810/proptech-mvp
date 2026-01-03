# 🏠 **HABITATPRO - PROPTECH MVP**

**Plataforma inmobiliaria completa para República Dominicana**  
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-green)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Operational-success)]()

---

## 🎯 **¿QUÉ ES HABITATPRO?**

HabitatPro es una **plataforma PropTech completa** que conecta usuarios, brokers y desarrolladores con propiedades inmobiliarias en República Dominicana. Incluye búsqueda avanzada, mapas interactivos, tours virtuales, sistema de reservas y analytics avanzados.

---

## ✨ **FEATURES PRINCIPALES**

### **🔐 Autenticación y Seguridad**
- ✅ Login/Registro con JWT y OAuth (Google, GitHub)
- ✅ Roles y permisos (user, broker, admin)
- ✅ Header condicional por rol
- ✅ Rutas admin protegidas

### **🏠 Gestión de Propiedades**
- ✅ CRUD completo de propiedades
- ✅ Filtros por operación (compra, alquiler, venta)
- ✅ Búsqueda avanzada
- ✅ Autocompletado de direcciones (Google Places)
- ✅ Panel admin completo

### **🗺️ Mapas Interactivos**
- ✅ Mapbox GL JS integrado
- ✅ Marcador arrastrable para selección precisa
- ✅ Clustering de propiedades
- ✅ Geocodificación automática

### **📅 Sistema de Reservas**
- ✅ Calendario integrado
- ✅ Reservas de visitas a propiedades
- ✅ Formulario completo de reserva
- ✅ Integración Google Calendar

### **🎥 Tours Virtuales**
- ✅ Soporte Matterport y Google Street View
- ✅ Tours 360° con imágenes
- ✅ Videos walkthrough integrados

### **🤖 Chatbot y IA**
- ✅ Chatbot de propiedades reutilizable
- ✅ Recomendaciones IA (base implementada)
- ✅ Sistema de favoritos con IA

### **📊 Analytics y Admin**
- ✅ Dashboard analytics completo
- ✅ Time range selector (7d/30d/90d/1y)
- ✅ ROI Dashboard
- ✅ Mapa de calor de leads
- ✅ Portal Statistics

---

## 🛠️ **STACK TECNOLÓGICO**

### **Frontend**
- **Framework:** Next.js 15.5.6
- **UI:** React 19, Tailwind CSS
- **Mapas:** Mapbox GL JS, react-map-gl
- **Auth:** NextAuth.js
- **Estado:** Zustand
- **Deploy:** Vercel

### **Backend**
- **Framework:** Flask 2.3.3
- **Base de datos:** PostgreSQL (producción), SQLite (desarrollo)
- **ORM:** SQLAlchemy 2.0
- **Auth:** JWT, authlib, flask-jwt-extended
- **Cache:** Redis (con fallback)
- **WebSockets:** Flask-SocketIO
- **Deploy:** Render

### **Servicios Externos**
- **Mapas:** Mapbox
- **Direcciones:** Google Places API
- **Monitoreo:** Sentry
- **CDN:** Vercel Edge Network

---

## 🚀 **INICIO RÁPIDO**

### **Prerrequisitos**
- Node.js 18+ y npm
- Python 3.9+
- PostgreSQL (o SQLite para desarrollo)

### **Frontend**
```bash
cd proptech-web
npm install
cp .env.local.example .env.local
# Configurar variables de entorno en .env.local
npm run dev
```

### **Backend**
```bash
cd proptech-backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configurar variables de entorno en .env
python app.py
```

---

## 📋 **VARIABLES DE ENTORNO**

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_BACKEND_URL=https://proptech-mvp-1.onrender.com
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ...
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=http://localhost:3000
```

### **Backend (.env)**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=tu-secret-key
JWT_SECRET_KEY=tu-jwt-secret
REDIS_URL=redis://localhost:6379
```

---

## 📚 **DOCUMENTACIÓN**

### **Documentación Completa**
- 📖 Ver carpeta `docs/` para documentación detallada
- 🔧 Guías de configuración y troubleshooting
- 📊 Resúmenes de estado y progreso
- 🚀 Guías de deployment

### **Documentación Importante**
- `docs/VERCEL_MAPBOX_SETUP.md` - Configurar Mapbox
- `docs/FIX_ERRORS_PRODUCCION.md` - Solución de errores
- `docs/PLAN_IMPLEMENTACION_FASES.md` - Plan de desarrollo

---

## 🎯 **ESTADO ACTUAL**

### **✅ Implementado (70%+)**
- Autenticación y seguridad completa
- Gestión de propiedades avanzada
- Mapas interactivos
- Sistema de reservas
- Tours virtuales 3D
- Chatbot de propiedades
- Sistema de favoritos
- Analytics avanzados
- Panel admin completo

### **⚠️ En Progreso**
- App móvil (estructura base lista)
- WhatsApp Business API (estructura base lista)
- GPT-4 integrado (estructura base lista)
- Motor IA recomendaciones avanzado

### **⏳ Pendiente**
- Multi-tenant avanzado
- API Marketplace público
- Sistema de afiliados
- Marketplace de servicios

---

## 🧪 **TESTING**

### **Backend**
```bash
cd proptech-backend
pytest tests/
```

### **Frontend**
```bash
cd proptech-web
npm run build  # Verificar que compile
npm run lint   # Verificar linting
```

---

## 📊 **ESTADÍSTICAS**

- **Features implementadas:** 70%+
- **Archivos de código:** ~200
- **Componentes React:** ~70
- **Endpoints API:** ~30
- **Modelos BD:** 10+

---

## 🌐 **DEPLOYMENT**

### **Frontend (Vercel)**
- **URL:** https://habitatprord.com
- **Deploy:** Automático en push a `main`
- **Build:** Exitoso ✅

### **Backend (Render)**
- **URL:** https://proptech-mvp-1.onrender.com
- **Deploy:** Automático en push a `main`
- **Health Check:** `/api/health` ✅

---

## 🤝 **CONTRIBUCIÓN**

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 **LICENCIA**

Este proyecto es privado y propietario.

---

## 📞 **CONTACTO**

**HabitatPro Team**  
República Dominicana

---

## 🎉 **ÚLTIMAS ACTUALIZACIONES**

- ✅ Sistema de reservas implementado
- ✅ Tours virtuales 3D completados
- ✅ Chatbot general creado
- ✅ Analytics con time range selector
- ✅ Mapa interactivo mejorado
- ✅ Errores CSP corregidos
- ✅ CORS configurado dinámicamente
- ✅ Build exitoso en producción

---

**Última actualización:** Octubre 2024  
**Estado:** ✅ Operacional y Estable  
**Versión:** 2.0.0-enterprise
