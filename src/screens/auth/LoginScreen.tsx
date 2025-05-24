import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useBiometric } from '../../hooks/useBiometric';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

import { AuthStackParamList, LoginFormData } from '../../types';
import { validateLoginForm } from '../../utils/validation';
import { SPACING, FONTS, STRINGS } from '../../constants';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { colors } = useTheme();
  const { signIn, biometricEnabled, signInWithBiometric } = useAuth();
  const { capabilities, authenticate } = useBiometric();
  const [showBiometric, setShowBiometric] = useState(false);

  // Verificar si mostrar opción biométrica al cargar
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      if (biometricEnabled && capabilities.isAvailable) {
        setShowBiometric(true);
      }
    };
    checkBiometricAvailability();
  }, [biometricEnabled, capabilities.isAvailable]);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: validateLoginForm,
    onSubmit: handleLogin,
  });

  async function handleLogin(formData: LoginFormData) {
    try {
      await signIn(formData.email, formData.password);
      // La navegación se maneja automáticamente por el AuthContext
    } catch (error: any) {
      Alert.alert(
        'Error de Inicio de Sesión',
        error.message || STRINGS.messages.error,
        [{ text: 'OK' }]
      );
    }
  }

  const handleBiometricLogin = async () => {
    try {
      console.log('🔐 Intentando login biométrico...');
      await signInWithBiometric();
      // La navegación se maneja automáticamente por el AuthContext
    } catch (error: any) {
      Alert.alert(
        'Error de Autenticación Biométrica',
        error.message || 'Error en la autenticación biométrica',
        [{ text: 'OK' }]
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    title: {
      fontSize: FONTS.sizes.xxxl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    form: {
      gap: SPACING.lg,
      marginBottom: SPACING.xl,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: -SPACING.sm,
      marginBottom: SPACING.md,
    },
    forgotPasswordText: {
      fontSize: FONTS.sizes.sm,
      color: colors.primary,
      fontWeight: FONTS.weights.medium,
    },
    biometricSection: {
      alignItems: 'center',
      marginVertical: SPACING.xl,
    },
    biometricButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.current.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    biometricText: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      textAlign: 'center',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.current.border,
    },
    dividerText: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      marginHorizontal: SPACING.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.xl,
    },
    footerText: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
    },
    registerLink: {
      fontSize: FONTS.sizes.md,
      color: colors.primary,
      fontWeight: FONTS.weights.semibold,
      marginLeft: SPACING.xs,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>¡Hola de nuevo!</Text>
          <Text style={styles.subtitle}>
            Inicia sesión en tu cuenta para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={STRINGS.auth.email}
            placeholder="Ingresa tu email"
            value={values.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            error={errors.email}
          />

          <Input
            label={STRINGS.auth.password}
            placeholder="Ingresa tu contraseña"
            value={values.password}
            onChangeText={handleChange('password')}
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>
              {STRINGS.auth.forgotPassword}
            </Text>
          </TouchableOpacity>

          <Button
            title={STRINGS.auth.login}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="large"
          />
        </View>

        {showBiometric && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.biometricSection}>
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={capabilities.biometricType?.includes('Face') ? 'eye' : 'finger-print'}
                  size={32}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.biometricText}>
                {capabilities.biometricType || STRINGS.auth.loginWithBiometric}
              </Text>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>
              {STRINGS.auth.register}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};