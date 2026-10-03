import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from './ResetPassword';
import { authService } from '../services/authService';

const mockNavigate = jest.fn();
let mockSearchParams = new globalThis.URLSearchParams('?token=mock-token-123');

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

jest.mock('../services/authService', () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

jest.mock('../themes/ThemeManager', () => ({
  useThemeMode: () => ({
    mode: 'light',
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('../components/FooterAdvertisement', () => {
  return function DummyFooter() {
    return <div data-testid="footer-ads">Footer Ads</div>;
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams('?token=mock-token-123');
  });

  test('renderiza correctamente el formulario cuando hay token', () => {
    render(<ResetPassword />);
    expect(screen.getByLabelText(/^nueva contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restablecer contraseña/i })).toBeInTheDocument();
  });

  test('muestra estado de error si el token no está en los parámetros de búsqueda', () => {
    mockSearchParams = new URLSearchParams('');
    render(<ResetPassword />);
    expect(screen.getByTestId('no-token-state')).toBeInTheDocument();
    expect(screen.getByText(/el token de recuperación no está presente/i)).toBeInTheDocument();

    const requestNewBtn = screen.getByTestId('request-new-link-button');
    fireEvent.click(requestNewBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  test('valida longitud mínima y coincidencia de contraseñas', async () => {
    render(<ResetPassword />);
    const passInput = screen.getByLabelText(/^nueva contraseña$/i);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i });

    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.blur(passInput);
    await waitFor(() => {
      expect(screen.getByText(/debe tener al menos 8 caracteres/i)).toBeInTheDocument();
    });

    fireEvent.change(passInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'different123' } });
    fireEvent.blur(confirmInput);
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  test('muestra pantalla de éxito si el restablecimiento es exitoso', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue({
      message: 'Contraseña actualizada exitosamente.',
    });

    render(<ResetPassword />);
    const passInput = screen.getByLabelText(/^nueva contraseña$/i);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i });

    fireEvent.change(passInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('mock-token-123', 'Password123!');
      expect(screen.getByTestId('success-state')).toBeInTheDocument();
      expect(screen.getByText(/tu contraseña ha sido restablecida exitosamente/i)).toBeInTheDocument();
    });

    const goToLoginBtn = screen.getByTestId('go-to-login-button');
    fireEvent.click(goToLoginBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('muestra mensaje de error si el token expira o es inválido', async () => {
    (authService.resetPassword as jest.Mock).mockRejectedValue(
      new Error('El enlace de recuperación es inválido o ha expirado.')
    );

    render(<ResetPassword />);
    const passInput = screen.getByLabelText(/^nueva contraseña$/i);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i });

    fireEvent.change(passInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/el enlace de recuperación es inválido o ha expirado/i);
      expect(screen.getByTestId('request-new-link-link')).toBeInTheDocument();
    });

    const requestNewLink = screen.getByTestId('request-new-link-link');
    fireEvent.click(requestNewLink);
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});
