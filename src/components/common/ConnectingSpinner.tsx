import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const DEFAULT_MESSAGES = [
  'Verificando tu usuario...',
  'Conectando a la red...',
  'Habilitando tu acceso...',
  'Preparando tu conexión...',
  'Ya casi estás conectado...',
];

interface Props {
  messages?: string[];
  intervalMs?: number;
}

const ConnectingSpinner: React.FC<Props> = ({ messages = DEFAULT_MESSAGES, intervalMs = 1800 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(cycle);
  }, [messages, intervalMs]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <CircularProgress size={20} sx={{ color: '#fff', flexShrink: 0 }} />
      <Typography variant="body2" sx={{ color: '#fff', whiteSpace: 'nowrap' }}>
        {messages[index]}
      </Typography>
    </Box>
  );
};

export default ConnectingSpinner;
