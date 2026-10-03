import { handleError, translateErrorMessage } from './handleError';
import { observability } from '../services/observability';

jest.mock('../services/observability', () => ({
  observability: {
    captureException: jest.fn(),
  },
}));

describe('handleError', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reporta la excepción a observability con el mensaje de contexto', () => {
    const error = new Error('algo falló');

    handleError(error, 'Error al verificar UAM');

    expect(observability.captureException).toHaveBeenCalledWith(error, {
      extra: { message: 'Error al verificar UAM' },
    });
  });

  it('devuelve el mensaje traducido para errores comunes', () => {
    const error = new Error('Invalid credentials');

    const result = handleError(error, 'Error al verificar UAM');

    expect(result).toBe('Correo electrónico o contraseña incorrectos.');
  });
});

describe('translateErrorMessage', () => {
  it('devuelve el fallback si no hay mensaje', () => {
    expect(translateErrorMessage('')).toBe('Ocurrió un error inesperado');
  });
});
