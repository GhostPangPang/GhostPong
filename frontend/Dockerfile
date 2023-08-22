FROM node:18-alpine AS builder

WORKDIR /app/frontend

ARG VITE_BASE_URL
ARG VITE_API_URL
ARG VITE_ASSET_URL

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ASSET_URL=$VITE_ASSET_URL

COPY ./frontend /app/frontend

COPY ./game /app/game

COPY ./types /app/types

RUN yarn && yarn build

FROM nginx:1.25.0-alpine

COPY --from=builder /app/frontend/dist /app/dist

COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
