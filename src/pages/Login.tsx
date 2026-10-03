import React, { useState } from 'react';
import { Box, Card, Tabs, Tab, Typography } from '@mui/material';
import { HeartPulse } from 'lucide-react';
import VitaliaLogo from '../components/common/VitaliaLogo';
import LoginTab from '../components/LoginTab';
import RegisterTab from '../components/RegisterTab';
import FooterAdvertisement from '../components/FooterAdvertisement';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

      <Box display="flex" flexDirection="column" alignItems="center" gap={1.2} mb={3}>
        <Box
          sx={{
            width: 56,
            height: 56,
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
          <HeartPulse size={28} strokeWidth={2.25} />
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
          Portal de Pacientes & Wi-Fi
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--muted)',
            fontWeight: 500,
            fontSize: '13.5px',
            textAlign: 'center',
          }}
        >
          Conectate a la red del hospital e ingresá a tu cuenta
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
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: '1px solid var(--stroke)',
            '& .MuiTab-root': {
              color: 'var(--muted)',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '14.5px',
              pb: 1.5,
              transition: 'color .2s',
            },
            '& .Mui-selected': {
              color: 'var(--blue) !important',
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'var(--blue)',
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="Iniciar Sesión" />
          <Tab label="Registrarse" />
        </Tabs>

        <Box sx={{ pt: 0.5 }}>
          {activeTab === 0 && <LoginTab />}
          {activeTab === 1 && <RegisterTab />}
        </Box>
      </Card>

      <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'center' }}>
        <FooterAdvertisement width="100%" maxWidth="100%" />
      </Box>
    </Box>
  );
};

export default Login;
