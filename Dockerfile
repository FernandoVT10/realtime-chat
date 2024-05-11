From node:21-alpine as base
WORKDIR /app

COPY ./package.json ./package-lock.json .
COPY ./backend/package.json ./backend/package.json
COPY ./frontend/package.json ./frontend/package.json

RUN npm install --loglevel verbose


FROM base as dev
ENV NODE_ENV development
WORKDIR /app
COPY . .

# Removes this folders since they will be mounted by docker compose
RUN rm -rf backend
RUN rm -rf frontend

COPY --from=base /app/node_modules ./node_modules

CMD ["npm", "run", "dev"]

# FROM base as builder
# WORKDIR /app
# COPY . .
# COPY --from=base /app/node_modules .
# RUN npm run build
