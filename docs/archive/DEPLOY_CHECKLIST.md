# 🚀 CHECKLIST DE DEPLOY - FIXES CRÍTICOS FASE 1

**Fecha**: Diciembre 2024  
**Versión**: 2.0.0-enterprise (con fixes críticos)  
**Autorizado por**: CTO

---

## ✅ PRE-DEPLOY (Completar ANTES de deploy)

### **Verificación de Código:**
- [x] ✅ Layout admin protegido con NextAuthRoleGuard
- [x] ✅ Header sin "Admin" para usuarios públicos
- [x] ✅ Errores sanitizados en producción
- [x] ✅ Header condicional implementado
- [x] ✅ Sin errores de lint críticos
- [x] ✅ Tests de seguridad pasando

### **Verificación de Archivos:**
- [x] ✅ `app/admin/layout.tsx` - Protegido
- [x] ✅ `app/components/Header.tsx` - Condicional
- [x] ✅ `app.py` - Errores sanitizados
- [x] ✅ `routes/auth_routes.py` - Errores sanitizados

### **Scripts de Verificación:**
```bash
# Ejecutar antes de deploy:
./test_security_fixes.sh
```

---

## 🚀 DEPLOY FRONTEND (Vercel)

### **Pasos de Deploy:**
1. [ ] Verificar cambios en git
   ```bash
   git status
   git diff proptech-web/app/admin/layout.tsx
   git diff proptech-web/app/components/Header.tsx
   ```

2. [ ] Commit de cambios
   ```bash
   git add proptech-web/app/admin/layout.tsx
   git add proptech-web/app/components/Header.tsx
   git commit -m "fix(critical): Proteger admin layout y sanitizar errores"
   ```

3. [ ] Push a main (trigger auto-deploy en Vercel)
   ```bash
   git push origin main
   ```

4. [ ] Verificar build en Vercel Dashboard
   - [ ] Build exitoso
   - [ ] Sin errores de compilación
   - [ ] Deploy completado

---

## 🔧 DEPLOY BACKEND (Render)

### **Pasos de Deploy:**
1. [ ] Verificar cambios en git
   ```bash
   git diff proptech-backend/app.py
   git diff proptech-backend/routes/auth_routes.py
   ```

2. [ ] Commit de cambios
   ```bash
   git add proptech-backend/app.py
   git add proptech-backend/routes/auth_routes.py
   git commit -m "fix(critical): Sanitizar errores en producción"
   ```

3. [ ] Push a main (trigger auto-deploy en Render)
   ```bash
   git push origin main
   ```

4. [ ] Verificar deploy en Render Dashboard
   - [ ] Build exitoso
   - [ ] Sin errores de compilación
   - [ ] Servicio activo

---

## 🧪 POST-DEPLOY - TESTS DE SEGURIDAD

### **Tests Críticos (Ejecutar INMEDIATAMENTE después de deploy):**

#### **1. Test de Protección Admin:**
```bash
# Test 1: Usuario público intenta acceder a /admin
curl -I https://habitatprord.com/admin
# Esperado: 200 OK pero redirect a /auth/signin (verificar en navegador)

# Test 2: Usuario sin rol admin
# Login como usuario normal y acceder a /admin
# Esperado: Mensaje "Acceso Denegado"
```

#### **2. Test de Header Público:**
```bash
# Test 3: Verificar header público (sin autenticación)
curl https://habitatprord.com/ | grep -i "admin"
# Esperado: NO encontrar "Admin" en el HTML

# Test 4: Usuario admin autenticado
# Login como admin y verificar header
# Esperado: Ver "Admin" en navegación
```

#### **3. Test de Sanitización de Errores:**
```bash
# Test 5: Provocar error en producción
curl -X POST https://proptech-mvp-1.onrender.com/api/ai/valuation \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
# Esperado: Mensaje genérico sin stack trace
```

#### **4. Test de Header Condicional:**
```bash
# Test 6: Usuario público
# Visitar homepage sin autenticación
# Esperado: Ver "Iniciar sesión" y "Registrarse"

# Test 7: Usuario autenticado
# Login y visitar homepage
# Esperado: Ver "Mi cuenta" y "Favoritos"
```

---

## 📊 MONITOREO POST-DEPLOY (1 hora)

### **Métricas a Monitorear:**
1. [ ] **Logs de Render** - Verificar errores sanitizados
   ```bash
   # Ver logs en Render Dashboard
   # Buscar: "ERROR (sanitizado en producción)"
   ```

2. [ ] **Logs de Vercel** - Verificar builds y errores
   ```bash
   # Ver logs en Vercel Dashboard
   # Verificar: Sin errores de compilación
   ```

3. [ ] **Rate de errores** - Comparar pre/post deploy
   - [ ] Errores 500 reducidos
   - [ ] Stack traces no visibles
   - [ ] Mensajes genéricos funcionando

4. [ ] **Accesos no autorizados** - Monitorear /admin
   - [ ] Redirects a login funcionando
   - [ ] Mensajes "Acceso Denegado" correctos
   - [ ] Solo admins accediendo exitosamente

---

## 🚨 PLAN DE ROLLBACK (Si algo falla)

### **Rollback Frontend:**
```bash
# Opción 1: Revertir commit en Vercel
# Dashboard Vercel → Deployments → Previous Deployment → Promote

# Opción 2: Revertir commit en git
git revert HEAD
git push origin main
```

### **Rollback Backend:**
```bash
# Opción 1: Revertir commit en Render
# Dashboard Render → Manual Deploy → Previous Commit

# Opción 2: Revertir commit en git
git revert HEAD
git push origin main
```

---

## ✅ CRITERIOS DE ÉXITO

### **Seguridad:**
- [ ] ✅ 0% acceso no autorizado a /admin
- [ ] ✅ 100% errores sanitizados en producción
- [ ] ✅ Header adaptativo funcionando correctamente

### **Experiencia:**
- [ ] ✅ Tiempo de carga < 3 segundos
- [ ] ✅ Navegación intuitiva por rol
- [ ] ✅ Mensajes de error comprensibles

### **Código:**
- [ ] ✅ Sin errores de lint
- [ ] ✅ Build exitoso en Vercel
- [ ] ✅ Deploy exitoso en Render

---

## 📝 NOTAS DE DEPLOY

### **Comandos Útiles:**
```bash
# Verificar estado de servicios
curl https://proptech-mvp-1.onrender.com/api/health
curl -I https://habitatprord.com/

# Ver logs en tiempo real
# Vercel: vercel logs --follow
# Render: Dashboard → Logs

# Verificar cambios desplegados
curl https://habitatprord.com/ | grep -i "admin"
```

### **Contactos:**
- **Frontend**: Vercel Dashboard
- **Backend**: Render Dashboard
- **Alerts**: Canal #security-alerts

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

1. ✅ **Ejecutar tests de seguridad** (`./test_security_fixes.sh`)
2. ✅ **Deploy frontend** (Vercel auto-deploy)
3. ✅ **Deploy backend** (Render auto-deploy)
4. ✅ **Tests post-deploy** (ejecutar inmediatamente)
5. ✅ **Monitoreo 1 hora** (logs y métricas)
6. ✅ **Reportar resultados** (canal #deploy-status)

---

**¿Listo para proceder con el deploy?** 🚀


