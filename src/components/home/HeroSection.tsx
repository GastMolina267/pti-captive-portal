import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Download, Check, ShieldCheck, HeartPulse, Calendar, Activity } from 'lucide-react';
import appMockup from '../../assets/app-mockup.png';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hospital.app';

const trustChips = [
  { icon: ShieldCheck, label: 'Red Segura y Privada' },
  { icon: Check, label: '100% Gratuito' },
  { icon: Activity, label: 'Turnos y Guardia en vivo' },
];

const HeroSection: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2.5, sm: 3, md: 5 },
        pt: { xs: 3, sm: 4, md: 6 },
        pb: { xs: 1, sm: 2 },
        textAlign: { xs: 'center', md: 'left' },
        display: { md: 'grid' },
        gridTemplateColumns: { md: '1.06fr 0.94fr' },
        columnGap: { md: '52px' },
        alignItems: { md: 'center' },
        gridTemplateAreas: { md: '"copy phone" "trust trust"' },
      }}
    >
      <Box sx={{ gridArea: { md: 'copy' } }}>
        <Box
          className="rv"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.1,
            background: 'linear-gradient(135deg, rgba(13,148,136,.16), rgba(13,148,136,.06))',
            border: '1px solid rgba(13,148,136,.35)',
            color: 'var(--blue-2, #14B8A6)',
            px: 1.8,
            py: 1,
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: 700,
            boxShadow: '0 8px 24px -12px rgba(13,148,136,.5)',
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'var(--blue)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 14px -2px rgba(13,148,136,.8)',
            }}
          >
            <HeartPulse size={14} color="#ffffff" />
          </Box>
          Wi-Fi gratis para pacientes y acompañantes
        </Box>

        <Typography
          component="h1"
          className="rv"
          sx={{
            mt: 2.2,
            fontSize: { xs: '30px', sm: '32px', md: '36px' },
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            textWrap: 'balance',
            maxWidth: { md: '550px' },
          }}
        >
          Tu conexión activa y tu salud al alcance de tu mano durante tu estadía
        </Typography>

        <Typography
          className="rv"
          sx={{
            mt: 1.8,
            fontSize: { xs: '15px', sm: '15.5px' },
            lineHeight: 1.5,
            color: 'var(--muted)',
            fontWeight: 500,
            maxWidth: '36ch',
            mx: { xs: 'auto', md: 0 },
          }}
        >
          Accedé a internet sin cargo en salas de espera, consultorios y habitaciones mientras gestionás tus turnos y estudios desde la app oficial.
        </Typography>

        <Box id="hero-cta" className="rv" sx={{ mt: 3 }}>
          <Button
            component="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            startIcon={<Download size={22} strokeWidth={2.4} />}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.2,
              width: { xs: '100%', md: 'auto' },
              background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
              color: '#fff',
              py: 2.2,
              px: { xs: 2.8, md: 4.5 },
              borderRadius: '16px',
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              textTransform: 'none',
              boxShadow: '0 12px 30px -8px rgba(13,148,136,.6), inset 0 1px 0 rgba(255,255,255,.28)',
              position: 'relative',
              overflow: 'hidden',
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
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 0.8,
              mt: 1.4,
              fontSize: '11.5px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            <Check size={14} color="#10B981" />
            100% Gratuito · Turnos y resultados · Listo en segundos
          </Box>
        </Box>
      </Box>

      <Box
        className="rv"
        sx={{
          gridArea: { md: 'phone' },
          position: 'relative',
          mt: { xs: 4, md: 0 },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 260, md: 300 },
            height: { xs: 260, md: 300 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,.35), transparent 62%)',
            filter: 'blur(20px)',
            zIndex: 0,
          }}
        />

        <Box
          component="img"
          src={appMockup}
          alt="App Hospital Digital"
          sx={{
            position: 'relative',
            zIndex: 2,
            width: { xs: 210, sm: 230, md: 248 },
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 40px 60px rgba(0,0,0,.45))',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            zIndex: 3,
            top: { xs: 40, md: 54 },
            left: { xs: '2%', sm: '8%', md: '-2px' },
            background: 'rgba(6,17,29,.85)',
            border: '1px solid var(--stroke-2)',
            borderRadius: '15px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 18px 40px -14px rgba(0,0,0,.7)',
            py: 1.4,
            px: 1.6,
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            animation: 'floaty 5s ease-in-out infinite',
          }}
        >
          <Box
            className="b-teal"
            sx={{
              width: 38,
              height: 38,
              borderRadius: '11px',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <HeartPulse size={20} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              Conexión renovada
            </Typography>
            <Typography sx={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
              +60 min · Sala de espera
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 3,
            bottom: { xs: 70, md: 90 },
            right: { xs: '2%', sm: '8%', md: '-6px' },
            background: 'rgba(6,17,29,.85)',
            border: '1px solid var(--stroke-2)',
            borderRadius: '15px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 18px 40px -14px rgba(0,0,0,.7)',
            py: 1.4,
            px: 1.6,
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            animation: 'floaty 5s ease-in-out infinite 1.6s',
          }}
        >
          <Box
            className="b-emerald"
            sx={{
              width: 38,
              height: 38,
              borderRadius: '11px',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Calendar size={20} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              Turno próx. · Cons. 4
            </Typography>
            <Typography sx={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
              10:30 hs · En llamado
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        className="rv"
        sx={{
          gridArea: { md: 'trust' },
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: 1,
          mt: { xs: 4, md: 4.2 },
          flexWrap: 'wrap',
        }}
      >
        {trustChips.map((chip) => (
          <Box
            key={chip.label}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'var(--surface)',
              border: '1px solid var(--stroke)',
              borderRadius: '999px',
              px: 1.6,
              py: 1,
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            <chip.icon size={15} color="#10B981" strokeWidth={2.4} />
            {chip.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;
