import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

import { AuthStackParamList } from '../../types';
import { validateEmail } from '../../utils/validation';
import { SPACING, FONTS, STRINGS } from '../../constants';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { colors } = useTheme();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    try {
      setError('');
      
      // Validar email
      const emailError = validateEmail(email);
      if (emailError) {
        setError(emailError);
        return;
      }

      setIsLoading(true);
      await resetPassword(email);
      
      setEmailSent(true);
      
      Alert.alert(
        'Email Enviado',
        `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada y sigue las instrucciones.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el email de recuperación. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xxl,
      justifyContent: 'center',
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.current.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    title: {
      fontSize: FONTS.sizes.xxl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: SPACING.md,
    },
    form: {
      gap: SPACING.lg,
      marginBottom: SPACING.xl,
    },
    successContainer: {
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    successIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    successTitle: {
      fontSize: FONTS.sizes.xl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    successText: {
      fontSize: FONTS.sizes.md,
      color: colors.current.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: SPACING.md,
    },
    emailText: {
      fontWeight: FONTS.weights.semibold,
      color: colors.primary,
    },
    resendContainer: {
      alignItems: 'center',
      marginTop: SPACING.xl,
    },
    resendText: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      marginBottom: SPACING.sm,
    },
    resendButton: {
      fontSize: FONTS.sizes.sm,
      color: colors.primary,
      fontWeight: FONTS.weights.semibold,
    },
  });

  if (emailSent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={32} color={colors.white} />
            </View>
            
            <Text style={styles.successTitle}>Email Enviado</Text>
            
            <Text style={styles.successText}>
              Se ha enviado un enlace de recuperación a{' '}
              <Text style={styles.emailText}>{email}</Text>.
              {'\n\n'}
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </Text>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                ¿No recibiste el email?
              </Text>
              <Button
                title="Reenviar"
                onPress={() => setEmailSent(false)}
                variant="ghost"
                size="small"
              />
            </View>
          </View>

          <Button
            title="Volver al Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="large"
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons 
              name="key" 
              size={32} 
              color={colors.primary} 
            />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes. Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={STRINGS.auth.email}
            placeholder="Ingresa tu email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            error={error}
          />

          <Button
            title="Enviar Enlace"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading || !email}
            size="large"
          />
        </View>

        <Button
          title="Volver al Login"
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="large"
        />
      </View>
    </KeyboardAvoidingView>
  );
};