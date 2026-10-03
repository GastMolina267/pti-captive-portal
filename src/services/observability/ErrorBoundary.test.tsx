import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { observability } from './instance';

jest.mock('./instance', () => ({
  observability: {
    captureException: jest.fn(),
  },
}));

function Bomb(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  const originalError = console.error;
  const originalLocation = globalThis.location;

  beforeAll(() => {
    console.error = jest.fn();
    Object.defineProperty(globalThis, 'location', {
      value: { reload: jest.fn() },
      configurable: true,
    });
  });

  afterAll(() => {
    console.error = originalError;
    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza a sus hijos cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <div>contenido normal</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('contenido normal')).toBeInTheDocument();
    expect(observability.captureException).not.toHaveBeenCalled();
  });

  it('muestra el fallback y reporta la excepción a observability cuando un hijo lanza', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(observability.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ extra: expect.objectContaining({ componentStack: expect.any(String) }) }),
    );
  });

  it('recarga la página al hacer click en el botón de recargar', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Recargar'));

    expect(globalThis.location.reload).toHaveBeenCalled();
  });
});
