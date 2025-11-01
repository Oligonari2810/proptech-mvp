# 🗺️ **CONFIGURAR MAPBOX EN VERCEL**

**Problema:** Mapbox no se carga porque falta el token de acceso.

---

## 🔑 **TOKEN MAPBOX ACTUAL (Temporal/Demo):**

```
pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ
```

⚠️ **NOTA:** Este es un token demo/temporal. Para producción, necesitas obtener tu propio token de Mapbox.

---

## 📋 **OPCIÓN 1: Usar Token Demo (Rápido)**

Si quieres que funcione inmediatamente, el código ya tiene un fallback con el token demo. Solo necesitas configurarlo en Vercel:

### **Pasos:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega:
   - **Name:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - **Value:** `pk.eyJ1Ijoib2xpZ29uYXJpMjgxMCIsImEiOiJjbTdzYzd6a3kwZG16MndwcTRqdmF3Y3gyIn0.wgkq0ZFbnRLq_W9fzrFbOQ`
   - **Environment:** Production, Preview, Development
3. Guarda y espera el redeploy

---

## 🔐 **OPCIÓN 2: Obtener Tu Propio Token (Recomendado para Producción)**

### **Paso 1: Crear Cuenta en Mapbox**
1. Ve a https://account.mapbox.com/
2. Crea una cuenta gratuita o inicia sesión
3. Ve a **Tokens** → **Create a token**

### **Paso 2: Configurar Token**
- **Token name:** `HabitatPro Production`
- **Token scopes:** 
  - ✅ `styles:read`
  - ✅ `fonts:read`
  - ✅ `datasets:read`
- **URL restrictions:** (Opcional) Configura tu dominio de producción

### **Paso 3: Copiar Token**
Después de crear el token, cópialo (empieza con `pk.eyJ...`)

### **Paso 4: Configurar en Vercel**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega:
   - **Name:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - **Value:** [Tu token de Mapbox]
   - **Environment:** Production, Preview, Development
3. Guarda

---

## ✅ **VERIFICACIÓN:**

### **Después de configurar:**
1. ✅ El mapa se carga correctamente
2. ✅ No aparece mensaje: "Mapbox token not configured"
3. ✅ Los marcadores aparecen en el mapa
4. ✅ No hay errores en la consola del navegador

---

## 🎯 **COMPONENTES QUE USAN MAPBOX:**

- ✅ `app/map/page.tsx` - Página de mapa principal
- ✅ `app/components/MapCluster.tsx` - Componente de mapa con clusters
- ✅ `app/components/maps/MapComponent.tsx` - Componente de mapa base
- ✅ `app/components/analytics/LeadHeatmap.tsx` - Mapa de calor de leads

---

## ⚠️ **IMPORTANTE:**

- 🔒 El token demo puede tener límites de uso
- 🔒 Para producción, usa tu propio token de Mapbox
- ✅ El token debe empezar con `pk.eyJ`
- ✅ Configúralo como `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` en Vercel

---

## 🚀 **PRÓXIMOS PASOS:**

1. **Opción rápida:** Usa el token demo mostrado arriba
2. **Opción producción:** Obtén tu propio token de Mapbox
3. Configura la variable en Vercel
4. Espera el redeploy automático
5. Verifica que el mapa carga correctamente

---

**Última actualización:** Octubre 2024  
**Estado:** ✅ Código actualizado con fallback. Falta configurar token en Vercel.

