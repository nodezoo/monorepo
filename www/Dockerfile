FROM node:14
WORKDIR /usr/src/nodezoo/www
COPY package*.json ./
COPY . .
RUN npm i
RUN npm run build
CMD ["node", "./src/server.js"]

