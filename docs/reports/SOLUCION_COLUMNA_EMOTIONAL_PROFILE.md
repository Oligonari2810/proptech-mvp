# 🔧 SOLUCIÓN: Columna emotional_profile NO Agregada

**Fecha:** 2025-01-02  
**Problema:** La columna `emotional_profile` no existe en la base de datos de producción  
**Sintoma:** Error de mapper al intentar acceder a esta columna

---

## 📊 EVIDENCIA DEL PROBLEMA

### **Error Actual en Render:**
```
One or more mappers failed to initialize
Could not determine join condition between parent/child tables
```

### **Estado de la Columna:**
- ✅ **Modelo (`models.py`)**: La columna está definida (línea 66)
- ✅ **Migración (`003_add_emotional_profile_column.py`)**: Existe
- ❌ **Base de Datos**: La columna NO existe en producción

---

## 🛠️ OPCIONES DE SOLUCIÓN

### **OPCIÓN 1: Ejecutar SQL Directamente (MÁS RÁPIDA)**

**Script:** `proptech-backend/scripts/fix_emotional_profile_column.sh`

**Ejecutar en Render:**
```bash
# En la consola de Render o via SSH
cd ~/project/src/proptech-backend
chmod +x scripts/fix_emotional_profile_column.sh
./scripts/fix_emotional_profile_column.sh
```

**O directamente con psql:**
```bash
psql $DATABASE_URL -c "ALTER TABLE properties ADD COLUMN IF NOT EXISTS emotional_profile JSON;"
```

---

### **OPCIÓN 2: Ejecutar Migración Manualmente**

**Script:** `proptech-backend/scripts/fix_emotional_profile_via_migration.py`

**Ejecutar en Render:**
```bash
cd ~/project/src/proptech-backend
python3 scripts/fix_emotional_profile_via_migration.py
```

---

### **OPCIÓN 3: Forzar Ejecución de Alembic**

**En Render, ejecutar:**
```bash
cd ~/project/src/proptech-backend
alembic upgrade head
```

---

### **OPCIÓN 4: Solución Temporal - Quitar Uso de Columna**

**Modificar `app.py` para NO usar `emotional_profile` temporalmente:**

```python
# En lugar de:
emotional_profile=getattr(prop, 'emotional_profile', None) or {}

# Usar:
emotional_profile={}  # Temporal hasta que se agregue la columna
```

---

## 🎯 RECOMENDACIÓN

### **Paso 1: Verificar Estado Actual**

**Ejecutar en Render:**
```bash
psql $DATABASE_URL -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='properties' AND column_name='emotional_profile';
"
```

**Resultado esperado:**
- Si NO hay resultados: Columna NO existe → Ejecutar Opción 1
- Si hay resultados: Columna existe → El problema es otro

---

### **Paso 2: Agregar Columna (Opción 1 Recomendada)**

**Ejecutar:**
```bash
psql $DATABASE_URL -c "ALTER TABLE properties ADD COLUMN IF NOT EXISTS emotional_profile JSON;"
```

---

### **Paso 3: Verificar**

**Ejecutar:**
```bash
psql $DATABASE_URL -c "\d properties" | grep emotional_profile
```

**Resultado esperado:**
```
emotional_profile | json
```

---

## 📋 CHECKLIST POST-SOLUCIÓN

- [ ] Columna agregada (verificar con psql)
- [ ] Health Check responde 200
- [ ] Properties endpoint responde 200
- [ ] Sin errores de mapper en logs

---

## ⚠️ NOTA IMPORTANTE

**Este script debe ejecutarse EN RENDER**, no localmente, porque:
1. La base de datos de producción está en Render
2. DATABASE_URL apunta a producción
3. Los cambios locales no afectan producción

**Para ejecutar en Render:**
1. Ir a Render Dashboard
2. Seleccionar el servicio backend
3. Abrir "Shell" o "Console"
4. Ejecutar los comandos SQL directamente

---

## 🔍 VERIFICACIÓN POST-DEPLOY

**Después de ejecutar la solución, verificar:**

```bash
# 1. Health Check
curl https://proptech-mvp-1.onrender.com/api/health

# 2. Properties
curl https://proptech-mvp-1.onrender.com/api/properties?limit=1

# Ambos deben responder 200 OK
```

