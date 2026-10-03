import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Download, HeartPulse, Play } from 'lucide-react';
import { useThemeMode } from '../../themes/ThemeManager';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hospital.app';

const FinalCTA: React.FC = () => {
  const { mode } = useThemeMode();

  return (
    <Box
      component="section"
      sx={{ px: { xs: 1.8, sm: 3, md: 5 }, pt: 1.8 }}
    >
      <Box
        className="rv"
        sx={{
          borderRadius: 'var(--r-lg)',
          p: { xs: '36px 24px 32px', sm: '40px 32px 36px' },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: mode === 'dark'
            ? 'var(--final-bg)'
            : 'rgba(255,255,255,.65)',
          border: '1px solid',
          borderColor: mode === 'dark' ? 'var(--stroke-2)' : 'rgba(13,148,136,.15)',
          boxShadow: mode === 'dark'
            ? 'none'
            : '0 20px 40px -20px rgba(13,148,136,.08)',
          transition: 'background .3s',
          maxWidth: { md: '760px' },
          mx: 'auto',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: mode === 'dark'
              ? 'radial-gradient(circle, rgba(13,148,136,.32), transparent 64%)'
              : 'radial-gradient(circle, rgba(13,148,136,.15), transparent 64%)',
            filter: 'blur(18px)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: mode === 'dark'
                ? 'rgba(13,148,136,.18)'
                : 'rgba(13,148,136,.08)',
              border: '1px solid',
              borderColor: mode === 'dark'
                ? 'rgba(13,148,136,.36)'
                : 'rgba(13,148,136,.25)',
              color: mode === 'dark' ? '#5EEAD4' : '#0F766E',
              py: 0.8,
              px: 1.8,
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 700,
            }}
          >
            <HeartPulse size={15} />
            Atención médica y conectividad continua
          </Box>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '26px', sm: '30px' },
              fontWeight: 800,
              color: 'var(--ink)',
              mt: 2,
            }}
          >
            Llevá la atención del hospital siempre con vos
          </Typography>

          <Typography
            sx={{
              color: mode === 'dark' ? '#cbd5e1' : 'var(--muted)',
              fontSize: '15px',
              lineHeight: 1.5,
              mt: 1.5,
              fontWeight: 500,
              maxWidth: '36ch',
              mx: 'auto',
            }}
          >
            Descargá la App del Hospital y disfrutá de atención ágil, gestión de turnos y Wi-Fi sin cargo durante toda tu visita.
          </Typography>

          <Button
            component="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Download size={22} strokeWidth={2.4} />}
            sx={{
              mt: 2.8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
              color: '#fff',
              py: 2.2,
              px: 4.5,
              borderRadius: '16px',
              fontSize: '17px',
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 12px 30px -8px rgba(13,148,136,.6), inset 0 1px 0 rgba(255,255,255,.28)',
              '&:hover': {
                background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
                transform: 'translateY(-1px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                animation: 'pulse 2.6s ease-out infinite',
              },
            }}
          >
            Descargar la App de Salud
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.4,
              mt: 1.8,
            }}
          >
            <Box
              component="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.2,
                background: mode === 'dark'
                  ? 'rgba(255,255,255,.06)'
                  : 'rgba(15,23,42,.05)',
                border: '1px solid',
                borderColor: mode === 'dark' ? 'var(--stroke-2)' : 'rgba(15,23,42,.08)',
                borderRadius: '14px',
                py: 1.4,
                px: 2,
                cursor: 'pointer',
                transition: 'background .15s, transform .15s',
                textDecoration: 'none',
                '&:hover': {
                  background: mode === 'dark'
                    ? 'rgba(255,255,255,.1)'
                    : 'rgba(15,23,42,.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Play size={24} color="var(--ink)" fill="var(--ink)" />
              <Box sx={{ textAlign: 'left', lineHeight: 1.1 }}>
                <Typography
                  sx={{
                    fontSize: '9px',
                    color: 'var(--muted)',
                    fontWeight: 600,
                  }}
                >
                  Disponible en
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 700,
                  }}
                >
                  Google Play
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalCTA;
