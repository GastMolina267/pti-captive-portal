import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import HospitalLogo from '../components/common/HospitalLogo';
import FooterAdvertisement from '../components/FooterAdvertisement';
import { authService } from '../services/authService';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('El email es requerido')
    .email('Email inválido'),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const response = await authService.requestPasswordReset(values.email);
        setSuccessMessage(response.message || 'Si el email está registrado, recibirás un correo con las instrucciones para recuperar tu contraseña.');
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Error al solicitar el enlace');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBackToLogin = () => {
    navigate({
      pathname: '/login',
      search: location.search,
    });
  };

  const commonTF = {
    mb: '1.25rem',
    '& .MuiOutlinedInput-root': {
      bgcolor: 'var(--surface-2)',
      borderRadius: '14px',
      color: 'var(--ink)',
      '& fieldset': {
        borderColor: 'var(--stroke)',
        transition: 'border-color .2s',
      },
      '&:hover fieldset': {
        borderColor: 'var(--stroke-2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--blue)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--muted)',
      fontSize: '14.5px',
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'var(--blue)',
      }
    },
  };

  const commonBtn = {
    py: '0.85rem',
    borderRadius: '14px',
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(61, 169, 252, 0.2)',
    transition: 'opacity .2s, transform .1s, box-shadow .2s',
    '&:hover': {
      background: 'linear-gradient(135deg, var(--blue), var(--blue-deep))',
      opacity: 0.95,
      boxShadow: '0 6px 16px rgba(61, 169, 252, 0.3)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&.Mui-disabled': {
      background: 'var(--surface-2) !important',
      color: 'var(--muted-2) !important',
    }
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
        <HospitalLogo height={52} />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap={1.5} mb={3.5}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue)',
            boxShadow: '0 4px 12px rgba(61, 169, 252, 0.08)',
          }}
        >
          {successMessage ? (
            <Mail size={28} strokeWidth={2.25} />
          ) : (
            <KeyRound size={28} strokeWidth={2.25} />
          )}
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
          {successMessage ? '¡Enlace enviado!' : 'Recuperar contraseña'}
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
        {successMessage ? (
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" data-testid="success-state">
            <Typography variant="body1" sx={{ color: 'var(--ink)', mb: 3, lineHeight: 1.6 }}>
              {successMessage}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleBackToLogin}
              sx={commonBtn}
              data-testid="back-to-login-button"
            >
              Volver a iniciar sesión
            </Button>
          </Box>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="body2" sx={{ color: 'var(--muted)', mb: 3, lineHeight: 1.5, textAlign: 'center' }}>
              Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos las instrucciones para restablecer tu contraseña.
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }}>
                {apiError}
              </Alert>
            )}

            <TextField
              name="email"
              label="Correo electrónico"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={commonTF}
              disabled={formik.isSubmitting}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={commonBtn}
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              data-testid="submit-button"
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Recuperar contraseña'
              )}
            </Button>

            <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                onClick={handleBackToLogin}
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  color: 'var(--muted)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'var(--blue)',
                    backgroundColor: 'transparent',
                  },
                }}
                data-testid="back-link"
              >
                Volver a iniciar sesión
              </Button>
            </Box>
          </form>
        )}
      </Card>

      <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'center' }}>
        <FooterAdvertisement width="100%" maxWidth="100%" />
      </Box>
    </Box>
  );
};

export default ForgotPassword;
