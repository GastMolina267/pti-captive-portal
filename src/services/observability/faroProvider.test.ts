import { initializeFaro, TransportItemType } from '@grafana/faro-web-sdk';
import FaroObservabilityProvider from './faroProvider';
import { getFaroConfig } from './config';

const mockFaroApi = {
  pushError: jest.fn(),
  pushLog: jest.fn(),
  pushEvent: jest.fn(),
  setUser: jest.fn(),
  resetUser: jest.fn(),
};

jest.mock('@grafana/faro-web-sdk', () => {
  const actual = jest.requireActual('@grafana/faro-web-sdk');
  return {
    ...actual,
    getWebInstrumentations: jest.fn(() => []),
    initializeFaro: jest.fn(),
  };
});

jest.mock('./config', () => ({
  getFaroConfig: jest.fn(),
}));

const mockedGetConfig = getFaroConfig as jest.Mock;
const mockedInitializeFaro = initializeFaro as jest.Mock;

describe('FaroObservabilityProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cuando está deshabilitado o sin url', () => {
    it('no llama a initializeFaro si enabled es false', () => {
      mockedGetConfig.mockReturnValue({ enabled: false, endpoint: 'https://faro.example/collect', environment: 'test', release: '1.0.0'});
      new FaroObservabilityProvider().init();
      expect(mockedInitializeFaro).not.toHaveBeenCalled();
    });

    it('no llama a initializeFaro si no hay url', () => {
      mockedGetConfig.mockReturnValue({ enabled: true, endpoint: '', environment: 'test', release: '1.0.0' });
      new FaroObservabilityProvider().init();
      expect(mockedInitializeFaro).not.toHaveBeenCalled();
    });

    it('las llamadas al provider son no-op si nunca se inicializó', () => {
      mockedGetConfig.mockReturnValue({ enabled: false, endpoint: '', environment: 'test', release: '1.0.0' });
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.captureException(new Error('boom'));
      provider.captureMessage('hola');
      provider.setUser({ id: '1' });
      provider.addBreadcrumb({ message: 'breadcrumb' });

      expect(mockFaroApi.pushError).not.toHaveBeenCalled();
      expect(mockFaroApi.pushLog).not.toHaveBeenCalled();
      expect(mockFaroApi.setUser).not.toHaveBeenCalled();
      expect(mockFaroApi.pushEvent).not.toHaveBeenCalled();
    });
  });

  describe('cuando está habilitado', () => {
    beforeEach(() => {
      mockedGetConfig.mockReturnValue({
        enabled: true,
        endpoint: 'https://faro.example/collect',
        environment: 'development',
        release: '1.2.3',
      });
      mockedInitializeFaro.mockReturnValue({ api: mockFaroApi });
    });

    it('inicializa Faro con url, app (name/environment/version) y session tracking', () => {
      new FaroObservabilityProvider().init();

      expect(mockedInitializeFaro).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://faro.example/collect',
          app: { name: 'vitalia-captive-portal', environment: 'development', version: '1.2.3' },
          sessionTracking: { enabled: true },
        }),
      );
    });

    it('delega captureException en faro.api.pushError con el error normalizado y el contexto', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();
      const error = new Error('falló el login');

      provider.captureException(error, { extra: { fallback: 'msg' }, tags: { flow: 'login' } });

      expect(mockFaroApi.pushError).toHaveBeenCalledWith(error, {
        context: { flow: 'login', fallback: 'msg' },
      });
    });

    it('normaliza a Error cuando captureException recibe algo que no es un Error', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.captureException('string plano');

      expect(mockFaroApi.pushError).toHaveBeenCalledWith(expect.any(Error), { context: undefined });
      expect((mockFaroApi.pushError.mock.calls[0][0] as Error).message).toBe('string plano');
    });

    it('delega captureMessage con nivel por defecto info', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.captureMessage('algo pasó');

      expect(mockFaroApi.pushLog).toHaveBeenCalledWith(['algo pasó'], { level: 'info', context: undefined });
    });

    it('delega setUser y resetUser según corresponda', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.setUser({ id: 'user-1' });
      expect(mockFaroApi.setUser).toHaveBeenCalledWith({ id: 'user-1' });

      provider.setUser(null);
      expect(mockFaroApi.resetUser).toHaveBeenCalled();
    });

    it('delega addBreadcrumb en pushEvent con nombre y dominio (category)', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.addBreadcrumb({ message: 'click', category: 'ui' });

      expect(mockFaroApi.pushEvent).toHaveBeenCalledWith('click', undefined, 'ui');
    });

    it('el beforeSend redacta claves sensibles del context de una excepción', () => {
      new FaroObservabilityProvider().init();
      const { beforeSend } = mockedInitializeFaro.mock.calls[0][0];

      const item = {
        type: TransportItemType.EXCEPTION,
        payload: { context: { email: 'user@example.com', flow: 'login' } },
        meta: {},
      };

      const result = beforeSend(item);

      expect(result.payload.context.email).toBe('[Filtered]');
      expect(result.payload.context.flow).toBe('login');
    });

    it('el beforeSend redacta claves sensibles de attributes en eventos', () => {
      new FaroObservabilityProvider().init();
      const { beforeSend } = mockedInitializeFaro.mock.calls[0][0];

      const item = {
        type: TransportItemType.EVENT,
        payload: { name: 'click', attributes: { password: 'super-secret', category: 'ui' } },
        meta: {},
      };

      const result = beforeSend(item);

      expect(result.payload.attributes.password).toBe('[Filtered]');
      expect(result.payload.attributes.category).toBe('ui');
    });

    it('el beforeSend redacta el campo newPassword (camelCase) del context', () => {
      new FaroObservabilityProvider().init();
      const { beforeSend } = mockedInitializeFaro.mock.calls[0][0];

      const item = {
        type: TransportItemType.EXCEPTION,
        payload: { context: { newPassword: 'super-secret' } },
        meta: {},
      };

      const result = beforeSend(item);

      expect(result.payload.context.newPassword).toBe('[Filtered]');
    });

    it('captureException scrubbea claves sensibles del contexto antes de enviarlo', () => {
      const provider = new FaroObservabilityProvider();
      provider.init();

      provider.captureException(new Error('falló'), { extra: { password: 'super-secret' } });

      expect(mockFaroApi.pushError).toHaveBeenCalledWith(expect.any(Error), {
        context: { password: '[Filtered]' },
      });
    });
  });
});
