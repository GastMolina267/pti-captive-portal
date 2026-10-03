import * as Yup from 'yup';

export interface PasswordRequirementsStatus {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 100
  label: 'Débil' | 'Media' | 'Fuerte';
  color: 'error' | 'warning' | 'success';
}

export const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
};

export function getPasswordRequirements(password: string): PasswordRequirementsStatus {
  const str = password || '';
  return {
    hasMinLength: str.length >= 8,
    hasUppercase: PASSWORD_REGEX.uppercase.test(str),
    hasLowercase: PASSWORD_REGEX.lowercase.test(str),
    hasNumber: PASSWORD_REGEX.number.test(str),
  };
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, label: 'Débil', color: 'error' };
  }

  const reqs = getPasswordRequirements(password);
  const metCount = Object.values(reqs).filter(Boolean).length;
  
  // Extra points for extra length (12+ chars)
  const lengthBonus = password.length >= 12 ? 1 : 0;
  const totalScore = Math.min(100, Math.round(((metCount + lengthBonus) / 5) * 100));

  if (metCount <= 2) {
    return { score: totalScore, label: 'Débil', color: 'error' };
  } else if (metCount === 3) {
    return { score: totalScore, label: 'Media', color: 'warning' };
  } else {
    return { score: totalScore, label: 'Fuerte', color: 'success' };
  }
}

export const passwordYupSchema = Yup.string()
  .required('La contraseña es requerida')
  .min(8, 'Debe tener al menos 8 caracteres')
  .matches(PASSWORD_REGEX.uppercase, 'Debe contener al menos una letra mayúscula')
  .matches(PASSWORD_REGEX.lowercase, 'Debe contener al menos una letra minúscula')
  .matches(PASSWORD_REGEX.number, 'Debe contener al menos un número');
