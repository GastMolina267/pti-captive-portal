# Requisitos

> **Alcance**: este repositorio (`pti-captive-portal`, portal cautivo de Vitalia) contiene únicamente el frontend SPA del portal cautivo (React + Vite, servido como archivos estáticos vía Nginx). No incluye servidor RADIUS, base de datos, ni backend de negocio — esos componentes viven en repositorios hermanos (ver [../02-technical/01-arquitectura.md](../02-technical/01-arquitectura.md)).

## Hardware objetivo

El portal está diseñado para desplegarse detrás de (o ser consumido por) un router **Teltonika RUT956** actuando como NAS (Network Access Server) con el protocolo **UAM** (compatible con CoovaChilli/ChilliSpot). El router es responsable de:

- Interceptar el tráfico HTTP del cliente WiFi y redirigirlo a esta SPA con parámetros de query (`uamip`, `uamport`, `challenge`, `mac`, `userurl`, `redirurl`).
- Recibir la respuesta de "logon" y habilitar/denegar el acceso a Internet del dispositivo cliente.

## Software y versiones (para build/despliegue del frontend)

| Componente | Versión requerida | Dónde se define |
| --- | --- | --- |
| Node.js | 24 (Alpine) | [`Dockerfile`](../../Dockerfile) |
| pnpm | última (vía corepack) | `Dockerfile`, `pnpm-lock.yaml` |
| Nginx | `nginx:alpine` (imagen final) | `Dockerfile` |
| TypeScript | ^5.5.3 | `package.json` |
| Vite | ^6.4.1 | `package.json` |
| React | ^18.3.1 | `package.json` |
| `@fontsource/plus-jakarta-sans` | ^5.3.0 | `package.json` — tipografía auto-hospedada, ver [../03-customization/01-temas.md](../03-customization/01-temas.md) |

No se requiere PHP, Python, MySQL/Postgres, ni `dnsmasq`/`iptables` dentro de este repositorio — esas piezas corresponden a la configuración del router Teltonika y a la API NestJS del Edge Gateway.

## Dependencias de servicios externos

- **Backend de negocio** (`VITE_BASE_URL`): expone `/auth/*` (incluye recupero de contraseña), `/advertisements/*`, `/indicators/*`. Debe estar accesible desde la red donde se sirve el portal. Ver [../02-technical/02-api.md](../02-technical/02-api.md).
- **Router RUT956 / NAS UAM**: debe redirigir tráfico HTTP no autenticado hacia la URL pública de esta SPA e inyectar los parámetros UAM en el query string (ver [03-configuracion-red.md](03-configuracion-red.md)).
- La app no depende de CDNs externos para cargar: la tipografía se auto-hospeda vía `@fontsource/plus-jakarta-sans`, empaquetada en el propio `dist/`.
- **Android App Links**: `public/.well-known/assetlinks.json` declara verificación de dominio para deep-linking a la app nativa `com.vitalia.app` — si se cambia el dominio de despliegue o el certificado de firma del APK, este archivo debe actualizarse.

## Requisitos del navegador cliente

- Cualquier navegador moderno con soporte de JavaScript ES2020+.
- `localStorage` habilitado (persiste `authToken` y la preferencia de tema `vitalia_theme`).
- `navigator.geolocation` (opcional, usado en `HeaderAds.tsx` para publicidad por zona geográfica).
- `navigator.clipboard` (opcional, usado en `SessionExpiredNoApp.tsx`; tiene fallback vía `document.execCommand('copy')`).

## Requisitos de build local (desarrollo)

- Node.js 24.x
- pnpm (vía `corepack`)
- Archivo `.env` basado en `.env.example` con al menos `VITE_BASE_URL` apuntando a una instancia del backend.
