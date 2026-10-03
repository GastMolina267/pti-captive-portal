import axios from 'axios';
import { axiosInstance } from './index';
import { observability } from './observability';
import { translateErrorMessage } from '../utils';

interface RegisterData {
  email: string;
  password: string;
  macAddress?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  person: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  deviceIp?: string;
  routerIp?: string;
  routerMac?: string;
  source?: string;
}

interface LoginData {
  email: string;
  password: string;
  macAddress?: string;
  deviceIp?: string;
  routerIp?: string;
  routerMac?: string;
  source?: string;
}

interface RegisterResponse extends LoginResponse {
  message: string;
}

interface RequestVerificationResponse {
  success: boolean;
  message: string;
}

interface VerifyCodeResponse {
  success: boolean;
}

interface LoginResponse {
  token: string;
  hasApp?: boolean;
  hasExpiredSession?: boolean;
}

interface RUT956Params {
  uamip?: string;
  uamport?: string;
  challenge?: string;
  userurl?: string;
  redirurl?: string;
  mac?: string;
  uamsecret?: string;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  let rawMsg = fallback;
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    const top = data?.message;
    if (typeof top === 'string' && top) rawMsg = top;
    else if (Array.isArray(top)) rawMsg = top.map(String).join('. ');
    else if (typeof data?.error?.message === 'string' && data.error.message) rawMsg = data.error.message;
    else if (typeof data?.error === 'string' && data.error) rawMsg = data.error;
    else if (typeof data === 'string' && data) rawMsg = data;
    else if (err.message) rawMsg = err.message;
  } else if (err instanceof Error) {
    rawMsg = err.message;
  }
  observability.captureException(err, { extra: { fallback } });
  return translateErrorMessage(rawMsg, fallback);
}

export const authService = {
  getRUT956Params: (): RUT956Params => {
    const pick = (p1: string, p2?: string) =>
      urlParams.get(p1) ?? (p2 ? urlParams.get(p2) : null) ?? undefined;
    const urlParams = new URLSearchParams(globalThis.location.search);

    return {
      uamip: pick('uamip'),
      uamport: pick('uamport'),
      challenge: pick('challenge'),
      userurl: pick('userurl'),
      redirurl: pick('redirurl'),
      mac: pick('mac'),
      uamsecret: pick('uamsecret'),
    };
  },
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const {
        data: { token, message },
      } = await axiosInstance.post<RegisterResponse>('/auth/register', data);

      localStorage.setItem('authToken', token);

      return { token, message };
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Error al registrar usuario'));
    }
  },
  requestVerificationCode: async (phoneNumber: string): Promise<RequestVerificationResponse> => {
    try {
      const response = await axiosInstance.post('/auth/request-code', { phoneNumber });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ??
          (err.response?.data && typeof err.response.data === 'string'
            ? err.response.data
            : 'Error desconocido');
        throw new Error(errorMessage);
      }
      throw err;
    }
  },
  verifyCode: async (phoneNumber: string, code: string): Promise<VerifyCodeResponse> => {
    try {
      const response = await axiosInstance.post('/auth/verify-code', { phoneNumber, code });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ??
          (err.response?.data && typeof err.response.data === 'string'
            ? err.response.data
            : 'Error desconocido');
        throw new Error(errorMessage);
      }
      throw err;
    }
  },
  login: async (data: LoginData): Promise<LoginResponse | null> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
      const { token, hasExpiredSession, hasApp } = response.data;

      if (hasExpiredSession) {
        if (hasApp) {
          throw new Error('SESSION_EXHAUSTED_HAS_APP');
        } else {
          throw new Error('SESSION_EXHAUSTED_NO_APP');
        }
      }

      localStorage.setItem('authToken', token);

      return response.data;
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message === 'SESSION_EXHAUSTED_HAS_APP' ||
          err.message === 'SESSION_EXHAUSTED_NO_APP')
      ) {
        throw err;
      }
      throw new Error(extractErrorMessage(err, 'Credenciales inválidas'));
    }
  },
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post<{ message: string }>('/auth/user-request-password-reset', {
        email,
        origin: 'portal',
      });
      return response.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Error al solicitar restablecimiento de contraseña'));
    }
  },
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post<{ message: string }>('/auth/user-reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Error al restablecer contraseña'));
    }
  },
};
