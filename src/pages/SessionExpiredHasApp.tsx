import React, { useEffect } from 'react';
import { Box, Card, Typography, Button, CircularProgress } from '@mui/material';
import { Smartphone, ExternalLink } from 'lucide-react';
import HospitalLogo from '../components/common/HospitalLogo';

const SessionExpiredHasApp: React.FC = () => {
  const appLink = `${globalThis.location.origin}/open-app`;

  useEffect(() => {
    if (globalThis.location.pathname !== '/open-app') {
      const timer = setTimeout(() => {
        globalThis.location.href = appLink;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [appLink]);

  const handleManualOpen = () => {
    globalThis.location.href = appLink;
  };

  const commonBtn = {
    py: '0.85rem',
    borderRadius: '14px',
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
    transition: 'opacity .2s, transform .1s, box-shadow .2s',
    '&:hover': {
      background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
      opacity: 0.95,
      boxShadow: '0 6px 16px rgba(13, 148, 136, 0.35)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
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
        <HospitalLogo height={52} />
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
          <Smartphone size={28} strokeWidth={2.25} />
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
          Abriendo la App del Hospital...
        </Typography>
      </Box>

      <Card
        className="glass"
        sx={{
          width: '100%',
          maxWidth: '420px',
          p: { xs: 3, sm: 4 },
          bgcolor: 'var(--surface) !important',
          border: '1px solid var(--stroke) !important',
          borderRadius: '26px !important',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07) !important',
          backdropFilter: 'blur(14px) saturate(1.3) !important',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
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
          Tu tiempo de cortesía en sala ha finalizado. Estamos redirigiéndote a la aplicación oficial del hospital para que puedas seguir conectado y gestionar tus turnos.
        </Typography>

        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={40} sx={{ color: 'var(--blue)' }} />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'var(--muted-2)',
            textAlign: 'center',
            fontSize: '13.5px',
          }}
        >
          Si la aplicación no se abre automáticamente en unos segundos, presiona el botón a continuación.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleManualOpen}
          startIcon={<ExternalLink size={20} />}
          sx={commonBtn}
        >
          Abrir App del Hospital
        </Button>
      </Card>
    </Box>
  );
};

export default SessionExpiredHasApp;
