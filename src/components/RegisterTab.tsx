import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/authService';
import { parseUamParams } from '../utils/parseUamParams';
import { buildUamLogonUrl } from '../utils/uamChap';
import ConnectingSpinner from './common/ConnectingSpinner';
import { passwordYupSchema } from '../utils/passwordValidation';
import PasswordRequirementsIndicator from './PasswordRequirementsIndicator';

const formatBirthDate = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
};

const convertToYmd = (dateStr: string): string => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'Nombre inválido')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo letras y espacios'),
  lastName: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'Apellido inválido')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo letras y espacios'),
  email: Yup.string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: passwordYupSchema,
  phone: Yup.string().test('phone', 'Teléfono inválido', (value) => {
    if (!value || value.trim() === '') return true;
    return /^[+]?[\d\s()-]{10,15}$/.test(value.replace(/\s+/g, ''));
  }),
  gender: Yup.string()
    .required('El género es requerido')
    .oneOf(['male', 'female', 'other'], 'El género es requerido'),
  birthDate: Yup.string()
    .optional()
    .test('isValidBirthDate', 'La fecha de nacimiento es inválida', function (value) {
      if (!value) return true;

      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        return this.createError({ message: 'La fecha de nacimiento debe ser una fecha válida (dd/mm/aaaa)' });
      }

      const [dayStr, monthStr, yearStr] = value.split('/');
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const year = parseInt(yearStr, 10);

      const birthDate = new Date(year, month, day);
      if (
        isNaN(birthDate.getTime()) ||
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month ||
        birthDate.getDate() !== day
      ) {
        return this.createError({ message: 'La fecha de nacimiento debe ser una fecha válida (dd/mm/aaaa)' });
      }

      const today = new Date();
      if (birthDate > today) {
        return this.createError({ message: 'La fecha de nacimiento no puede ser en el futuro.' });
      }

      const minAgeDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );
      if (birthDate > minAgeDate) {
        return this.createError({ message: 'Debes tener al menos 5 años de edad.' });
      }

      const maxAgeDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      if (birthDate < maxAgeDate) {
        return this.createError({ message: 'La edad no puede ser superior a 100 años.' });
      }

      return true;
    }),
});

const RegisterTab: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      gender: '',
      birthDate: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError('');
      let navigating = false;
      try {
        const phone = values.phone.trim();
        let formattedPhone = '';
        if (phone) {
          formattedPhone = phone.startsWith('+') ? phone : '+' + phone;
        }

        const parsed = parseUamParams();
        const macAddress = parsed.ok ? parsed.params.mac : undefined;
        // const deviceIp = parsed.ok ? parsed.params.ip : undefined;
        // const routerIp = parsed.ok ? parsed.params.uamip : undefined;
        // const routerMac = parsed.ok ? parsed.params.called : undefined;
        // const source = parsed.ok ? 'portal' : undefined;

        const { message } = await authService.register({
          email: values.email,
          password: values.password,
          macAddress,
          // deviceIp,
          // routerIp,
          // routerMac,
          // source,
          gender: values.gender as 'male' | 'female' | 'other',
          birthDate: values.birthDate ? convertToYmd(values.birthDate) : undefined,
          person: {
            firstName: values.name,
            lastName: values.lastName,
            phone: formattedPhone,
          },
        });

        if (parsed.ok) {
          const { uamip, uamport, challenge } = parsed.params;
          const portalHomeUrl = `${globalThis.location.origin}/`;
          const loginUrl = buildUamLogonUrl(uamip, uamport, values.email, values.password, challenge, portalHomeUrl);
          navigating = true;
          setIsConnecting(true);
          globalThis.location.href = loginUrl;
        } else {
          setSuccess(message || 'Usuario registrado correctamente');
          resetForm();
          globalThis.location.replace('/');
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Error al registrar usuario');
      } finally {
        if (!navigating) setSubmitting(false);
      }
    },
  });

  const fieldError = (name: keyof typeof formik.initialValues) =>
    formik.touched[name] && Boolean(formik.errors[name]);

  const fieldHelperText = (name: keyof typeof formik.initialValues) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  const commonTF = {
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
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'var(--muted)',
    }
  };

  const commonBtn = {
    py: 1.5,
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
    <form onSubmit={formik.handleSubmit} autoComplete="off" style={{ maxWidth: 400, margin: '0 auto' }}>
      <Snackbar
        open={!!apiError}
        autoHideDuration={6000}
        onClose={() => setApiError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setApiError('')} severity="error" variant="filled" sx={{ width: '100%', borderRadius: '12px' }}>
          {apiError}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess('')} severity="success" variant="filled" sx={{ width: '100%', borderRadius: '12px' }}>
          {success}
        </Alert>
      </Snackbar>

      <TextField
        name="name"
        label="Nombre"
        variant="outlined"
        fullWidth
        disabled={formik.isSubmitting}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError('name')}
        helperText={fieldHelperText('name')}
        sx={{ ...commonTF, mb: 2 }}
      />

      <TextField
        name="lastName"
        label="Apellido"
        variant="outlined"
        fullWidth
        disabled={formik.isSubmitting}
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError('lastName')}
        helperText={fieldHelperText('lastName')}
        sx={{ ...commonTF, mb: 2 }}
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        disabled={formik.isSubmitting}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError('email')}
        helperText={fieldHelperText('email')}
        sx={{ ...commonTF, mb: 2 }}
      />

      <TextField
        name="password"
        label="Contraseña"
        type={showPass ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        disabled={formik.isSubmitting}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError('password')}
        helperText={fieldHelperText('password')}
        sx={{ ...commonTF, mb: 2 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <PasswordRequirementsIndicator password={formik.values.password} />

      <TextField
        name="phone"
        label="Teléfono"
        variant="outlined"
        fullWidth
        disabled={formik.isSubmitting}
        placeholder="+54 9 11 2345-6789"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError('phone')}
        helperText={fieldHelperText('phone') || 'Formato: código país + número'}
        sx={{ ...commonTF, mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <TextField
          select
          name="gender"
          label="Género"
          variant="outlined"
          fullWidth
          disabled={formik.isSubmitting}
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError('gender')}
          helperText={fieldHelperText('gender')}
          sx={{ ...commonTF, flex: 1 }}>
          <MenuItem value="male">Hombre</MenuItem>
          <MenuItem value="female">Mujer</MenuItem>
          <MenuItem value="other">Otro</MenuItem>
        </TextField>

        <TextField
          name="birthDate"
          label="Fecha de nacimiento"
          type="text"
          placeholder="dd/mm/aaaa"
          variant="outlined"
          fullWidth
          disabled={formik.isSubmitting}
          value={formik.values.birthDate}
          onChange={(e) => {
            const formatted = formatBirthDate(e.target.value);
            formik.setFieldValue('birthDate', formatted);
          }}
          onBlur={formik.handleBlur}
          error={fieldError('birthDate')}
          helperText={fieldHelperText('birthDate')}
          sx={{ ...commonTF, flex: 1 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
        sx={commonBtn}>
        {isConnecting && <ConnectingSpinner />}
        {!isConnecting && formik.isSubmitting && <CircularProgress size={24} sx={{ color: '#fff' }} />}
        {!isConnecting && !formik.isSubmitting && 'Registrarse'}
      </Button>
    </form>
  );
};

export default RegisterTab;
