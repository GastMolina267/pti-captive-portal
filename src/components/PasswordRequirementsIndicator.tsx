import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { Check, X } from 'lucide-react';
import { getPasswordRequirements, calculatePasswordStrength } from '../utils/passwordValidation';

interface PasswordRequirementsIndicatorProps {
  password: string;
}

export const PasswordRequirementsIndicator: React.FC<PasswordRequirementsIndicatorProps> = ({ password }) => {
  if (!password) {
    return null;
  }

  const reqs = getPasswordRequirements(password);
  const strength = calculatePasswordStrength(password);

  const requirementItems = [
    { label: 'Mínimo 8 caracteres', met: reqs.hasMinLength },
    { label: 'Al menos una letra mayúscula (A-Z)', met: reqs.hasUppercase },
    { label: 'Al menos una letra minúscula (a-z)', met: reqs.hasLowercase },
    { label: 'Al menos un número (0-9)', met: reqs.hasNumber },
  ];

  return (
    <Box
      sx={{
        mt: 1,
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'var(--surface-2, rgba(255, 255, 255, 0.05))',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Fortaleza de la contraseña:
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color:
              strength.color === 'error'
                ? 'error.main'
                : strength.color === 'warning'
                ? 'warning.main'
                : 'success.main',
          }}
        >
          {strength.label}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={strength.score}
        color={strength.color}
        sx={{
          height: 6,
          borderRadius: 3,
          mb: 1.5,
          bgcolor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          },
        }}
      />

      <Stack spacing={0.5}>
        {requirementItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: item.met ? 'success.main' : 'text.secondary',
              transition: 'color 0.2s ease',
            }}
          >
            {item.met ? (
              <Check size={14} style={{ flexShrink: 0 }} />
            ) : (
              <X size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: item.met ? 600 : 400,
                opacity: item.met ? 1 : 0.7,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default PasswordRequirementsIndicator;
