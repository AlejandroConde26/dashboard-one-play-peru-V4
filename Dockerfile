FROM node:20-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
# Si usas pnpm (porque vi el lock), descomenta la siguiente linea:
# RUN npm install -g pnpm && pnpm install
RUN npm install

# Copiamos todo el código
COPY . .

# Exponemos el puerto donde corre Vite normalmente
EXPOSE 3000

# Comando para arrancar. 
# Forzamos el puerto 3000 y el host 0.0.0.0 para que Docker lo detecte
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]