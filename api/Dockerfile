FROM node:alpine
WORKDIR /app


COPY . .


RUN npm install

EXPOSE 3005

RUN npm install -g nodemon

CMD ["nodemon", "--exec", "npx tsx index.ts"]
