FROM node:18.15-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=production

COPY ./ ./

EXPOSE 9196

CMD ["npm", "start"]