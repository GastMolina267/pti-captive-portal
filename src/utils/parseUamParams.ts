// Extrae y valida parámetros UAM inyectados por el router (Teltonika/Coova/MikroTik)
// Persiste en sessionStorage para que no se pierdan al navegar entre rutas del portal cautivo.

export interface UamParams {
  uamip?: string;
  uamport?: string; // default 3990 si no viene
  challenge?: string; // hex
  userurl?: string;
  redirurl?: string;
  mac?: string;
  ssl?: string;
  ip?: string;
  called?: string;
}

export interface UamParseResult {
  ok: boolean;
  params: Required<Pick<UamParams, 'uamip' | 'uamport'>> & UamParams;
  error?: string;
}

const STORAGE_KEY = 'uam_captive_params';

const getParamFromLocation = (paramName: string): string | undefined => {
  const target = paramName.toLowerCase();
  
  // 1. Buscar en search query string
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    for (const [k, v] of searchParams.entries()) {
      if (k.toLowerCase() === target && v) return v;
    }
  }

  // 2. Buscar en hash si el router o proxy redirigió con hash
  if (window.location.hash && window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.substring(window.location.hash.indexOf('?'));
    const hashParams = new URLSearchParams(hashQuery);
    for (const [k, v] of hashParams.entries()) {
      if (k.toLowerCase() === target && v) return v;
    }
  }

  return undefined;
};

export function parseUamParams(): UamParseResult {
  let uamip = getParamFromLocation('uamip');
  let uamport = getParamFromLocation('uamport') || '3990';
  let challenge = getParamFromLocation('challenge');
  let userurl = getParamFromLocation('userurl');
  let redirurl = getParamFromLocation('redirurl');
  let mac = getParamFromLocation('mac');
  let ssl = getParamFromLocation('ssl');
  let ip = getParamFromLocation('ip');
  let called = getParamFromLocation('called');

  // Si encontramos parámetros en la URL actual, los persistimos en sessionStorage y localStorage
  if (uamip) {
    const extracted: UamParams = {
      uamip,
      uamport,
      challenge,
      userurl,
      redirurl,
      mac,
      ssl,
      ip,
      called,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(extracted));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(extracted));
    } catch {
      // Ignorar errores de storage privado
    }
  } else {
    // Si no están en la URL actual, intentar recuperarlos de sessionStorage / localStorage
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UamParams = JSON.parse(stored);
        if (parsed.uamip) {
          uamip = parsed.uamip;
          uamport = parsed.uamport || uamport;
          challenge = parsed.challenge || challenge;
          userurl = parsed.userurl || userurl;
          redirurl = parsed.redirurl || redirurl;
          mac = parsed.mac || mac;
          ssl = parsed.ssl || ssl;
          ip = parsed.ip || ip;
          called = parsed.called || called;
        }
      }
    } catch {
      // Ignorar errores de parseo
    }
  }

  if (!uamip) {
    return {
      ok: false,
      params: {
        uamip: uamip || '',
        uamport: uamport || '3990',
        challenge,
        userurl,
        redirurl,
        mac,
        ssl,
        ip,
        called,
      },
      error:
        'Parámetros UAM faltantes. Reconectá al WiFi o abrí http://neverssl.com para forzar el portal.',
    };
  }

  return {
    ok: true,
    params: {
      uamip,
      uamport,
      challenge,
      userurl,
      redirurl,
      mac,
      ssl,
      ip,
      called,
    },
  };
}