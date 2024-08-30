# Base image
FROM node:20.11.1
WORKDIR /usr/src/gmover-game
RUN npm install -g yarn || echo "Yarn is already installed"
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 8293
CMD ["yarn", "start","-p","8293"]