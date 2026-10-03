# Despliegue con Docker

El [`Dockerfile`](../../Dockerfile) implementa un build multi-stage que compila la SPA y la sirve con Nginx. Es el mecanismo de despliegue soportado y el que usa el pipeline de CI/CD.

## Etapas del Dockerfile

```dockerfile
FROM node:24-alpine AS base       # habilita corepack + pnpm
FROM base AS deps                 # pnpm install --frozen-lockfile --ignore-scripts
FROM base AS builder               # copia node_modules + código, corre `pnpm build`
FROM nginx:alpine                  # etapa final: solo Nginx + dist/ + nginx.conf
```

1. **`base`**: imagen `node:24-alpine`, habilita `corepack` y prepara `pnpm@latest`.
2. **`deps`**: instala dependencias con `pnpm install --frozen-lockfile --ignore-scripts` (usa el lockfile committeado, no ejecuta scripts de instalación de terceros).
3. **`builder`**: copia `node_modules`, copia el resto del código y corre `pnpm build` (`tsc -b && vite build`), generando `dist/`.
4. **Etapa final**: imagen `nginx:alpine` limpia, copia [`infra/nginx.conf`](../../infra/nginx.conf) a `/etc/nginx/conf.d/default.conf` y `dist/` a `/usr/share/nginx/html`. Arranca con `nginx -g "daemon off;"`.

La imagen final no contiene Node.js ni el código fuente — solo los estáticos compilados y Nginx.

## Build y ejecución local

```bash
docker build -t busdigital-captive-portal .
docker run -p 3000:3000 busdigital-captive-portal
```

Las variables `VITE_*` se **inyectan en tiempo de build** (Vite las reemplaza estáticamente al compilar), no en runtime del contenedor:

- Para cambiar `VITE_BASE_URL` u otras variables `VITE_*`, hay que reconstruir la imagen con esas variables disponibles en el entorno de build (un `.env` en el contexto de build antes de `RUN pnpm build` — el Dockerfile no declara `ARG`/`ENV` propios para ellas).
- No es posible cambiar `VITE_BASE_URL` de una imagen ya construida sin rebuildear.

## Healthcheck

`infra/nginx.conf` expone `GET /health` devolviendo `200 healthy` sin loguear (`access_log off`) — apto para probes de Docker/Kubernetes/orquestador. El `Dockerfile` no declara una directiva `HEALTHCHECK` propia; si se quiere healthcheck nativo de Docker, agregar:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
```

## Uso en CI/CD

El pipeline de GitHub Actions delega el build/push/deploy de imagen a workflows reutilizables del repositorio compartido `mindfactory-sw/mf-mindstack-gha`:

- [`01-deploy-to-dev.yaml`](../../.github/workflows/01-deploy-to-dev.yaml): en cada push a `main`, dispara build + deploy a `development` con versión `development-{run_number}`.
- [`02-release.yaml`](../../.github/workflows/02-release.yaml): `workflow_dispatch` manual, resuelve versión semántica y despliega a `staging`/`production`.

## Variables de entorno en runtime del contenedor

Ninguna. Al ser una SPA estática servida por Nginx, no hay variables de entorno leídas en runtime — todo lo que empieza con `VITE_` queda "horneado" en el bundle de JavaScript en tiempo de build.
