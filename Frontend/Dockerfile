# ─── Etapa 1: Build con Node + Vite ─────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# URL del backend en producción (se sobreescribe con ARG en tiempo de build)
ARG VITE_API_URL=https://sgp-backend.onrender.com
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# ─── Etapa 2: Servidor Nginx ligero ─────────────────────────────────────────
FROM nginx:1.27-alpine

# Copiar build generado por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx con soporte para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
