# Observabilidad

## Qué resuelve

Al ser una SPA 100% client-side, un error de JavaScript en producción (por ejemplo durante el login o el flujo UAM) antes solo quedaba en la consola del navegador del usuario, sin visibilidad para el equipo. Hoy se reporta a **Sentry**.

La estrategia del equipo es migrar a **Grafana Faro** cuando la infraestructura de ingesta (Grafana Alloy) esté disponible. Por eso toda la app pasa por una capa de abstracción propia en vez de acoplarse directamente al SDK de Sentry — el día que se migre, el cambio es de un solo archivo (ver [Migrar a Faro](#migrar-a-faro)).

**Estado actual**: `src/services/observability/faroProvider.ts` ya implementa la misma interfaz que Sentry y tiene su propia suite de tests, pero no está activo — `instance.ts` sigue instanciando `SentryObservabilityProvider`.

## Capa de abstracción

Todo el código de la aplicación interactúa con la observabilidad a través de la interfaz `ObservabilityProvider` (`src/services/observability/types.ts`), nunca con el SDK de Sentry ni con el de Faro directamente:

```ts
export interface ObservabilityProvider {
  init(): void;
  captureException(error: unknown, context?: ObservabilityContext): void;
  captureMessage(message: string, level?: ObservabilityLevel, context?: ObservabilityContext): void;
  setUser(user: ObservabilityUser | null): void;
  addBreadcrumb(breadcrumb: ObservabilityBreadcrumb): void;
}
```

`sentryProvider.ts` es el único archivo que importa `@sentry/react`; `faroProvider.ts` es el único que importa `@grafana/faro-web-sdk`. El singleton en `instance.ts` es el único punto de acoplamiento con el resto de la app:

```ts
export const observability: ObservabilityProvider = new SentryObservabilityProvider();
```

## Qué captura

- **Errores JS no controlados y promesas rechazadas**: capturados automáticamente por `Sentry.init()` en cuanto `observability.init()` corre en `src/main.tsx`, antes del render de React.
- **Excepciones no controladas de React**: capturadas por [`ErrorBoundary.tsx`](../../src/services/observability/ErrorBoundary.tsx), que envuelve todo el árbol en `App.tsx` y muestra un fallback con botón de "Recargar".
- **Errores de autenticación ya traducidos por la app**: instrumentados en `authService.ts` (`extractErrorMessage`) y `handleError.ts`. Los errores de control de flujo esperado (`SESSION_EXHAUSTED_HAS_APP`/`SESSION_EXHAUSTED_NO_APP`) quedan excluidos porque `login()` los relanza antes de llegar a `extractErrorMessage`.
- **Contexto de cada evento**: URL, navegador, sistema operativo y stack trace (integraciones por defecto de Sentry). La versión de la app se envía como `release`.

## Configuración por entorno

| Variable | Descripción |
| --- | --- |
| `VITE_OBSERVABILITY_ENVIRONMENT` | Tag `environment` del evento (`local`, `development`, `staging`, `production`). Compartida por Sentry y Faro. |
| `VITE_APP_VERSION` | Se envía como `release`/`version`. `vite.config.ts` la calcula en cada build con `git describe --tags --always` — nunca queda vacía (cae a `<versión de package.json>-no-git` si no hay `.git`). |
| `VITE_SENTRY_DSN` | DSN del proyecto de Sentry. Vacío = observability no-op. |
| `VITE_SENTRY_ENABLED` | Kill-switch explícito e independiente del DSN. Default `false`. |
| `VITE_FARO_URL` | URL del collector de Grafana Alloy/Cloud. Vacío = Faro no-op. |
| `VITE_FARO_ENABLED` | Kill-switch explícito e independiente de la URL. Default `false`. |

Un solo proyecto de Sentry y un solo `app.name` de Faro cubren todos los entornos, diferenciados por `VITE_OBSERVABILITY_ENVIRONMENT` — no hay DSNs ni collectors separados por entorno.

## PII y scrubbing

- `sendDefaultPii: false` explícito en `Sentry.init()`, sin Session Replay.
- `beforeSend` en `sentryProvider.ts` redacta el header `Authorization` y las claves `password`/`newPassword`/`email` del body y de los breadcrumbs, para los endpoints de auth conocidos (`/auth/login`, `/auth/register`, `/auth/user-reset-password`, `/auth/user-request-password-reset`).
- `faroProvider.ts` replica el mismo criterio: el contexto se redacta antes de despacharse y de nuevo en el `beforeSend` de `initializeFaro()`, como segunda capa de defensa. Solo usa `getWebInstrumentations()` por defecto (errores, web vitals, consola, sesión, vista) — sin Session Replay ni tracing/fetch.

## Migrar a Faro

Cuando exista la URL del collector de Grafana Alloy (o Grafana Cloud):

1. Cambiar `instance.ts` para que instancie `FaroObservabilityProvider` en vez de `SentryObservabilityProvider`.
2. Configurar `VITE_FARO_URL` y `VITE_FARO_ENABLED=true` en el `.env` de cada ambiente.
3. Repetir la validación manual (ver abajo) apuntando `window.__triggerObservabilityTestError()` contra Faro.
4. Una vez confirmado en producción, remover `@sentry/react` de `package.json` y borrar `sentryProvider.ts`/`sentryProvider.test.ts`.

Ningún otro archivo de la aplicación necesita tocarse — todos dependen únicamente de la interfaz `ObservabilityProvider`.

## Validación manual

`src/services/observability/testTrigger.ts` expone `window.__triggerObservabilityTestError()` en cualquier entorno que no sea `production`.

1. Configurar `VITE_SENTRY_DSN` y `VITE_SENTRY_ENABLED=true` en el entorno de `development`.
2. Abrir el portal desplegado, abrir la consola del navegador y ejecutar `window.__triggerObservabilityTestError()`.
3. Confirmar en el proyecto de Sentry que el evento `Sentry test error` llegó con `release`, `environment`, navegador, SO, URL y stack trace correctos.

## Testing automatizado

- `sentryProvider.test.ts` / `faroProvider.test.ts`: init con las opciones correctas, no-op cuando está deshabilitado, delegación de los métodos públicos, scrubbing de PII.
- `ErrorBoundary.test.tsx`: el fallback se muestra y reporta a `observability` cuando un hijo lanza.
- `authService.test.ts` / `handleError.test.ts`: se reporta la excepción en los paths de error de auth, y explícitamente no se reporta para `SESSION_EXHAUSTED_*`.
