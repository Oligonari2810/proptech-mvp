# 📋 INSTRUCCIONES PARA EJECUTAR EN RENDER

**OBJETIVO:** Agregar columna `emotional_profile` directamente en PostgreSQL de producción

---

## 🚨 PASO A PASO EN RENDER

### **Paso 1: Acceder a Shell de Render**

1. Ir a https://dashboard.render.com
2. Seleccionar servicio backend: `proptech-mvp-1`
3. Ir a pestaña "Shell" o "Console"
4. Abrir terminal

---

### **Paso 2: Ejecutar SQL Directamente**

**Comando más rápido:**
```bash
psql $DATABASE_URL -c "ALTER TABLE properties ADD COLUMN IF NOT EXISTS emotional_profile JSON;"
```

**Resultado esperado:**
```
ALTER TABLE
```

---

### **Paso 3: Verificar que se Creó**

```bash
psql $DATABASE_URL -c "
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name='properties' AND column_name='emotional_profile';
"
```

**Resultado esperado:**
```
 column_name        | data_type | is_nullable 
--------------------+-----------+-------------
 emotional_profile  | json      | t
```

---

### **Paso 4: Verificar Backend**

**Esperar 30 segundos y ejecutar:**
```bash
curl https://proptech-mvp-1.onrender.com/api/health
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  ...
}
```

**Status Code esperado:** 200 (no 503)

---

## ✅ SI EL COMANDO PSQL NO FUNCIONA

### **Alternativa: Usar Python en Render Shell**

```bash
cd ~/project/src/proptech-backend

python3 -c "
import os
import psycopg2

conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()

# Verificar si existe
cur.execute('''
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='emotional_profile'
''')

if cur.fetchone()[0] == 0:
    # Agregar columna
    cur.execute('ALTER TABLE properties ADD COLUMN emotional_profile JSON')
    conn.commit()
    print('✅ Columna emotional_profile agregada')
else:
    print('✅ Columna emotional_profile ya existe')

cur.close()
conn.close()
"
```

---

## 📊 VERIFICACIÓN POST-AGREGACIÓN

**Ejecutar estos tests después de agregar la columna:**

```bash
# 1. Health Check
curl -s https://proptech-mvp-1.onrender.com/api/health | jq '.status'

# Resultado esperado: "healthy" o "degraded" (pero NO error de mapper)

# 2. Properties Endpoint
curl -s https://proptech-mvp-1.onrender.com/api/properties?limit=1 | jq '.success'

# Resultado esperado: true O lista de propiedades (NO error 500)
```

---

## 🚨 SI TODAVÍA HAY ERRORES

**Si después de agregar la columna sigue el error:**

1. Verificar que la columna existe (Paso 3)
2. Verificar logs de Render para errores específicos
3. Puede ser que necesite restart del servicio
4. O puede ser un problema diferente (foreign keys, etc.)

---

## 📝 NOTAS IMPORTANTES

- ✅ Ejecutar estos comandos **EN RENDER**, no localmente
- ✅ DATABASE_URL apunta a producción automáticamente
- ✅ Los cambios son permanentes en la BD
- ⚠️ No ejecutar DROP COLUMN sin backup

