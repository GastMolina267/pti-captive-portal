# Seguridad

## Cifrado y transporte

- **HTTPS del backend de negocio**: depende de cómo se despliegue `VITE_BASE_URL` — este repo no fuerza HTTPS en `axiosInstance.ts`. En producción, `VITE_BASE_URL` debe ser `https://` para proteger email/password en tránsito.
- **Certificados SSL/TLS**: no se gestionan en este repositorio (Nginx en `infra/nginx.conf` escucha en `:3000` plano). La terminación TLS la hace un proxy/balanceador delante del contenedor. Ver [../01-deployment/04-docker.md](../01-deployment/04-docker.md).
- **Redirección al NAS (`/logon`)**: se hace por HTTP simple (`http://{uamip}:{uamport}/logon`) — comportamiento estándar del protocolo UAM/CoovaChilli sobre redes locales del propio bus.

## Protocolo CHAP (autenticación contra el NAS)

[`src/utils/uamChap.ts`](../../src/utils/uamChap.ts) implementa la respuesta CHAP estándar:

```txt
response = MD5( 0x00 + password + challenge )
```

usando `crypto-js` (`CryptoJS.MD5`), compatible con el protocolo UAM de Teltonika/CoovaChilli — el objetivo de CHAP es evitar transmitir la contraseña en claro hacia el NAS cuando el router provee `challenge`. Si el NAS no envía `challenge`, el logon se hace sin CHAP (ver [`buildUamLogonUrl`](../../src/utils/uamChap.ts)).

## Manejo de tokens y sesión

- El JWT (`authToken`) se guarda en `localStorage`, no en cookie `httpOnly` — decisión común en SPAs, mitigable con una `Content-Security-Policy` estricta.
- No hay lógica de expiración/refresh de token en el cliente: si el JWT expira, las llamadas subsiguientes fallan con `401` (no hay interceptor de response, solo de request en `axiosInstance.ts`).
- El router no tiene guards basados en `authToken` — todas las rutas son públicas; la validez del token solo se comprueba al hacer una llamada HTTP real.

## Headers de seguridad (Nginx)

`infra/nginx.conf` incluye:

```txt
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
```

Desde que se removieron Google Analytics/Fonts (tipografías auto-hospedadas vía `@fontsource`), `index.html` no depende de ningún script/font externo — lo que simplifica definir una `Content-Security-Policy` restrictiva sin necesidad de allowlistear dominios de terceros.

## Auditoría de dependencias y secretos (CI)

El workflow [`00-pull-request-validation.yaml`](../../.github/workflows/00-pull-request-validation.yaml) incluye un job `security` que corre auditoría de dependencias (`pnpm audit`) y **Gitleaks** (escaneo de secretos commiteados). Cubre la cadena de suministro del build, no un análisis de seguridad del runtime (XSS, CSP, CHAP) como el descrito arriba.

## Datos personales

El registro de usuario (`RegisterTab.tsx` / `/auth/register`) recolecta email, teléfono, género y fecha de nacimiento — datos personales sujetos a la normativa de protección de datos aplicable en la jurisdicción donde opera la flota.
