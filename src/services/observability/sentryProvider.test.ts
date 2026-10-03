import * as Sentry from '@sentry/react';
import SentryObservabilityProvider from './sentryProvider';
import { getSentryConfig } from './config';

jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

jest.mock('./config', () => ({
  getSentryConfig: jest.fn(),
}));

const mockedGetConfig = getSentryConfig as jest.Mock;

describe('SentryObservabilityProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cuando está deshabilitado o sin endpoint', () => {
    it('no llama a Sentry.init si enabled es false', () => {
      mockedGetConfig.mockReturnValue(
        {
          enabled: false,
          endpoint: 'https://test@sentry.io/1',
          environment: 'test',
          release: '1.0.0'
        }
      );
      new SentryObservabilityProvider().init();
      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it('no llama a Sentry.init si no hay endpoint', () => {
      mockedGetConfig.mockReturnValue(
        {
          enabled: true,
          endpoint: '',
          environment: 'test',
          release: '1.0.0'
        }
      );
      new SentryObservabilityProvider().init();
      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it('las llamadas al provider son no-op si nunca se inicializó', () => {
      mockedGetConfig.mockReturnValue(
        {
          enabled: false,
          endpoint: '',
          environment: 'test',
          release: '1.0.0'
        }
      );
      const provider = new SentryObservabilityProvider();
      provider.init();

      provider.captureException(new Error('boom'));
      provider.captureMessage('hola');
      provider.setUser({ id: '1' });
      provider.addBreadcrumb({ message: 'breadcrumb' });

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
      expect(Sentry.setUser).not.toHaveBeenCalled();
      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });
  });

  describe('cuando está habilitado', () => {
    beforeEach(() => {
      mockedGetConfig.mockReturnValue(
        {
          enabled: true,
          endpoint: 'https://test@sentry.io/1',
          environment: 'development',
          release: '1.2.3',
        }
      );
    });

    it('inicializa Sentry con dsn, environment, release y sendDefaultPii en false', () => {
      new SentryObservabilityProvider().init();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: 'https://test@sentry.io/1',
          environment: 'development',
          release: '1.2.3',
          sendDefaultPii: false,
        }),
      );
    });

    it('delega captureException en Sentry.captureException con extra/tags', () => {
      const provider = new SentryObservabilityProvider();
      provider.init();
      const error = new Error('falló el login');

      provider.captureException(error, { extra: { fallback: 'msg' }, tags: { flow: 'login' } });

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: { fallback: 'msg' },
        tags: { flow: 'login' },
      });
    });

    it('delega captureMessage con nivel por defecto info', () => {
      const provider = new SentryObservabilityProvider();
      provider.init();

      provider.captureMessage('algo pasó');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('algo pasó', expect.objectContaining({ level: 'info' }));
    });

    it('delega setUser y addBreadcrumb', () => {
      const provider = new SentryObservabilityProvider();
      provider.init();

      provider.setUser({ id: 'user-1' });
      provider.addBreadcrumb({ message: 'click', category: 'ui' });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'user-1' });
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({ message: 'click', category: 'ui' });
    });

    it('el beforeSend redacta el header Authorization y campos sensibles de endpoints de auth', () => {
      new SentryObservabilityProvider().init();
      const { beforeSend } = (Sentry.init as jest.Mock).mock.calls[0][0];

      const event = {
        request: {
          url: 'https://portal.example/auth/login',
          headers: { Authorization: 'Bearer secret-token' },
          data: { email: 'user@example.com', password: 'super-secret' },
        },
      };

      const result = beforeSend(event);

      expect(result.request.headers.Authorization).toBe('[Filtered]');
      expect(result.request.data.password).toBe('[Filtered]');
      expect(result.request.data.email).toBe('[Filtered]');
    });

    it('el beforeSend redacta el campo newPassword (camelCase) del body de request', () => {
      new SentryObservabilityProvider().init();
      const { beforeSend } = (Sentry.init as jest.Mock).mock.calls[0][0];

      const event = {
        request: {
          url: 'https://portal.example/auth/user-reset-password',
          data: { newPassword: 'super-secret' },
        },
      };

      const result = beforeSend(event);

      expect(result.request.data.newPassword).toBe('[Filtered]');
    });

    it('el beforeSend redacta el body de breadcrumbs de endpoints de auth', () => {
      new SentryObservabilityProvider().init();
      const { beforeSend } = (Sentry.init as jest.Mock).mock.calls[0][0];

      const event = {
        request: { url: 'https://portal.example/' },
        breadcrumbs: [
          { data: { url: '/auth/register', body: { password: 'super-secret' } } },
          { data: { url: '/benefits', body: { foo: 'bar' } } },
        ],
      };

      const result = beforeSend(event);

      expect(result.breadcrumbs[0].data.body.password).toBe('[Filtered]');
      expect(result.breadcrumbs[1].data.body.foo).toBe('bar');
    });

    it('el beforeSend no toca requests que no son de endpoints de auth', () => {
      new SentryObservabilityProvider().init();
      const { beforeSend } = (Sentry.init as jest.Mock).mock.calls[0][0];

      const event = {
        request: {
          url: 'https://portal.example/benefits',
          data: { email: 'user@example.com' },
        },
      };

      const result = beforeSend(event);

      expect(result.request.data.email).toBe('user@example.com');
    });
  });
});
