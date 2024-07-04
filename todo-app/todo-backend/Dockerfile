FROM node:20

WORKDIR /usr/src/app

# Copy package.json and package-lock.json files.
COPY package*.json ./

# Install dependencies.
RUN npm install

COPY --chown=node:node . .

USER node

CMD npm start