import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginTab from './LoginTab';
import '@testing-library/jest-dom';
import { parseUamParams } from '../utils/parseUamParams';
import { buildUamLogonUrl } from '../utils/uamChap';
import { authService } from '../services/authService';

const mockNavigate = jest.fn();
const mockLocation = { search: '?uamip=10.0.0.1&uamport=3990' };

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock('../utils/parseUamParams', () => ({
  parseUamParams: jest.fn(),
}));

jest.mock('../utils/uamChap', () => ({
  buildUamLogonUrl: jest.fn(),
}));

jest.mock('../services/authService', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('LoginTab', () => {
  const originalLocation = globalThis.location;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'location', {
      value: { href: '', origin: 'http://localhost' },
      configurable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'location', { value: originalLocation });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.location.href = '';
  });

  test('renderiza correctamente los campos de email y contraseña', () => {
    render(<LoginTab />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('permite alternar la visibilidad de la contraseña', () => {
    render(<LoginTab />);
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText(/ocultar contraseña/i));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('redirige (window.location.href) correctamente cuando los parámetros UAM son válidos', async () => {
    (parseUamParams as jest.Mock).mockReturnValue({
      ok: true,
      params: {
        uamip: '10.0.0.1',
        uamport: '80',
        challenge: '12345',
        userurl: 'http://google.com',
        redirurl: null,
      },
    });

    const expectedUrl = 'http://10.0.0.1:80/login?user=juan&pass=secret';
    (buildUamLogonUrl as jest.Mock).mockReturnValue(expectedUrl);
    (authService.login as jest.Mock).mockResolvedValue({ token: 'mock-token' });

    render(<LoginTab />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'secret' } });
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'juan',
        password: 'secret',
        macAddress: undefined,
        deviceIp: undefined,
        routerIp: '10.0.0.1',
        routerMac: undefined,
        source: 'portal',
      });
      expect(buildUamLogonUrl).toHaveBeenCalledWith(
        '10.0.0.1',
        '80',
        'juan',
        'secret',
        '12345',
        'http://localhost/',
      );
      expect(globalThis.location.href).toBe(expectedUrl);
    });
  });

  test('muestra error si parseUamParams falla', async () => {
    (parseUamParams as jest.Mock).mockReturnValue({
      ok: false,
      error: 'Faltan parámetros UAM',
    });

    render(<LoginTab />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Faltan parámetros UAM');
    });

    expect(globalThis.location.href).toBe('');
  });

  test('muestra error genérico si ocurre una excepción inesperada', async () => {
    (parseUamParams as jest.Mock).mockImplementation(() => {
      throw new Error('Error inesperado');
    });

    render(<LoginTab />);
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Error al iniciar sesión/i);
    });
  });

  test('redirige a /forgot-password conservando los parámetros UAM al hacer clic en "¿Olvidaste tu contraseña?"', () => {
    render(<LoginTab />);
    const link = screen.getByRole('button', { name: /¿olvidaste tu contraseña\?/i });
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/forgot-password',
      search: mockLocation.search,
    });
  });


  test('redirige a /session-expired-no-app si authService.login falla con SESSION_EXHAUSTED_NO_APP', async () => {
    (parseUamParams as jest.Mock).mockReturnValue({
      ok: true,
      params: {
        uamip: '10.0.0.1',
        uamport: '80',
        challenge: '12345',
        userurl: 'http://google.com',
        redirurl: null,
      },
    });

    (authService.login as jest.Mock).mockRejectedValue(new Error('SESSION_EXHAUSTED_NO_APP'));

    render(<LoginTab />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/session-expired-no-app');
    });
  });

  test('redirige a / si authService.login falla con SESSION_EXHAUSTED_HAS_APP', async () => {
    (parseUamParams as jest.Mock).mockReturnValue({
      ok: true,
      params: {
        uamip: '10.0.0.1',
        uamport: '80',
        challenge: '12345',
        userurl: 'http://google.com',
        redirurl: null,
      },
    });

    (authService.login as jest.Mock).mockRejectedValue(new Error('SESSION_EXHAUSTED_HAS_APP'));

    render(<LoginTab />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
