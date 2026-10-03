import axios from 'axios';
import { observability } from '../services/observability';

export function translateErrorMessage(rawMsg: string, fallback: string = 'Ocurrió un error inesperado'): string {
  if (!rawMsg) return fallback;

  const lower = rawMsg.toLowerCase();

  if (
    lower.includes('duplicate key') ||
    lower.includes('unique constraint') ||
    lower.includes('uq_') ||
    lower.includes('already exists') ||
    lower.includes('email_1')
  ) {
    return 'Este correo electrónico ya se encuentra registrado. Si ya tienes una cuenta, por favor inicia sesión.';
  }

  if (lower.includes('invalid credentials') || lower.includes('unauthorized') || lower.includes('credenciales')) {
    return 'Correo electrónico o contraseña incorrectos.';
  }

  if (lower.includes('user not found') || lower.includes('usuario no encontrado')) {
    return 'No existe un usuario registrado con este correo electrónico.';
  }

  if (lower.includes('network error') || lower.includes('err_network')) {
    return 'Error de conexión. Por favor verifica tu red e intenta nuevamente.';
  }

  if (lower.includes('internal server error') || lower.includes('500')) {
    return 'Ocurrió un problema en el servidor. Por favor intenta más tarde.';
  }

  return rawMsg;
}

export function handleError(error: unknown, message: string): string {
  observability.captureException(error, { extra: { message } });

  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message || error.message;
    return translateErrorMessage(backendMessage, `${message}: ${error.message} - ${error.response?.status}`);
  } else if (error instanceof Error) {
    return translateErrorMessage(error.message, `${message}: ${error.message}`);
  } else {
    return message;
  }
}
