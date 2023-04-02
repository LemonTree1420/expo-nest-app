FROM node:18.15-slim

WORKDIR /app

COPY ./package*.json ./yarn.lock ./

RUN yarn install

COPY ./ ./

RUN yarn build

EXPOSE 9001

CMD ["node", "dist/main.js"]