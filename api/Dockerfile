FROM node:alpine
WORKDIR /app/dummy-api


COPY . .


RUN npm install

EXPOSE 3005

RUN npm install -g nodemon

CMD ["nodemon", "--exec", "npx tsx index.ts"]
