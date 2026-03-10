FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_RUNTIME_MODE=docker-split
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_WS_BASE_URL=ws://localhost:8080
ARG VITE_USE_DEV_PROXY=false
ARG VITE_GOOGLE_AUTH_ENABLED=false

ENV VITE_RUNTIME_MODE=${VITE_RUNTIME_MODE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_WS_BASE_URL=${VITE_WS_BASE_URL}
ENV VITE_USE_DEV_PROXY=${VITE_USE_DEV_PROXY}
ENV VITE_GOOGLE_AUTH_ENABLED=${VITE_GOOGLE_AUTH_ENABLED}

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
