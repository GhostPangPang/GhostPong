FROM node:18-alpine AS builder

WORKDIR /app/backend

COPY ./backend /app/backend

COPY ./game /app/game

COPY ./types /app/types

RUN yarn --immutable --immutable-cache

RUN yarn build

FROM node:18-alpine

COPY --from=builder /app/backend/dist /app/dist

COPY --from=builder /app/backend/node_modules /app/node_modules

USER node

EXPOSE 3000

ENTRYPOINT ["node", "/app/dist/backend/src/main"]
