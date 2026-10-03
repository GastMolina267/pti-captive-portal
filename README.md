# BusDigital Cautive Portal

User login service for a bus fleet | Frontend application for the project

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Producción recomendado)

```bash
# Construir imagen de producción
docker build -t busdigital-captive-portal .

# Ejecutar el contenedor (sirve build en puerto 4173)
docker run -p 4173:4173 --name busdigital-captive-portal busdigital-captive-portal
```

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias
pnpm install  # o npm install

# Ejecutar en desarrollo
pnpm dev      # o npm run dev
```

- Desarrollo: http://localhost:5173
- Preview producción local (opcional): `pnpm build && pnpm preview` → http://localhost:4173
