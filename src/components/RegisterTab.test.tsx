import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterTab from './RegisterTab';
import { authService } from '../services/authService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../services/authService', () => ({
  authService: {
    register: jest.fn(),
    requestVerificationCode: jest.fn(),
    verifyCode: jest.fn(),
  },
}));

const mockFormData = {
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'Password123!',
  phone: '+5491123456789',
  gender: 'male',
  birthDate: '01/01/2001',
};

describe('RegisterTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (authService.requestVerificationCode as jest.Mock).mockResolvedValue({ success: true });
    (authService.verifyCode as jest.Mock).mockResolvedValue({ success: true });
  });

  const fillBasicForm = async () => {
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: mockFormData.name } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: mockFormData.lastName } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: mockFormData.email } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: mockFormData.password } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: mockFormData.phone } });
    const genderInput = document.querySelector('input[name="gender"]') as HTMLInputElement;
    if (genderInput) {
      fireEvent.change(genderInput, { target: { value: mockFormData.gender } });
    } else {
      const genderSelect = screen.getByLabelText(/género/i);
      fireEvent.mouseDown(genderSelect);
      const label = mockFormData.gender === 'male' ? 'Hombre' : mockFormData.gender === 'female' ? 'Mujer' : 'Otro';
      const option = await screen.findByText(label);
      fireEvent.click(option);
    }

    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: mockFormData.birthDate } });
  };

  test('renderiza todos los campos del formulario', () => {
    render(<RegisterTab />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('muestra errores de validación en campos requeridos', async () => {
    render(<RegisterTab />);

    fireEvent.blur(screen.getByLabelText(/nombre/i));
    fireEvent.blur(screen.getByLabelText(/apellido/i));
    fireEvent.blur(screen.getByLabelText(/email/i));
    fireEvent.blur(screen.getByLabelText(/^contraseña$/i));
    fireEvent.blur(screen.getByLabelText(/género/i));

    await waitFor(() => {
      expect(screen.getAllByText(/requerid[oa]/i).length).toBeGreaterThanOrEqual(5);
    });
  });

  test('habilita el botón de registro si el formulario está completo', async () => {
    render(<RegisterTab />);
    await fillBasicForm();
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('alternar visibilidad de contraseña', () => {
    render(<RegisterTab />);
    const input = screen.getByLabelText(/^contraseña$/i);
    const toggleBtn = screen.getByLabelText(/mostrar contraseña/i);

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  test('valida el rango de edad y formato de la fecha de nacimiento', async () => {
    render(<RegisterTab />);
    const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);

    const formatDateToDmy = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDateToDmy(tomorrow);
    fireEvent.change(birthDateInput, { target: { value: tomorrowStr } });
    fireEvent.blur(birthDateInput);
    await waitFor(() => {
      expect(screen.getByText(/La fecha de nacimiento no puede ser en el futuro\./i)).toBeInTheDocument();
    });

    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 3);
    const recentDateStr = formatDateToDmy(recentDate);
    fireEvent.change(birthDateInput, { target: { value: recentDateStr } });
    fireEvent.blur(birthDateInput);
    await waitFor(() => {
      expect(screen.getByText(/Debes tener al menos 5 años de edad\./i)).toBeInTheDocument();
    });

    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 105);
    const oldDateStr = formatDateToDmy(oldDate);
    fireEvent.change(birthDateInput, { target: { value: oldDateStr } });
    fireEvent.blur(birthDateInput);
    await waitFor(() => {
      expect(screen.getByText(/La edad no puede ser superior a 100 años\./i)).toBeInTheDocument();
    });

    fireEvent.change(birthDateInput, { target: { value: '01/01/2001' } });
    fireEvent.blur(birthDateInput);
    await waitFor(() => {
      expect(screen.queryByText(/La fecha de nacimiento debe ser una fecha válida \(dd\/mm\/aaaa\)/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/La fecha de nacimiento no puede ser en el futuro\./i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Debes tener al menos 5 años de edad\./i)).not.toBeInTheDocument();
      expect(screen.queryByText(/La edad no puede ser superior a 100 años\./i)).not.toBeInTheDocument();
    });
  });
});