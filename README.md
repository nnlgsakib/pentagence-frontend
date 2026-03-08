# Pentagence Frontend

React + Vite frontend for Pentagence.

## Local Development (Non-docker)

```bash
npm install
npm run dev
```

By default, Vite runs on `http://localhost:5173` and proxies `/v1` and websocket traffic to backend `http://localhost:8080`.

## Environment Variables

Copy `.env.example` and adjust values if needed:

- `VITE_RUNTIME_MODE`: `non-docker`, `docker-split`, or `docker-gateway`
- `VITE_API_BASE_URL`: backend base URL; can be empty in gateway mode
- `VITE_WS_BASE_URL`: websocket base URL; can be empty in gateway mode
- `VITE_USE_DEV_PROXY`: `true` to use local Vite proxy in development
- `VITE_DEV_PROXY_TARGET`: backend target for Vite proxy
- `VITE_DEV_PORT`: local frontend port

## Build and Test

```bash
npm run test
npm run build
```

## Docker

Frontend Docker image is defined in `pentagence-frontend/Dockerfile` and serves static assets with nginx.

- Split mode: served directly on `FRONTEND_PORT`.
- Gateway mode: static assets are bundled into `Dockerfile.gateway` image and served behind nginx with backend proxying.
