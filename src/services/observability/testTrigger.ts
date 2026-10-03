import { getObservabilityEnvironment } from './config';
import { observability } from './instance';

declare global {
  interface Window {
    __triggerObservabilityTestError?: () => void;
  }
}

// Expone window.__triggerObservabilityTestError() fuera de producción, para la validación manual de CA004.
export function registerObservabilityTestTrigger(): void {
  if (getObservabilityEnvironment() === 'production') return;

  window.__triggerObservabilityTestError = () => {
    observability.captureException(new Error('Sentry test error'));
  };
}
