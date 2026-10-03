import React, { useState, useEffect, useCallback } from 'react';
import { parseUamParams } from '../utils/parseUamParams';
import { handleError } from '../utils';

export const UAMConfigVerification: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<{
    isLoading: boolean;
    isValid: boolean | null;
    error: string | null;
    config: unknown;
  }>({
    isLoading: false,
    isValid: null,
    error: null,
    config: null,
  });

  const verifyConfig = useCallback(() => {
    setConfigStatus((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const parsed = parseUamParams();
      const isValid = parsed.ok;
      setConfigStatus({
        isLoading: false,
        isValid,
        error: parsed.ok ? null : parsed.error || 'Parámetros UAM no encontrados',
        config: parsed.params,
      });
    } catch (error) {
      const message = handleError(error, 'Error al verificar UAM');
      setConfigStatus({
        isLoading: false,
        isValid: false,
        error: message,
        config: null,
      });
    }
  }, []);

  useEffect(() => {
    verifyConfig();
  }, [verifyConfig]);

  if (configStatus.isValid === false && !configStatus.isLoading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
        <div className="flex items-center text-yellow-700 text-sm">
          <span className="mr-2">⚠️</span>
          <span>Verificación UAM no disponible. Puedes continuar con el login normal.</span>
          <button
            onClick={verifyConfig}
            className="ml-auto px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (configStatus.isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
        <div className="flex items-center text-blue-700 text-sm">
          <span className="mr-2">⏳</span>
          <span>Verificando configuración UAM...</span>
        </div>
      </div>
    );
  }

  if (configStatus.isValid === true) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
        <div className="flex items-center text-green-700 text-sm">
          <span className="mr-2">✅</span>
          <span>Configuración UAM verificada correctamente</span>
        </div>
      </div>
    );
  }

  return null;
};

export default UAMConfigVerification;
