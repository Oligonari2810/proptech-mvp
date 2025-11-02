# 🚨 PROTOCOLO ANTI-OPTIMISMO - DEPLOY Y CONFIGURACIÓN

**Fecha de creación:** 2025-01-02  
**Motivación:** 20 deploys fallidos debido a optimismo sin evidencia real  
**Estado:** OBLIGATORIO para todas las configuraciones futuras

---

## 🎯 REGLAS FUNDAMENTALES

### **REGLA #1: CURSOR NO DECIDE CUÁNDO HACER DEPLOY**

```python
def puede_hacer_deploy():
    """SOLO devuelve True si se cumplen TODAS estas condiciones"""
    
    condiciones = {
        'endpoints_200': False,      # ✅ Health + Properties = 200
        'sin_errores_logs': False,   # ✅ Logs limpios por 5 min
        'tests_integracion': False,  # ✅ Tests pasan EN RENDER
        'usuario_aprobo': False      # ✅ USUARIO da aprobación explícita
    }
    
    # Cursor NUNCA puede cambiar esto
    return all(condiciones.values())
```

**NUNCA asumir:** "Todo está listo para deploy"  
**SIEMPRE mostrar:** Estado actual con evidencia real

---

## 📋 CHECKLIST OBLIGATORIO PRE-DEPLOY

### **1. HEALTH CHECK**

**Comando obligatorio:**
```bash
curl -s "https://proptech-mvp-1.onrender.com/api/health"
```

**Verificar:**
- [ ] Status Code: **200** (no 503, no 500)
- [ ] Response contiene `"status": "healthy"` (no "degraded", no "unhealthy")
- [ ] No errores de mapper/foreign key en la respuesta

---

### **2. PROPERTIES ENDPOINT**

**Comando obligatorio:**
```bash
curl -s "https://proptech-mvp-1.onrender.com/api/properties?limit=1"
```

**Verificar:**
- [ ] Status Code: **200** (no 500)
- [ ] Response contiene `"success": true` O lista de propiedades
- [ ] No errores de foreign key/mapper en la respuesta

---

### **3. VEREDICTO**

**Condiciones para considerar deploy:**
- Health Check: ✅ 200 / ❌ Otro
- Properties: ✅ 200 / ❌ Otro

**Decisión:**
- [ ] **NO DEPLOY** - Si alguno no es 200
- [ ] **DEPLOY POSIBLE** - Solo si ambos son 200

**Decisión final:** 👤 **USUARIO decide** basado en evidencia

---

## ❌ FRASES PROHIBIDAS

**NUNCA usar estas frases sin evidencia:**
- ❌ "Todo está listo"
- ❌ "Perfecto"
- ❌ "100% funcional"
- ❌ "Errores corregidos" (sin mostrar que pasaron tests)
- ❌ "Deploy seguro"
- ❌ "Funcionará"
- ❌ "Estable"
- ❌ "Listo para producción"
- ❌ "🎉" / "✨"
- ❌ "El código está listo" (sin verificar endpoints)

---

## ✅ FRASES PERMITIDAS

**Usar SIEMPRE estas frases con evidencia:**
- ✅ "El health check devuelve 503"
- ✅ "Hay un error de foreign key en los logs"
- ✅ "Los endpoints responden 500"
- ✅ "EVIDENCIA: Health Check = 200, Properties = 200"
- ✅ "El endpoint `/api/properties` retorna 500 con este error: [error exacto]"
- ✅ "Status Code: 503, Response: [mostrar respuesta real]"

---

## 🔧 FLUJO OBLIGATORIO (SIEMPRE SEGUIR)

```
1. 🔍 Ejecutar comandos REALES (curl, tests)
2. 📊 Mostrar resultados EXACTOS (status codes, respuestas)
3. 🚨 Presentar EVIDENCIA sin interpretación
4. 👤 USUARIO decide basado en evidencia
5. ✅/❌ DEPLOY o NO DEPLOY (decisión del usuario)
```

---

## 🛠 COMANDOS OBLIGATORIOS

**Antes de cualquier conclusión sobre deploy:**

```bash
# 1. Estado actual REAL
curl -s "https://proptech-mvp-1.onrender.com/api/health"
curl -s "https://proptech-mvp-1.onrender.com/api/properties?limit=1"

# 2. Mostrar resultados EXACTOS (no interpretación)
# 3. Si alguno NO es 200, mostrar error EXACTO
# 4. NO proponer deploy hasta que ambos sean 200
```

---

## 📊 TEMPLATE DE REPORTE

**Formato obligatorio para cualquier reporte de estado:**

```markdown
## 📊 ESTADO ACTUAL - EVIDENCIA REAL

### 1. Health Check
**Status Code:** [número exacto]
**Response:** [respuesta exacta, truncada si es muy larga]

### 2. Properties Endpoint  
**Status Code:** [número exacto]
**Response:** [respuesta exacta]

### VEREDICTO
- [ ] ✅ 200 OK / ❌ Otro: [explicar]

### DECISIÓN
👤 USUARIO decide basado en evidencia
```

---

## 🎪 DETECTOR DE OPTIMISMO

**Si detectas estas señales, DETENER y pedir evidencia:**

```python
def detectar_optimismo(mensaje):
    frases_optimistas = [
        "todo está listo", "perfecto", "100% funcional", 
        "errores corregidos", "deploy seguro", "funcionará",
        "estable", "listo para producción", "🎉", "✨"
    ]
    
    if any(frase in mensaje.lower() for frase in frases_optimistas):
        return "🚨 ALERTA: Optimismo detectado - PEDIR EVIDENCIA"
    
    return "OK"
```

---

## 📝 CONTRATO CURSOR-USUARIO

### **Cursor se compromete a:**
- ✅ Mostrar EVIDENCIA, no optimismos
- ✅ Ejecutar tests y mostrar RESULTADOS CRUDOS
- ✅ NO decidir cuándo hacer deploy
- ✅ Usar frases permitidas con evidencia
- ✅ Mostrar errores EXACTOS sin minimizar

### **Usuario se compromete a:**
- ✅ Solo aprobar deploy con EVIDENCIA de 200 OK
- ✅ Revisar logs antes de decidir
- ✅ Ignorar conclusiones optimistas sin evidencia

---

## 🚨 CASOS DE USO

### **Caso 1: Después de corregir código**

**❌ INCORRECTO:**
> "Todo está listo para deploy! 🎉"

**✅ CORRECTO:**
> "El código fue corregido en commit X. Ejecutando tests:
> Health Check: 503
> Properties: 500
> Error detectado: [error exacto]
> **EVIDENCIA:** El backend aún tiene problemas. NO DEPLOY recomendado."

---

### **Caso 2: Después de tests exitosos localmente**

**❌ INCORRECTO:**
> "Tests pasan, listo para producción!"

**✅ CORRECTO:**
> "Tests locales pasan (sin dependencias Flask). Verificando endpoints en Render:
> Health Check: [status code]
> Properties: [status code]
> **EVIDENCIA:** [mostrar resultados reales]"

---

### **Caso 3: Antes de cualquier configuración**

**❌ INCORRECTO:**
> "Esto debería funcionar correctamente"

**✅ CORRECTO:**
> "Ejecutando verificación actual:
> [comando] → [resultado exacto]
> Estado actual: [descripción basada en evidencia]"

---

## 📚 LECCIONES APRENDIDAS

1. **20 deploys fallidos** debido a optimismo sin verificación
2. **Optimismo sin evidencia** = Desperdicio de tiempo
3. **Evidencia real** = Decisión informada
4. **Usuario decide** = Menos errores

---

## ✅ VERIFICACIÓN ANTES DE CUALQUIER MENSAJE

**Preguntas que DEBO hacerme antes de escribir:**

1. ¿Ejecuté comandos REALES y mostré resultados?
2. ¿Evité frases optimistas prohibidas?
3. ¿Mostré status codes EXACTOS?
4. ¿Dejé que el usuario decida basado en evidencia?
5. ¿Presenté errores sin minimizarlos?

**Si alguna respuesta es NO, corregir antes de enviar.**

---

## 🎯 CONCLUSIÓN

**Este protocolo es OBLIGATORIO para todas las configuraciones futuras.**

**Meta:** Cero deploys fallidos por optimismo sin evidencia.

**Método:** Mostrar hechos, no esperanzas.

**Resultado:** Decisiones informadas basadas en evidencia real.

