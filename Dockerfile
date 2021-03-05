FROM node:12
EXPOSE 3000
WORKDIR /usr/app
COPY package-lock.json .
COPY package.json .
RUN npm install
COPY dist .
#COPY .env .
CMD node dist/src/index.js