# 🔐 **CONFIGURAR MAPBOX EN VERCEL - SOLUCIÓN DEFINITIVA**

**Problema:** Mapbox no carga en producción (Vercel)  
**Causa:** Variable de entorno `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` no configurada

---

## ✅ **SOLUCIÓN RÁPIDA (5 MINUTOS)**

### **PASO 1: Obtener Token de Mapbox**

1. Ve a https://account.mapbox.com/access-tokens/
2. Crea un nuevo token o copia uno existente
3. El token debe empezar con `pk.` (public key)

### **PASO 2: Configurar en Vercel**

1. **Ir a Dashboard de Vercel:**
   - https://vercel.com/dashboard
   - Seleccionar proyecto `habitatprord`

2. **Settings → Environment Variables:**
   - Click en "Settings"
   - Click en "Environment Variables"
   - Click en "Add New"

3. **Agregar Variable:**
   ```
   Name: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
   Value: pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ
   Environment: Production, Preview, Development (marcar todos)
   ```

4. **Redeploy:**
   - Click en "Deployments"
   - Click en el último deployment
   - Click en "Redeploy"

---

## 🔍 **VERIFICACIÓN POST-CONFIGURACIÓN**

### **1. Verificar en Browser Console:**

Abrir consola del navegador (F12) y buscar:

```javascript
🔍 Mapbox Debug: {
  token_present: true,
  token_valid: true,
  token_length: 128,
  token_prefix: "pk.eyJ1Ij..."
}
```

### **2. Verificar Network Tab:**

- Abrir Network tab (F12 → Network)
- Filtrar por "mapbox"
- Debe haber requests a:
  - `https://api.mapbox.com/mapbox-gl-js/...`
  - `https://*.tiles.mapbox.com/...`

### **3. Verificar Errores:**

Si sigue fallando, buscar en consola:

```
❌ Error de Mapbox: { ... }
```

---

## 🚨 **ERRORES COMUNES Y SOLUCIONES**

### **Error 1: "401 Unauthorized"**
**Causa:** Token inválido o expirado  
**Solución:** Crear nuevo token en Mapbox dashboard

### **Error 2: "403 Forbidden"**
**Causa:** Token sin permisos para URLs  
**Solución:** Verificar que el token tenga permisos "Public" en Mapbox

### **Error 3: "Token no disponible"**
**Causa:** Variable no configurada en Vercel  
**Solución:** Seguir PASO 2 arriba

### **Error 4: "CSP bloqueando Mapbox"**
**Causa:** Content Security Policy bloqueando recursos  
**Solución:** Ya está configurado en `next.config.js`, pero verificar que Vercel lo respete

---

## 📋 **CHECKLIST RÁPIDO**

- [ ] Token creado en Mapbox dashboard
- [ ] Variable `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` agregada en Vercel
- [ ] Variable marcada para Production, Preview, Development
- [ ] Deploy realizado después de agregar variable
- [ ] Consola del navegador muestra token válido
- [ ] Mapa carga sin errores 401/403

---

## 🎯 **TOKEN ACTUAL (FALLBACK)**

Si no configuras tu token propio, el sistema usa este token público:

```
pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ
```

**⚠️ IMPORTANTE:** Este token puede tener límites. Crea tu propio token para producción.

---

## 📞 **SI TODAVÍA NO FUNCIONA**

1. **Abrir consola del navegador** (F12)
2. **Copiar todos los errores** relacionados con Mapbox
3. **Verificar que la variable esté en Vercel:**
   - Settings → Environment Variables
   - Buscar `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
4. **Forzar rebuild completo:**
   - Vercel → Deployments → Redeploy → Clear Cache

---

**Última actualización:** Octubre 2024  
**Estado:** Sistema mejorado con diagnóstico automático

