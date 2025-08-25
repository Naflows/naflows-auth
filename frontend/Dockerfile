# BUILD FRONTEND FOR PRODUCTION
FROM node:alpine AS build-stage
WORKDIR /app/frontend

COPY . .
RUN npm install
EXPOSE 8080
RUN npm install -g nodemon
RUN npm run build

# RUN PRODUCTION SERVER 
# Found at https://stackoverflow.com/questions/75531401/how-to-use-vite-for-production-build
FROM busybox:1.35
RUN adduser -D static 
USER static 
WORKDIR /home/static 
COPY --from=build-stage /app/frontend/dist .
CMD ["busybox","httpd","-f","-v","-p","8080"]