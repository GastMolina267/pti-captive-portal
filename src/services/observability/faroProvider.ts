import { getWebInstrumentations, initializeFaro, LogLevel, type Faro, type TransportItem } from '@grafana/faro-web-sdk';
import { getFaroConfig } from './config';
import type {
  ObservabilityBreadcrumb,
  ObservabilityContext,
  ObservabilityLevel,
  ObservabilityProvider,
  ObservabilityUser,
} from './types';

const SCRUBBED_KEYS: Set<string> = new Set(['password', 'newpassword', 'email', 'authorization']);
const REDACTED = '[Filtered]';

const LEVEL_TO_FARO: Record<ObservabilityLevel, LogLevel> = {
  info: LogLevel.INFO,
  warning: LogLevel.WARN,
  error: LogLevel.ERROR,
};

function scrubStringRecord(record: Record<string, string>): Record<string, string> {
  const clone = { ...record };
  for (const key of Object.keys(clone)) {
    if (SCRUBBED_KEYS.has(key.toLowerCase())) {
      clone[key] = REDACTED;
    }
  }
  return clone;
}

// Defensa en profundidad: por si algún día se agrega una instrumentación que capture
// datos de request/formularios, además del scrubbing explícito en toFaroContext().
function scrubItem(item: TransportItem): TransportItem {
  const payload = item.payload as { context?: Record<string, string>; attributes?: Record<string, string> };

  if (payload.context) {
    payload.context = scrubStringRecord(payload.context);
  }
  if (payload.attributes) {
    payload.attributes = scrubStringRecord(payload.attributes);
  }

  return item;
}

function toFaroContext(context?: ObservabilityContext): Record<string, string> | undefined {
  if (!context?.tags && !context?.extra) return undefined;

  const merged: Record<string, string> = { ...context.tags };
  for (const [key, value] of Object.entries(context.extra ?? {})) {
    merged[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  return scrubStringRecord(merged);
}

class FaroObservabilityProvider implements ObservabilityProvider {
  private faro: Faro | null = null;

  init(): void {
    const cfg = getFaroConfig();

    if (!cfg.enabled || !cfg.endpoint) {
      console.info('[observability] Faro deshabilitado (VITE_FARO_ENABLED/VITE_FARO_URL no configurados)');
      return;
    }

    this.faro = initializeFaro({
      url: cfg.endpoint,
      app: {
        name: 'vitalia-captive-portal',
        environment: cfg.environment,
        version: cfg.release,
      },
      sessionTracking: { enabled: true },
      instrumentations: getWebInstrumentations(),
      beforeSend: (item) => scrubItem(item),
    });
  }

  captureException(error: unknown, context?: ObservabilityContext): void {
    if (!this.faro) return;
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    this.faro.api.pushError(normalizedError, { context: toFaroContext(context) });
  }

  captureMessage(message: string, level: ObservabilityLevel = 'info', context?: ObservabilityContext): void {
    if (!this.faro) return;
    this.faro.api.pushLog([message], { level: LEVEL_TO_FARO[level], context: toFaroContext(context) });
  }

  setUser(user: ObservabilityUser | null): void {
    if (!this.faro) return;
    if (user) {
      this.faro.api.setUser({ id: user.id });
    } else {
      this.faro.api.resetUser();
    }
  }

  addBreadcrumb(breadcrumb: ObservabilityBreadcrumb): void {
    if (!this.faro) return;
    this.faro.api.pushEvent(breadcrumb.message, undefined, breadcrumb.category);
  }
}

export default FaroObservabilityProvider;
