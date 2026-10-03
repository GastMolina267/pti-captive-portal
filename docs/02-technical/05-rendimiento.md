# Rendimiento

El portal se sirve a celulares de pacientes y acompañantes conectados a la red Wi-Fi del hospital, con hardware y conectividad variables — el rendimiento de carga impacta directamente en la tasa de éxito de la autenticación. Estas son las optimizaciones vigentes y cómo mantenerlas.

## Code-splitting por ruta

[`src/routes/RouterApp.tsx`](../../src/routes/RouterApp.tsx) importa cada página con `React.lazy()` + `Suspense`, para que `/login` no descargue el código de rutas a las que el usuario todavía no navegó:

```tsx
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
```

**Al agregar una página nueva, seguir el mismo patrón** — importarla con `React.lazy()` en vez de un import estático, para no crecer el bundle inicial.

## Priorización de imágenes (LCP)

- Logo principal (`Login.tsx`): `fetchPriority="high"`, `loading="eager"`, con `width`/`height` fijos para reservar espacio antes de cargar.
- Banners publicitarios: solo el primero carga `eager`; el resto usa `loading="lazy"`.

## Bundling (`vite.config.ts`)

Las librerías de terceros se separan en chunks propios para que el navegador las cachee de forma independiente del código de la app:

```ts
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
  'vendor-swiper': ['swiper'],
}
```

## Servidor (Nginx)

`infra/nginx.conf` comprime (gzip) JS/CSS/JSON/SVG/WOFF2 y cachea estáticos hasheados por Vite (`.js`, `.css`, imágenes, fuentes) con `Cache-Control: public, max-age=31536000, immutable`.

## SEO y agentic browsing

- `index.html` fija `<meta name="description">` y el `lang` del documento.
- `public/robots.txt` y `public/llms.txt` evitan que esas rutas devuelvan el HTML dinámico de React con errores de sintaxis para crawlers.

## Cómo medir el rendimiento real

Nunca correr Lighthouse contra `pnpm dev` — Vite en modo desarrollo sirve JS sin minificar e inyecta utilidades de hot-reload, lo que da puntajes artificialmente bajos.

```bash
pnpm build
pnpm preview   # sirve el build de producción en http://localhost:4173
```

Con eso corriendo, abrir la URL en Chrome/Edge → DevTools → pestaña Lighthouse → modo **Mobile** → analizar.
