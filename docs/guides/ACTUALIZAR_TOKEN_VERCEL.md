# 🔄 **ACTUALIZAR TOKEN MAPBOX EN VERCEL**

**Token nuevo:** `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzOTgwZDAwY241MmtwbHJ6aWFsazIxIn0.-k_hECMvvQyjKCgqHbQHAA`

---

## ✅ **PASOS PARA ACTUALIZAR EN VERCEL**

### **PASO 1: Ir a Vercel Dashboard**

1. **Abrir:** https://vercel.com/dashboard
2. **Seleccionar proyecto:** `habitatprord` (o el nombre de tu proyecto)

### **PASO 2: Settings → Environment Variables**

1. Click en "Settings" (icono de engranaje)
2. Click en "Environment Variables" en el menú lateral

### **PASO 3: Editar Variable Existente**

1. **Buscar:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
2. **Click en "Edit"** (icono de lápiz o tres puntos → Edit)

### **PASO 4: Actualizar Valor**

1. **Reemplazar token antiguo:**
   ```
   Token antiguo: pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ
   ```
   
   **Con token nuevo:**
   ```
   pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzOTgwZDAwY241MmtwbHJ6aWFsazIxIn0.-k_hECMvvQyjKCgqHbQHAA
   ```

2. **Pegar** el nuevo token completo
3. **Verificar** que esté seleccionado para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Click en "Save"**

### **PASO 5: Redeploy**

1. **Vercel debería redeployar automáticamente**
2. **Si no, forzar redeploy:**
   - Click en "Deployments"
   - Click en el último deployment
   - Click en "..." (tres puntos) → "Redeploy"
   - ✅ Marcar "Use existing Build Cache" si aparece la opción
   - Click en "Redeploy"

---

## ✅ **VERIFICACIÓN POST-ACTUALIZACIÓN**

### **Test 1: Verificar en Consola del Navegador**

1. **Abrir sitio en Vercel** después del redeploy
2. **Abrir consola** (F12)
3. **Buscar logs:**
   ```
   🔍 Mapbox Debug: {
     token_present: true,
     token_valid: true,
     token_prefix: "pk.eyJ1Ijoi"
   }
   ✅ Token Mapbox configurado correctamente
   ✅ Mapbox cargado exitosamente
   ```

### **Test 2: Verificar Network Tab**

1. **Abrir DevTools** (F12) → **Network tab**
2. **Recargar página** con mapa
3. **Filtrar por:** "mapbox"
4. **Verificar requests:**
   - ✅ Requests con status `200` → Token funciona
   - ❌ Requests con status `403` → Token aún sin permisos

---

## 🔍 **VERIFICAR TOKEN EN MAPBOX**

### **Importante: Asegurar Permisos**

Aunque actualices el token en Vercel, **también debes verificar en Mapbox:**

1. **Ir a:** https://account.mapbox.com/access-tokens/
2. **Buscar token:** `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzOTgwZDAwY241MmtwbHJ6aWFsazIxIn0.-k_hECMvvQyjKCgqHbQHAA`
3. **Click en "Edit"** (icono de lápiz)
4. **Verificar:**
   - ✅ **Scope PUBLIC:** Debe estar marcado
   - ✅ **URL restrictions:** Debe estar vacío O incluir `https://*.vercel.app`
   - ✅ **Token expires:** "Never" o fecha futura
   - ✅ **Status:** "Active"
5. **Guardar cambios** si se modificó algo

---

## 📋 **CHECKLIST COMPLETO**

- [ ] Token actualizado en Vercel (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`)
- [ ] Token configurado para Production, Preview, Development
- [ ] Redeploy realizado en Vercel
- [ ] Token verificado en Mapbox dashboard
- [ ] Token tiene scope PUBLIC activado
- [ ] URL restrictions configurado correctamente (vacío o `*.vercel.app`)
- [ ] Consola del navegador muestra logs de Mapbox sin errores
- [ ] Network tab muestra requests 200 (no 403)

---

## 🚨 **SI AÚN DA 403 DESPUÉS DE ACTUALIZAR**

### **Posibles Causas:**

1. **Token sin permisos PUBLIC** → Verificar en Mapbox dashboard
2. **Token con URL restrictions** → Debe incluir `*.vercel.app` o estar vacío
3. **Token expirado o deshabilitado** → Verificar status en Mapbox
4. **Cache de Vercel** → Forzar redeploy con "Clear Cache"
5. **Cache del navegador** → Hard refresh (Ctrl+Shift+R o Cmd+Shift+R)

### **Solución:**

1. **Verificar token en Mapbox:** https://account.mapbox.com/access-tokens/
2. **Asegurar scope PUBLIC** activado
3. **Redeploy en Vercel** con "Clear Cache"
4. **Hard refresh** en navegador

---

**Última actualización:** Octubre 2024  
**Token nuevo:** `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzOTgwZDAwY241MmtwbHJ6aWFsazIxIn0.-k_hECMvvQyjKCgqHbQHAA`

