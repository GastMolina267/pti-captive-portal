import { render, screen, fireEvent, act } from '@testing-library/react';
import SessionExpiredHasApp from './SessionExpiredHasApp';
import '@testing-library/jest-dom';

jest.mock('../themes/ThemeManager', () => ({
  useThemeMode: () => ({ mode: 'light' }),
}));

describe('SessionExpiredHasApp', () => {
  const originalLocation = globalThis.location;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    Object.defineProperty(globalThis, 'location', { value: originalLocation });
  });

  test('renderiza correctamente el spinner y textos descriptivos', () => {
    Object.defineProperty(globalThis, 'location', {
      value: {
        href: '',
        origin: 'http://localhost',
        pathname: '/session-expired-has-app',
      },
      configurable: true,
      writable: true,
    });

    render(<SessionExpiredHasApp />);
    expect(screen.getByText(/Abriendo la App/i)).toBeInTheDocument();
    expect(screen.getByText(/Estamos redirigiéndote a la aplicación oficial del hospital/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir app/i })).toBeInTheDocument();
  });

  test('dispara la redirección automática después del timeout si no está en /open-app', () => {
    const mockLocation = {
      href: '',
      origin: 'http://localhost',
      pathname: '/session-expired-has-app',
    };
    Object.defineProperty(globalThis, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true,
    });

    render(<SessionExpiredHasApp />);

    expect(mockLocation.href).toBe('');

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockLocation.href).toBe('http://localhost/open-app');
  });

  test('NO dispara la redirección automática si ya está en /open-app', () => {
    const mockLocation = {
      href: '',
      origin: 'http://localhost',
      pathname: '/open-app',
    };
    Object.defineProperty(globalThis, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true,
    });

    render(<SessionExpiredHasApp />);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockLocation.href).toBe('');
  });

  test('dispara la redirección manual al presionar el botón', () => {
    const mockLocation = {
      href: '',
      origin: 'http://localhost',
      pathname: '/open-app',
    };
    Object.defineProperty(globalThis, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true,
    });

    render(<SessionExpiredHasApp />);

    const button = screen.getByRole('button', { name: /abrir app/i });
    fireEvent.click(button);

    expect(mockLocation.href).toBe('http://localhost/open-app');
  });
});
