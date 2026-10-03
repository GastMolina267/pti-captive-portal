# Temas, logos y apariencia

> El código de UI vive directamente en `src/` (no hay una carpeta `frontend/` separada). Este documento cubre cómo cambiar colores, tipografía, modo oscuro/claro y logos sin tocar la lógica de negocio.

## Modo claro/oscuro

Todo el mecanismo vive en [`src/themes/ThemeManager.tsx`](../../src/themes/ThemeManager.tsx):

- Expone un `ThemeContext` con `{ mode: 'light' | 'dark', toggleTheme: () => void }`, accesible vía el hook `useThemeMode()`.
- El modo inicial se lee de `localStorage.getItem('vitalia_theme')`; si no hay valor guardado, arranca en `'light'`.
- Al cambiar el modo, `ThemeManager` setea `document.documentElement[data-theme]`, agrega la clase `light-mode`/`dark-mode` a `document.body`, y persiste el nuevo modo en `localStorage.vitalia_theme`.
- El único control de UI es el botón en [`Header.tsx`](../../src/components/layout/Header.tsx) (ícono `Moon`/`Sun` de `lucide-react`). Como `Header` no se renderiza en las páginas de login/forgot/reset/session-expired, esas pantallas heredan el modo guardado pero no ofrecen forma de cambiarlo desde ahí.

## Colores y tipografía (tema MUI)

El tema de Material UI se define en `ThemeManager.tsx`, generado dinámicamente por modo (`useMemo` con `mode` como dependencia).

Para cambiar la paleta de marca, editar estos valores en el `useMemo` de `ThemeManager.tsx`, ajustando ambas variantes (`light`/`dark`) de cada color de fondo/texto.

### Tipografía — auto-hospedada, sin CDN externo

La fuente se empaqueta vía el paquete npm `@fontsource/plus-jakarta-sans`, importado en [`src/main.tsx`](../../src/main.tsx):

La app no depende de conectividad a Internet para cargar las tipografías — quedan empaquetadas en `dist/assets/*.woff2`, lo que simplifica el walled garden del router (ver [../01-deployment/03-configuracion-red.md](../01-deployment/03-configuracion-red.md)).

Para cambiar de fuente: instalar el paquete `@fontsource/<nueva-fuente>`, actualizar los imports en `main.tsx` y el valor de `fontFamily` en `ThemeManager.tsx`.

## Favicon y metadata

`public/favicon.svg` (con `public/favicon.ico` como alternativa), referenciados en `index.html`. El título de la pestaña es **"Vitalia · Wi-Fi para pacientes"**. La guía completa de marca está en [03-identidad-visual.md](03-identidad-visual.md).

## Deep-linking a la app nativa

[`public/.well-known/assetlinks.json`](../../public/.well-known/assetlinks.json) declara Android App Links hacia el paquete `com.vitalia.app`, usado por el flujo de `/open-app` ([`SessionExpiredHasApp.tsx`](../../src/pages/SessionExpiredHasApp.tsx)). Si se cambia el package name o los certificados de firma de la app Android, este archivo debe actualizarse en conjunto (los `sha256_cert_fingerprints` deben coincidir con el certificado real de firma del APK/AAB publicado).
