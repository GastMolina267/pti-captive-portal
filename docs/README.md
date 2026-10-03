# Documentación — BusDigital Captive Portal

Documentación técnica, operativa y de usuario del **frontend** del portal cautivo de WiFi para la flota de buses (React + Vite + TypeScript, protocolo UAM/CHAP contra routers Teltonika RUT956).

> **Alcance**: este repositorio contiene únicamente la SPA que el usuario ve en su navegador. No incluye servidor RADIUS, base de datos propia, ni configuración de firewall — esos componentes corresponden al router del bus y al backend de negocio (repo hermano `mindfactory-busdigital-backend`).

La documentación está ordenada de forma progresiva: primero cómo poner el proyecto en marcha, después cómo entenderlo y adaptarlo por dentro, y por último cómo operarlo día a día y qué ve el usuario final.

## 1. Despliegue ([`01-deployment/`](01-deployment/))

| Documento | Contenido |
| --- | --- |
| [01-requisitos.md](01-deployment/01-requisitos.md) | Hardware objetivo (RUT956), versiones de Node/pnpm/Nginx, dependencias externas |
| [02-instalacion.md](01-deployment/02-instalacion.md) | Instalación local, variables de entorno, build y verificación |
| [03-configuracion-red.md](01-deployment/03-configuracion-red.md) | Walled garden, redirección UAM, puertos, parámetros de red esperados |
| [04-docker.md](01-deployment/04-docker.md) | Build multi-stage, healthcheck, integración con CI/CD |

## 2. Documentación técnica ([`02-technical/`](02-technical/))

| Documento | Contenido |
| --- | --- |
| [01-arquitectura.md](02-technical/01-arquitectura.md) | Flujo de autenticación, estructura de `src/`, decisiones de diseño |
| [02-api.md](02-technical/02-api.md) | Endpoints consumidos (`/auth`, `/advertisements`, `/indicators`) y el `/logon` del NAS |
| [03-base-datos.md](02-technical/03-base-datos.md) | Modelo de datos visto desde el cliente (no hay DB propia en este repo) |
| [04-seguridad.md](02-technical/04-seguridad.md) | CHAP, manejo de tokens, headers de seguridad |
| [05-rendimiento.md](02-technical/05-rendimiento.md) | Code-splitting, priorización de imágenes, cómo medir con Lighthouse |
| [06-observabilidad.md](02-technical/06-observabilidad.md) | Reporte de errores de runtime (Sentry/Faro), configuración por entorno, scrubbing de PII |

## 3. Personalización e interfaz ([`03-customization/`](03-customization/))

| Documento | Contenido |
| --- | --- |
| [01-temas.md](03-customization/01-temas.md) | Paleta de colores, tipografía, logos y assets de marca |
| [02-idiomas.md](03-customization/02-idiomas.md) | Estado actual (sin i18n) y cómo agregarlo |

## 4. Operaciones y mantenimiento ([`04-operations/`](04-operations/))

| Documento | Contenido |
| --- | --- |
| [01-monitoreo.md](04-operations/01-monitoreo.md) | Healthcheck, logs, analítica y cobertura en CI |
