import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useTheme } from '../contexts/ThemeContext';
import { APP_CONFIG, SPACING, FONTS } from '../constants';

// Prevenir que se oculte automáticamente
SplashScreenExpo.preventAutoHideAsync();

export const SplashScreen: React.FC = () => {
  const { colors } = useTheme();

  useEffect(() => {
    // Simular carga de datos iniciales
    const initializeApp = async () => {
      try {
        // Reducir tiempo de carga para debug
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.log('Error durante la inicialización:', error);
      } finally {
        // Ocultar splash screen nativo
        await SplashScreenExpo.hideAsync();
      }
    };

    initializeApp();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    logoText: {
      fontSize: FONTS.sizes.xxxl,
      fontWeight: FONTS.weights.bold,
      color: colors.primary,
    },
    appName: {
      fontSize: FONTS.sizes.xxl,
      fontWeight: FONTS.weights.bold,
      color: colors.white,
      textAlign: 'center',
    },
    appVersion: {
      fontSize: FONTS.sizes.sm,
      color: colors.white,
      marginTop: SPACING.sm,
      opacity: 0.8,
    },
    loadingContainer: {
      marginTop: SPACING.xxl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FONTS.sizes.md,
      color: colors.white,
      marginTop: SPACING.md,
      opacity: 0.9,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MB</Text>
        </View>
        
        <Text style={styles.appName}>{APP_CONFIG.name}</Text>
        <Text style={styles.appVersion}>v{APP_CONFIG.version}</Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={colors.white} 
        />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    </View>
  );
};