import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

interface BiometricCapabilities {
  isAvailable: boolean;
  biometricType: string | null;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

interface UseBiometricReturn {
  capabilities: BiometricCapabilities;
  isLoading: boolean;
  authenticate: (options?: LocalAuthentication.LocalAuthenticationOptions) => Promise<LocalAuthentication.LocalAuthenticationResult>;
  checkCapabilities: () => Promise<void>;
}

export const useBiometric = (): UseBiometricReturn => {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    isAvailable: false,
    biometricType: null,
    isEnrolled: false,
    supportedTypes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCapabilities();
  }, []);

  const checkCapabilities = async () => {
    try {
      setIsLoading(true);

      // Verificar si el dispositivo tiene hardware biométrico
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      
      if (!hasHardware) {
        setCapabilities({
          isAvailable: false,
          biometricType: null,
          isEnrolled: false,
          supportedTypes: [],
        });
        return;
      }

      // Verificar si hay datos biométricos registrados
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      // Obtener tipos de autenticación soportados
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      // Determinar el tipo principal de biometría
      let biometricType = null;
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricType = 'Face ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricType = 'Touch ID / Huella Dactilar';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometricType = 'Reconocimiento de Iris';
      }

      setCapabilities({
        isAvailable: hasHardware && isEnrolled,
        biometricType,
        isEnrolled,
        supportedTypes,
      });
    } catch (error) {
      console.log('Error verificando capacidades biométricas:', error);
      setCapabilities({
        isAvailable: false,
        biometricType: null,
        isEnrolled: false,
        supportedTypes: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (
    options?: LocalAuthentication.LocalAuthenticationOptions
  ): Promise<LocalAuthentication.LocalAuthenticationResult> => {
    try {
      if (!capabilities.isAvailable) {
        throw new Error('Autenticación biométrica no disponible');
      }

      const defaultOptions: LocalAuthentication.LocalAuthenticationOptions = {
        promptMessage: 'Autenticarse para continuar',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
        requireConfirmation: true,
      };

      const authOptions = { ...defaultOptions, ...options };
      
      const result = await LocalAuthentication.authenticateAsync(authOptions);
      
      return result;
    } catch (error) {
      console.log('Error en autenticación biométrica:', error);
      throw error;
    }
  };

  return {
    capabilities,
    isLoading,
    authenticate,
    checkCapabilities,
  };
};