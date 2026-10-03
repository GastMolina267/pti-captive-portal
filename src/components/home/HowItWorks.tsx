import React from 'react';
import { Box, Typography } from '@mui/material';
import { Wifi, Download, HeartPulse, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: Wifi,
    num: 'Paso 1',
    title: 'Conectate al Wi-Fi',
    desc: 'Ya estás conectado a la red gratuita del hospital. ¡Listo!',
    active: true,
  },
  {
    icon: Download,
    num: 'Paso 2',
    title: 'Descargá la App',
    desc: 'Instalá la aplicación oficial para gestionar tu atención médica.',
    active: false,
  },
  {
    icon: HeartPulse,
    num: 'Paso 3',
    title: 'Accedé a tus servicios',
    desc: 'Consultá turnos, recetas, guardia en vivo y resultados de estudios.',
    active: false,
  },
  {
    icon: ShieldCheck,
    num: 'Paso 4',
    title: 'Renová tu conexión',
    desc: 'Navegá sin interrupciones durante toda tu permanencia en el hospital.',
    active: false,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2.5, sm: 3, md: 5 },
        py: { xs: 4, sm: 5 },
        textAlign: { xs: 'left', md: 'center' },
      }}
    >
      <Typography className="eyebrow rv" component="span">
        Atención Ágil
      </Typography>
      <Typography
        component="h2"
        className="rv"
        sx={{
          fontSize: { xs: '24px', sm: '27px' },
          lineHeight: 1.12,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          mt: 1.5,
        }}
      >
        ¿Cómo funciona?
      </Typography>
      <Typography
        className="rv"
        sx={{
          fontSize: '14.5px',
          lineHeight: 1.55,
          color: 'var(--muted)',
          fontWeight: 500,
          mt: 1.2,
          mx: { md: 'auto' },
          maxWidth: { md: '52ch' },
        }}
      >
        En menos de un minuto ya estás navegando y accediendo a tus servicios de salud.
      </Typography>

      <Box
        sx={{
          mt: 3,
          position: 'relative',
          display: { xs: 'flex', md: 'grid' },
          flexDirection: { xs: 'column' },
          gridTemplateColumns: { md: 'repeat(4, 1fr)' },
          gap: { xs: 0, md: 2.2 },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '25px',
            top: '18px',
            bottom: '18px',
            width: '2px',
            background: 'linear-gradient(180deg, var(--blue), rgba(13,148,136,.1))',
            display: { xs: 'block', md: 'none' },
          },
        }}
      >
        {steps.map((step) => (
          <Box
            key={step.num}
            className="rv"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: { xs: 2, md: 0 },
              position: 'relative',
              pb: { xs: 2, md: 0 },
              textAlign: { md: 'center' },
              '&:last-child': { pb: 0 },
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                background: step.active
                  ? 'linear-gradient(135deg, var(--blue), var(--blue-deep))'
                  : 'var(--bg-2)',
                border: step.active
                  ? '1px solid transparent'
                  : '1px solid rgba(13,148,136,.4)',
                color: step.active ? '#fff' : 'var(--blue)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                zIndex: 1,
                mx: { md: 'auto' },
                mb: { md: 2 },
                boxShadow: step.active
                  ? '0 0 0 6px var(--bg), 0 0 26px -2px rgba(13,148,136,.7)'
                  : '0 0 0 6px var(--bg), 0 8px 22px -8px rgba(13,148,136,.4)',
                transition: 'transform .3s cubic-bezier(.22,1,.36,1)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.04)',
                },
              }}
            >
              <step.icon size={24} />
            </Box>

            <Box
              sx={{
                flex: 1,
                background: 'var(--surface)',
                border: '1px solid var(--stroke)',
                borderRadius: '18px',
                py: 1.8,
                px: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--blue)',
                }}
              >
                {step.num}
              </Typography>
              <Typography
                sx={{
                  fontSize: '16.5px',
                  fontWeight: 700,
                  color: 'var(--card-text)',
                  mt: 0.3,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'var(--muted)',
                  mt: 0.6,
                  lineHeight: 1.45,
                  fontWeight: 500,
                }}
              >
                {step.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HowItWorks;
