# Monitoreo

## Alcance

Este repositorio es una SPA estática servida por Nginx. No corre procesos de aplicación en el servidor — el monitoreo relevante se divide en: (1) salud del contenedor/Nginx, (2) calidad/cobertura de código en CI, y (3) eventos de negocio reportados al backend (`/indicators`). Para errores de runtime del cliente (excepciones JS, crashes de React), ver [../02-technical/06-observabilidad.md](../02-technical/06-observabilidad.md).

## 1. Salud del servicio (Nginx)

`infra/nginx.conf` expone:

```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

```bash
curl -f http://<host>:3000/health
```

Este endpoint solo confirma que Nginx está sirviendo tráfico — no valida que el bundle de React cargue correctamente ni que el backend de negocio (`VITE_BASE_URL`) esté accesible. Para un smoke test más completo, verificar además que `GET /` devuelva `index.html` con status 200 y que el bundle JS (`/assets/*.js`) sea alcanzable.

Si se despliega en un orquestador (Kubernetes, ECS, Nomad), el healthcheck debe configurarse a nivel de esa plataforma apuntando a `/health` — el `Dockerfile` no declara una directiva `HEALTHCHECK` nativa.

## 2. Logs de acceso y error de Nginx

Nginx (imagen `nginx:alpine`) escribe a stdout/stderr, capturables por `docker logs` o el driver de logging del orquestador. `location /health` tiene `access_log off` para no ensuciar los logs con probes periódicos.

```bash
docker logs -f <container_id>
```

## 3. Analítica de uso

`index.html` no incluye ninguna herramienta de analítica de tráfico agregado (pageviews, embudo de conversión) — el único monitoreo de uso real disponible son los eventos de negocio de `/indicators` (sección siguiente).

## 4. Eventos de negocio (`/indicators`)

El frontend reporta eventos de interacción con publicidades al backend vía [`advertisementTracking.ts`](../../src/services/advertisementTracking.ts): `view`, `click`, `view-more` y retención. Son **fire-and-forget** — si fallan, solo se loguean con `console.error` en el navegador del cliente. El monitoreo real de estos indicadores (dashboards de efectividad publicitaria) vive del lado del backend/BI.

## 5. CI: cobertura y calidad estática

El workflow [`00-pull-request-validation.yaml`](../../.github/workflows/00-pull-request-validation.yaml) es la fuente de verdad de calidad de código en cada PR:

- `pnpm test:cov` genera reporte de cobertura en `coverage/unit/lcov.info`, enviado a **SonarQube**.
- El job `security` corre auditoría de dependencias (`pnpm audit`) y **Gitleaks**.

Para monitorear la salud del proyecto a nivel de repositorio, revisar el dashboard de SonarQube y los checks de cada PR en GitHub Actions.
