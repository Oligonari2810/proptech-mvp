# 🐛 **DEBUG MAPBOX - ERROR AL CARGAR EL MAPA**

**Problema:** El mapa muestra "Error al cargar el mapa. Verifica la configuración de Mapbox."

---

## 🔍 **PASOS PARA DEBUG:**

### **1. Abrir Consola del Navegador:**
- Chrome/Edge: `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Firefox: `F12` o `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- Safari: `Cmd+Option+I`

### **2. Verificar Errores en Consola:**
Busca mensajes que empiecen con:
- `❌ Error de Mapbox:`
- `❌ Error inicializando mapa:`
- `❌ Mapbox token no disponible`
- `❌ Contenedor de mapa no encontrado`

### **3. Verificar Token:**
En la consola, ejecuta:
```javascript
console.log('Token:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
```

**Debería mostrar:**
- Token presente (empieza con `pk.eyJ...`)
- O `undefined` si no está configurado

---

## 🔧 **SOLUCIONES COMUNES:**

### **Problema 1: Token no configurado en Vercel**
**Solución:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
3. Valor: `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ`
4. Guarda y espera redeploy

### **Problema 2: CSP bloqueando Mapbox**
**Verificar:**
- Consola del navegador → Network tab
- Buscar requests a `api.mapbox.com`
- Si están bloqueados, ajustar CSP en `next.config.js` y `middleware.ts`

### **Problema 3: Token inválido o expirado**
**Solución:**
- Obtener nuevo token de Mapbox en https://account.mapbox.com/
- Actualizar en Vercel Environment Variables

### **Problema 4: Contenedor no disponible**
**Verificar:**
- El componente `MapCluster` debe tener un contenedor con `ref={mapContainer}`
- Verificar que el contenedor tenga altura y ancho

---

## 📋 **INFORMACIÓN DE DEBUG:**

El código ahora muestra en consola:
- ✅ Token presente/faltante
- ✅ Contenedor presente/faltante
- ✅ Número de propiedades
- ✅ Detalles del error específico
- ✅ Stack trace completo

---

## 🎯 **VERIFICACIÓN RÁPIDA:**

1. Abre consola del navegador
2. Recarga la página
3. Busca mensajes con `❌`
4. Copia los detalles del error
5. Revisa `DEBUG_MAPBOX.md` para soluciones

---

## ⚠️ **ERRORES COMUNES:**

### **"Mapbox token no disponible"**
→ Configurar `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` en Vercel

### **"Contenedor de mapa no encontrado"**
→ Verificar que el componente tenga un `div` con `ref={mapContainer}`

### **"Error de Mapbox: ..."**
→ Verificar CSP y permisos del token
→ Verificar que el token sea válido

---

**Última actualización:** Octubre 2024  
**Próximo paso:** Revisar consola del navegador para ver detalles del error específico

