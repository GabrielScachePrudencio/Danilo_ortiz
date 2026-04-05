# build do React
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# servir com nginx
FROM nginx:alpine

# IMPORTANTE: Verifique se sua pasta de build é 'build' ou 'dist'
# Se usar Vite, mude de /app/build para /app/dist
COPY --from=build /app/build /usr/share/nginx/html

# COPIA A CONFIGURAÇÃO PERSONALIZADA PARA O NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]