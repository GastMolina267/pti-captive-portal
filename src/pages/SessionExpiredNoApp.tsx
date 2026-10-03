import React, { useState } from 'react';
import { Box, Card, Typography, Button, Snackbar, Alert } from '@mui/material';
import { AlertTriangle, Copy, Check } from 'lucide-react';
import VitaliaLogo from '../components/common/VitaliaLogo';

const APP_NAME = 'VITALIA';

const SessionExpiredNoApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyAppName = async () => {
    try {
      await globalThis.navigator.clipboard.writeText(APP_NAME);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = APP_NAME;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        background: 'var(--app-bg)',
        transition: 'background 0.3s ease',
      }}
    >
      <Box mb={3.5} sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '400px' }}>
        <VitaliaLogo height={52} />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap={1.5} mb={3.5}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue)',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.12)',
          }}
        >
          <AlertTriangle size={28} strokeWidth={2.25} />
        </Box>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: 'var(--ink)',
            fontWeight: 800,
            fontSize: { xs: '20px', sm: '22px' },
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Tiempo de Cortesía en Sala Agotado
        </Typography>
      </Box>

      <Card
        className="glass"
        sx={{
          width: '100%',
          maxWidth: '440px',
          p: { xs: 3, sm: 4 },
          bgcolor: 'var(--surface) !important',
          border: '1px solid var(--stroke) !important',
          borderRadius: '26px !important',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07) !important',
          backdropFilter: 'blur(14px) saturate(1.3) !important',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'var(--muted)',
            textAlign: 'center',
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          Tu tiempo de navegación gratuita de cortesía en el hospital ha finalizado. Para seguir disfrutando del servicio de internet y gestionar turnos o estudios, debes instalar nuestra aplicación oficial.
        </Typography>

        <Box
          sx={{
            width: '100%',
            bgcolor: 'var(--surface-2)',
            border: '1px solid var(--stroke)',
            borderRadius: '18px',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'var(--ink)',
              fontSize: '14px',
              textAlign: 'center',
              letterSpacing: '-0.01em',
            }}
          >
            Pasos para continuar conectado:
          </Typography>

          <Box display="flex" alignItems="flex-start" gap={1.5}>
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(61, 169, 252, 0.12)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                mt: 0.2,
              }}
            >
              1
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--ink)', fontSize: '13.5px', lineHeight: 1.5, fontWeight: 500 }}>
              Abre la aplicación <strong>Google Play Store</strong> en tu dispositivo.
            </Typography>
          </Box>

          <Box display="flex" alignItems="flex-start" gap={1.5}>
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(61, 169, 252, 0.12)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                mt: 0.2,
              }}
            >
              2
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--ink)', fontSize: '13.5px', lineHeight: 1.5, fontWeight: 500 }}>
              En el buscador, escribe <strong>"{APP_NAME}"</strong> y selecciona la aplicación oficial.
            </Typography>
          </Box>

          <Box display="flex" alignItems="flex-start" gap={1.5}>
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(61, 169, 252, 0.12)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                mt: 0.2,
              }}
            >
              3
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--ink)', fontSize: '13.5px', lineHeight: 1.5, fontWeight: 500 }}>
              Descarga e instala la aplicación en tu dispositivo.
            </Typography>
          </Box>

          <Box display="flex" alignItems="flex-start" gap={1.5}>
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(61, 169, 252, 0.12)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                mt: 0.2,
              }}
            >
              4
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--ink)', fontSize: '13.5px', lineHeight: 1.5, fontWeight: 500 }}>
              Ingresá a la app <strong>{APP_NAME}</strong> para consultar tus turnos médicos y renovar tu sesión de Wi-Fi en el hospital.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleCopyAppName}
          startIcon={copied ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
          sx={{
            py: '0.75rem',
            borderRadius: '14px',
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            borderColor: 'var(--stroke)',
            color: 'var(--ink)',
            '&:hover': {
              borderColor: 'var(--blue)',
              bgcolor: 'rgba(13, 148, 136, 0.05)',
            },
          }}
        >
          {copied ? '¡Nombre Copiado!' : `Copiar "${APP_NAME}"`}
        </Button>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '12px' }}>
          ¡Nombre de la app copiado al portapapeles!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SessionExpiredNoApp;
