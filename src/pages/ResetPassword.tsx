import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material';
import { KeyRound, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import VitaliaLogo from '../components/common/VitaliaLogo';
import FooterAdvertisement from '../components/FooterAdvertisement';
import { authService } from '../services/authService';
import { passwordYupSchema } from '../utils/passwordValidation';
import PasswordRequirementsIndicator from '../components/PasswordRequirementsIndicator';

const validationSchema = Yup.object({
  newPassword: passwordYupSchema,
  confirmPassword: Yup.string()
    .required('Debe confirmar la contraseña')
    .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) {
        setApiError('El token de recuperación no está presente.');
        setSubmitting(false);
        return;
      }

      setApiError(null);
      try {
        await authService.resetPassword(token, values.newPassword);
        setSuccess(true);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToForgot = () => {
    navigate('/forgot-password');
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
    '& .MuiInputAdornment-root .MuiIconButton-root': {
      color: 'var(--muted)',
    }
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

  const isTokenExpired = apiError?.toLowerCase().includes('expirado') || apiError?.toLowerCase().includes('inválido') || apiError?.toLowerCase().includes('expired') || apiError?.toLowerCase().includes('invalid');

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
            color: success ? 'var(--green, #34D399)' : !token || isTokenExpired ? 'error.main' : 'var(--blue)',
            boxShadow: '0 4px 12px rgba(61, 169, 252, 0.08)',
          }}
        >
          {success ? (
            <CheckCircle size={28} strokeWidth={2.25} />
          ) : !token || isTokenExpired ? (
            <AlertTriangle size={28} strokeWidth={2.25} />
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
          {success ? 'Contraseña actualizada' : !token ? 'Enlace no válido' : 'Establecer nueva contraseña'}
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
        {success ? (
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" data-testid="success-state">
            <Typography variant="body1" sx={{ color: 'var(--ink)', mb: 3, lineHeight: 1.6 }}>
              Tu contraseña ha sido restablecida exitosamente. Ahora puedes ingresar al portal con tus nuevas credenciales.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGoToLogin}
              sx={commonBtn}
              data-testid="go-to-login-button"
            >
              Iniciar sesión
            </Button>
          </Box>
        ) : !token ? (
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" data-testid="no-token-state">
            <Typography variant="body1" sx={{ color: 'var(--ink)', mb: 3, lineHeight: 1.6 }}>
              El token de recuperación no está presente o el enlace es incorrecto. Vuelve a solicitar la recuperación de tu contraseña.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGoToForgot}
              sx={commonBtn}
              data-testid="request-new-link-button"
            >
              Solicitar nuevo enlace
            </Button>
          </Box>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="body2" sx={{ color: 'var(--muted)', mb: 3, lineHeight: 1.5 }}>
              Ingresa tu nueva contraseña. Asegúrate de que tenga al menos 6 caracteres.
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }}>
                {apiError}
              </Alert>
            )}

            <TextField
              name="newPassword"
              label="Nueva contraseña"
              type={showNewPass ? 'text' : 'password'}
              fullWidth
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              sx={commonTF}
              disabled={formik.isSubmitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowNewPass(!showNewPass)}
                        aria-label={showNewPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showNewPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <PasswordRequirementsIndicator password={formik.values.newPassword} />

            <TextField
              name="confirmPassword"
              label="Confirmar contraseña"
              type={showConfirmPass ? 'text' : 'password'}
              fullWidth
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              sx={commonTF}
              disabled={formik.isSubmitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        aria-label={showConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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
                'Restablecer contraseña'
              )}
            </Button>

            {isTokenExpired && (
              <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="text"
                  onClick={handleGoToForgot}
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
                  data-testid="request-new-link-link"
                >
                  Solicitar nuevo enlace
                </Button>
              </Box>
            )}
          </form>
        )}
      </Card>

      <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'center' }}>
        <FooterAdvertisement width="100%" maxWidth="100%" />
      </Box>
    </Box>
  );
};

export default ResetPassword;
