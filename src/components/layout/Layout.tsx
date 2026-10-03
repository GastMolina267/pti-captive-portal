import React from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import StickyDock from './StickyDock';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/session-expired-no-app',
    '/session-expired-has-app',
    '/open-app',
  ].includes(location.pathname);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: 'var(--app-bg)',
        color: 'var(--ink)',
        position: 'relative',
        maxWidth: '1440px',
        margin: '0 auto',
        transition: 'background .3s ease',
      }}
    >
      {!isAuthPage && <Header />}

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          overflowX: 'clip',
        }}
      >
        {children || <Outlet />}
      </Box>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <StickyDock />}
    </Box>
  );
};

export default Layout;
