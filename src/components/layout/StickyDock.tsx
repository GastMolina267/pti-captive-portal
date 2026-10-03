import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Download, Wifi } from 'lucide-react';
import { useThemeMode } from '../../themes/ThemeManager';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vitalia.app';

const StickyDock: React.FC = () => {
  const [show, setShow] = useState(false);
  const { mode } = useThemeMode();

  useEffect(() => {
    const heroCta = document.getElementById('hero-cta');
    if (!heroCta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShow(!entry.isIntersecting);
        });
      },
      { threshold: 0 },
    );

    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 60,
        background: 'var(--dock-bg)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
        borderTop: '1px solid var(--stroke)',
        py: 1.4,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        boxShadow: mode === 'dark'
          ? '0 -10px 30px -16px rgba(0,0,0,.8)'
          : '0 -10px 30px -16px rgba(13,148,136,.12)',
        transform: show ? 'translateY(0)' : 'translateY(130%)',
        transition: 'transform .4s cubic-bezier(.22,1,.36,1)',
        paddingBottom: 'calc(11px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--card-text)',
            lineHeight: 1.1,
          }}
        >
          Seguí conectado en el Hospital
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            mt: 0.3,
          }}
        >
          <Wifi size={13} color="#10B981" />
          <Typography
            sx={{
              fontSize: '11px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            Wi-Fi gratis · Pacientes y Acompañantes
          </Typography>
        </Box>
      </Box>

      <Button
        component="a"
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<Download size={18} strokeWidth={2.4} />}
        sx={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
          color: '#fff',
          fontWeight: 800,
          fontSize: '14px',
          px: 2.2,
          py: 1.2,
          borderRadius: '13px',
          boxShadow: '0 10px 22px -8px rgba(13,148,136,.7)',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
            transform: 'translateY(-1px)',
          },
        }}
      >
        App Oficial
      </Button>
    </Box>
  );
};

export default StickyDock;
