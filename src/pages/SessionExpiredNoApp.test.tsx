import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionExpiredNoApp from './SessionExpiredNoApp';
import '@testing-library/jest-dom';

jest.mock('../themes/ThemeManager', () => ({
  useThemeMode: () => ({ mode: 'light' }),
}));

describe('SessionExpiredNoApp', () => {
  test('renderiza correctamente las instrucciones para descargar la app', () => {
    render(<SessionExpiredNoApp />);
    expect(screen.getByText(/Tiempo de Cortesía en Sala Agotado/i)).toBeInTheDocument();
    expect(screen.getByText(/Pasos para continuar conectado/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Play Store/i)).toBeInTheDocument();
    expect(screen.getByText(/consultar tus turnos médicos y renovar tu sesión/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copiar "hospital digital"/i })).toBeInTheDocument();
  });

  test('permite copiar el nombre de la app al portapapeles', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    render(<SessionExpiredNoApp />);
    const copyBtn = screen.getByRole('button', { name: /copiar "hospital digital"/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('HOSPITAL DIGITAL');
      expect(screen.getByText(/¡nombre copiado!/i)).toBeInTheDocument();
    });
  });
});
