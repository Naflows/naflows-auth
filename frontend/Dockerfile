# BUILD FRONTEND FOR PRODUCTION
FROM node:alpine AS build-stage
WORKDIR /app/frontend

COPY . .
RUN npm install
RUN npm run build

# RUN PRODUCTION SERVER WITH NGINX
FROM nginx:alpine
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

# Create nginx config for SPA routing
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]