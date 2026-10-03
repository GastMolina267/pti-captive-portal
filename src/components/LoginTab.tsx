import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Box
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseUamParams } from '../utils/parseUamParams';
import { buildUamLogonUrl } from '../utils/uamChap';

import { authService } from '../services/authService';
import ConnectingSpinner from './common/ConnectingSpinner';


const LoginTab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    let navigating = false;

    try {
      const parsed = parseUamParams();
      if (!parsed.ok) {
        setError(parsed.error || 'Parámetros UAM inválidos.');
        return;
      }

      const { uamip, uamport, challenge, mac, ip, called } = parsed.params;

      try {
        await authService.login({
          email: user,
          password: password,
          macAddress: mac,
          deviceIp: ip,
          routerIp: uamip,
          routerMac: called,
          source: 'portal',
        });
      } catch (backendErr) {
        const message = backendErr instanceof Error ? backendErr.message : 'Credenciales inválidas.';
        if (message === 'SESSION_EXHAUSTED_NO_APP') {
          navigate('/session-expired-no-app');
          return;
        }
        if (message === 'SESSION_EXHAUSTED_HAS_APP') {
          navigate('/');
          return;
        }
        // if (message === 'SESSION_EXHAUSTED_HAS_APP') {
        //   navigate('/session-expired-has-app');
        //   return;
        // }
        setError(message);
        return;
      }

      const portalHomeUrl = `${globalThis.location.origin}/`;
      const loginUrl = buildUamLogonUrl(uamip, uamport, user, password, challenge, portalHomeUrl);
      navigating = true;
      setIsConnecting(true);
      globalThis.location.href = loginUrl;
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión. Verificá tus credenciales.');
    } finally {
      if (!navigating) setIsLoading(false);
    }
  };

  const commonTF = {
    mb: '1.25rem',
    '& .MuiOutlinedInput-root': {
      bgcolor: 'var(--surface-2)',
      borderRadius: '14px',
      color: 'var(--ink)',
      '& fieldset': {
        borderColor: 'var(--stroke)',
        transition: 'border-color .2s',
      },
      '&:hover fieldset': {
        borderColor: 'var(--stroke-2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--blue)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--muted)',
      fontSize: '14.5px',
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'var(--blue)',
      }
    },
    '& .MuiInputAdornment-root .MuiIconButton-root': {
      color: 'var(--muted)',
    }
  };

  const commonBtn = {
    py: '0.85rem',
    borderRadius: '14px',
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(61, 169, 252, 0.2)',
    transition: 'opacity .2s, transform .1s, box-shadow .2s',
    '&:hover': {
      background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
      opacity: 0.95,
      boxShadow: '0 6px 16px rgba(61, 169, 252, 0.3)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&.Mui-disabled': {
      background: 'var(--surface-2) !important',
      color: 'var(--muted-2) !important',
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        fullWidth
        value={user}
        onChange={(e) => setUser(e.target.value.toLowerCase())}
        sx={commonTF}
      />

      <TextField
        label="Contraseña"
        fullWidth
        type={showPass ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={commonTF}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" fullWidth sx={commonBtn} data-testid="login-button" disabled={isLoading}>
        {isConnecting && <ConnectingSpinner />}
        {!isConnecting && isLoading && <CircularProgress size={24} sx={{ color: '#fff' }} />}
        {!isConnecting && !isLoading && 'Iniciar sesión'}
      </Button>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="text"
          onClick={() => navigate({ pathname: '/forgot-password', search: location.search })}
          sx={{
            color: 'var(--blue)',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '14.5px',
            minWidth: 'auto',
            padding: 0,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </Box>

    </form>
  );
};

export default LoginTab;
