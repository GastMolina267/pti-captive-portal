# API

Este frontend **no expone** una API propia — es un **consumidor** de dos APIs distintas:

1. El **backend de negocio** (repo hermano, vía `VITE_BASE_URL`), para autenticación, recupero de contraseña, publicidades e indicadores.
2. El **endpoint `/logon` del NAS** (router RUT956), para autorizar el acceso a Internet vía protocolo UAM/CHAP.

Todas las llamadas al backend de negocio pasan por [`src/services/axiosInstance.ts`](../../src/services/axiosInstance.ts), que fija `baseURL = import.meta.env.VITE_BASE_URL` y agrega `Authorization: Bearer {authToken}` (leído de `localStorage`) en cada request saliente.

## Autenticación (`/auth`) — [`authService.ts`](../../src/services/authService.ts)

### `POST /auth/register`

```json
{
  "email": "string",
  "password": "string",
  "macAddress": "string (opcional)",
  "gender": "male | female | other",
  "birthDate": "string YYYY-MM-DD (opcional)",
  "person": {
    "firstName": "string",
    "lastName": "string",
    "phone": "string (opcional, con prefijo + si el usuario lo ingresó)"
  }
}
```

Response `200`: `{ "token": "string (JWT)", "message": "string" }`. El cliente guarda `token` en `localStorage.authToken`.

### `POST /auth/login`

```json
{
  "email": "string",
  "password": "string",
  "macAddress": "string (opcional)",
  "deviceIp": "string (opcional, desde el parámetro UAM 'ip')",
  "routerIp": "string (opcional, desde el parámetro UAM 'uamip')",
  "routerMac": "string (opcional, desde el parámetro UAM 'called')",
  "source": "'portal'"
}
```

Response `200`: `{ "token": "string (JWT)", "hasApp": "boolean (opcional)", "hasExpiredSession": "boolean (opcional)" }`.

Comportamiento del cliente según la respuesta:

- Si `hasExpiredSession === true`: no guarda token; lanza una excepción con el mensaje literal `SESSION_EXHAUSTED_HAS_APP` (si `hasApp: true`) o `SESSION_EXHAUSTED_NO_APP` (si `hasApp: false`). Ver [01-arquitectura.md](01-arquitectura.md) para cómo navega cada caso.
- Si no hay expiración: guarda `token` en `localStorage.authToken` y continúa con la redirección UAM al router.

### `POST /auth/user-request-password-reset`

Usado por [`ForgotPassword.tsx`](../../src/pages/ForgotPassword.tsx). Body: `{ "email": "string", "origin": "portal" }`. Response `200`: `{ "message": "string" }` (fallback si no viene: *"Si el email está registrado, recibirás un correo con las instrucciones para recuperar tu contraseña."*).

### `POST /auth/user-reset-password`

Usado por [`ResetPassword.tsx`](../../src/pages/ResetPassword.tsx). Body: `{ "token": "string (de ?token= en el email)", "newPassword": "string" }`. Response `200`: `{ "message": "string" }`.

El frontend detecta "token inválido/expirado" haciendo matching de substring (case-insensitive) sobre el mensaje de error devuelto (`'expirado'`, `'inválido'`, `'expired'`, `'invalid'`) — no depende de un código de error estructurado.

### Manejo de errores

`extractErrorMessage()` normaliza errores de Axios y pasa el resultado por `translateErrorMessage()` ([`utils/handleError.ts`](../../src/utils/handleError.ts)), que traduce mensajes técnicos comunes del backend al español:

| Patrón detectado (case-insensitive) | Mensaje mostrado al usuario |
| --- | --- |
| `duplicate key`, `unique constraint`, `uq_`, `already exists`, `email_1` | "Este correo electrónico ya se encuentra registrado. Si ya tienes una cuenta, por favor inicia sesión." |
| `invalid credentials`, `unauthorized`, `credenciales` | "Correo electrónico o contraseña incorrectos." |
| `user not found`, `usuario no encontrado` | "No existe un usuario registrado con este correo electrónico." |
| `network error`, `err_network` | "Error de conexión. Por favor verifica tu red e intenta nuevamente." |
| `internal server error`, `500` | "Ocurrió un problema en el servidor. Por favor intenta más tarde." |
| (sin match) | el mensaje original del backend, sin traducir |

## Publicidades (`/advertisements`)

### `GET /advertisements`

Consumido por [`HeaderAds.tsx`](../../src/components/layout/HeaderAds.tsx). Se filtra client-side por `showPortal`, rango de fechas `start`/`end`, horario (`schedules[]`, soporta franjas que cruzan medianoche) y zona geográfica (`zones[].pointsList`, cruzado con `navigator.geolocation` vía point-in-polygon). Si el usuario no otorga geolocalización, se muestran las primeras 5 publicidades con `zones` definidas, sin filtrar por zona real.

```ts
interface Advertisement {
  id: string;
  name: string;
  file?: { fileUrl: string };
  description: string;
  showPortal: boolean;
  url?: string;
  zones?: { pointsList: string }[];
  start: string;
  end: string;
  schedules?: { day: number; startTime: string; endTime: string }[];
}
```

### `GET /advertisements/filter/by-locations?locationNames=Footer`

Usado por [`FooterAdvertisement.tsx`](../../src/components/FooterAdvertisement.tsx), visible en `Login.tsx`, `ForgotPassword.tsx` y `ResetPassword.tsx`.

## Indicadores / analítica (`/indicators`) — [`advertisementTracking.ts`](../../src/services/advertisementTracking.ts)

Todas las llamadas son fire-and-forget (errores solo van a `console.error`).

| Endpoint | Método | Cuándo se dispara |
| --- | --- | --- |
| `/indicators/view` | POST | Impresión de una publicidad |
| `/indicators/click` | POST | Click en `HeaderAds` o `FooterAdvertisement` |
| `/indicators/view-more` | POST | Expansión de detalle de una publicidad |
| `/indicators` | POST | Retención (`startTime`/`endTime`, `actionType: 'view'`) |

## Endpoint del NAS (fuera del backend de negocio)

### `GET http://{uamip}:{uamport}/logon`

Construido tras un login/registro exitoso (con `challenge` si el NAS lo proveyó) — ver [`uamChap.ts`](../../src/utils/uamChap.ts).

## Parámetros UAM (query string, no son parte de la API HTTP pero determinan sus payloads)

[`parseUamParams.ts`](../../src/utils/parseUamParams.ts):

| Parámetro | Mapeado a (en `/auth/login`) |
| --- | --- |
| `ip` | `deviceIp` |
| `called` | `routerMac` |
| `uamip` | `routerIp` |
| (fijo) | `source: 'portal'` |

## Variables que determinan las URLs base

| Variable | Efecto |
| --- | --- |
| `VITE_BASE_URL` | `baseURL` de `axiosInstance` — todas las rutas de este documento (excepto `/logon`) son relativas a esta URL |
| `uamip`, `uamport` (query string, no env var) | Determinan la URL del `/logon` |
