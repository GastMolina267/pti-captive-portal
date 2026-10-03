# Instalación

Este documento cubre la instalación del frontend en dos modos: desarrollo local y build de producción. Para contenedor ver [04-docker.md](04-docker.md); para reglas de red ver [03-configuracion-red.md](03-configuracion-red.md).

> No hay base de datos ni permisos de sistema operativo que instalar en este repositorio: es una SPA sin estado persistente propio (usa `localStorage` del navegador).

## 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo> mindfactory-busdigital-captive-portal
cd mindfactory-busdigital-captive-portal
corepack enable          # habilita pnpm vía corepack
pnpm install
```

El proyecto fija su gestor de paquetes en `pnpm-lock.yaml`. No usar `npm install` ni `yarn` para evitar discrepancias de lockfile.

## 2. Configurar variables de entorno

```bash
cp .env.example .env
```

| Variable | Descripción | Obligatoria |
| --- | --- | --- |
| `VITE_BASE_URL` | URL base del backend de negocio (auth, advertisements, indicators) | Sí |
| `VITE_RUT956_DEFAULT_IP` | IP por defecto del router RUT956 (referencia/documental) | No |
| `VITE_RUT956_DEFAULT_PORT` | Puerto por defecto del router RUT956 (referencia/documental) | No |

## 3. Levantar en modo desarrollo

```bash
pnpm dev        # http://localhost:5173
```

Para simular el flujo completo, abrir la app con los parámetros UAM en la URL:

```txt
http://localhost:5173/login?uamip=192.168.1.1&uamport=3990&challenge=<hex>&mac=AA:BB:CC:DD:EE:FF
```

Sin `uamip`, [`parseUamParams.ts`](../../src/utils/parseUamParams.ts) devuelve un error y el login no podrá completar la redirección final al NAS.

## 4. Compilar para producción

```bash
pnpm build          # tsc -b && vite build  → genera dist/
pnpm preview         # sirve dist/ localmente en :4173 para verificación
```

## 5. Verificar el build

- `pnpm type-check` — chequeo de tipos sin emitir.
- `pnpm lint` — ESLint.
- `pnpm test:cov` — suite Jest con cobertura (ver [../04-operations/01-monitoreo.md](../04-operations/01-monitoreo.md)).

## 6. Despliegue

El artefacto de `pnpm build` (carpeta `dist/`) se sirve como contenido estático vía **Docker + Nginx** — ver [04-docker.md](04-docker.md). El pipeline de GitHub Actions (`01-deploy-to-dev.yaml`, `02-release.yaml`) automatiza el build y despliegue a `development`, `staging` y `production`.
