FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .
# Display current working directory ls for debugging
RUN ls -la

EXPOSE 3000
EXPOSE 8081

CMD ["nodemon", "--exec", "npx tsx index.ts"]