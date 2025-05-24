import { STRINGS } from '../constants';

// Validar email
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'El email es requerido';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return STRINGS.errors.auth.invalidEmail;
  }
  
  return undefined;
};

// Validar contraseña
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'La contraseña es requerida';
  }
  
  if (password.length < 6) {
    return STRINGS.errors.auth.weakPassword;
  }
  
  return undefined;
};

// Validar confirmación de contraseña
export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Confirma tu contraseña';
  }
  
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  
  return undefined;
};

// Validar nombre
export const validateName = (name: string): string | undefined => {
  if (!name) {
    return 'El nombre es requerido';
  }
  
  if (name.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (name.length > 50) {
    return 'El nombre no puede tener más de 50 caracteres';
  }
  
  return undefined;
};

// Validar teléfono (opcional)
export const validatePhone = (phone: string): string | undefined => {
  if (!phone) {
    return undefined; // Teléfono es opcional
  }
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Formato de teléfono inválido';
  }
  
  return undefined;
};

// Validaciones para formularios específicos
export const validateLoginForm = (values: { email: string; password: string }) => {
  const errors: any = {};
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateRegisterForm = (values: { 
  email: string; 
  password: string; 
  confirmPassword: string; 
  displayName: string;
}) => {
  const errors: any = {};
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(values.password, values.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  const nameError = validateName(values.displayName);
  if (nameError) errors.displayName = nameError;
  
  return errors;
};

export const validateProfileForm = (values: { 
  displayName: string; 
  email: string; 
  phone?: string;
}) => {
  const errors: any = {};
  
  const nameError = validateName(values.displayName);
  if (nameError) errors.displayName = nameError;
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  if (values.phone) {
    const phoneError = validatePhone(values.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  return errors;
};