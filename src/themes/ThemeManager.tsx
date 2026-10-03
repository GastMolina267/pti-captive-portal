import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => { },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeContext);

const fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";

function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem('bd_theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  return 'light';
}

interface Props {
  children: React.ReactNode;
}

export default function ThemeManager({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>(getStoredTheme);

  const toggleTheme = useCallback(() => {
    console.log('toggleTheme clicked, transitioning from:', mode);
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [mode]);

  useEffect(() => {
    console.log('ThemeManager effect: setting data-theme to', mode);
    document.documentElement.setAttribute('data-theme', mode);
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);

    try {
      localStorage.setItem('bd_theme', mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0D9488',
            dark: '#0F766E',
            light: '#14B8A6',
          },
          secondary: {
            main: '#0284C7',
            dark: '#0369A1',
            light: '#38BDF8',
          },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#06111D',
            paper: mode === 'light' ? '#FFFFFF' : '#0B1A2C',
          },
          text: {
            primary: mode === 'light' ? '#0F172A' : '#F1F5FB',
            secondary: mode === 'light' ? '#475569' : '#94A3B8',
          },
          success: {
            main: '#10B981',
          },
          divider:
            mode === 'light'
              ? 'rgba(15, 23, 42, 0.08)'
              : 'rgba(255, 255, 255, 0.09)',
        },
        typography: {
          fontFamily,
          h1: { fontWeight: 800, letterSpacing: '-0.03em' },
          h2: { fontWeight: 800, letterSpacing: '-0.025em' },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          subtitle1: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 700 },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '14px',
                fontFamily,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '20px',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}