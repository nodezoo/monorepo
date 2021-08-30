FROM node:14
WORKDIR /usr/src/nodezoo
COPY package.json ./
COPY srv ./srv
COPY build ./build
COPY devassets ./devassets
COPY deploy ./deploy
COPY lib ./lib
COPY model ./model
COPY test ./test
RUN npm install

