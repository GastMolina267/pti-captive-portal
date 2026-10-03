import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeMode } from '../../themes/ThemeManager';

interface HospitalLogoProps {
  height?: number | { xs: number; sm: number };
  showSubtitle?: boolean;
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  height = 42,
  showSubtitle = true,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.2,
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* Isotipo SVG Cruz Médica + Pulso Conectado */}
      <Box
        sx={{
          width: typeof height === 'number' ? height : height.xs,
          height: typeof height === 'number' ? height : height.xs,
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="medGrad1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D9488" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="medGrad2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14B8A6" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Fondo redondeado con gradiente */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="url(#medGrad1)"
            opacity={isDark ? 0.95 : 1}
          />

          {/* Cruz Médica estilizada */}
          <rect x="20" y="10" width="8" height="28" rx="4" fill="#ffffff" opacity={0.25} />
          <rect x="10" y="20" width="28" height="8" rx="4" fill="#ffffff" opacity={0.25} />

          {/* Línea de pulso cardíaco / WiFi central */}
          <path
            d="M12 24H18L21 16L27 32L30 24H36"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Punto de conectividad / pulso */}
          <circle cx="36" cy="24" r="2.5" fill="#34D399" />
        </svg>
      </Box>

      {/* Tipografía de la marca */}
      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            component="span"
            sx={{
              fontSize: typeof height === 'number' ? `${height * 0.44}px` : { xs: '17px', sm: '20px' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: isDark ? '#F1F5FB' : '#0F172A',
            }}
          >
            Hospital
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: typeof height === 'number' ? `${height * 0.44}px` : { xs: '17px', sm: '20px' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              background: 'linear-gradient(135deg, #0D9488, #0284C7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Digital
          </Typography>
        </Box>

        {showSubtitle && (
          <Typography
            component="span"
            sx={{
              fontSize: '9.5px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isDark ? '#94A3B8' : '#64748B',
              lineHeight: 1.2,
              mt: '1px',
            }}
          >
            Red de Salud & Wi-Fi
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HospitalLogo;
