FROM node:latest

ARG service_src

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./
COPY $service_src/src ./service/src
COPY $service_src/tests ./service/tests
COPY $service_src/.env ./service/.env
COPY $service_src/.env ./service/dotenvconfig

EXPOSE 3000

RUN npm install