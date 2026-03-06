# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Instalar pnpm (el proyecto lo usa como packageManager)
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copiar archivos de dependencias primero (cache de capas)
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --no-frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Construir los assets estáticos con Vite (salen a dist/public)
RUN pnpm run build

# ── Etapa 2: Producción con Nginx ───────────────────────────────────────────
FROM nginx:stable-alpine

# Copiar los archivos estáticos generados por Vite
COPY --from=build /app/dist/public /usr/share/nginx/html

# Nginx escucha en el puerto 80 por defecto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]