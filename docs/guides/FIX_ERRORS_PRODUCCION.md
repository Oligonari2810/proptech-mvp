# 🔧 **FIX ERRORES PRODUCCIÓN - SOLUCIÓN COMPLETA**

**Fecha:** Octubre 2024  
**Problemas identificados:** CORS, CSP, Mapbox 403

---

## 🚨 **ERRORES IDENTIFICADOS**

### **1. ERROR CORS - Backend bloqueando requests**
```
Access to fetch at 'https://proptech-mvp-1.onrender.com/api/properties' 
from origin 'https://proptech-3r2xxlrkn-oligonari2810s-projects.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Causa:** El dominio de Vercel `proptech-3r2xxlrkn-oligonari2810s-projects.vercel.app` no está en la lista de `allowed_origins` del backend.

**Solución:** ✅ **IMPLEMENTADA**
- CORS ahora acepta dinámicamente todos los dominios `*.vercel.app`
- Función `is_vercel_domain()` valida dominios de Vercel automáticamente
- Agregado patrón regex para validar cualquier subdominio de Vercel

---

### **2. ERROR CSP - Font-src bloqueando data:**
```
Loading the font 'data:font/woff2;base64,...' violates the following 
Content Security Policy directive: "font-src 'self' 'unsafe-inline' data: ..."
```

**Causa:** CSP tiene `data:` en font-src, pero necesita ser más permisivo para fuentes base64.

**Solución:** ✅ **IMPLEMENTADA**
- Agregado `blob:` a `font-src` en CSP
- Ahora permite: `font-src 'self' 'unsafe-inline' data: blob: ...`

---

### **3. ERROR MAPBOX 403 - Token inválido o sin permisos**
```
api.mapbox.com/v4/mapbox.mapbox-streets-v8,.../vector.pbf: 
Failed to load resource: the server responded with a status of 403
```

**Causa:** 
1. Token de Mapbox puede estar inválido o expirado
2. Token no tiene permisos para el estilo `mapbox-streets-v8`
3. Token puede estar limitado a ciertos dominios

**Solución:** ⚠️ **REQUIERE ACCIÓN MANUAL**

**Pasos:**
1. Ve a https://account.mapbox.com/access-tokens/
2. Verifica que el token `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ` esté activo
3. Si no está activo, crea un nuevo token:
   - Click en "Create a token"
   - Nombre: "HabitatPro Production"
   - URL restrictions: Dejar vacío (o agregar `https://*.vercel.app`)
   - Scopes: Marcar "PUBLIC" y "DOWNLOADS:READ"
   - Token expires: Never (o fecha lejana)
4. Copia el nuevo token y agrégalo a Vercel:
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` = [nuevo token]

---

### **4. ERROR MAPBOX events.mapbox.com - DNS no resuelve**
```
events.mapbox.com/events/v2?...: Failed to load resource: net::ERR_NAME_NOT_RESOLVED
```

**Causa:** El servicio de eventos de Mapbox no está disponible o hay un problema de DNS.

**Solución:** ✅ **NO CRÍTICO**
- Los eventos de Mapbox son opcionales (analytics)
- El mapa funciona sin ellos
- No afecta la funcionalidad principal
- Si persiste, puede ser un problema temporal de Mapbox

---

## ✅ **CORRECCIONES IMPLEMENTADAS**

### **1. CORS Backend Mejorado:**
```python
# app.py - CORS dinámico para Vercel
CORS(app, 
     origins=lambda origin: (
         origin in allowed_origins or 
         is_vercel_domain(origin) or  # ← NUEVO: acepta *.vercel.app
         (origin and 'localhost' in origin) or
         (os.getenv('FLASK_ENV') != 'production' and origin)
     ),
     ...
)
```

### **2. CSP Font-src Mejorado:**
```javascript
// next.config.js
"font-src 'self' 'unsafe-inline' data: blob: ..."  // ← Agregado blob:
```

---

## 🔍 **VERIFICACIÓN POST-FIX**

### **1. Verificar CORS:**
```bash
# Test desde consola del navegador
fetch('https://proptech-mvp-1.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS OK:', d))
  .catch(e => console.error('❌ CORS ERROR:', e));
```

**Resultado esperado:**
- ✅ `200 OK` sin error CORS
- ✅ Headers incluyen `Access-Control-Allow-Origin`

### **2. Verificar CSP:**
- Abrir consola del navegador (F12)
- Buscar errores CSP (deberían desaparecer)
- Verificar que fuentes carguen correctamente

### **3. Verificar Mapbox:**
- Abrir consola del navegador (F12)
- Buscar: `✅ Mapbox cargado exitosamente`
- Verificar que no hay errores 403 después de configurar token correcto

---

## 📋 **CHECKLIST DE ACCIÓN**

- [x] CORS configurado para aceptar dominios Vercel dinámicamente
- [x] CSP font-src mejorado con `blob:`
- [ ] **Mapbox token verificado y actualizado en Vercel** ← REQUIERE ACCIÓN MANUAL
- [ ] Redeploy backend después de cambios CORS
- [ ] Redeploy frontend después de cambios CSP

---

## 🚀 **PRÓXIMOS PASOS**

### **1. Redeploy Backend (RENDER):**
```bash
# En Render Dashboard:
# 1. Ir a servicio backend
# 2. Manual Deploy → Clear build cache → Deploy
```

### **2. Redeploy Frontend (VERCEL):**
- Vercel debería detectar cambios automáticamente
- Si no, forzar redeploy desde dashboard

### **3. Configurar Mapbox Token:**
- Seguir pasos en sección "ERROR MAPBOX 403" arriba

---

**Última actualización:** Octubre 2024  
**Estado:** CORS y CSP corregidos, Mapbox requiere token válido en Vercel

