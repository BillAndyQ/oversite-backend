# Usa Node 24 (misma versión que tienes con NVM)
FROM node:24

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Construir la app NestJS
RUN npm run build

# Exponer el puerto que usa tu app
EXPOSE 3000

# Comando para correr la app en producción
CMD ["node", "dist/main.js"]
