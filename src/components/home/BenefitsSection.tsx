import React from 'react';
import { Box, Typography } from '@mui/material';
import { Calendar, FileText, Activity, MapPin, Pill } from 'lucide-react';

const benefits = [
  {
    icon: Calendar,
    gradient: 'b-teal',
    title: 'Turnos y Consultas',
    desc: 'Gestioná y confirmá citas con especialistas médicos al instante.',
    wide: false,
  },
  {
    icon: FileText,
    gradient: 'b-emerald',
    title: 'Resultados Médicos',
    desc: 'Descargá análisis de laboratorio y estudios digitales.',
    wide: false,
  },
  {
    icon: Activity,
    gradient: 'b-indigo',
    title: 'Guardia en Tiempo Real',
    desc: 'Consultá tiempos de espera y llamado de guardia médica.',
    wide: false,
  },
  {
    icon: MapPin,
    gradient: 'b-cyan',
    title: 'Guía y Mapa del Sanatorio',
    desc: 'Ubicá consultorios, salas de espera y laboratorios.',
    wide: false,
  },
  {
    icon: Pill,
    gradient: 'b-blue',
    title: 'Farmacia & Coberturas',
    desc: 'Beneficios en medicamentos, validación de recetas y convenios exclusivos con obras sociales y prepagas.',
    wide: true,
  },
];

const BenefitsSection: React.FC = () => {
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
        Servicios al Paciente
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
        Todo lo que tenés a tu alcance
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
        Mucho más que internet gratis: una app pensada para cuidar tu salud y optimizar tus tiempos.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(auto-fit, minmax(180px, 1fr))' },
          gap: 1.6,
          mt: 3,
          maxWidth: { md: '940px' },
          mx: { md: 'auto' },
        }}
      >
        {benefits.map((b) => (
          <Box
            key={b.title}
            className="rv"
            sx={{
              gridColumn: b.wide ? '1 / -1' : 'auto',
              background: 'var(--surface)',
              border: '1px solid var(--stroke)',
              borderRadius: '20px',
              p: 2.2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform .25s, border-color .25s, background .25s',
              display: b.wide ? 'flex' : 'block',
              alignItems: b.wide ? 'center' : 'flex-start',
              gap: b.wide ? 2 : 0,
              textAlign: 'left',
              cursor: 'default',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(120px 80px at 80% -10%, rgba(61,169,252,.14), transparent 70%)',
                opacity: 0,
                transition: 'opacity .3s',
              },
              '&:hover, &:active': {
                transform: 'translateY(-3px)',
                borderColor: 'var(--stroke-2)',
                background: 'var(--surface-2)',
              },
              '&:hover::before': {
                opacity: 1,
              },
            }}
          >
            <Box
              className={b.gradient}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                mb: b.wide ? 0 : 1.8,
                flexShrink: 0,
                transition: 'transform .3s cubic-bezier(.22,1,.36,1)',
                '.MuiBox-root:hover &': {
                  transform: 'scale(1.07) rotate(-3deg)',
                },
              }}
            >
              <b.icon size={24} color="#fff" strokeWidth={2.1} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: b.wide ? '15.5px' : '15px',
                  fontWeight: 700,
                  color: 'var(--card-text)',
                  lineHeight: 1.2,
                }}
              >
                {b.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12.5px',
                  color: 'var(--muted)',
                  fontWeight: 500,
                  mt: 0.8,
                  lineHeight: 1.4,
                }}
              >
                {b.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BenefitsSection;
