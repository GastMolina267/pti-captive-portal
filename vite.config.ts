import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json' with { type: 'json' };

// Misma fuente que alimenta el CHANGELOG.md (semantic-release tagea sobre estos commits),
// así que no depende de que CI nos pase la versión por variable de entorno.
// `--always` ya cubre el caso de "no hay tags": devuelve el hash corto del commit.
// Solo llega al catch si no hay .git (ej. build desde un tarball) o git no está instalado.
function getAppVersion(): string {
  try {
    return execSync('git describe --tags --always').toString().trim();
  } catch {
    const fallback = `${pkg.version}-no-git`;
    console.warn(
      `[vite.config] No se pudo ejecutar "git describe" (¿falta .git o git?). Usando fallback: ${fallback}`,
    );
    return fallback;
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(getAppVersion()),
  },
  server: {
    host: '0.0.0.0', // Allow external access
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-swiper': ['swiper'],
        },
      },
    },
  },
});
