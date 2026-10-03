# Base de datos

## Alcance

Este repositorio (**frontend SPA**) **no contiene ninguna base de datos, ORM, migración ni esquema propio**. Toda persistencia de usuarios, sesiones, publicidades e indicadores vive en el **backend de negocio** (API NestJS del Edge Gateway, con PostgreSQL), fuera de este repositorio.

> Lo que sigue es el **modelo de datos tal como lo consume el frontend**, inferido de las interfaces TypeScript y los payloads de [02-api.md](02-api.md) — es un contrato de API, no un esquema de base de datos.

## Modelo de datos inferido (vista del cliente)

### Usuario (`src/interfaces/userInterface.ts`)

```ts
interface User {
  id: string;
  email: string;
  token: string | null;
  createdAt: Date;
  isActive: boolean;
}
```

Campos que el frontend **envía** al registrar (no necesariamente lo que persiste el backend 1:1):

```ts
{
  email: string;
  password: string;        // se asume hasheada server-side, nunca se persiste en el cliente
  macAddress?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;       // formato YYYY-MM-DD
  person: {
    firstName: string;
    lastName: string;
    phone: string;
  }
}
```

### Publicidad (`src/interfaces/advertisingIntefaces.ts`)

```ts
interface Advertisement {
  id: string;
  name: string;
  file?: { fileUrl: string };
  description: string;
  showPortal: boolean;
  url?: string;
  zones?: { pointsList: string }[];   // polígonos de geofencing, uno o más por publicidad
  start: string;                       // fecha ISO de inicio de vigencia
  end: string;                         // fecha ISO de fin de vigencia
  schedules?: { day: number; startTime: string; endTime: string }[];  // franjas horarias por día de semana
}
```

Variante reducida `FilteredAdvertisement` (usada en `/advertisements/filter/by-locations`):

```ts
interface FilteredAdvertisement {
  id: string;
  name: string;
  url: string;
  duration: number | null;
  file: { id: string; name: string; fileUrl: string };
}
```

### Indicadores/eventos de tracking

No hay una interfaz TypeScript dedicada; el payload enviado (ver [02-api.md](02-api.md)) sugiere una tabla de eventos con forma aproximada:

```txt
indicator_event {
  advertisementId: string (FK)
  platform: string           # siempre 'portal' desde este frontend
  userId?: string
  zoneId?: string
  lat?: number
  lng?: number
  actionType?: string        # 'view' en el caso de retención
  startTime?: timestamp
  endTime?: timestamp
}
```

## Persistencia del lado del cliente

Lo único que este repositorio persiste es en el **navegador**, no en una base de datos:

| Storage | Clave | Contenido | Dónde |
| --- | --- | --- | --- |
| `localStorage` | `authToken` | JWT devuelto por `/auth/login` o `/auth/register` | `authService.ts`, leído por `axiosInstance.ts` |
| `localStorage` | `vitalia_theme` | Preferencia de tema visual (`'light'` \| `'dark'`) | [`ThemeManager.tsx`](../../src/themes/ThemeManager.tsx) — ver [../03-customization/01-temas.md](../03-customization/01-temas.md) |

No hay cookies, IndexedDB, ni cache de service worker configurados en este repo.

## Backups y migraciones

No aplican a este repositorio — remitirse al repositorio del backend para backups/migraciones de base de datos reales.
