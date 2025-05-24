import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCamera } from '../../hooks/useCamera';
import { useLocation } from '../../hooks/useLocation';
import { useNotifications } from '../../hooks/useNotifications';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS, STRINGS } from '../../constants';
import { formatName, getInitials } from '../../utils/format';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { showImageOptions, loading: cameraLoading } = useCamera();
  const { getCurrentLocation, location, loading: locationLoading } = useLocation();
  const { sendLocalNotification, scheduleNotification, loading: notificationLoading } = useNotifications();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleCameraAction = async () => {
    try {
      const imageUri = await showImageOptions();
      if (imageUri) {
        setProfileImage(imageUri);
        await sendLocalNotification(
          '📷 Foto actualizada',
          'Tu foto de perfil se ha actualizado correctamente'
        );
      }
    } catch (error) {
      console.log('Error con cámara:', error);
    }
  };

  const handleLocationAction = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        Alert.alert(
          '📍 Ubicación Obtenida',
          `Latitud: ${currentLocation.latitude.toFixed(6)}\nLongitud: ${currentLocation.longitude.toFixed(6)}`,
          [
            { text: 'OK' },
            { 
              text: 'Ver en Mapas', 
              onPress: () => console.log('Abrir mapas con:', currentLocation) 
            }
          ]
        );
      }
    } catch (error) {
      console.log('Error con ubicación:', error);
    }
  };

  const handleNotificationAction = () => {
    Alert.alert(
      '🔔 Enviar Notificación',
      'Elige una opción',
      [
        {
          text: 'Inmediata',
          onPress: () => sendLocalNotification(
            '¡Hola!',
            'Esta es una notificación de prueba inmediata'
          )
        },
        {
          text: 'En 5 segundos',
          onPress: () => scheduleNotification(
            '⏰ Notificación Programada',
            'Esta notificación fue programada hace 5 segundos',
            5
          )
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleSettingsAction = () => {
    Alert.alert(
      '⚙️ Configuración Rápida',
      'Funcionalidades disponibles',
      [
        { text: 'Ir a Configuración', onPress: () => console.log('Navegar a settings') },
        { text: 'Cerrar', style: 'cancel' }
      ]
    );
  };

  const quickActions = [
    { 
      icon: 'camera', 
      title: 'Cámara', 
      color: colors.primary,
      action: handleCameraAction,
      loading: cameraLoading
    },
    { 
      icon: 'location', 
      title: 'Ubicación', 
      color: colors.secondary,
      action: handleLocationAction,
      loading: locationLoading
    },
    { 
      icon: 'notifications', 
      title: 'Notificación', 
      color: colors.accent,
      action: handleNotificationAction,
      loading: notificationLoading
    },
    { 
      icon: 'settings', 
      title: 'Configuración', 
      color: colors.success,
      action: handleSettingsAction
    },
  ];

  const recentActivity = [
    { icon: 'checkmark-circle', title: 'Perfil actualizado', time: 'Hace 2 horas', color: colors.success },
    { icon: 'shield-checkmark', title: 'Autenticación biométrica activada', time: 'Hace 1 día', color: colors.primary },
    { icon: 'moon', title: 'Tema cambiado a oscuro', time: 'Hace 3 días', color: colors.secondary },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.current.background,
    },
    scrollContent: {
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    header: {
      paddingTop: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    welcomeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    welcomeText: {
      flex: 1,
    },
    greeting: {
      fontSize: FONTS.sizes.lg,
      color: colors.current.textSecondary,
      marginBottom: SPACING.xs,
    },
    userName: {
      fontSize: FONTS.sizes.xxl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    avatarText: {
      fontSize: FONTS.sizes.lg,
      fontWeight: FONTS.weights.bold,
      color: colors.white,
    },
    section: {
      marginBottom: SPACING.xxl,
    },
    sectionTitle: {
      fontSize: FONTS.sizes.xl,
      fontWeight: FONTS.weights.bold,
      color: colors.current.text,
      marginBottom: SPACING.lg,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: SPACING.md,
    },
    quickActionItem: {
      width: '47%',
      backgroundColor: colors.current.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      alignItems: 'center',
      ...SHADOWS.small,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    quickActionTitle: {
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.medium,
      color: colors.current.text,
      textAlign: 'center',
    },
    activityList: {
      gap: SPACING.md,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.current.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      ...SHADOWS.small,
    },
    activityIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: FONTS.sizes.md,
      fontWeight: FONTS.weights.medium,
      color: colors.current.text,
      marginBottom: SPACING.xs,
    },
    activityTime: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.current.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      ...SHADOWS.small,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.current.border,
      marginHorizontal: SPACING.md,
    },
    statNumber: {
      fontSize: FONTS.sizes.xl,
      fontWeight: FONTS.weights.bold,
      color: colors.primary,
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: FONTS.sizes.sm,
      color: colors.current.textSecondary,
      textAlign: 'center',
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {formatName(user?.displayName || user?.email?.split('@')[0] || 'Usuario')}
              </Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.displayName || user?.email || 'U')}
              </Text>
            </View>
          </View>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Días activo</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Sesiones</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Configuraciones</Text>
            </View>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionItem,
                  action.loading && { opacity: 0.6 }
                ]}
                activeOpacity={0.8}
                onPress={action.action}
                disabled={action.loading}
              >
                <View style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${action.color}15` }
                ]}>
                  {action.loading ? (
                    <ActivityIndicator size={24} color={action.color} />
                  ) : (
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  )}
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[
                  styles.activityIconContainer,
                  { backgroundColor: `${activity.color}15` }
                ]}>
                  <Ionicons
                    name={activity.icon as any}
                    size={20}
                    color={activity.color}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};