import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Button } from '@mui/material';
import { Download, Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../../themes/ThemeManager';
import VitaliaLogo from '../common/VitaliaLogo';
import HeaderAds from './HeaderAds';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vitalia.app';

const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        borderBottom: '1px solid var(--stroke)',
        boxShadow: mode === 'dark'
          ? '0 6px 24px -16px rgba(0,0,0,.9)'
          : '0 6px 24px -16px rgba(13,148,136,.10)',
        transition: 'background .3s, box-shadow .3s',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 0.5,
          minHeight: { xs: '56px', sm: '64px' },
        }}
      >
        <VitaliaLogo height={38} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '1px solid var(--stroke)',
              color: 'var(--ink)',
              transition: 'background .2s, transform .15s',
              '&:hover': {
                background: 'var(--surface)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>

          <Button
            component="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Download size={16} strokeWidth={2.4} />}
            sx={{
              background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
              color: '#fff',
              fontWeight: 800,
              fontSize: { xs: '12px', sm: '13px' },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.8, sm: 1.2 },
              borderRadius: '12px',
              boxShadow: '0 8px 18px -8px rgba(13,148,136,.7), inset 0 1px 0 rgba(255,255,255,.25)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              textTransform: 'none',
              transition: 'transform .15s, box-shadow .15s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 12px 22px -8px rgba(13,148,136,.85), inset 0 1px 0 rgba(255,255,255,.25)',
                background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
              },
            }}
          >
            App del Hospital
          </Button>
        </Box>
      </Toolbar>

      <HeaderAds />
    </AppBar>
  );
};

export default Header;
