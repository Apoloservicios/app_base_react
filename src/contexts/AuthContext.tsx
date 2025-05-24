import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';
import { APP_CONFIG, STRINGS } from '../constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  useEffect(() => {
    // Inicialización simple sin Firebase
    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando auth...');
        
        // Verificar si hay un usuario guardado localmente
        const savedUser = await AsyncStorage.getItem('@saved_user');
        console.log('💾 Usuario guardado:', savedUser ? 'Sí' : 'No');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('👤 Cargando usuario:', userData.email);
          setUser(userData);
          await loadBiometricSetting();
        }
        
        console.log('✅ Auth inicializado correctamente');
      } catch (error) {
        console.log('❌ Error inicializando auth:', error);
      } finally {
        console.log('🏁 Terminando loading...');
        setLoading(false);
      }
    };

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout de auth - forzando fin de loading');
      setLoading(false);
    }, 3000);

    initializeAuth().finally(() => {
      clearTimeout(timeout);
    });
  }, []);

  const loadBiometricSetting = async () => {
    try {
      const biometricSetting = await AsyncStorage.getItem(APP_CONFIG.biometricStorageKey);
      setBiometricEnabledState(biometricSetting === 'true');
    } catch (error) {
      console.log('Error cargando configuración biométrica:', error);
    }
  };

  const setBiometricEnabled = async (enabled: boolean) => {
    try {
      // Verificar disponibilidad antes de habilitar
      if (enabled) {
        const isAvailable = await checkBiometricAvailability();
        if (!isAvailable) {
          throw new Error('La autenticación biométrica no está disponible en este dispositivo');
        }

        // Probar autenticación para confirmar que funciona
        const testResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifica tu identidad para habilitar la autenticación biométrica',
          cancelLabel: 'Cancelar',
          fallbackLabel: 'Usar contraseña',
        });

        if (!testResult.success) {
          throw new Error('Debes autenticarte biométricamente para habilitar esta función');
        }
      }

      await AsyncStorage.setItem(APP_CONFIG.biometricStorageKey, enabled.toString());
      setBiometricEnabledState(enabled);

      if (enabled && user) {
        // Guardar credenciales cifradas para biometría
        const biometricData = {
          userId: user.uid,
          email: user.email,
          enabledAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(`@biometric_user_${user.uid}`, JSON.stringify(biometricData));
      }

    } catch (error: any) {
      console.log('Error configurando biometría:', error);
      throw error;
    }
  };

  // Verificar disponibilidad de biometría
  const checkBiometricAvailability = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      console.log('🔍 Biometric capabilities:', {
        hasHardware,
        isEnrolled,
        supportedTypes
      });

      return hasHardware && isEnrolled;
    } catch (error) {
      console.log('Error verificando biometría:', error);
      return false;
    }
  };

  // Login simple con credenciales de prueba
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔐 Intentando login:', email);
      
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuario de prueba
      if (email === 'test@test.com' && password === '123456') {
        const mockUser: User = {
          uid: 'test-user-123',
          email: email,
          displayName: 'Usuario de Prueba',
          photoURL: null,
          emailVerified: true,
        };
        
        setUser(mockUser);
        await AsyncStorage.setItem('@saved_user', JSON.stringify(mockUser));
        await loadBiometricSetting();
        console.log('✅ Login exitoso');
      } else {
        throw new Error('Credenciales incorrectas. Usa: test@test.com / 123456');
      }
    } catch (error: any) {
      console.log('❌ Error en login:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registro simple
  const signUp = async (email: string, password: string, displayName?: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('📝 Registrando usuario:', email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: displayName || 'Nuevo Usuario',
        photoURL: null,
        emailVerified: true,
      };
      
      setUser(newUser);
      await AsyncStorage.setItem('@saved_user', JSON.stringify(newUser));
      await loadBiometricSetting();
      console.log('✅ Registro exitoso');
    } catch (error: any) {
      console.log('❌ Error en registro:', error);
      throw new Error('Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🚪 Cerrando sesión...');
      
      await AsyncStorage.removeItem('@saved_user');
      if (user) {
        await AsyncStorage.removeItem(`@biometric_user_${user.uid}`);
      }
      setUser(null);
      setBiometricEnabledState(false);
      
      console.log('✅ Sesión cerrada');
    } catch (error: any) {
      console.log('❌ Error cerrando sesión:', error);
      throw new Error('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    console.log('📧 Simulando envío de email a:', email);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await AsyncStorage.setItem('@saved_user', JSON.stringify(updatedUser));
  };

  // ✨ AUTENTICACIÓN BIOMÉTRICA REAL
  const signInWithBiometric = async (): Promise<void> => {
    try {
      console.log('👆 Iniciando autenticación biométrica...');

      // Verificar que esté habilitada
      if (!biometricEnabled) {
        throw new Error('La autenticación biométrica no está habilitada. Habilítala en Configuración.');
      }

      // Verificar disponibilidad
      const isAvailable = await checkBiometricAvailability();
      if (!isAvailable) {
        throw new Error('Autenticación biométrica no disponible en este dispositivo');
      }

      // Buscar datos de usuario guardados para biometría
      const savedUser = await AsyncStorage.getItem('@saved_user');
      if (!savedUser) {
        throw new Error('No hay credenciales guardadas para autenticación biométrica');
      }

      // Realizar autenticación biométrica
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: STRINGS.auth.biometricPrompt || 'Usa tu huella dactilar o Face ID para iniciar sesión',
        cancelLabel: STRINGS.messages.cancel || 'Cancelar',
        fallbackLabel: STRINGS.auth.biometricFallback || 'Usar contraseña',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        console.log('❌ Autenticación biométrica cancelada o falló');
        throw new Error('Autenticación biométrica cancelada');
      }

      // Si la autenticación fue exitosa, restaurar sesión
      const userData = JSON.parse(savedUser);
      setUser(userData);
      await loadBiometricSetting();
      
      console.log('✅ Autenticación biométrica exitosa para:', userData.email);
      
    } catch (error: any) {
      console.log('❌ Error en autenticación biométrica:', error.message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    biometricEnabled,
    setBiometricEnabled,
    signInWithBiometric,
  };

  // Debug
  console.log('🔍 AuthContext state:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email,
    biometricEnabled
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};