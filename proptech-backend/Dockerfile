FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instalar scikit-learn para el modelo IA
RUN pip install scikit-learn joblib numpy

# Copiar aplicación
COPY . .

# Crear directorio para modelos IA
RUN mkdir -p backend/ai/models/recommendation

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app", "--workers", "4", "--timeout", "120"]
