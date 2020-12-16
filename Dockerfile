FROM node:12

WORKDIR /src

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build

CMD yarn start
