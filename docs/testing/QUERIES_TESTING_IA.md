# 📝 Queries de Testing: IA Emocional

## 🎯 **QUERIES POR CATEGORÍA**

### **Categoría 1: Familia y Hogar Tranquilo**

1. **"hogar tranquilo para mi familia y mi perro"**
   - **Esperado**: vibes: tranquilo, lifestyle: family-friendly, pet-friendly, community: familiar
   - **Match esperado**: ≥80% para propiedades con jardín, zona familiar, pet-friendly

2. **"casa familiar con jardín cerca de escuela"**
   - **Esperado**: lifestyle: family-friendly, community: familiar
   - **Match esperado**: ≥75% para casas con jardín, cerca de escuelas

3. **"apartamento seguro para niños en zona residencial"**
   - **Esperado**: lifestyle: family-friendly, community: familiar, vibes: tranquilo
   - **Match esperado**: ≥70% para apartamentos en zonas residenciales seguras

---

### **Categoría 2: Profesional y Trabajo**

4. **"apartamento vibrante para joven profesional"**
   - **Esperado**: vibes: vibrante, community: joven, profesional
   - **Match esperado**: ≥75% para apartamentos modernos en zonas urbanas

5. **"casa moderna para trabajar desde casa"**
   - **Esperado**: lifestyle: work-from-home, vibes: moderno
   - **Match esperado**: ≥70% para casas con espacios para oficina

6. **"loft en zona empresarial con espacios abiertos"**
   - **Esperado**: community: profesional, vibes: moderno, lifestyle: work-from-home
   - **Match esperado**: ≥65% para lofts en zonas empresariales

---

### **Categoría 3: Retiro y Tranquilidad**

7. **"casa acogedora para retiro tranquilo"**
   - **Esperado**: lifestyle: retiro, vibes: acogedor, tranquilo
   - **Match esperado**: ≥80% para casas tranquilas con jardín

8. **"propiedad para jubilación con jardín"**
   - **Esperado**: lifestyle: retiro, vibes: tranquilo
   - **Match esperado**: ≥75% para propiedades con jardín, zonas tranquilas

9. **"hogar tranquilo para descansar después del trabajo"**
   - **Esperado**: vibes: tranquilo, lifestyle: retiro
   - **Match esperado**: ≥70% para propiedades tranquilas

---

### **Categoría 4: Inversión y Rentabilidad**

10. **"propiedad con buen ROI para rentar"**
    - **Esperado**: intent: investment
    - **Match esperado**: ≥65% para propiedades en zonas turísticas o comerciales

11. **"inversión inmobiliaria rentable en zona turística"**
    - **Esperado**: intent: investment
    - **Match esperado**: ≥70% para propiedades en zonas turísticas

12. **"apartamento para generar ingresos"**
    - **Esperado**: intent: investment
    - **Match esperado**: ≥60% para apartamentos rentables

---

### **Categoría 5: Emocional Complejo**

13. **"hogar bohemio y artístico para creativo"**
    - **Esperado**: vibes: bohemio, artístico, community: artístico
    - **Match esperado**: ≥70% para propiedades únicas, creativas

14. **"casa lujosa pero acogedora para familia"**
    - **Esperado**: vibes: lujoso, acogedor, lifestyle: family-friendly
    - **Match esperado**: ≥75% para casas premium familiares

15. **"apartamento moderno y tranquilo"**
    - **Esperado**: vibes: moderno, tranquilo
    - **Match esperado**: ≥70% para apartamentos modernos en zonas tranquilas

---

### **Categoría 6: Queries Específicas RD**

16. **"casa en Punta Cana para vacaciones familiares"**
    - **Esperado**: location: Punta Cana, lifestyle: family-friendly
    - **Match esperado**: ≥75% para propiedades en Punta Cana

17. **"apartamento en Santo Domingo para joven profesional"**
    - **Esperado**: location: Santo Domingo, community: joven, profesional
    - **Match esperado**: ≥70% para apartamentos en Santo Domingo

18. **"inversión turística en Bávaro con CONFOTUR"**
    - **Esperado**: intent: investment, location: Bávaro
    - **Match esperado**: ≥65% para propiedades en Bávaro

---

## 🔍 **QUERIES DE EDGE CASES**

### **Queries Vacías o Inválidas**

19. **""** (query vacía)
    - **Esperado**: Error 400, mensaje "Query es requerida"

20. **"   "** (solo espacios)
    - **Esperado**: Error 400, mensaje "Query no puede estar vacía"

---

### **Queries Muy Específicas**

21. **"casa con 3 dormitorios, 2 baños, piscina, jardín, garaje, en zona residencial tranquila, cerca de escuela, para familia con 2 niños y perro"**
    - **Esperado**: Detecta múltiples factores emocionales y técnicos
    - **Match esperado**: ≥85% para propiedades que cumplan todos los criterios

---

### **Queries Ambigüas**

22. **"algo bonito"**
    - **Esperado**: Confianza baja (≤0.3), búsqueda general
    - **Match esperado**: Propiedades con mejores scores generales

23. **"lo que sea"**
    - **Esperado**: Confianza muy baja (≤0.2), sin filtros emocionales
    - **Match esperado**: Propiedades activas ordenadas por precio o fecha

---

## 📊 **TABLA DE RESULTADOS ESPERADOS**

| Query | Vibes Esperados | Lifestyle Esperado | Community Esperado | Intent Esperado | Match Mínimo |
|-------|----------------|-------------------|-------------------|----------------|--------------|
| "hogar tranquilo para mi familia y mi perro" | tranquilo | family-friendly, pet-friendly | familiar | family_living | ≥80% |
| "apartamento vibrante para joven profesional" | vibrante | work-from-home | joven, profesional | work_living | ≥75% |
| "casa acogedora para retiro" | acogedor, tranquilo | retiro | tranquilo | retirement | ≥80% |
| "propiedad con buen ROI" | - | - | - | investment | ≥65% |
| "hogar bohemio y artístico" | bohemio, artístico | - | artístico | general_living | ≥70% |

---

## ✅ **CHECKLIST DE VALIDACIÓN**

Para cada query, verificar:

- [ ] **Análisis emocional** contiene vibes relevantes
- [ ] **Análisis emocional** contiene lifestyle relevante
- [ ] **Análisis emocional** contiene community relevante
- [ ] **Intención detectada** es correcta
- [ ] **Confidence score** es razonable (>0.3 para queries claras)
- [ ] **Propiedades devueltas** tienen compatibility_score > 0.1
- [ ] **Propiedades ordenadas** por compatibility_score descendente
- [ ] **Insights emocionales** son relevantes y explicativos
- [ ] **Sugerencias** son útiles y contextuales
- [ ] **Resumen emocional** es legible y acogedor

---

## 🎯 **QUERIES PARA DEMOSTRACIÓN**

### **Demo 1: Familia (5 min)**
```
1. "hogar tranquilo para mi familia y mi perro"
2. "casa familiar con jardín cerca de escuela"
3. Click en propiedad con ≥80% match
```

### **Demo 2: Profesional (5 min)**
```
1. "apartamento vibrante para joven profesional"
2. "casa moderna para trabajar desde casa"
3. Click en propiedad con mejor match
```

### **Demo 3: Inversión (5 min)**
```
1. "propiedad con buen ROI para rentar"
2. "inversión inmobiliaria rentable"
3. Revisar propiedades filtradas
```

---

**Fecha de Testing:** _____________  
**Probado por:** _____________  
**Resultado:** ☐ APROBADO ☐ NECESITA AJUSTES  

**Notas:** 
_____________________________________________
_____________________________________________
_____________________________________________

