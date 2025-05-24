import React from 'react';
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

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

import { AuthStackParamList, RegisterFormData } from '../../types';
import { validateRegisterForm } from '../../utils/validation';
import { SPACING, FONTS, STRINGS } from '../../constants';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { colors } = useTheme();
  const { signUp } = useAuth();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm<RegisterFormData>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      acceptTerms: false,
    },
    validate: validateRegisterForm,
    onSubmit: handleRegister,
  });

  async function handleRegister(formData: RegisterFormData) {
    try {
      if (!formData.acceptTerms) {
        Alert.alert(
          'Términos y Condiciones',
          'Debes aceptar los términos y condiciones para continuar.',
          [{ text: 'OK' }]
        );
        return;
      }

      await signUp(formData.email, formData.password, formData.displayName);
      
      Alert.alert(
        'Cuenta Creada',
        'Tu cuenta ha sido creada exitosamente. ¡Bienvenido!',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error de Registro',
        error.message || STRINGS.messages.error,
        [{ text: 'OK' }]
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
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
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: SPACING.md,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.current.border,
      marginRight: SPACING.sm,
      marginTop: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: FONTS.weights.bold,
    },
    termsText: {
      flex: 1,
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: FONTS.weights.medium,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.lg,
    },
    footerText: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
    },
    loginLink: {
      fontSize: FONTS.sizes.md,
      color: colors.primary,
      fontWeight: FONTS.weights.semibold,
      marginLeft: SPACING.xs,
    },
    passwordRequirements: {
      marginTop: -SPACING.sm,
      marginBottom: SPACING.sm,
    },
    requirementText: {
      fontSize: FONTS.sizes.xs,
      color: colors.current.textSecondary,
      lineHeight: 16,
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Completa los datos para crear tu nueva cuenta
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre Completo"
            placeholder="Ingresa tu nombre completo"
            value={values.displayName}
            onChangeText={handleChange('displayName')}
            autoCapitalize="words"
            icon="person"
            error={errors.displayName}
          />

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
            placeholder="Crea una contraseña"
            value={values.password}
            onChangeText={handleChange('password')}
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementText}>
              • Mínimo 6 caracteres
            </Text>
          </View>

          <Input
            label={STRINGS.auth.confirmPassword}
            placeholder="Confirma tu contraseña"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            icon="lock-closed"
            error={errors.confirmPassword}
          />

          <TouchableOpacity 
            style={styles.termsContainer}
            onPress={() => handleChange('acceptTerms')(!values.acceptTerms)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.checkbox, 
              values.acceptTerms && styles.checkboxChecked
            ]}>
              {values.acceptTerms && (
                <Text style={styles.checkboxText}>✓</Text>
              )}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>Términos y Condiciones</Text>
              {' '}y la{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title={STRINGS.auth.register}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !values.acceptTerms}
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              {STRINGS.auth.login}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};