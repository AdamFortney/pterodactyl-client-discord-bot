FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "./src/main.js"]