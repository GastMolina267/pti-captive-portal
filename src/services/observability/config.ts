export interface ObservabilityConfig {
  endpoint: string;
  enabled: boolean;
  environment: string;
  release: string;
}

export function getObservabilityEnvironment(): string {
  return import.meta.env.VITE_OBSERVABILITY_ENVIRONMENT || 'local';
}

function getObservabilityRelease(): string {
  return import.meta.env.VITE_APP_VERSION || 'unknown';
}

export function getSentryConfig(): ObservabilityConfig {
  return {
    endpoint: import.meta.env.VITE_SENTRY_DSN ?? '',
    enabled: import.meta.env.VITE_SENTRY_ENABLED === 'true',
    environment: getObservabilityEnvironment(),
    release: getObservabilityRelease(),
  };
}

// Config del futuro reemplazo de Sentry (ver faroProvider.ts). No usado todavía por `instance.ts`.
export function getFaroConfig(): ObservabilityConfig {
  return {
    endpoint: import.meta.env.VITE_FARO_URL ?? '',
    enabled: import.meta.env.VITE_FARO_ENABLED === 'true',
    environment: getObservabilityEnvironment(),
    release: getObservabilityRelease(),
  };
}
