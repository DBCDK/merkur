FROM docker-io.dbc.dk/node:9-alpine

ENV USER node
ENV HOME /home/$USER
WORKDIR $HOME

COPY src src
COPY .babelrc .babelrc
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY webpack.common.js webpack.common.js
COPY webpack.dev.js webpack.dev.js
COPY webpack.prod.js webpack.prod.js

RUN yarn
RUN ["yarn", "build"]

CMD ["node_modules/.bin/babel-node", "src/express-server"]

EXPOSE 3000
