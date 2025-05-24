import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { AuthStackParamList } from '../../types';
import { SPACING, FONTS, BORDER_RADIUS, STRINGS } from '../../constants';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    gradientBackground: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: SPACING.xl,
      justifyContent: 'space-between',
    },
    topSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    logo: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    logoText: {
      fontSize: 48,
      fontWeight: FONTS.weights.bold,
      color: colors.primary,
    },
    welcomeText: {
      fontSize: FONTS.sizes.xxxl,
      fontWeight: FONTS.weights.bold,
      color: colors.white,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    subtitleText: {
      fontSize: FONTS.sizes.lg,
      color: colors.white,
      textAlign: 'center',
      opacity: 0.9,
      lineHeight: 24,
    },
    bottomSection: {
      paddingBottom: SPACING.xl,
    },
    buttonContainer: {
      gap: SPACING.md,
    },
    primaryButton: {
      backgroundColor: colors.white,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    primaryButtonText: {
      fontSize: FONTS.sizes.lg,
      fontWeight: FONTS.weights.semibold,
      color: colors.primary,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.white,
    },
    secondaryButtonText: {
      fontSize: FONTS.sizes.lg,
      fontWeight: FONTS.weights.medium,
      color: colors.white,
    },
    featuresContainer: {
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    featureIcon: {
      marginRight: SPACING.md,
    },
    featureText: {
      fontSize: FONTS.sizes.md,
      color: colors.white,
      opacity: 0.9,
    },
  });

  const features = [
    { icon: 'shield-checkmark', text: 'Autenticación segura con biometría' },
    { icon: 'sync', text: 'Sincronización en tiempo real' },
    { icon: 'moon', text: 'Modo oscuro y claro' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>MB</Text>
              </View>
              
              <Text style={styles.welcomeText}>
                {STRINGS.messages.welcome}
              </Text>
              <Text style={styles.subtitleText}>
                Tu aplicación segura y moderna{'\n'}
                para gestionar tu día a día
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons
                    name={feature.icon as any}
                    size={20}
                    color={colors.white}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {STRINGS.auth.login}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  {STRINGS.auth.register}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};