FROM node:14.17.6-alpine
RUN mkdir -p /apps
WORKDIR /apps
COPY . /apps

RUN npm install

EXPOSE 3001

CMD npm run start