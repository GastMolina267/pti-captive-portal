import SentryObservabilityProvider from './sentryProvider';
import type { ObservabilityProvider } from './types';

export const observability: ObservabilityProvider = new SentryObservabilityProvider();
