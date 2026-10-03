import {
  getPasswordRequirements,
  calculatePasswordStrength,
  passwordYupSchema,
} from './passwordValidation';

describe('passwordValidation utility', () => {
  describe('getPasswordRequirements', () => {
    test('identifica correctamente qué requisitos cumple una contraseña', () => {
      const weak = getPasswordRequirements('abc');
      expect(weak).toEqual({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: true,
        hasNumber: false,
      });

      const full = getPasswordRequirements('Password123');
      expect(full).toEqual({
        hasMinLength: true,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
      });
    });
  });

  describe('calculatePasswordStrength', () => {
    test('calcula el nivel de fortaleza correctamente', () => {
      expect(calculatePasswordStrength('')).toEqual({
        score: 0,
        label: 'Débil',
        color: 'error',
      });

      expect(calculatePasswordStrength('abc')).toEqual({
        score: 20,
        label: 'Débil',
        color: 'error',
      });

      expect(calculatePasswordStrength('Pass12')).toEqual({
        score: 60,
        label: 'Media',
        color: 'warning',
      });

      expect(calculatePasswordStrength('Password123').label).toBe('Fuerte');
      expect(calculatePasswordStrength('Password123').color).toBe('success');
    });
  });

  describe('passwordYupSchema', () => {
    test('valida correctamente contraseñas válidas e inválidas', async () => {
      // Válida sin necesidad de carácter especial
      await expect(passwordYupSchema.isValid('Password123')).resolves.toBe(true);

      // Faltan 8 caracteres
      await expect(passwordYupSchema.isValid('Pass1')).resolves.toBe(false);

      // Falta mayúscula
      await expect(passwordYupSchema.isValid('password123')).resolves.toBe(false);

      // Falta minúscula
      await expect(passwordYupSchema.isValid('PASSWORD123')).resolves.toBe(false);

      // Falta número
      await expect(passwordYupSchema.isValid('Password')).resolves.toBe(false);
    });
  });
});
