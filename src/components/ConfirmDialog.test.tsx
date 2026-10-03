import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const title = 'Título de prueba';
  const contentText = 'Este es el contenido del diálogo de prueba';

  test('renderiza correctamente el diálogo cuando open es true', () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        content={contentText}
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
  });

  test('llama a onClose al hacer clic en "Cancelar"', () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        content={contentText}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('llama a onConfirm al hacer clic en "Confirmar"', () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        content={contentText}
      />,
    );

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  test('no renderiza el diálogo cuando open es false', () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    render(
      <ConfirmDialog
        open={false}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        content={contentText}
      />,
    );

    expect(screen.queryByText(title)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
