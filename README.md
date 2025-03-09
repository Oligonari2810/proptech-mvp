
# 🏡 Proptech MVP

**Proptech MVP** es una plataforma innovadora que digitaliza la compra, venta y gestión de propiedades. Su objetivo es revolucionar el sector inmobiliario con tecnología avanzada.

## 📂 Estructura del Proyecto

```
proptech-mvp/
│── proptech-backend/   # Backend en Python con Flask
│── proptech-web/       # Frontend en Next.js con Tailwind CSS
│── README.md           # Documentación del proyecto
│── .gitignore          # Archivos a ignorar en Git
```

## 🚀 Tecnologías Utilizadas

### 📌 **Backend**:
- Python 3
- Flask
- SQLAlchemy (Base de datos)
- Redis (Cache y tareas en segundo plano)
- JWT (Autenticación segura)

### 🎨 **Frontend**:
- Next.js
- Tailwind CSS
- TypeScript
- Axios (Manejo de API)
- React Hooks y Context API

---

## 🔧 Instalación y Configuración

### 1️⃣ **Clonar el repositorio:**
```bash
git clone https://github.com/Oligonari2810/proptech-mvp.git
cd proptech-mvp
```

---

### 2️⃣ **Configurar el Backend:**
```bash
cd proptech-backend
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
> 📌 Asegúrate de configurar tu archivo `.env` con las credenciales necesarias.

---

### 3️⃣ **Configurar el Frontend:**
```bash
cd ../proptech-web
npm install
npm run dev
```
> 📌 La aplicación estará disponible en `http://localhost:3000`.

---

## 📡 Despliegue

| Componente  | Estado  | Enlace |
|-------------|---------|--------|
| **Frontend**  | ✅ En producción | [proptech-web-five.vercel.app](https://proptech-web-five.vercel.app) |
| **Backend**  | 🔴 Pendiente de despliegue | *(Render próximamente)* |

---

## 📞 Contacto

Si tienes alguna duda o sugerencia, puedes comunicarte conmigo en **[LinkedIn](https://www.linkedin.com/)** o enviarme un correo.

---

🚀 **Proptech MVP - Transformando el mercado inmobiliario con tecnología.**
```

---

### 📌 **Pasos para guardarlo y subirlo a GitHub**:

1. **Abre Visual Studio Code** y crea un nuevo archivo en la raíz del proyecto:
   - `README.md`
2. **Pega el contenido** en el archivo.
3. **Guarda los cambios** (`Ctrl + S` o `Cmd + S` en Mac).
4. **Súbelo a GitHub**:
   ```bash
   git add README.md
   git commit -m "Agregando README en la raíz"
   git push origin main
   ```

📌 **¡Listo! Ahora tu repositorio tendrá una documentación clara y profesional en GitHub.** 🚀🔥