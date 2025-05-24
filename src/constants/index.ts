// Colores del tema
export const COLORS = {
  // Colores principales
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  
  // Colores de estado
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Colores neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  darkGray: '#3A3A3C',
  
  // Colores del tema claro
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#3A3A3C',
    border: '#C6C6C8',
    card: '#FFFFFF',
    notification: '#FF3B30',
    tabBar: '#F2F2F7',
    tabBarActive: '#007AFF',
    tabBarInactive: '#8E8E93'
  },
  
  // Colores del tema oscuro
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    border: '#38383A',
    card: '#1C1C1E',
    notification: '#FF453A',
    tabBar: '#1C1C1E',
    tabBarActive: '#0A84FF',
    tabBarInactive: '#98989D'
  }
};

// Tipografía
export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const
  }
};

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// Bordes
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  }
};

// Strings de la aplicación
export const STRINGS = {
  // Autenticación
  auth: {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    biometricLogin: 'Iniciar con Biometría',
    loginWithBiometric: 'Usar Face ID / Touch ID',
    biometricPrompt: 'Usa tu huella dactilar o Face ID para iniciar sesión',
    biometricFallback: 'Usar contraseña',
    rememberMe: 'Recordarme'
  },
  
  // Navegación
  navigation: {
    home: 'Inicio',
    profile: 'Perfil',
    settings: 'Configuración',
    notifications: 'Notificaciones'
  },
  
  // Mensajes
  messages: {
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    error: 'Ha ocurrido un error',
    success: 'Operación exitosa',
    noData: 'No hay datos disponibles',
    retry: 'Reintentar',
    cancel: 'Cancelar',
    accept: 'Aceptar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar'
  },
  
  // Errores
  errors: {
    network: 'Error de conexión',
    auth: {
      invalidEmail: 'Correo electrónico inválido',
      weakPassword: 'La contraseña debe tener al menos 6 caracteres',
      emailInUse: 'Este correo ya está registrado',
      userNotFound: 'Usuario no encontrado',
      wrongPassword: 'Contraseña incorrecta',
      tooManyRequests: 'Demasiados intentos. Intenta más tarde'
    }
  }
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'MiAppBase',
  version: '1.0.0',
  biometricStorageKey: '@biometric_enabled',
  userTokenKey: '@user_token',
  themeKey: '@theme_preference'
};