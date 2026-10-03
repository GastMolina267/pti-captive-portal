# Configuración de red

> Este repositorio **no contiene** reglas de `iptables`/`nftables` ni configuración de `dnsmasq` — esa configuración vive en el router **Teltonika RUT956** (administrada vía su propia interfaz UCI/LuCI/RutOS). Este documento describe cómo debe estar configurada la red que rodea al portal para que la SPA funcione correctamente.

## Flujo de red esperado (a alto nivel)

```txt
[Dispositivo cliente WiFi]
      │  (sin autenticar, tráfico HTTP interceptado)
      ▼
[Router Teltonika RUT956 — NAS UAM]
      │  redirige a la SPA con query params (uamip, uamport, challenge, mac, userurl, redirurl)
      ▼
[Portal cautivo SPA — este repo, servido por Nginx en :3000]
      │  login/registro → axios → backend de negocio (VITE_BASE_URL)
      │  al autenticar → construye URL de "logon" y redirige el navegador
      ▼
[Router RUT956 — endpoint /logon en uamip:uamport]
      │  valida CHAP, habilita la MAC del cliente en la whitelist
      ▼
[Internet]
```

## Requisitos de firewall / NAT en el router

Estas reglas se configuran **en el RUT956**, no en este repo:

1. **Walled garden (lista blanca pre-autenticación)**: mientras el cliente no está autenticado, el router debe permitir tráfico HTTP/HTTPS hacia el host donde se sirve esta SPA y hacia el backend de negocio (`VITE_BASE_URL`), para que `LoginTab`/`RegisterTab` puedan llamar a `/auth/login` y `/auth/register` antes de que el dispositivo tenga acceso completo a Internet. No es necesario permitir CDNs externos: la tipografía se auto-hospeda vía `@fontsource/plus-jakarta-sans`, empaquetada en el propio bundle. Los destinos de anuncios de terceros (`ad.url`) tampoco necesitan estar en el walled garden — solo son alcanzables una vez el usuario ya se autenticó.
2. **Redirección transparente (DNAT)**: todo el tráfico HTTP no autenticado del cliente debe redirigirse (vía `dnsmasq` + reglas NAT del router, estándar en CoovaChilli/ChilliSpot) hacia la URL de esta SPA, con los parámetros UAM anexados por el firmware del router.
3. **Puerto UAM**: el puerto por defecto esperado por el frontend si el router no lo especifica es **3990** (fallback en [`src/utils/parseUamParams.ts`](../../src/utils/parseUamParams.ts)). Si el RUT956 usa otro puerto, debe enviarse explícitamente como parámetro `uamport`.
4. **Endpoint de logon**: el router debe exponer `GET http://{uamip}:{uamport}/logon` aceptando los parámetros que construye [`buildUamLogonUrl`](../../src/utils/uamChap.ts): `username`, `password`, `response`, `md`, `challenge`, `userurl`, `redirurl`.

## Parámetros UAM que el router debe inyectar

| Parámetro | Uso en el frontend | Obligatorio |
| --- | --- | --- |
| `uamip` | IP del NAS/router al que se redirige el logon | Sí — sin este parámetro la app muestra error y no permite continuar |
| `uamport` | Puerto del servicio UAM en el router | No (default `3990`) |
| `challenge` | Challenge hex para calcular la respuesta CHAP (MD5) | No — si falta, se hace login sin CHAP |
| `mac` | MAC address del dispositivo cliente | No |
| `ip` | IP del dispositivo cliente — se envía al backend como `deviceIp` en `/auth/login` | No |
| `called` | Identificador del router/AP — se envía al backend como `routerMac` en `/auth/login` | No |
| `userurl` / `redirurl` | URL original que el usuario intentaba visitar, para redirigir tras autenticar | No |
| `ssl` | Indicador de si el logon debe hacerse sobre HTTPS | No |

> A diferencia de `uamip`/`uamport`, los parámetros `ip` y `called` se leen sin nombre alternativo de fallback — el router debe inyectarlos exactamente con esos nombres.

## Puerto de escucha de la SPA

El contenedor Nginx que sirve el build de producción escucha en el **puerto 3000** ([`infra/nginx.conf`](../../infra/nginx.conf)) — el router/firewall debe redirigir tráfico hacia ese puerto (ver [04-docker.md](04-docker.md)).

## DNS

No hay configuración de `dnsmasq` en este repositorio. La resolución DNS previa a la autenticación es responsabilidad de la configuración DNS del router RUT956 / walled garden, típicamente redirigiendo cualquier consulta DNS del cliente no autenticado hacia sí mismo o hacia el servidor de la SPA.
