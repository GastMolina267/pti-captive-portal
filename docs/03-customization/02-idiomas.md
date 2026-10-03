# Idiomas y traducciones

## Estado actual: sin sistema de internacionalización

Este repositorio no tiene una carpeta `locales/` ni ninguna librería de i18n (`i18next`, `react-intl`, etc.). Los textos de la interfaz están **hardcodeados directamente en el JSX** de cada componente, en español.

### Traducción de mensajes de error del backend

[`src/utils/handleError.ts`](../../src/utils/handleError.ts) expone `translateErrorMessage(rawMsg, fallback)`, usada por `extractErrorMessage()` en `authService.ts` para todos los flujos de auth (login, registro, forgot/reset password). Hace matching de substring sobre el mensaje técnico que devuelve el backend (a menudo en inglés) y lo reemplaza por un mensaje fijo en español (tabla completa en [../02-technical/02-api.md](../02-technical/02-api.md)). Es una traducción puntual de mensajes de error, no un sistema de i18n de la UI en general.
