FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000
EXPOSE 8081

RUN npm install -g nodemon

CMD ["nodemon", "--exec", "npx tsx index.ts"]
