import * as Sentry from '@sentry/react';
import { getSentryConfig } from './config';
import type {
  ObservabilityBreadcrumb,
  ObservabilityContext,
  ObservabilityLevel,
  ObservabilityProvider,
  ObservabilityUser,
} from './types';

const SCRUBBED_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/user-reset-password',
  '/auth/user-request-password-reset',
];
const SCRUBBED_KEYS: Set<string> = new Set(['password', 'newpassword', 'email', 'authorization']);
const REDACTED = '[Filtered]';

function isAuthEndpointUrl(url: unknown): boolean {
  return typeof url === 'string' && SCRUBBED_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function scrubKeys(data: unknown): unknown {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const clone: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    if (SCRUBBED_KEYS.has(key.toLowerCase())) {
      clone[key] = REDACTED;
    }
  }
  return clone;
}

function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.request?.headers?.Authorization) {
    event.request.headers.Authorization = REDACTED;
  }

  if (isAuthEndpointUrl(event.request?.url) && event.request?.data) {
    event.request.data = scrubKeys(event.request.data);
  }

  event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => {
    if (isAuthEndpointUrl(breadcrumb.data?.url) && breadcrumb.data) {
      return { ...breadcrumb, data: { ...breadcrumb.data, body: scrubKeys(breadcrumb.data.body) } };
    }
    return breadcrumb;
  });

  return event;
}

class SentryObservabilityProvider implements ObservabilityProvider {
  private initialized = false;

  init(): void {
    const cfg = getSentryConfig();

    if (!cfg.enabled || !cfg.endpoint) {
      console.info('[observability] Sentry deshabilitado (VITE_SENTRY_ENABLED/VITE_SENTRY_DSN no configurados)');
      return;
    }

    Sentry.init({
      dsn: cfg.endpoint,
      environment: cfg.environment,
      release: cfg.release,
      sampleRate: 1,
      sendDefaultPii: false,
      beforeSend: (event) => scrubEvent(event),
    });

    this.initialized = true;
  }

  captureException(error: unknown, context?: ObservabilityContext): void {
    if (!this.initialized) return;
    Sentry.captureException(error, { extra: context?.extra, tags: context?.tags });
  }

  captureMessage(message: string, level: ObservabilityLevel = 'info', context?: ObservabilityContext): void {
    if (!this.initialized) return;
    Sentry.captureMessage(message, { level, extra: context?.extra, tags: context?.tags });
  }

  setUser(user: ObservabilityUser | null): void {
    if (!this.initialized) return;
    Sentry.setUser(user);
  }

  addBreadcrumb(breadcrumb: ObservabilityBreadcrumb): void {
    if (!this.initialized) return;
    Sentry.addBreadcrumb(breadcrumb);
  }
}

export default SentryObservabilityProvider;
