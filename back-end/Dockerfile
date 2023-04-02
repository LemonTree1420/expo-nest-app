FROM node:18.15-slim

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=production

COPY ./ ./

RUN npm run build

EXPOSE 9001

CMD ["node", "dist/main.js"]