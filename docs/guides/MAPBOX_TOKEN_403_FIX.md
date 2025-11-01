# 🔧 **FIX MAPBOX 403 ERROR - TOKEN CONFIGURADO PERO SIN PERMISOS**

**Problema:** Token de Mapbox configurado en Vercel pero devuelve 403  
**Token actual:** `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ`

---

## 🔍 **DIAGNÓSTICO**

El error 403 indica que:
1. ✅ **Token existe** (no es 401)
2. ✅ **Token está configurado en Vercel**
3. ❌ **Token no tiene permisos** o está restringido

---

## 🚨 **CAUSAS COMUNES DEL 403**

### **1. Token sin Permisos PUBLIC**
El token necesita el scope `PUBLIC` para cargar estilos públicos de Mapbox.

### **2. Token Limitado a Ciertos Dominios**
Si el token tiene "URL restrictions", debe incluir tu dominio de Vercel.

### **3. Token sin DOWNLOADS:READ**
Necesita el scope `DOWNLOADS:READ` para descargar tiles.

### **4. Token Expirado o Deshabilitado**
Aunque el token existe, puede estar deshabilitado o expirado.

---

## ✅ **SOLUCIÓN PASO A PASO**

### **PASO 1: Verificar Token en Mapbox**

1. **Ir a Mapbox Dashboard:**
   - https://account.mapbox.com/access-tokens/

2. **Buscar tu token:**
   - Buscar: `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ`

3. **Verificar configuración:**
   - ✅ **Token URL restrictions:** Debe estar vacío O incluir `https://*.vercel.app`
   - ✅ **Token scopes:** Debe tener `PUBLIC` marcado
   - ✅ **Token expires:** Debe ser "Never" o fecha futura
   - ✅ **Token status:** Debe estar "Active"

---

### **PASO 2: Crear Nuevo Token (Si el Actual No Funciona)**

Si el token actual tiene problemas, crea uno nuevo:

1. **En Mapbox Dashboard:**
   - Click en "Create a token"
   - **Name:** `HabitatPro Production`
   - **URL restrictions:** Dejar vacío (o agregar `https://*.vercel.app`)
   - **Token scopes:**
     - ✅ `PUBLIC` (obligatorio)
     - ✅ `DOWNLOADS:READ` (opcional pero recomendado)
   - **Token expires:** `Never` (o fecha muy lejana)
   - Click en "Create token"

2. **Copiar el nuevo token**

3. **Actualizar en Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Buscar `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Click en "Edit"
   - Pegar el nuevo token
   - Click en "Save"
   - **Redeploy** automáticamente o forzar redeploy

---

### **PASO 3: Verificar Token Actual (Sin Crear Nuevo)**

Si prefieres usar el token actual, verifica:

1. **En Mapbox Dashboard:**
   - Buscar el token actual
   - Click en "Edit" (icono de lápiz)
   - **Verificar:**
     - ✅ URL restrictions: Vacío o `https://*.vercel.app`
     - ✅ Scopes: `PUBLIC` marcado
   - Click en "Save"

2. **Esperar 1-2 minutos** para que los cambios se propaguen

3. **Redeploy en Vercel** (forzar si es necesario)

---

## 🧪 **VERIFICAR QUE FUNCIONA**

### **Test 1: Verificar Token desde Consola**

Abrir consola del navegador (F12) y ejecutar:

```javascript
// Verificar que el token está disponible
console.log('Token:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'NO DISPONIBLE');

// Verificar permisos del token
fetch('https://api.mapbox.com/tokens/v2/oligonari2810?access_token=pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ')
  .then(r => r.json())
  .then(d => console.log('Token info:', d))
  .catch(e => console.error('Error:', e));
```

### **Test 2: Verificar en Network Tab**

1. Abrir DevTools (F12) → Network tab
2. Recargar página con mapa
3. Buscar requests a `api.mapbox.com`
4. **Buscar:**
   - ✅ Requests con status `200` → Token funciona
   - ❌ Requests con status `403` → Token sin permisos

---

## 📋 **CHECKLIST RÁPIDO**

- [ ] Token verificado en Mapbox dashboard
- [ ] Token tiene scope `PUBLIC` activado
- [ ] Token URL restrictions vacío o incluye `*.vercel.app`
- [ ] Token está activo (no expirado ni deshabilitado)
- [ ] Token actualizado en Vercel (si se creó nuevo)
- [ ] Redeploy realizado en Vercel
- [ ] Verificado en consola del navegador que no hay errores 403

---

## 🔄 **SI TODAVÍA NO FUNCIONA**

### **Opción A: Usar Token Público Temporal**

El sistema tiene un fallback, pero puedes crear un token completamente nuevo:

1. **Crear token nuevo** en Mapbox
2. **Sin restricciones** (URL restrictions vacío)
3. **Todos los scopes** habilitados
4. **Actualizar en Vercel**

### **Opción B: Verificar Dominio en Restricciones**

Si el token tiene URL restrictions, debe incluir:
- `https://*.vercel.app` (patrón wildcard)
- O específicamente: `https://proptech-3r2xxlrkn-oligonari2810s-projects.vercel.app`

### **Opción C: Contactar Soporte Mapbox**

Si nada funciona:
- https://support.mapbox.com/
- Incluir: Token, dominio, error específico

---

## 💡 **NOTA IMPORTANTE**

El token que estás usando parece ser un token de desarrollo/demo. Para producción, es recomendable:
1. Crear un token específico para producción
2. Configurar URL restrictions apropiadas
3. Rotar tokens periódicamente para seguridad

---

**Última actualización:** Octubre 2024  
**Estado:** Token configurado, requiere verificación de permisos en Mapbox

