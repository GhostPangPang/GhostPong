FROM node:18-alpine

WORKDIR /app/backend

COPY ./backend /app/backend

COPY ./game /app/game

COPY ./types /app/types

RUN yarn --frozen-lockfile && yarn build

EXPOSE 3000

ENTRYPOINT ["node", "dist/backend/src/main"]
