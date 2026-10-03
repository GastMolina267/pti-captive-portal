import axios from 'axios';
import { authService } from './authService';
import { axiosInstance } from './index';
import { observability } from './observability';

jest.mock('./index', () => ({
  axiosInstance: {
    post: jest.fn(),
  },
}));

jest.mock('./observability', () => ({
  observability: { captureException: jest.fn() },
}));

describe('authService — instrumentación de observability', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('reporta la excepción a observability cuando el registro falla', async () => {
      (axiosInstance.post as jest.Mock).mockRejectedValue(new Error('email_1 duplicate key'));

      await expect(authService.register({} as never)).rejects.toThrow();

      expect(observability.captureException).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('reporta la excepción a observability cuando las credenciales son inválidas', async () => {
      const axiosError = Object.assign(new Error('Unauthorized'), {
        isAxiosError: true,
        response: { status: 401, data: { message: 'Unauthorized' } },
      });
      (axiosInstance.post as jest.Mock).mockRejectedValue(axiosError);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(authService.login({} as never)).rejects.toThrow();

      expect(observability.captureException).toHaveBeenCalledTimes(1);
    });

    it('NO reporta a observability cuando la sesión está agotada (control de flujo esperado)', async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValue({
        data: { token: 't', hasExpiredSession: true, hasApp: true },
      });

      await expect(authService.login({} as never)).rejects.toThrow('SESSION_EXHAUSTED_HAS_APP');

      expect(observability.captureException).not.toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    it('reporta la excepción a observability cuando falla', async () => {
      (axiosInstance.post as jest.Mock).mockRejectedValue(new Error('network error'));

      await expect(authService.requestPasswordReset('user@example.com')).rejects.toThrow();

      expect(observability.captureException).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('reporta la excepción a observability cuando falla', async () => {
      (axiosInstance.post as jest.Mock).mockRejectedValue(new Error('token inválido'));

      await expect(authService.resetPassword('token', 'newPass')).rejects.toThrow();

      expect(observability.captureException).toHaveBeenCalledTimes(1);
    });
  });
});
