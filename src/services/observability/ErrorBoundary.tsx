import { Component, type ErrorInfo, type ReactNode } from 'react';
import { observability } from './instance';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const fallbackStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  button: {
    marginTop: '16px',
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    observability.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  handleReload = (): void => {
    globalThis.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={fallbackStyles.container}>
          <h1>Algo salió mal</h1>
          <p>Ocurrió un error inesperado. Por favor recargá la página para continuar.</p>
          <button style={fallbackStyles.button} onClick={this.handleReload}>
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
