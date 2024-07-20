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

RUN yarn --immutable

EXPOSE 5173

ENTRYPOINT ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]
