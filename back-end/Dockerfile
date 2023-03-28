# FROM node:18.15-alpine

# WORKDIR /app

# COPY ./package*.json ./

# RUN npm install --only=production

# COPY ./ ./

# EXPOSE 9196

# CMD ["npm", "start"]

FROM node:18.15-slim

WORKDIR /app

COPY ./ ./

ENV PORT=6000
ENV DB_URI="mongodb://13.209.57.85:27017"
ENV MONGO_USERNAME="lemon"
ENV MONGO_PASSWORD="rudqud!"
ENV DB_NAME="choice"
ENV JWT_SECRET_KEY="choice9196"

CMD npm run start:dev