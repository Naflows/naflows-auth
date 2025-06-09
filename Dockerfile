FROM node:18-alpine

WORKDIR /

COPY package*.json ./
RUN npm install

COPY / ./

EXPOSE 3000
EXPOSE 8081


RUN npm install -g nodemon

CMD ["nodemon", "--exec", "npx tsx index.ts"]
