FROM node:18.15-slim

WORKDIR /app

COPY ./ ./

RUN yarn install

RUN yarn build

EXPOSE 9001

CMD ["node", "dist/main.js"]