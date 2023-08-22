FROM node:18-alpine AS builder

WORKDIR /app/frontend

COPY ./frontend /app/frontend

COPY ./game /app/game

COPY ./types /app/types

RUN yarn && yarn build

FROM nginx:1.25.0-alpine

COPY --from=builder /app/frontend/dist /app/dist

COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

