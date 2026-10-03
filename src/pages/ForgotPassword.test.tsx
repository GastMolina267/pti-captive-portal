import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from './ForgotPassword';
import { authService } from '../services/authService';

const mockNavigate = jest.fn();
const mockLocation = { search: '?uamip=10.0.0.1&uamport=3990' };

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock('../services/authService', () => ({
  authService: {
    requestPasswordReset: jest.fn(),
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

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario inicial', () => {
    render(<ForgotPassword />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recuperar contraseña/i })).toBeInTheDocument();
    expect(screen.getByTestId('back-link')).toBeInTheDocument();
  });

  test('valida que el email ingresado sea válido', async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /recuperar contraseña/i });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  test('muestra estado de carga y luego pantalla de éxito si la petición es exitosa', async () => {
    (authService.requestPasswordReset as jest.Mock).mockResolvedValue({
      message: 'Instrucciones enviadas',
    });

    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /recuperar contraseña/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByTestId('success-state')).toBeInTheDocument();
      expect(screen.getByText('Instrucciones enviadas')).toBeInTheDocument();
    });

    const backToLoginButton = screen.getByTestId('back-to-login-button');
    fireEvent.click(backToLoginButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/login',
      search: mockLocation.search,
    });
  });

  test('muestra mensaje de error si la petición del servicio falla', async () => {
    (authService.requestPasswordReset as jest.Mock).mockRejectedValue(
      new Error('No se encontró un usuario activo con ese email.')
    );

    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /recuperar contraseña/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No se encontró un usuario activo con ese email.');
    });
  });

  test('el botón de volver al login en el formulario redirige conservando parámetros UAM', () => {
    render(<ForgotPassword />);
    const backLink = screen.getByTestId('back-link');
    fireEvent.click(backLink);

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/login',
      search: mockLocation.search,
    });
  });
});
