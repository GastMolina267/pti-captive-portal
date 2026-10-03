export interface ObservabilityUser {
  id: string;
}

export interface ObservabilityContext {
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
}

export type ObservabilityLevel = 'info' | 'warning' | 'error';

export interface ObservabilityBreadcrumb {
  message: string;
  category?: string;
  level?: ObservabilityLevel;
}

export interface ObservabilityProvider {
  init(): void;
  captureException(error: unknown, context?: ObservabilityContext): void;
  captureMessage(message: string, level?: ObservabilityLevel, context?: ObservabilityContext): void;
  setUser(user: ObservabilityUser | null): void;
  addBreadcrumb(breadcrumb: ObservabilityBreadcrumb): void;
}
