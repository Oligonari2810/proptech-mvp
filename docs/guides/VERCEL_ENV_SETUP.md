# 🔐 **CONFIGURACIÓN DE VARIABLES DE ENTORNO - VERCEL**

**Problema:** El build falla porque `NEXTAUTH_SECRET` no está configurado en Vercel.

---

## 🚨 **ERROR ACTUAL:**

```
Error: NEXTAUTH_SECRET no configurado en producción. Genera uno seguro con scripts/generate_secrets.py
```

---

## ✅ **SOLUCIÓN: Configurar NEXTAUTH_SECRET en Vercel**

### **Paso 1: Generar Secret Seguro**

```bash
cd proptech-backend
python3 scripts/generate_secrets.py
```

Esto generará un `NEXTAUTH_SECRET` seguro. Copia el valor.

### **Paso 2: Configurar en Vercel**

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** [Pega el secret generado]
   - **Environment:** Production, Preview, Development
4. Guarda

### **Paso 3: Redeploy**

Después de configurar la variable, Vercel redeployará automáticamente.

---

## 📋 **VARIABLES DE ENTORNO NECESARIAS EN VERCEL**

### **Requeridas:**
- ✅ `NEXTAUTH_SECRET` - Secret para NextAuth (CRÍTICO)
- ✅ `NEXT_PUBLIC_BACKEND_URL` - URL del backend (ya configurado)

### **Opcionales pero Recomendadas:**
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Para autocompletado de direcciones

---

## 🔧 **FIX APLICADO:**

El código ahora usa un secret temporal durante el build para evitar errores, pero **debe configurarse** `NEXTAUTH_SECRET` en Vercel para que funcione correctamente en producción.

---

## ⚠️ **IMPORTANTE:**

- **NEXTAUTH_SECRET** es crítico para la seguridad de autenticación
- Debe ser un valor aleatorio y seguro (mínimo 32 caracteres)
- No compartir este secret públicamente
- Usar `generate_secrets.py` para generar uno seguro

---

**Última actualización:** Octubre 2024

