From node:21-alpine
WORKDIR /app

COPY ./package.json ./package-lock.json .
COPY ./backend/package.json ./backend/package.json
COPY ./frontend/package.json ./frontend/package.json

RUN npm install --loglevel verbose

COPY . .

# this command only installs the npm workspaces
RUN npm install

CMD ["npm", "run", "dev"]
