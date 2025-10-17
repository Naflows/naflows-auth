FROM node:18-alpine AS build
WORKDIR /app
ARG DUMMY_API_URL=http://localhost:3005
ARG AUTH_API_URL=http://localhost:3001
ENV VITE_DUMMY_API_URL=$DUMMY_API_URL
ENV VITE_AUTH_API_URL=$AUTH_API_URL
ENV DUMMY_API_URL_DEV=$DUMMY_API_URL
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]