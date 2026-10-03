import React from 'react';
import { Box, Typography } from '@mui/material';
import VitaliaLogo from '../common/VitaliaLogo';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 5 },
        pb: { xs: '140px', sm: '140px' },
        textAlign: 'center',
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <VitaliaLogo height={34} />
      </Box>

      <Typography
        sx={{
          fontSize: '12px',
          color: 'var(--muted)',
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        Portal Cautivo de Conectividad & Servicios de Atención al Paciente
      </Typography>

      <Typography
        sx={{
          fontSize: '11px',
          color: 'var(--muted-2)',
          fontWeight: 500,
        }}
      >
        © 2026 Vitalia · Portal Cautivo del Ecosistema Digital Hospitalario
      </Typography>
    </Box>
  );
};

export default Footer;
