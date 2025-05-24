import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeType } from '../../types';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants';

export const SettingsScreen: React.FC = () => {
  const { biometricEnabled, setBiometricEnabled } = useAuth();
  const { theme, setTheme, isDark, colors } = useTheme();

  const handleBiometricToggle = async (value: boolean) => {
    try {
      await setBiometricEnabled(value);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Seleccionar Tema',
      'Elige el tema que prefieras',
      [
        { text: 'Sistema', onPress: () => setTheme('system' as ThemeType) },
        { text: 'Claro', onPress: () => setTheme('light' as ThemeType) },
        { text: 'Oscuro', onPress: () => setTheme('dark' as ThemeType) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'system':
        return 'Sistema';
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      default:
        return 'Sistema';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      paddingBottom: SPACING.xxl,
    },
    section: {
      paddingHorizontal: SPACING.xl,
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONTS.sizes.lg,
      fontWeight: FONTS.weights.semibold,
      color: colors.current.text,
      marginBottom: SPACING.md,
    },
    settingsList: {
      gap: SPACING.xs,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.current.card,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      ...SHADOWS.small,
    },
    settingIcon: {
      marginRight: SPACING.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.medium,
      color: colors.current.text,
    },
    settingDescription: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      marginTop: SPACING.xs,
    },
    settingValue: {
      fontSize: FONTS.sizes.sm,
      color: colors.primary,
      fontWeight: FONTS.weights.medium,
    },
    chevron: {
      marginLeft: SPACING.sm,
    },
  });

  const securitySettings = [
    {
      icon: 'finger-print',
      title: 'Autenticación Biométrica',
      description: 'Usar huella dactilar o Face ID para iniciar sesión',
      type: 'toggle' as const,
      value: biometricEnabled,
      onToggle: handleBiometricToggle,
    },
    {
      icon: 'shield-checkmark',
      title: 'Verificación en Dos Pasos',
      description: 'Añade una capa extra de seguridad',
      type: 'navigation' as const,
      onPress: () => console.log('2FA'),
    },
  ];

  const appearanceSettings = [
    {
      icon: 'color-palette',
      title: 'Tema',
      description: 'Cambiar entre tema claro, oscuro o sistema',
      type: 'selection' as const,
      value: getThemeLabel(),
      onPress: handleThemeChange,
    },
  ];

  const appSettings = [
    {
      icon: 'notifications',
      title: 'Notificaciones',
      description: 'Configurar alertas y recordatorios',
      type: 'navigation' as const,
      onPress: () => console.log('Notificaciones'),
    },
    {
      icon: 'language',
      title: 'Idioma',
      description: 'Cambiar idioma de la aplicación',
      type: 'selection' as const,
      value: 'Español',
      onPress: () => console.log('Idioma'),
    },
  ];

  const supportSettings = [
    {
      icon: 'help-circle',
      title: 'Centro de Ayuda',
      description: 'Preguntas frecuentes y soporte',
      type: 'navigation' as const,
      onPress: () => console.log('Ayuda'),
    },
    {
      icon: 'mail',
      title: 'Contactar Soporte',
      description: 'Enviar comentarios o reportar problemas',
      type: 'navigation' as const,
      onPress: () => console.log('Contacto'),
    },
    {
      icon: 'information-circle',
      title: 'Acerca de',
      description: 'Información de la aplicación y versión',
      type: 'navigation' as const,
      onPress: () => console.log('Acerca de'),
    },
  ];

  const renderSettingItem = (setting: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={setting.onPress}
      activeOpacity={setting.type === 'toggle' ? 1 : 0.8}
      disabled={setting.type === 'toggle'}
    >
      <Ionicons
        name={setting.icon}
        size={24}
        color={colors.current.textSecondary}
        style={styles.settingIcon}
      />
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      
      {setting.type === 'toggle' && (
        <Switch
          value={setting.value}
          onValueChange={setting.onToggle}
          trackColor={{ 
            false: colors.current.border, 
            true: `${colors.primary}80` 
          }}
          thumbColor={setting.value ? colors.primary : colors.current.surface}
        />
      )}
      
      {setting.type === 'selection' && (
        <Text style={styles.settingValue}>{setting.value}</Text>
      )}
      
      {setting.type === 'navigation' && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.current.textSecondary}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.settingsList}>
            {securitySettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          <View style={styles.settingsList}>
            {appearanceSettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación</Text>
          <View style={styles.settingsList}>
            {appSettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <View style={styles.settingsList}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};