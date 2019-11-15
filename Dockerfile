FROM docker.dbc.dk/dbc-node:latest

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

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install yarn -qy && \
    yarn
 RUN ["yarn", "build"]

CMD ["node_modules/.bin/babel-node", "src/express-server"]

EXPOSE 3000
