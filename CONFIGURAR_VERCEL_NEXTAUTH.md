# 🔐 **CONFIGURAR NEXTAUTH_SECRET EN VERCEL**

**Fecha:** Octubre 2024  
**Estado:** ⚠️ **ACCIÓN REQUERIDA**

---

## 🚨 **SECRET GENERADO:**

**NEXTAUTH_SECRET para Vercel:**
```
X(@8./.j[$tkz*!m!62oSL_YiaU@O9yj[V#M7^sdvwsgFudj3_U&!,(MsT1.<uUH
```

⚠️ **COPIA ESTE VALOR** - Lo necesitarás para configurar en Vercel.

---

## 📋 **PASOS PARA CONFIGURAR EN VERCEL:**

### **Paso 1: Acceder a Vercel Dashboard**
1. Ve a https://vercel.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto **proptech-mvp** o **habitatpro**

### **Paso 2: Ir a Environment Variables**
1. En tu proyecto, ve a **Settings**
2. En el menú lateral, haz clic en **Environment Variables**

### **Paso 3: Agregar NEXTAUTH_SECRET**
1. Haz clic en **Add New** o **Add Variable**
2. Completa:
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** `X(@8./.j[$tkz*!m!62oSL_YiaU@O9yj[V#M7^sdvwsgFudj3_U&!,(MsT1.<uUH`
   - **Environment:** Selecciona las tres:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Haz clic en **Save**

### **Paso 4: Verificar otras Variables**
Asegúrate de que estas variables también estén configuradas:
- ✅ `NEXT_PUBLIC_BACKEND_URL` = `https://proptech-mvp-1.onrender.com`
- ✅ `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` = (tu API key de Google Places, si la tienes)

### **Paso 5: Redeploy**
Después de agregar la variable:
1. Vercel automáticamente detectará el cambio
2. Ve a **Deployments**
3. Haz clic en **Redeploy** en el último deployment (o espera el auto-redeploy)
4. El build debería pasar ahora sin errores

---

## ✅ **VERIFICACIÓN:**

### **Después de configurar, verifica:**
1. ✅ El build pasa sin errores
2. ✅ No aparece el mensaje: `NEXTAUTH_SECRET no configurado`
3. ✅ La autenticación funciona en producción
4. ✅ Puedes iniciar sesión correctamente

---

## 🔐 **OTROS SECRETS GENERADOS:**

También se generaron estos secrets (para backend/Render si los necesitas):

**Backend (Render):**
- `JWT_SECRET_KEY` = `jNzTqCW]m9h`J}v/3*fz;[vS2r2QQ[zcCq{$r@J/Rud]]^~oWrV<}5bF;{:[Z~yS`
- `SECRET_KEY` = `,1b23}2B*1b[bS|@W+(3,TCbf#!7}8>`g#<`0.pf]zy|5FdBQicijm.HWDl;sG.B`

**Nota:** Estos están en `proptech-backend/.env.secrets` (no subido a Git)

---

## ⚠️ **IMPORTANTE:**

- 🔒 **NUNCA** subas estos secrets al repositorio
- 🔒 **NUNCA** compartas estos secrets públicamente
- 🔒 Solo configúralos en Vercel Environment Variables
- ✅ Ya están en `.gitignore` localmente

---

## 🎯 **RESULTADO ESPERADO:**

Después de configurar `NEXTAUTH_SECRET` en Vercel:
- ✅ Build pasa exitosamente
- ✅ Autenticación funciona en producción
- ✅ NextAuth puede crear sesiones seguras
- ✅ No más errores de secret no configurado

---

**Última actualización:** Octubre 2024  
**Próximo paso:** Configurar `NEXTAUTH_SECRET` en Vercel Dashboard

