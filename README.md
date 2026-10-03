# Vitalia · Portal Cautivo

Portal cautivo de la red Wi-Fi de pacientes (VLAN 20) de **Vitalia — Ecosistema Digital Hospitalario**, Proyecto Tecnológico Integrador (Ingeniería Informática, UBP).

SPA en React + Vite + TypeScript que autentica al paciente y habilita su acceso a la red mediante el protocolo UAM/CHAP del router Teltonika RUT956.

## 🚀 Inicio rápido

### Opción 1: Docker (recomendado para el Edge Gateway)

```bash
# Construir la imagen de producción
docker build -t vitalia-captive-portal .

# Ejecutar el contenedor (Nginx en el puerto 3000)
docker run -p 3000:3000 --name vitalia-captive-portal vitalia-captive-portal
```

### Opción 2: Desarrollo local

```bash
pnpm install
cp .env.example .env   # completar VITE_BASE_URL con la API del Edge Gateway
pnpm dev
```

- Desarrollo: http://localhost:4173
- Preview de producción: `pnpm build && pnpm preview`

## 📚 Documentación

Ver [`docs/`](docs/README.md). La identidad visual compartida con el Backoffice y la landing está en [`docs/03-customization/03-identidad-visual.md`](docs/03-customization/03-identidad-visual.md).
